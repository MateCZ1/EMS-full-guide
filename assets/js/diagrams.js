// ---------------------------------------------------------------------------
// Interactive diagram components. Registry: EMS_DIAGRAMS[key](container)
// Every diagram is self-contained vanilla JS/SVG — no external dependencies.
// ---------------------------------------------------------------------------
const EMS_DIAGRAMS = {};

function mountDiagrams(root) {
  root.querySelectorAll("[data-diagram]").forEach(el => {
    const key = el.getAttribute("data-diagram");
    if (EMS_DIAGRAMS[key] && !el.dataset.mounted) {
      el.dataset.mounted = "1";
      try { EMS_DIAGRAMS[key](el); } catch (e) { console.error("diagram failed:", key, e); }
    }
  });
}

/* ---------------------------------------------------------------------- */
/* 1) EMS levels — capability ladder                                       */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["ems-levels"] = (el) => {
  const levels = [
    { k: "EMT", label: "Záchranář-technik", pct: 25, detail: "Základní úroveň. Resuscitace, AED, kyslík, obvazování, imobilizace, transport. Zvládne 80 % všech výjezdů." },
    { k: "AEMT", label: "Střední úroveň", pct: 50, detail: "Vše jako EMT, navíc IV přístup do žíly a omezené spektrum léků." },
    { k: "Paramedic", label: "Plná pokročilá péče", pct: 78, detail: "Intubace, kompletní léky, 12-svodové EKG, kardioverze — mobilní intenzivní péče." },
    { k: "Medical Director", label: "Lékař", pct: 100, detail: "Dohled nad celým systémem, pokročilé výkony, odpovědnost za protokoly." }
  ];
  el.innerHTML = `
    <div class="dg-levels">
      ${levels.map((l, i) => `
        <button class="dg-level" data-i="${i}">
          <span class="dg-level-bar"><span style="width:${l.pct}%"></span></span>
          <span class="dg-level-name">${l.k}</span>
          <span class="dg-level-label">${l.label}</span>
        </button>`).join("")}
    </div>
    <div class="dg-level-detail" id="dgLevelDetail">${levels[0].detail}</div>
  `;
  injectDiagramStyles(`
    .dg-levels{display:flex;flex-direction:column;gap:10px}
    .dg-level{display:flex;align-items:center;gap:12px;background:none;border:1px solid var(--border);border-radius:10px;padding:10px 14px;cursor:pointer;font-family:var(--font);text-align:left;color:var(--text)}
    .dg-level:hover{border-color:var(--accent-strong)}
    .dg-level.active{background:var(--teal-soft);border-color:var(--accent-strong)}
    .dg-level-bar{width:110px;height:8px;border-radius:5px;background:var(--bg-2);overflow:hidden;flex:none}
    .dg-level-bar span{display:block;height:100%;background:linear-gradient(90deg,var(--teal),var(--accent-strong))}
    .dg-level-name{font-weight:700;font-size:13.5px;min-width:130px}
    .dg-level-label{color:var(--text-faint);font-size:12.5px}
    .dg-level-detail{margin-top:14px;padding:14px 16px;background:var(--bg-2);border-radius:10px;font-size:13.5px;line-height:1.6;color:var(--text-dim)}
  `);
  const btns = el.querySelectorAll(".dg-level");
  const detail = el.querySelector("#dgLevelDetail");
  btns.forEach((b, i) => b.addEventListener("click", () => {
    btns.forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    detail.textContent = levels[i].detail;
  }));
  btns[0].classList.add("active");
};

