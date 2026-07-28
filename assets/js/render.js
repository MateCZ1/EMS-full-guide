// ---------------------------------------------------------------------------
// Rendering helpers: turn chapter JSON (see /data/*.json) into DOM/HTML.
// ---------------------------------------------------------------------------

function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Very small inline-markdown: **bold** only (used sparingly in source content).
function inlineMd(str) {
  return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}

function renderTable(block) {
  const caption = block.caption ? `<div class="table-caption">${escapeHtml(block.caption)}</div>` : "";
  const thead = `<thead><tr>${block.headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>`;
  const rows = block.rows.map(row => {
    const isPhase = row.length && /^[—\-–]{2,}/.test(String(row[0]).trim());
    if (isPhase) {
      return `<tr class="phase-row"><td colspan="${block.headers.length}">${inlineMd(row[0])}</td></tr>`;
    }
    return `<tr>${row.map(c => `<td>${inlineMd(c)}</td>`).join("")}</tr>`;
  }).join("");
  return `<div class="table-wrap">${caption}<table class="data-table">${thead}<tbody>${rows}</tbody></table></div>`;
}

function renderList(block) {
  return `<ul class="plain-list">${block.items.map(i => `<li>${inlineMd(i)}</li>`).join("")}</ul>`;
}

function renderSteps(block) {
  return `<div class="steps">${block.items.map(s => `
    <div class="step">
      <div class="step-num">${s.n}</div>
      <div class="step-body">
        <div class="step-title">${escapeHtml(s.title)}</div>
        <div class="step-text">${inlineMd(s.text)}</div>
      </div>
    </div>`).join("")}</div>`;
}

const CALLOUT_ICON = { critical: "siren", warning: "flame", info: "compass" };
function renderCallout(block) {
  const style = ["critical", "warning", "info"].includes(block.style) ? block.style : "info";
  return `<div class="callout ${style}">
    <div class="callout-icon">${emsIcon(CALLOUT_ICON[style], "icon")}</div>
    <div>
      ${block.title ? `<div class="callout-title">${escapeHtml(block.title)}</div>` : ""}
      <div class="callout-text">${inlineMd(block.text)}</div>
    </div>
  </div>`;
}

function renderBlock(block) {
  switch (block.type) {
    case "paragraph": return `<p class="para">${inlineMd(block.text)}</p>`;
    case "table": return renderTable(block);
    case "list": return renderList(block);
    case "steps": return renderSteps(block);
    case "callout": return renderCallout(block);
    case "diagram": return `<div class="diagram-box" data-diagram="${escapeHtml(block.key)}" id="diagram-${escapeHtml(block.key)}"></div>`;
    default: return "";
  }
}

function renderSummaryBox(summary, sectionId) {
  if (!summary || !summary.length) return "";
  return `<div class="summary-box">
    <div class="summary-box-title">${emsIcon("clipboard", "icon-sm")} Shrnutí ${escapeHtml(sectionId || "")}</div>
    <ul>${summary.map(s => `<li>${inlineMd(s)}</li>`).join("")}</ul>
  </div>`;
}

function renderSection(section) {
  const lead = section.lead ? `<p class="section-lead">${inlineMd(section.lead)}</p>` : "";
  const blocks = (section.blocks || []).map(renderBlock).join("");
  const summary = renderSummaryBox(section.summary, section.id);
  const anchor = "sec-" + section.id.replace(/\./g, "-");
  const heading = section.title
    ? `<h2 id="${anchor}"><span class="sec-num">${escapeHtml(section.id)}</span> ${escapeHtml(section.title)}</h2>`
    : "";
  return `<section class="section-block" id="${anchor}" data-sec-id="${escapeHtml(section.id)}">
    ${heading}
    ${lead}
    ${blocks}
    ${summary}
  </section>`;
}

function renderChapterSummary(chapter) {
  if (!chapter.chapterSummary || !chapter.chapterSummary.length) return "";
  return `<div class="chapter-summary">
    <div class="chapter-summary-title">${emsIcon("cheatsheet")} Shrnutí kapitoly ${escapeHtml(chapter.number)}</div>
    <ul>${chapter.chapterSummary.map(s => `<li>${inlineMd(s)}</li>`).join("")}</ul>
  </div>`;
}

function renderTOC(chapter) {
  const items = chapter.sections.map(s =>
    `<li><a href="#/${chapter.id}/${encodeURIComponent(s.id)}"><span class="n">${escapeHtml(s.id)}</span>${escapeHtml(s.title)}</a></li>`
  ).join("");
  return `<div class="ch-toc">
    <div class="ch-toc-title">Obsah kapitoly</div>
    <ol>${items}</ol>
  </div>`;
}

function renderChapterPage(chapter, prevMeta, nextMeta) {
  const partLabel = EMS_PARTS[chapter.part] || "";
  const intro = chapter.intro ? `<p class="ch-intro">${inlineMd(chapter.intro)}</p>` : "";
  const sectionsHtml = (chapter.sections || []).map(renderSection).join("");
  const pager = `<div class="ch-pager">
    ${prevMeta ? `<a class="pager-link prev" href="#/${prevMeta.id}"><span class="pager-label">${emsIcon("arrowLeft","icon-sm")} Předchozí</span><span class="pager-title">${escapeHtml(prevMeta.number)}. ${escapeHtml(prevMeta.title)}</span></a>` : "<span></span>"}
    ${nextMeta ? `<a class="pager-link next" href="#/${nextMeta.id}"><span class="pager-label">Další ${emsIcon("arrowRight","icon-sm")}</span><span class="pager-title">${escapeHtml(nextMeta.number)}. ${escapeHtml(nextMeta.title)}</span></a>` : "<span></span>"}
  </div>`;

  return `
  <article class="page">
    <div class="ch-breadcrumb"><a href="#/">Přehled</a> <span>/</span> <span>Část ${escapeHtml(chapter.part)} · ${escapeHtml(partLabel)}</span></div>
    <div class="ch-eyebrow"><span class="ch-icon-wrap">${emsIcon(chapter.icon, "icon-sm")}</span> Kapitola ${escapeHtml(chapter.number)}</div>
    <h1 class="ch-title">${escapeHtml(chapter.title)}</h1>
    ${intro}
    ${chapter.sections && chapter.sections.length > 1 ? renderTOC(chapter) : ""}
    ${sectionsHtml}
    ${renderChapterSummary(chapter)}
    ${pager}
  </article>`;
}
