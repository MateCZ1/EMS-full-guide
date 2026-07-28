// ---------------------------------------------------------------------------
// App bootstrap: data loading, hash router, sidebar, search UI, theme, misc UI.
// ---------------------------------------------------------------------------
const EmsApp = {
  chapters: {},      // id -> chapter JSON (once loaded)
  loadPromises: {},  // id -> Promise
  searchBuilt: new Set(),
};

const $content = document.getElementById("content");
const $sidebarNav = document.getElementById("sidebarNav");

/* ------------------------------------------------------------------ */
/* Data loading                                                        */
/* ------------------------------------------------------------------ */
function loadChapter(id) {
  if (EmsApp.chapters[id]) return Promise.resolve(EmsApp.chapters[id]);
  if (EmsApp.loadPromises[id]) return EmsApp.loadPromises[id];
  const p = fetch(`data/${id}.json?v=2`)
    .then(r => { if (!r.ok) throw new Error("not found"); return r.json(); })
    .then(data => {
      EmsApp.chapters[id] = data;
      if (!EmsApp.searchBuilt.has(id)) { EmsSearch.buildFromChapter(data); EmsApp.searchBuilt.add(id); }
      return data;
    })
    .catch(err => { console.warn("Chapter load failed:", id, err); return null; });
  EmsApp.loadPromises[id] = p;
  return p;
}

function loadAllChapters() {
  return Promise.all(EMS_MANIFEST.map(m => loadChapter(m.id)));
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */
function buildSidebarSkeleton() {
  const parts = {};
  EMS_MANIFEST.forEach(m => { (parts[m.part] = parts[m.part] || []).push(m); });

  let html = `
    <div class="nav-part">
      <div class="nav-part-label">Nástroje</div>
      <a href="#/vyjezd" class="nav-item nav-item-tool" data-chapter-link="vyjezd">
        ${emsIcon("siren", "icon-sm")}
        <span class="nav-item-title">Pomocník pro výjezd</span>
      </a>
    </div>`;
  Object.keys(parts).sort().forEach(partKey => {
    html += `<div class="nav-part"><div class="nav-part-label">Část ${partKey} · ${EMS_PARTS[partKey] || ""}</div>`;
    parts[partKey].forEach(m => {
      html += `
      <div class="nav-item-wrap" data-chapter="${m.id}">
        <a href="#/${m.id}" class="nav-item" data-chapter-link="${m.id}">
          ${emsIcon(m.icon, "icon-sm")}
          <span class="nav-num">${m.number}</span>
          <span class="nav-item-title">${escapeHtml(m.title)}</span>
          <span class="nav-toggle-btn">${emsIcon("chevron", "nav-toggle")}</span>
        </a>
        <div class="nav-sub" id="navsub-${m.id}"></div>
      </div>`;
    });
    html += `</div>`;
  });
  $sidebarNav.innerHTML = html;

  // Toggle expand on chevron click (without navigating)
  $sidebarNav.querySelectorAll(".nav-toggle-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const wrap = btn.closest(".nav-item-wrap");
      const navItem = wrap.querySelector(".nav-item");
      const sub = wrap.querySelector(".nav-sub");
      const willOpen = !sub.classList.contains("open");
      sub.classList.toggle("open", willOpen);
      navItem.classList.toggle("expanded", willOpen);
      if (willOpen) populateSubnav(wrap.dataset.chapter);
    });
  });
}

function populateSubnav(chapterId) {
  const sub = document.getElementById(`navsub-${chapterId}`);
  if (!sub || sub.dataset.filled) return;
  loadChapter(chapterId).then(ch => {
    if (!ch) { sub.innerHTML = `<span class="nav-sub-item" style="opacity:.5">obsah se připravuje…</span>`; return; }
    sub.dataset.filled = "1";
    sub.innerHTML = (ch.sections || []).map(s =>
      `<a class="nav-sub-item" href="#/${chapterId}/${encodeURIComponent(s.id)}" data-sub-link="${chapterId}/${s.id}">${escapeHtml(s.id)} ${escapeHtml(s.title)}</a>`
    ).join("");
    highlightActiveNav();
  });
}