/* ---------------------------------------------------------------------- */
/* 2) Priority pyramid                                                     */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["priority-pyramid"] = (el) => {
  const tiers = [
    { n: 1, label: "Bezpečnost záchranáře", why: "Nemůžete pomáhat ze sanitky nebo z nemocnice — vy jste první nástroj záchrany." },
    { n: 2, label: "Bezpečnost posádky", why: "Váš partner je váš záložní záchranář — bez něj klesá šance pacienta na přežití." },
    { n: 3, label: "Bezpečnost ostatních osob", why: "Svědci a okolostojící se mohou stát dalšími pacienty, pokud scénu nezajistíte." },
    { n: 4, label: "Péče o pacienta", why: "Teprve když jsou první tři úrovně splněny, začíná samotné ošetření." }
  ];
  el.innerHTML = `<div class="dg-pyramid">
    ${tiers.map((t, i) => `
      <div class="dg-tier" data-i="${i}" style="width:${100 - i * 16}%">
        <span class="dg-tier-n">${t.n}</span><span class="dg-tier-label">${t.label}</span>
      </div>`).join("")}
    <div class="dg-tier-why" id="dgTierWhy">${tiers[0].why}</div>
  </div>`;
  injectDiagramStyles(`
    .dg-pyramid{display:flex;flex-direction:column;align-items:center;gap:6px}
    .dg-tier{display:flex;align-items:center;gap:10px;justify-content:center;padding:12px 10px;border-radius:9px;cursor:pointer;
      background:linear-gradient(90deg,var(--red),var(--amber));color:#fff;font-weight:700;font-size:13px;transition:transform .12s}
    .dg-tier:nth-child(2){background:linear-gradient(90deg,var(--amber),#e0c258)}
    .dg-tier:nth-child(3){background:linear-gradient(90deg,#e0c258,var(--teal))}
    .dg-tier:nth-child(4){background:linear-gradient(90deg,var(--teal),var(--blue))}
    .dg-tier:hover{transform:scale(1.02)}
    .dg-tier-n{width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;font-size:12px;flex:none}
    .dg-tier-why{margin-top:14px;padding:14px 16px;background:var(--bg-2);border-radius:10px;font-size:13.5px;line-height:1.6;color:var(--text-dim);width:100%;text-align:center}
  `);
  const tierEls = el.querySelectorAll(".dg-tier");
  const why = el.querySelector("#dgTierWhy");
  tierEls.forEach((t, i) => t.addEventListener("click", () => why.textContent = tiers[i].why));
};

/* ---------------------------------------------------------------------- */
/* 3) Triage / dispatch codes                                              */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["triage-codes"] = (el) => {
  const codes = [
    { c: "P1", code: "Code 3", color: "var(--code1)", label: "Kritická", situ: "Zástava srdce, střelná rána, ucpané dýchací cesty", time: "Okamžitě" },
    { c: "P2", code: "Code 2", color: "var(--code2)", label: "Závažná", situ: "Zlomeniny, střední krvácení, ztráta vědomí", time: "Do 10 minut" },
    { c: "P3", code: "Code 1", color: "var(--code3)", label: "Nízká", situ: "Drobná zranění, bolest, chronické stavy", time: "Do 30 minut" }
  ];
  el.innerHTML = `<div class="dg-triage">
    ${codes.map(c => `
      <div class="dg-triage-card" style="--c:${c.color}">
        <div class="dg-triage-top"><span class="dg-dot"></span>${c.c} <small>${c.code}</small></div>
        <div class="dg-triage-label">${c.label}</div>
        <div class="dg-triage-situ">${c.situ}</div>
        <div class="dg-triage-time">${c.time}</div>
      </div>`).join("")}
  </div>`;
  injectDiagramStyles(`
    .dg-triage{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px}
    .dg-triage-card{border:1px solid var(--border);border-radius:12px;padding:16px;border-top:4px solid var(--c)}
    .dg-triage-top{font-family:var(--font-mono);font-weight:800;font-size:15px;display:flex;align-items:center;gap:8px;color:var(--c)}
    .dg-triage-top small{font-weight:600;font-size:11px;color:var(--text-faint);font-family:var(--font)}
    .dg-dot{width:9px;height:9px;border-radius:50%;background:var(--c);box-shadow:0 0 0 4px color-mix(in srgb, var(--c) 25%, transparent);animation:dgpulse 1.6s infinite}
    @keyframes dgpulse{0%,100%{opacity:1}50%{opacity:.4}}
    .dg-triage-label{font-weight:700;margin:8px 0 6px;font-size:13.5px}
    .dg-triage-situ{font-size:12.5px;color:var(--text-dim);line-height:1.5;min-height:52px}
    .dg-triage-time{margin-top:10px;font-size:11.5px;font-weight:700;color:var(--c)}
  `);
};

