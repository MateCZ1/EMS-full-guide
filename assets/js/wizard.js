// ---------------------------------------------------------------------------
// Pomocník pro výjezd — interaktivní klikací algoritmus XABCDE.
// Zobrazuje vždy jen aktuální krok; historie umožňuje krok zpět, tlačítko
// "Zpět na začátek" je dostupné na každém kroku.
// ---------------------------------------------------------------------------
const EmsWizard = {
  data: null,
  loadPromise: null,
  history: [], // stack of node ids visited (current node is last)
};

function loadWizardData() {
  if (EmsWizard.data) return Promise.resolve(EmsWizard.data);
  if (EmsWizard.loadPromise) return EmsWizard.loadPromise;
  EmsWizard.loadPromise = fetch("data/wizard-xabcde.json?v=1")
    .then(r => r.json())
    .then(d => { EmsWizard.data = d; return d; });
  return EmsWizard.loadPromise;
}

function wizardToneClass(tone) {
  return {
    danger: "wz-opt-danger",
    warn: "wz-opt-warn",
    success: "wz-opt-success",
    primary: "wz-opt-primary",
    ghost: "wz-opt-ghost",
    neutral: "wz-opt-neutral",
  }[tone] || "wz-opt-neutral";
}

function renderWizardLetters(currentLetter) {
  const letters = EmsWizard.data.letters;
  const order = letters.map(l => l.key);
  const curIdx = order.indexOf(currentLetter);
  return `<div class="wz-letters">${letters.map((l, i) => {
    let state = "upcoming";
    if (l.key === currentLetter) state = "current";
    else if (curIdx >= 0 && i < curIdx) state = "done";
    return `<div class="wz-letter wz-letter-${state}" title="${escapeHtml(l.label)}">
      <span class="wz-letter-key">${l.key}</span>
      <span class="wz-letter-label">${escapeHtml(l.label)}</span>
    </div>`;
  }).join(`<span class="wz-letter-sep"></span>`)}</div>`;
}

function renderWizardWarning(w) {
  const icon = w.tone === "critical" ? "flame" : w.tone === "warning" ? "siren" : "compass";
  return `<div class="callout ${w.tone === "critical" ? "critical" : w.tone === "warning" ? "warning" : "info"}">
    <span class="callout-icon">${emsIcon(icon, "icon")}</span>
    <div class="callout-text">${inlineMd(w.text)}</div>
  </div>`;
}

function renderWizardNode(id) {
  const node = EmsWizard.data.nodes[id];
  if (!node) return;
  const $content = document.getElementById("content");

  const introHtml = (node.intro || []).map(p => `<p class="wz-intro">${inlineMd(p)}</p>`).join("");

  const listHtml = node.list ? `
    <div class="wz-checklist">
      ${node.listTitle ? `<div class="wz-checklist-title">${escapeHtml(node.listTitle)}</div>` : ""}
      <ul class="plain-list">${node.list.map(i => `<li>${inlineMd(i)}</li>`).join("")}</ul>
    </div>` : "";

  const stepsHtml = node.steps ? renderSteps({ items: node.steps }) : "";

  const warningsHtml = (node.warnings || []).map(renderWizardWarning).join("");

  const questionHtml = node.question ? `<div class="wz-question">${inlineMd(node.question)}</div>` : "";

  const optionsHtml = node.options ? `
    <div class="wz-options">
      ${node.options.map(opt => `
        <button type="button" class="wz-option ${wizardToneClass(opt.tone)}" data-next="${opt.next}">
          <span class="wz-option-label">${inlineMd(opt.label)}</span>
          ${opt.hint ? `<span class="wz-option-hint">${inlineMd(opt.hint)}</span>` : ""}
        </button>`).join("")}
    </div>` : "";

  const endNoteHtml = node.endNote ? `<div class="wz-endnote">${emsIcon("compass", "icon-sm")} ${inlineMd(node.endNote)}</div>` : "";

  const canGoBack = EmsWizard.history.length > 1;

  $content.innerHTML = `
    <div class="page wz-page">
      <div class="wz-topbar">
        ${renderWizardLetters(node.letter)}
      </div>
      <div class="wz-controls">
        <button type="button" class="btn wz-restart-btn" id="wzRestart">${emsIcon("arrowLeft", "icon-sm")} Zpět na začátek</button>
        ${canGoBack ? `<button type="button" class="btn wz-back-btn" id="wzBack">${emsIcon("chevron", "icon-sm")} Krok zpět</button>` : ""}
      </div>

      <div class="wz-card">
        <div class="wz-code">${escapeHtml(node.code)}</div>
        <h1 class="wz-title">${escapeHtml(node.title)}</h1>
        ${introHtml}
        ${listHtml}
        ${stepsHtml}
        ${warningsHtml}
        ${questionHtml}
        ${optionsHtml}
        ${endNoteHtml}
      </div>
    </div>
  `;

  $content.querySelectorAll(".wz-option[data-next]").forEach(btn => {
    btn.addEventListener("click", () => {
      EmsWizard.history.push(btn.dataset.next);
      renderWizardNode(btn.dataset.next);
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    });
  });

  const restartBtn = document.getElementById("wzRestart");
  if (restartBtn) restartBtn.addEventListener("click", () => {
    EmsWizard.history = [EmsWizard.data.start];
    renderWizardNode(EmsWizard.data.start);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  });

  const backBtn = document.getElementById("wzBack");
  if (backBtn) backBtn.addEventListener("click", () => {
    EmsWizard.history.pop();
    const prev = EmsWizard.history[EmsWizard.history.length - 1];
    renderWizardNode(prev);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  });
}

function renderWizardPage() {
  const $content = document.getElementById("content");
  $content.innerHTML = `<div class="loading-state"><div class="spinner"></div><span>Načítám pomocníka…</span></div>`;
  loadWizardData().then(() => {
    EmsWizard.history = [EmsWizard.data.start];
    renderWizardNode(EmsWizard.data.start);
  });
}
