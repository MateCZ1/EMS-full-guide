// ---------------------------------------------------------------------------
// "Intelligent" client-side search: diacritics-insensitive, typo-tolerant,
// weighted scoring across titles / glossary / body text, with snippets.
// ---------------------------------------------------------------------------

function normalizeText(str) {
  return String(str || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  if (a === b) return 0;
  const al = a.length, bl = b.length;
  if (!al) return bl; if (!bl) return al;
  let prev = new Array(bl + 1);
  for (let j = 0; j <= bl; j++) prev[j] = j;
  for (let i = 1; i <= al; i++) {
    const cur = [i];
    for (let j = 1; j <= bl; j++) {
      cur[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return prev[bl];
}

const EmsSearch = {
  records: [],   // { type, chapterId, sectionId, title, path, text, weightFields:{title,gloss,body} }
  built: false,

  addRecord(rec) {
    rec.norm = {
      title: normalizeText(rec.title),
      gloss: normalizeText(rec.gloss || ""),
      body: normalizeText(rec.body || "")
    };
    this.records.push(rec);
  },

  buildFromChapter(chapter) {
    const chMeta = EMS_MANIFEST.find(m => m.id === chapter.id) || {};
    this.addRecord({
      type: "chapter",
      chapterId: chapter.id,
      sectionId: null,
      icon: chMeta.icon,
      title: `${chapter.number}. ${chapter.title}`,
      path: `Kapitola ${chapter.number}`,
      hash: `#/${chapter.id}`,
      gloss: [(chapter.abbrevs || []).map(a => a.a + " " + a.f).join(" "), (chapter.terms || []).map(t => t.t + " " + t.d).join(" ")].join(" "),
      body: chapter.intro || ""
    });

    (chapter.sections || []).forEach(sec => {
      const bodyParts = [];
      if (sec.lead) bodyParts.push(sec.lead);
      (sec.blocks || []).forEach(b => {
        if (b.type === "paragraph") bodyParts.push(b.text);
        else if (b.type === "list") bodyParts.push(b.items.join(" "));
        else if (b.type === "steps") bodyParts.push(b.items.map(s => s.title + " " + s.text).join(" "));
        else if (b.type === "callout") bodyParts.push((b.title || "") + " " + b.text);
        else if (b.type === "table") {
          bodyParts.push((b.caption || "") + " " + b.headers.join(" ") + " " + b.rows.map(r => r.join(" ")).join(" "));
        }
      });
      if (sec.summary) bodyParts.push(sec.summary.join(" "));

      this.addRecord({
        type: "section",
        chapterId: chapter.id,
        sectionId: sec.id,
        icon: chMeta.icon,
        title: sec.title,
        path: `Kapitola ${chapter.number} · ${sec.id}`,
        hash: `#/${chapter.id}/${encodeURIComponent(sec.id)}`,
        gloss: [(sec.abbrevs || []).map(a => a.a + " " + a.f).join(" "), (sec.terms || []).map(t => t.t + " " + t.d).join(" ")].join(" "),
        body: bodyParts.join(" \n ")
      });

      // Individual glossary entries get their own lightweight record so a bare
      // abbreviation ("GCS", "TXA"...) ranks its defining section highly.
      (sec.abbrevs || []).forEach(a => this.addRecord({
        type: "glossary", chapterId: chapter.id, sectionId: sec.id, icon: chMeta.icon,
        title: `${a.a} — ${a.f}`, path: `Zkratka · ${sec.id}`, hash: `#/${chapter.id}/${encodeURIComponent(sec.id)}`,
        gloss: a.a + " " + a.f, body: ""
      }));
    });
  },

  search(query, limit = 18) {
    const q = normalizeText(query);
    if (!q) return [];
    const terms = q.split(" ").filter(Boolean);
    const results = [];

    for (const rec of this.records) {
      let score = 0;
      const { title, gloss, body } = rec.norm;

      if (title === q) score += 140;
      else if (title.startsWith(q)) score += 90;
      else if (title.includes(q)) score += 60;

      for (const term of terms) {
        if (!term) continue;
        if (title.includes(term)) score += 22;
        if (gloss.includes(term)) score += 16;
        if (body.includes(term)) score += 6;

        // light typo tolerance for terms of reasonable length
        if (score === 0 && term.length >= 4) {
          const words = (title + " " + gloss).split(" ");
          for (const w of words) {
            if (w.length >= 4 && levenshtein(w, term) <= 1) { score += 10; break; }
          }
        }
      }
      if (rec.type === "chapter") score *= 0.85;
      if (rec.type === "glossary" && score > 0) score += 8;

      if (score > 0) results.push({ rec, score });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit).map(r => ({
      ...r.rec,
      snippet: buildSnippet(r.rec, terms)
    }));
  }
};

// Maps an unaccented lowercase letter to a character class matching all its
// Czech diacritic variants, so a normalized query term can be located inside
// the original (accented) source text without ever normalizing the source.
const DIACRITIC_CLASS = {
  a: "aá", c: "cč", d: "dď", e: "eéě", i: "ií", n: "nň", o: "oó",
  r: "rř", s: "sš", t: "tť", u: "uúů", y: "yý", z: "zž"
};
function termToPattern(term) {
  return term.split("").map(ch => {
    if (DIACRITIC_CLASS[ch]) return `[${DIACRITIC_CLASS[ch]}]`;
    if (/[a-z0-9]/i.test(ch)) return ch;
    return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("");
}
function buildTermRegex(terms) {
  const alts = terms.filter(Boolean).map(termToPattern);
  if (!alts.length) return null;
  return new RegExp(alts.join("|"), "gi");
}

function buildSnippet(rec, terms) {
  const re = buildTermRegex(terms);
  if (!re) return "";
  for (const raw of [rec.gloss, rec.body]) {
    if (!raw) continue;
    re.lastIndex = 0;
    const m = re.exec(raw);
    if (!m) continue;
    const start = Math.max(0, m.index - 50);
    const end = Math.min(raw.length, m.index + 110);
    let snippet = raw.slice(start, end).trim();
    if (start > 0) snippet = "…" + snippet;
    if (end < raw.length) snippet += "…";
    return highlightSnippet(snippet, re);
  }
  return "";
}

function highlightSnippet(snippet, re) {
  const escaped = escapeHtml(snippet);
  re.lastIndex = 0;
  return escaped.replace(re, (m) => `<mark>${m}</mark>`);
}