/* ---------------------------------------------------------------------- */
/* 4) XABCDE flow                                                          */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["xabcde-flow"] = (el) => buildLetterFlow(el, [
  { k: "X", label: "Zastavení krvácení", detail: "Turniket, hemostatická gáza, přímý tlak — arteriální krvácení zabíjí za 3 minuty." },
  { k: "A", label: "Dýchací cesty", detail: "Záklon hlavy, výtah čelisti, vzduchovody — bez průchodných cest mozek odumírá za 4–6 minut." },
  { k: "B", label: "Dýchání", detail: "Frekvence, saturace, tenzní pneumothorax — cílová SpO2 94–99 %." },
  { k: "C", label: "Oběh", detail: "Puls, TK, CRT, rozpoznání šoku — nízký tlak je pozdní příznak." },
  { k: "D", label: "Neurologický stav", detail: "AVPU, GCS, zornice, glykémie — teprve po zajištění ABC." },
  { k: "E", label: "Celkové odkrytí", detail: "Odkrýt celé tělo, najít skrytá zranění, ihned zakrýt proti podchlazení." }
], "var(--red)");

/* ---------------------------------------------------------------------- */
/* 5) MARCH flow (tactical)                                                */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["march-flow"] = (el) => buildLetterFlow(el, [
  { k: "M", label: "Masivní krvácení", detail: "Turnikety a hemostatická gáza na všechna krvácející místa — první priorita, zabíjí za 3 minuty." },
  { k: "A", label: "Dýchací cesty", detail: "NPA, výtah čelisti — intubace odložena do bezpečné zóny." },
  { k: "R", label: "Dýchání (Respiration)", detail: "Větrací záplata, dekomprese tenzního pneumothoraxu." },
  { k: "C", label: "Oběh", detail: "IV/IO přístup a infúze — až po zastavení krvácení." },
  { k: "H", label: "Podchlazení a hlava", detail: "Záchranná deka, GCS, zornice — neohrožuje život do 3 minut." }
], "var(--amber)");

function buildLetterFlow(el, steps, color) {
  el.innerHTML = `<div class="dg-flow" style="--flow-c:${color}">
    ${steps.map((s, i) => `
      <div class="dg-flow-step" data-i="${i}">
        <div class="dg-flow-letter">${s.k}</div>
        <div class="dg-flow-label">${s.label}</div>
      </div>${i < steps.length - 1 ? '<div class="dg-flow-arrow">→</div>' : ""}`).join("")}
  </div>
  <div class="dg-flow-detail" id="dgFlowDetail"><b>${steps[0].k}</b> — ${steps[0].detail}</div>`;
  injectDiagramStyles(`
    .dg-flow{display:flex;align-items:stretch;flex-wrap:wrap;gap:6px;justify-content:center}
    .dg-flow-step{display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;padding:10px 12px;border-radius:10px;min-width:88px}
    .dg-flow-step:hover, .dg-flow-step.active{background:var(--bg-2)}
    .dg-flow-letter{width:44px;height:44px;border-radius:50%;background:var(--flow-c);color:#fff;font-family:var(--font-mono);font-weight:800;font-size:19px;display:flex;align-items:center;justify-content:center}
    .dg-flow-label{font-size:11.5px;text-align:center;color:var(--text-dim);max-width:100px;line-height:1.3}
    .dg-flow-arrow{align-self:center;color:var(--text-faint);font-size:18px}
    .dg-flow-detail{margin-top:16px;padding:14px 16px;background:var(--bg-2);border-radius:10px;font-size:13.5px;line-height:1.6;color:var(--text-dim)}
  `);
  const stepEls = el.querySelectorAll(".dg-flow-step");
  const detail = el.querySelector("#dgFlowDetail");
  stepEls.forEach((s, i) => s.addEventListener("click", () => {
    stepEls.forEach(x => x.classList.remove("active"));
    s.classList.add("active");
    detail.innerHTML = `<b>${steps[i].k}</b> — ${steps[i].detail}`;
  }));
  stepEls[0].classList.add("active");
}