function highlightActiveNav() {
  const { chapterId, sectionId } = parseHash();
  $sidebarNav.querySelectorAll(".nav-item").forEach(a => a.classList.toggle("active", a.dataset.chapterLink === chapterId && !sectionId));
  $sidebarNav.querySelectorAll(".nav-sub-item").forEach(a => {
    const match = a.dataset.subLink === `${chapterId}/${sectionId}`;
    a.classList.toggle("active", !!sectionId && match);
  });
  if (chapterId) {
    const wrap = $sidebarNav.querySelector(`.nav-item-wrap[data-chapter="${chapterId}"]`);
    if (wrap) {
      const sub = wrap.querySelector(".nav-sub");
      const navItem = wrap.querySelector(".nav-item");
      if (!sub.classList.contains("open")) { sub.classList.add("open"); navItem.classList.add("expanded"); populateSubnav(chapterId); }
      wrap.scrollIntoView({ block: "nearest" });
    }
  }
}

/* ------------------------------------------------------------------ */
/* Router                                                               */
/* ------------------------------------------------------------------ */
function parseHash() {
  let h = location.hash.replace(/^#\/?/, "");
  if (!h) return { chapterId: null, sectionId: null };
  const parts = h.split("/");
  return { chapterId: parts[0] || null, sectionId: parts[1] ? decodeURIComponent(parts[1]) : null };
}

function renderLoading() {
  $content.innerHTML = `<div class="loading-state"><div class="spinner"></div><span>Načítám obsah…</span></div>`;
}

function renderMissing(chapterId) {
  $content.innerHTML = `<div class="page"><div class="loading-state" style="padding:80px 0">
    <span>Kapitola „${escapeHtml(chapterId)}“ zatím není k dispozici.</span>
    <a class="btn" href="#/">${emsIcon("arrowLeft","icon-sm")} Zpět na přehled</a>
  </div></div>`;
}

function router() {
  const { chapterId, sectionId } = parseHash();
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  if (!chapterId) {
    renderHome();
    mountDiagrams($content);
    highlightActiveNav();
    closeMobileSidebar();
    return;
  }

  if (chapterId === "vyjezd") {
    renderWizardPage();
    highlightActiveNav();
    closeMobileSidebar();
    return;
  }

  renderLoading();
  loadChapter(chapterId).then(ch => {
    if (!ch) { renderMissing(chapterId); return; }
    const idx = EMS_MANIFEST.findIndex(m => m.id === chapterId);
    const prevMeta = idx > 0 ? EMS_MANIFEST[idx - 1] : null;
    const nextMeta = idx >= 0 && idx < EMS_MANIFEST.length - 1 ? EMS_MANIFEST[idx + 1] : null;
    $content.innerHTML = renderChapterPage(ch, prevMeta, nextMeta);
    highlightGlossaryTerms($content);
    mountDiagrams($content);
    highlightActiveNav();
    if (sectionId) {
      const anchor = document.getElementById("sec-" + sectionId.replace(/\./g, "-"));
      if (anchor) setTimeout(() => anchor.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  });
  closeMobileSidebar();
}

/* ------------------------------------------------------------------ */
/* Home page                                                           */
/* ------------------------------------------------------------------ */
function renderHome() {
  const totalSections = Object.values(EmsApp.chapters).reduce((sum, ch) => sum + (ch.sections ? ch.sections.length : 0), 0);
  const partI = EMS_MANIFEST.filter(m => m.part === "I");
  const partII = EMS_MANIFEST.filter(m => m.part === "II");

  const cardsFor = (list) => list.map(m => `
    <a class="chapter-card" href="#/${m.id}">
      <div class="ch-icon">${emsIcon(m.icon)}</div>
      <div class="ch-num">Kapitola ${m.number}</div>
      <h3>${escapeHtml(m.title)}</h3>
    </a>`).join("");

  $content.innerHTML = `
    <section class="hero">
      <span class="hero-badge">${emsIcon("siren","icon-sm")} FiveM Roleplay &middot; Emergency Medical Services</span>
      <h1>EMS Operační Manuál<br>v2.0</h1>
      <p class="lead">Interaktivní vzdělávací portál pro záchranáře. Protokoly, vybavení, diagnostické algoritmy a nemocniční péče na jednom místě — s vyhledáváním a interaktivními diagramy k pochopení, ne jen memorování.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#/vyjezd">${emsIcon("siren","icon-sm")} Pomocník pro výjezd</a>
        <a class="btn" href="#/ch01">${emsIcon("compass","icon-sm")} Začít číst od kapitoly 1</a>
        <a class="btn" href="#/ch09">${emsIcon("cheatsheet","icon-sm")} Rychlý tahák</a>
      </div>
      <div class="stat-row">
        <div class="stat"><b>${EMS_MANIFEST.length}</b><span>kapitol</span></div>
        <div class="stat"><b>${totalSections || "70+"}</b><span>podkapitol</span></div>
        <div class="stat"><b>2</b><span>části manuálu</span></div>
        <div class="stat"><b>v2.0</b><span>verze příručky</span></div>
      </div>
    </section>
    <div class="home-body">
      <div class="section-heading">${emsIcon("compass","icon-sm")} Prozkoumej tělo</div>
      <p class="section-sub">Klikni na část těla — rovnou tě to přehodí do příslušné sekce manuálu.</p>
      <div class="diagram-box" data-diagram="body-map-navigator" id="diagram-body-map-navigator" style="margin-bottom:46px"></div>

      <div class="section-heading"><span class="part-tag">ČÁST I</span> Přednemocniční péče</div>
      <p class="section-sub">Vše, co záchranář potřebuje v terénu — od základních principů po vybavení a léčebné postupy.</p>
      <div class="card-grid">${cardsFor(partI)}</div>

      <div class="section-heading"><span class="part-tag">ČÁST II</span> Nemocniční péče</div>
      <p class="section-sub">Co se s pacientem děje po předání do nemocnice — příjem, chirurgie, JIP a rehabilitace.</p>
      <div class="card-grid">${cardsFor(partII)}</div>
    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Search UI                                                            */
/* ------------------------------------------------------------------ */
document.querySelector("#searchBox .search-icon").innerHTML = emsIcon("search", "icon-sm");
const $searchInput = document.getElementById("searchInput");
const $searchResults = document.getElementById("searchResults");
const $searchClear = document.getElementById("searchClear");
$searchClear.innerHTML = emsIcon("close", "icon-sm");
let searchActiveIndex = -1;
let currentResults = [];

function renderSearchResults(results, query) {
  currentResults = results;
  searchActiveIndex = -1;
  if (!query) { $searchResults.hidden = true; return; }
  if (!results.length) {
    $searchResults.innerHTML = `<div class="search-empty">Nic jsme nenašli pro „${escapeHtml(query)}“.</div>`;
  } else {
    $searchResults.innerHTML = results.map((r, i) => `
      <a class="search-result" href="${r.hash}" data-idx="${i}">
        <span class="search-result-icon">${emsIcon(r.icon || "clipboard", "icon-sm")}</span>
        <span class="search-result-body">
          <span class="search-result-path">${escapeHtml(r.path)}</span>
          <span class="search-result-title">${escapeHtml(r.title)}</span>
          ${r.snippet ? `<span class="search-result-snippet">${r.snippet}</span>` : ""}
        </span>
      </a>`).join("");
  }
  $searchResults.hidden = false;
}

function runSearch() {
  const q = $searchInput.value.trim();
  $searchClear.hidden = !q;
  if (!q) { $searchResults.hidden = true; return; }
  renderSearchResults(EmsSearch.search(q), q);
}

let searchDebounce;
$searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(runSearch, 90);
});
$searchInput.addEventListener("focus", () => { if ($searchInput.value.trim()) runSearch(); });
$searchClear.addEventListener("click", () => { $searchInput.value = ""; $searchResults.hidden = true; $searchClear.hidden = true; $searchInput.focus(); });

$searchInput.addEventListener("keydown", (e) => {
  if ($searchResults.hidden) return;
  const items = $searchResults.querySelectorAll(".search-result");
  if (e.key === "ArrowDown") { e.preventDefault(); searchActiveIndex = Math.min(searchActiveIndex + 1, items.length - 1); updateActiveResult(items); }
  else if (e.key === "ArrowUp") { e.preventDefault(); searchActiveIndex = Math.max(searchActiveIndex - 1, 0); updateActiveResult(items); }
  else if (e.key === "Enter") {
    if (searchActiveIndex >= 0 && items[searchActiveIndex]) { location.hash = items[searchActiveIndex].getAttribute("href"); $searchResults.hidden = true; $searchInput.blur(); }
    else if (items.length) { location.hash = items[0].getAttribute("href"); $searchResults.hidden = true; $searchInput.blur(); }
  } else if (e.key === "Escape") { $searchResults.hidden = true; $searchInput.blur(); }
});
function updateActiveResult(items) {
  items.forEach((el, i) => el.classList.toggle("active", i === searchActiveIndex));
  if (items[searchActiveIndex]) items[searchActiveIndex].scrollIntoView({ block: "nearest" });
}

$searchResults.addEventListener("click", (e) => {
  const link = e.target.closest(".search-result");
  if (link) {
    $searchResults.hidden = true;
    $searchInput.blur();
  }
});
document.addEventListener("click", (e) => {
  if (!document.getElementById("searchBox").contains(e.target)) $searchResults.hidden = true;
});
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== $searchInput && !/input|textarea/i.test(document.activeElement.tagName)) {
    e.preventDefault(); $searchInput.focus();
  }
});

/* ------------------------------------------------------------------ */
/* Theme toggle                                                         */
/* ------------------------------------------------------------------ */
const $themeToggle = document.getElementById("themeToggle");
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  $themeToggle.innerHTML = emsIcon(theme === "dark" ? "sun" : "moon", "icon-sm");
  localStorage.setItem("ems-theme", theme);
}
(function initTheme() {
  const saved = localStorage.getItem("ems-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
})();
$themeToggle.addEventListener("click", () => {
  applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

/* ------------------------------------------------------------------ */
/* Mobile sidebar                                                       */
/* ------------------------------------------------------------------ */
const $sidebar = document.getElementById("sidebar");
const $scrim = document.getElementById("sidebarScrim");
const $menuToggle = document.getElementById("menuToggle");
$menuToggle.innerHTML = emsIcon("menu", "icon-sm");
$menuToggle.addEventListener("click", () => {
  $sidebar.classList.add("open"); $scrim.classList.add("show");
});
$scrim.addEventListener("click", closeMobileSidebar);
function closeMobileSidebar() { $sidebar.classList.remove("open"); $scrim.classList.remove("show"); }

/* ------------------------------------------------------------------ */
/* Scroll to top                                                        */
/* ------------------------------------------------------------------ */
const $scrollTop = document.getElementById("scrollTop");
$scrollTop.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
window.addEventListener("scroll", () => { $scrollTop.classList.toggle("show", window.scrollY > 500); });
$scrollTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ------------------------------------------------------------------ */
/* Boot                                                                 */
/* ------------------------------------------------------------------ */
buildSidebarSkeleton();
renderLoading();
loadAllChapters().then(() => {
  GlossaryIndex = buildGlossaryIndex();
  window.addEventListener("hashchange", router);
  router();
});
