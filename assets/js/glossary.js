// ---------------------------------------------------------------------------
// Inline glossary tooltips: abbreviations and technical terms get a dotted
// underline wherever they appear in body text; hover (desktop) or tap
// (mobile) reveals a small popover with the definition — instead of the
// old separate "used abbreviations / terms" boxes at the top of a section.
// ---------------------------------------------------------------------------

let GlossaryIndex = null;

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Rough "word character" class covering ASCII + Czech-relevant Latin-1/Extended-A
// accented letters, used to build our own \b-equivalent boundary (JS \b only
// understands ASCII word chars, so "turniketu" would wrongly boundary-match
// inside itself right after an accented letter otherwise).
const WORD_CLASS = "A-Za-z0-9À-ž";

function buildGlossaryIndex() {
  const abbrevMap = new Map();   // exact key -> definition (case-sensitive match)
  const termMap = new Map();     // lowercase key -> { original, def } (case-insensitive match)

  EMS_MANIFEST.forEach(m => {
    const ch = EmsApp.chapters[m.id];
    if (!ch) return;
    const addAbbrevs = (list) => (list || []).forEach(x => {
      if (x.a && !abbrevMap.has(x.a)) abbrevMap.set(x.a, x.f);
    });
    const addTerms = (list) => (list || []).forEach(x => {
      if (x.t && x.t.length >= 4) {
        const key = x.t.toLowerCase();
        if (!termMap.has(key)) termMap.set(key, { original: x.t, def: x.d });
      }
    });
    addAbbrevs(ch.abbrevs);
    addTerms(ch.terms);
    (ch.sections || []).forEach(s => { addAbbrevs(s.abbrevs); addTerms(s.terms); });
  });

  const byLengthDesc = (a, b) => b.length - a.length;

  const abbrevKeys = [...abbrevMap.keys()].sort(byLengthDesc);
  const termKeys = [...termMap.keys()].sort(byLengthDesc);

  const abbrevRegex = abbrevKeys.length
    ? new RegExp(abbrevKeys.map(k => `(?<![${WORD_CLASS}])${escapeRegExp(k)}(?![${WORD_CLASS}])`).join("|"), "g")
    : null;
  const termRegex = termKeys.length
    ? new RegExp(termKeys.map(k => `(?<![${WORD_CLASS}])${escapeRegExp(k)}(?![${WORD_CLASS}])`).join("|"), "gi")
    : null;

  return { abbrevMap, termMap, abbrevRegex, termRegex };
}

function splitTextNodeByRegex(textNode, regex, lookup) {
  const text = textNode.nodeValue;
  regex.lastIndex = 0;
  let match;
  let lastIndex = 0;
  const frags = [];
  while ((match = regex.exec(text))) {
    const found = lookup(match[0]);
    if (!found) { if (regex.lastIndex === match.index) regex.lastIndex++; continue; }
    if (match.index > lastIndex) frags.push(document.createTextNode(text.slice(lastIndex, match.index)));
    const span = document.createElement("span");
    span.className = "gloss-hl";
    span.tabIndex = 0;
    span.dataset.term = found.term;
    span.dataset.def = found.def;
    span.dataset.type = found.type;
    span.textContent = match[0];
    frags.push(span);
    lastIndex = match.index + match[0].length;
    if (regex.lastIndex === match.index) regex.lastIndex++;
  }
  if (!frags.length) return null;
  if (lastIndex < text.length) frags.push(document.createTextNode(text.slice(lastIndex)));
  return frags;
}

const GLOSS_SKIP_TAGS = new Set(["A", "BUTTON", "SCRIPT", "STYLE", "SVG", "TEXTAREA", "INPUT"]);

function collectGlossaryTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      let p = node.parentElement;
      while (p && p !== root) {
        if (GLOSS_SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.classList && (p.classList.contains("gloss-hl") || p.classList.contains("diagram-box"))) return NodeFilter.FILTER_REJECT;
        p = p.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  return nodes;
}

function runGlossaryPass(root, regex, lookup) {
  if (!regex) return;
  collectGlossaryTextNodes(root).forEach(node => {
    if (!node.parentNode) return;
    const frags = splitTextNodeByRegex(node, regex, lookup);
    if (!frags) return;
    const parent = node.parentNode;
    frags.forEach(f => parent.insertBefore(f, node));
    parent.removeChild(node);
  });
}

function highlightGlossaryTerms(root) {
  if (!GlossaryIndex) return;
  const { abbrevMap, termMap, abbrevRegex, termRegex } = GlossaryIndex;
  runGlossaryPass(root, abbrevRegex, (m) => abbrevMap.has(m) ? { term: m, def: abbrevMap.get(m), type: "abbr" } : null);
  runGlossaryPass(root, termRegex, (m) => {
    const hit = termMap.get(m.toLowerCase());
    return hit ? { term: hit.original, def: hit.def, type: "term" } : null;
  });
}

/* ------------------------------------------------------------------ */
/* Popover UI (single shared element, positioned near the hovered/tapped
   term; works via hover on desktop and tap/focus on mobile)            */
/* ------------------------------------------------------------------ */
const $glossPopover = document.createElement("div");
$glossPopover.className = "gloss-popover";
$glossPopover.hidden = true;
document.body.appendChild($glossPopover);

let glossHideTimer = null;

function showGlossPopover(target) {
  clearTimeout(glossHideTimer);
  const term = target.dataset.term;
  const def = target.dataset.def;
  const type = target.dataset.type;
  $glossPopover.innerHTML = `<div class="gloss-popover-term ${type}">${escapeHtml(term)}</div><div class="gloss-popover-def">${escapeHtml(def)}</div>`;
  $glossPopover.hidden = false;
  $glossPopover.dataset.forTerm = term;

  const r = target.getBoundingClientRect();
  const pw = $glossPopover.offsetWidth, ph = $glossPopover.offsetHeight;
  let top = r.top - ph - 10;
  $glossPopover.classList.remove("placement-bottom");
  if (top < 8) { top = r.bottom + 10; $glossPopover.classList.add("placement-bottom"); }
  let left = r.left + r.width / 2 - pw / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
  $glossPopover.style.top = top + "px";
  $glossPopover.style.left = left + "px";
}

function hideGlossPopover() {
  $glossPopover.hidden = true;
  delete $glossPopover.dataset.forTerm;
}

document.addEventListener("mouseover", (e) => {
  const t = e.target.closest && e.target.closest(".gloss-hl");
  if (t) showGlossPopover(t);
});
document.addEventListener("mouseout", (e) => {
  const t = e.target.closest && e.target.closest(".gloss-hl");
  if (t) glossHideTimer = setTimeout(hideGlossPopover, 150);
});
document.addEventListener("focusin", (e) => {
  if (e.target.classList && e.target.classList.contains("gloss-hl")) showGlossPopover(e.target);
});
document.addEventListener("focusout", (e) => {
  if (e.target.classList && e.target.classList.contains("gloss-hl")) hideGlossPopover();
});
document.addEventListener("click", (e) => {
  const t = e.target.closest && e.target.closest(".gloss-hl");
  if (t) {
    e.preventDefault();
    e.stopPropagation();
    if (!$glossPopover.hidden && $glossPopover.dataset.forTerm === t.dataset.term) hideGlossPopover();
    else showGlossPopover(t);
    return;
  }
  if (!e.target.closest || !e.target.closest(".gloss-popover")) hideGlossPopover();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideGlossPopover(); });
window.addEventListener("scroll", () => hideGlossPopover(), true);