/* ---------------------------------------------------------------------- */
/* 6) GCS calculator                                                       */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["gcs-calculator"] = (el) => {
  const eye = [["Spontánní", 4], ["Na výzvu", 3], ["Na bolest", 2], ["Žádná", 1]];
  const verbal = [["Orientovaný", 5], ["Zmatený", 4], ["Nepřiléhavá slova", 3], ["Nesrozumitelné zvuky", 2], ["Žádná", 1]];
  const motor = [["Poslechne výzvu", 6], ["Lokalizuje bolest", 5], ["Úniková reakce", 4], ["Abnormální flexe", 3], ["Abnormální extenze", 2], ["Žádná", 1]];
  function group(title, opts, name) {
    return `<div class="dg-gcs-group">
      <div class="dg-gcs-title">${title}</div>
      <div class="dg-gcs-opts">${opts.map((o, i) => `<button class="dg-gcs-opt" data-group="${name}" data-val="${o[1]}" ${i === 0 ? "data-default" : ""}>${o[0]} <b>${o[1]}</b></button>`).join("")}</div>
    </div>`;
  }
  el.innerHTML = `<div class="dg-gcs">
    ${group("Otevření očí (E)", eye, "e")}
    ${group("Slovní odpověď (V)", verbal, "v")}
    ${group("Motorická odpověď (M)", motor, "m")}
    <div class="dg-gcs-total">
      <div class="dg-gcs-score" id="dgGcsScore">15</div>
      <div class="dg-gcs-severity" id="dgGcsSeverity">Normální stav vědomí</div>
    </div>
  </div>`;
  injectDiagramStyles(`
    .dg-gcs{display:flex;flex-direction:column;gap:16px}
    .dg-gcs-title{font-size:12px;font-weight:700;color:var(--text-faint);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
    .dg-gcs-opts{display:flex;flex-wrap:wrap;gap:6px}
    .dg-gcs-opt{border:1px solid var(--border);background:var(--bg-2);color:var(--text-dim);border-radius:8px;padding:7px 11px;font-size:12.5px;cursor:pointer;font-family:var(--font)}
    .dg-gcs-opt b{font-family:var(--font-mono);margin-left:5px}
    .dg-gcs-opt.sel{background:var(--teal-soft);border-color:var(--accent-strong);color:var(--text)}
    .dg-gcs-total{display:flex;align-items:center;gap:16px;border-top:1px solid var(--border);padding-top:16px;margin-top:4px}
    .dg-gcs-score{font-family:var(--font-mono);font-size:34px;font-weight:800;color:var(--accent-strong);min-width:70px}
    .dg-gcs-severity{font-size:13.5px;color:var(--text-dim)}
  `);
  const state = { e: 4, v: 5, m: 6 };
  function update() {
    const total = state.e + state.v + state.m;
    el.querySelector("#dgGcsScore").textContent = total;
    const sev = el.querySelector("#dgGcsSeverity");
    const scoreEl = el.querySelector("#dgGcsScore");
    if (total <= 8) { sev.textContent = "Těžké poškození vědomí — GCS ≤ 8 = zajistit dýchací cesty rourkou."; scoreEl.style.color = "var(--red)"; }
    else if (total <= 12) { sev.textContent = "Středně těžké poškození vědomí."; scoreEl.style.color = "var(--amber)"; }
    else { sev.textContent = "Normální až mírně změněný stav vědomí."; scoreEl.style.color = "var(--accent-strong)"; }
  }
  el.querySelectorAll(".dg-gcs-opt").forEach(btn => {
    if (btn.hasAttribute("data-default")) btn.classList.add("sel");
    btn.addEventListener("click", () => {
      const g = btn.dataset.group;
      el.querySelectorAll(`.dg-gcs-opt[data-group="${g}"]`).forEach(b => b.classList.remove("sel"));
      btn.classList.add("sel");
      state[g] = parseInt(btn.dataset.val, 10);
      update();
    });
  });
  update();
};

/* ---------------------------------------------------------------------- */
/* 7) Rule of nines — burn % calculator                                    */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["burn-rule-of-nines"] = (el) => {
  const regions = [
    { id: "head", label: "Hlava a krk", pct: 9 },
    { id: "armL", label: "Levá paže", pct: 9 },
    { id: "armR", label: "Pravá paže", pct: 9 },
    { id: "trunkF", label: "Trup — přední", pct: 18 },
    { id: "trunkB", label: "Trup — zadní", pct: 18 },
    { id: "legL", label: "Levá noha", pct: 18 },
    { id: "legR", label: "Pravá noha", pct: 18 },
    { id: "groin", label: "Genitál/perineum", pct: 1 }
  ];
  el.innerHTML = `
    <div class="dg-burns">
      <div class="dg-burns-body">
        ${regions.map(r => `<button class="dg-burn-region r-${r.id}" data-id="${r.id}" title="${r.label} — ${r.pct} %"><span>${r.pct}%</span></button>`).join("")}
      </div>
      <div class="dg-burns-side">
        <div class="dg-burns-list">${regions.map(r => `<label class="dg-burns-item" data-for="${r.id}"><input type="checkbox" data-id="${r.id}"> ${r.label} <b>${r.pct}%</b></label>`).join("")}</div>
        <div class="dg-burns-total">Celkový rozsah popálení (TBSA): <span id="dgBurnTotal">0</span> %</div>
      </div>
    </div>`;
  injectDiagramStyles(`
    .dg-burns{display:flex;gap:24px;flex-wrap:wrap}
    .dg-burns-body{display:grid;grid-template-columns:repeat(4,52px);grid-template-rows:repeat(4,44px);gap:4px;flex:none}
    .dg-burn-region{border:1px solid var(--border);background:var(--bg-2);border-radius:8px;color:var(--text-faint);font-family:var(--font-mono);font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center}
    .dg-burn-region.on{background:var(--red);color:#fff;border-color:var(--red)}
    .r-head{grid-column:2/4;grid-row:1}
    .r-armL{grid-column:1;grid-row:2}
    .r-trunkF{grid-column:2/3;grid-row:2}
    .r-trunkB{grid-column:3/4;grid-row:2}
    .r-armR{grid-column:4;grid-row:2}
    .r-legL{grid-column:2;grid-row:3/5}
    .r-groin{grid-column:2/4;grid-row:3;align-self:end}
    .r-legR{grid-column:3;grid-row:3/5}
    .dg-burns-side{flex:1;min-width:220px}
    .dg-burns-list{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
    .dg-burns-item{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-dim);cursor:pointer}
    .dg-burns-item b{margin-left:auto;font-family:var(--font-mono);color:var(--text-faint)}
    .dg-burns-item.active{color:var(--text)}
    .dg-burns-total{font-size:15px;font-weight:700;padding-top:12px;border-top:1px solid var(--border)}
    #dgBurnTotal{color:var(--red);font-family:var(--font-mono);font-size:20px}
  `);
  function recalc() {
    let total = 0;
    regions.forEach(r => {
      const on = el.querySelector(`.dg-burn-region[data-id="${r.id}"]`).classList.contains("on");
      if (on) total += r.pct;
    });
    el.querySelector("#dgBurnTotal").textContent = total;
  }
  function toggle(id) {
    el.querySelector(`.dg-burn-region[data-id="${id}"]`).classList.toggle("on");
    const cb = el.querySelector(`input[data-id="${id}"]`);
    cb.checked = el.querySelector(`.dg-burn-region[data-id="${id}"]`).classList.contains("on");
    el.querySelector(`.dg-burns-item[data-for="${id}"]`).classList.toggle("active", cb.checked);
    recalc();
  }
  regions.forEach(r => {
    el.querySelector(`.dg-burn-region[data-id="${r.id}"]`).addEventListener("click", () => toggle(r.id));
    el.querySelector(`input[data-id="${r.id}"]`).addEventListener("change", () => toggle(r.id));
  });
};

/* ---------------------------------------------------------------------- */
/* 8) Trauma center levels                                                  */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["trauma-center-levels"] = (el) => {
  const levels = [
    { l: "Level I", pct: 100, desc: "Komplexní péče o veškerá zranění 24/7, vlastní výzkum, rezidenční program.", cases: "Polytrauma, GSW hlavy/trupu, disekce aorty, ECMO" },
    { l: "Level II", pct: 75, desc: "Kompletní chirurgická a kritická péče, nemusí mít vědecký program.", cases: "Větší traumata, infarkt, mrtvice, těžké popáleniny" },
    { l: "Level III", pct: 45, desc: "Stabilizace a přeložení, základní chirurgie dostupná.", cases: "Zlomeniny, lehčí trauma, stabilizace před přesunem" },
    { l: "Level IV", pct: 20, desc: "Základní stabilizace, první pomoc, transport.", cases: "Vzdálené oblasti, malá zranění, rychlý přesun jinam" }
  ];
  el.innerHTML = `<div class="dg-tc">
    ${levels.map((lv, i) => `
      <div class="dg-tc-row" data-i="${i}">
        <div class="dg-tc-label">${lv.l}</div>
        <div class="dg-tc-bar"><span style="width:${lv.pct}%"></span></div>
      </div>`).join("")}
    <div class="dg-tc-detail" id="dgTcDetail">
      <b>${levels[0].l}</b> — ${levels[0].desc}<br><span>Typicky: ${levels[0].cases}</span>
    </div>
  </div>`;
  injectDiagramStyles(`
    .dg-tc{display:flex;flex-direction:column;gap:10px}
    .dg-tc-row{display:flex;align-items:center;gap:14px;cursor:pointer;padding:6px;border-radius:8px}
    .dg-tc-row:hover, .dg-tc-row.active{background:var(--bg-2)}
    .dg-tc-label{width:80px;flex:none;font-weight:700;font-size:13px}
    .dg-tc-bar{flex:1;height:14px;background:var(--bg-2);border-radius:7px;overflow:hidden}
    .dg-tc-bar span{display:block;height:100%;background:linear-gradient(90deg,var(--red),var(--amber))}
    .dg-tc-detail{margin-top:10px;padding:14px 16px;background:var(--bg-2);border-radius:10px;font-size:13.5px;line-height:1.6;color:var(--text-dim)}
    .dg-tc-detail span{display:block;margin-top:6px;color:var(--text-faint);font-size:12.5px}
  `);
  const rows = el.querySelectorAll(".dg-tc-row");
  const detail = el.querySelector("#dgTcDetail");
  rows.forEach((r, i) => r.addEventListener("click", () => {
    rows.forEach(x => x.classList.remove("active"));
    r.classList.add("active");
    detail.innerHTML = `<b>${levels[i].l}</b> — ${levels[i].desc}<br><span>Typicky: ${levels[i].cases}</span>`;
  }));
  rows[0].classList.add("active");
};

/* ---------------------------------------------------------------------- */
/* 9) Golden hour timeline                                                  */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["golden-hour-timeline"] = (el) => {
  const marks = [
    { t: 0, label: "Poranění", detail: "Čas nula — začíná odpočet zlaté hodiny." },
    { t: 10, label: "Odjezd ze scény", detail: "Load and Go — maximálně 10 minut na místě u nestabilního polytraumatu." },
    { t: 35, label: "Příjezd do nemocnice", detail: "Předání SBAR trauma týmu; tým je připraven díky předchozí avizaci." },
    { t: 36, label: "FAST ultrazvuk", detail: "Do 60 sekund od příjmu — hledá volnou tekutinu v dutinách." },
    { t: 40, label: "CT celého těla", detail: "Do 5 minut od příjmu u nestabilních pacientů po základní stabilizaci." },
    { t: 60, label: "Operační sál", detail: "Cíl: pacient na operačním stole do 60 minut od poranění, pokud to stav vyžaduje." }
  ];
  el.innerHTML = `<div class="dg-timeline">
    <div class="dg-timeline-track">
      ${marks.map((m, i) => `<button class="dg-timeline-dot" data-i="${i}" style="left:${(m.t / 60) * 100}%"></button>`).join("")}
    </div>
    <div class="dg-timeline-labels">
      ${marks.map(m => `<span style="left:${(m.t / 60) * 100}%">${m.t}′</span>`).join("")}
    </div>
    <div class="dg-timeline-detail" id="dgTlDetail"><b>${marks[0].label}</b> — ${marks[0].detail}</div>
  </div>`;
  injectDiagramStyles(`
    .dg-timeline-track{position:relative;height:14px;background:linear-gradient(90deg,var(--green),var(--amber) 70%,var(--red));border-radius:7px;margin:30px 6px 4px}
    .dg-timeline-dot{position:absolute;top:50%;width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid var(--bg-1);transform:translate(-50%,-50%);cursor:pointer;box-shadow:0 0 0 1px var(--border-strong)}
    .dg-timeline-dot.active{background:var(--accent-strong)}
    .dg-timeline-labels{position:relative;height:16px;margin:0 6px 10px}
    .dg-timeline-labels span{position:absolute;transform:translateX(-50%);font-size:10.5px;color:var(--text-faint);font-family:var(--font-mono)}
    .dg-timeline-detail{margin-top:16px;padding:14px 16px;background:var(--bg-2);border-radius:10px;font-size:13.5px;line-height:1.6;color:var(--text-dim)}
  `);
  const dots = el.querySelectorAll(".dg-timeline-dot");
  const detail = el.querySelector("#dgTlDetail");
  dots.forEach((d, i) => d.addEventListener("click", () => {
    dots.forEach(x => x.classList.remove("active"));
    d.classList.add("active");
    detail.innerHTML = `<b>${marks[i].label}</b> — ${marks[i].detail}`;
  }));
  dots[0].classList.add("active");
};

/* ---------------------------------------------------------------------- */
/* Style injection helper (once per key)                                   */
/* ---------------------------------------------------------------------- */
const _injectedStyles = new Set();
function injectDiagramStyles(css) {
  const hash = css.length + ":" + css.slice(0, 40);
  if (_injectedStyles.has(hash)) return;
  _injectedStyles.add(hash);
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}
