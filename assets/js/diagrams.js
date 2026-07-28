// ---------------------------------------------------------------------------
// Interactive diagram components. Registry: EMS_DIAGRAMS[key](container)
// Every diagram is self-contained vanilla JS/SVG — no external dependencies.
// ---------------------------------------------------------------------------
const EMS_DIAGRAMS = {};

/* =========================================================================
   Equipment hotspot images — jump bag, ambulance, QRV, helicopter,
   hospital rooms. Each is a simple flat illustration with numbered pins.
   ========================================================================= */

EMS_DIAGRAMS["jump-bag-hotspot"] = (el) => buildHotspotDiagram(el, {
  photo: "assets/images/jump-bag.jpg",
  photoAlt: "Otevřený záchranářský batoh s rozloženým vybavením",
  hotspots: [
    { x: 47, y: 12, label: "Horní kapsa — QuikClot a hrudní záplata", detail: "Hemostatická gáza QuikClot (Oddíl A) pro krvácení v tříslech, podpaží nebo krku, a větrací hrudní záplata s ventilkem (Oddíl B) pro penetrující rány hrudníku." },
    { x: 79, y: 24, label: "Tonometr a fonendoskop", detail: "Oddíl C — tonometr (manžeta na krevní tlak); bez znalosti tlaku nerozpoznáte šok." },
    { x: 91, y: 40, label: "Sterilní obvazy a gázy", detail: "Oddíl D — sterilní gázy a obvazový materiál pro krytí ran a vstřebávání krve." },
    { x: 20, y: 52, label: "MED POD — sterilní balíčky", detail: "Oddíl D — jednotlivě balené sterilní gázy a lepicí obvazový materiál, organizované pro rychlé vybalení." },
    { x: 70, y: 66, label: "Turnikety, nůžky, pulzní oxymetr", detail: "Oddíl A + B — barevně odlišené turnikety, záchranářské nůžky (Trauma Shears) a pulzní oxymetr v přední kapse." },
    { x: 38, y: 84, label: "Digitální tonometr", detail: "Oddíl C — automatický měřič krevního tlaku; klíčový nástroj pro rozpoznání šoku v terénu." }
  ]
});

EMS_DIAGRAMS["ambulance-hotspot"] = (el) => buildHotspotDiagram(el, {
  photo: "assets/images/ambulance.jpg",
  photoAlt: "Interiér sanitky s nosítky a vybavením",
  hotspots: [
    { x: 44, y: 68, label: "Nosítka (Power-Pro XT)", detail: "Samonakládací, výškově nastavitelná, RTG průhledná deska — lze snímat bez přesunu pacienta." },
    { x: 57, y: 36, label: "Monitor a defibrilátor", detail: "Zoll X Series / Lifepak 15 — 12-svodové EKG, SpO2, ETCO2, NIBP, IBP; defibrilace, kardioverze, stimulace." },
    { x: 84, y: 45, label: "Úložné skříně — kyslík a pumpy", detail: "Kyslíkový systém (D/E lahve) a infúzní pumpy ×2 (Braun Perfusor) uložené v nástěnných skříních." },
    { x: 80, y: 62, label: "Lavice se sedadly a úchyty", detail: "Zde se během jízdy ukládá videolaryngoskop, FAST ultrazvuk a trakční dlaha — vždy po ruce spolujezdci." },
    { x: 15, y: 30, label: "Stropní úložný prostor", detail: "Vakuová matrace a záchranné deky — skladovány nad hlavou, aby nezavazely při ošetřování." },
    { x: 18, y: 55, label: "Sedačka záchranáře", detail: "Otočné křeslo s pásy — záchranář sedí čelem k pacientovi po celou dobu transportu." }
  ]
});

EMS_DIAGRAMS["qrv-hotspot"] = (el) => buildHotspotDiagram(el, {
  photo: "assets/images/qrv.jpg",
  photoAlt: "Kufr rychlého výjezdového vozu (QRV) s vybavením",
  hotspots: [
    { x: 12, y: 68, label: "Přenosný monitor s defibrilátorem", detail: "SpO2, 3-svodové EKG, NIBP — okamžitý přehled vitálních funkcí; hlasové pokyny jako u AED." },
    { x: 33, y: 66, label: "Kyslíková lahev + dýchací vybavení", detail: "Přenosná kyslíková lahev se sadou masek — kyslík musí být dostupný okamžitě." },
    { x: 50, y: 72, label: "Trakční dlaha a páteřní deska", detail: "Trakční dlaha Sager — zlomenina femuru bez trakce znamená 2–3 litry krve do stehna. Páteřní deska pro znehybnění." },
    { x: 75, y: 66, label: "Záchranářský batoh (plně vybavený)", detail: "Oddíly A–E kompletní — QRV záchranář musí zahájit péči bez sanitky, musí mít vše u sebe." },
    { x: 68, y: 38, label: "Nitrilové rukavice + spotřební materiál", detail: "Rukavice S/M/L/XL k výměně mezi pacienty; krabice s dalším spotřebním materiálem na horní polici." },
    { x: 33, y: 38, label: "Záchranné deky a doplňkové vybavení", detail: "Termoizolační přikrývky proti podchlazení — u každého traumatizovaného pacienta." }
  ]
});

EMS_DIAGRAMS["hems-hotspot"] = (el) => buildHotspotDiagram(el, {
  photo: "assets/images/helicopter.jpg",
  photoAlt: "Kabina záchranného vrtulníku HEMS s vybavením",
  hotspots: [
    { x: 20, y: 45, label: "Záchranářský batoh (Trauma Pack)", detail: "Kompletní vybavení pro zahájení péče okamžitě po přistání, ještě před vyložením nosítek." },
    { x: 34, y: 34, label: "Lifepak 15 — monitor a defibrilátor", detail: "12-svodové EKG, SpO2, ETCO2, IBP, teplota — plnohodnotná JIP monitorace i za letu." },
    { x: 56, y: 20, label: "Kyslíkový systém a ventilátor", detail: "Transportní ventilátor Oxylog 3000+ napojený na kyslíkové zásobníky — odolný vůči vibracím vrtulníku." },
    { x: 50, y: 60, label: "Transportní lehátko", detail: "Nosítka s pásy pro bezpečné uchycení pacienta během letu, zasunovací do kabiny." },
    { x: 68, y: 50, label: "Infúzní pumpy + FAST ultrazvuk", detail: "Přesné dávkování bez ohledu na náklon vrtulníku; FAST diagnostikuje krvácení přímo za letu." }
  ]
});

/* =========================================================================
   Body map navigator — anatomical photo with hotspots that jump straight
   into the relevant manual chapter/section (used on the home page).
   ========================================================================= */
EMS_DIAGRAMS["body-map-navigator"] = (el) => buildHotspotDiagram(el, {
  photo: "assets/images/body-map.jpg",
  photoAlt: "Anatomické tělo s klikacími body",
  bodymap: true,
  hotspots: [
    { x: 29, y: 6, label: "Hlava", detail: "Poranění mozku (TBI) — GCS, zornice, Cushingova triáda.", href: "#/ch04/4.8" },
    { x: 30, y: 15, label: "Krční páteř", detail: "Poranění páteře a míchy — imobilizace, log-roll, NV status.", href: "#/ch04/4.9" },
    { x: 32, y: 24, label: "Hrudník / srdce", detail: "Zástava srdce a resuscitace (KPR) — algoritmus ALS, defibrilace.", href: "#/ch04/4.7" },
    { x: 30, y: 38, label: "Břicho", detail: "Šok — rozpoznání a léčba; vnitřní krvácení se projeví tachykardií dřív než poklesem tlaku.", href: "#/ch04/4.16" },
    { x: 30, y: 46, label: "Pánev", detail: "Zlomeniny — nestabilní pánev může krvácet až 5 litrů; pánevní pás T-POD ihned.", href: "#/ch04/4.2" },
    { x: 45, y: 49, label: "Paže", detail: "Zlomeniny horních končetin — dlahování, kontrola NV statusu před i po.", href: "#/ch04/4.2" },
    { x: 28, y: 68, label: "Stehno / noha", detail: "Zlomenina femuru — trakční dlaha povinně, bez ní vteče do stehna 1–3 litry krve.", href: "#/ch04/4.2" },
    { x: 70, y: 26, label: "Záda / páteř (zezadu)", detail: "Poranění páteře — log-roll minimálně 3 záchranáři, nulová rotace páteře.", href: "#/ch04/4.9" },
    { x: 68, y: 66, label: "Tepny dolních končetin", detail: "Algoritmus XABCDE — X: zastavení masivního krvácení má vždy přednost před vším ostatním.", href: "#/ch03/3.1" }
  ]
});

function mountDiagrams(root) {
  root.querySelectorAll("[data-diagram]").forEach(el => {
    const key = el.getAttribute("data-diagram");
    if (EMS_DIAGRAMS[key] && !el.dataset.mounted) {
      el.dataset.mounted = "1";
      try { EMS_DIAGRAMS[key](el); } catch (e) { console.error("diagram failed:", key, e); }
    }
  });
}

EMS_DIAGRAMS["trauma-bay-hotspot"] = (el) => buildHotspotDiagram(el, {
  photo: "assets/images/trauma-bay.jpg",
  photoAlt: "Trauma bay — resuscitační místnost urgentního příjmu",
  hotspots: [
    { x: 54, y: 20, label: "Stropní ramena — světla a monitor", detail: "Výkonná studená LED světla a centrální monitor na plně polohovatelných ramenech přichycených ke stropu — lze umístit nad pacienta z libovolného úhlu." },
    { x: 30, y: 65, label: "Traumatologické lůžko", detail: "Pevné, výškově nastavitelné lůžko na kolečkách s RTG průhlednou deskou — lze snímat bez přesunu pacienta." },
    { x: 18, y: 48, label: "Lékový vozík (Crash Cart)", detail: "Barevně rozlišené zásuvky: resuscitační léky, dýchací cesty, sedace/RSI, vazoaktivní léky, analgetika, ostatní léky." },
    { x: 63, y: 68, label: "Druhé resuscitační lůžko", detail: "Trauma bay má obvykle 2+ lůžek pro paralelní ošetření více pacientů při hromadném neštěstí." },
    { x: 80, y: 55, label: "Infúzní pumpy a kyslíkové zásuvky", detail: "Elektrické pumpy (Alaris/B. Braun) na přesný průtok; nástěnné zásuvky O2 a medicinálních plynů." },
    { x: 78, y: 72, label: "Elektrická odsávačka + spotřební vozík", detail: "Nástěnná odsávačka s podtlakem 600+ mmHg pro odsátí krve a zvratků; vozík se spotřebním materiálem." }
  ]
});

EMS_DIAGRAMS["or-hotspot"] = (el) => buildHotspotDiagram(el, {
  photo: "assets/images/or-room.jpg",
  photoAlt: "Operační sál s robotickým chirurgickým ramenem",
  hotspots: [
    { x: 22, y: 18, label: "Chirurgická svítidla", detail: "LED světla bez stínů (až 160 000 luxů) na výškově nastavitelných ramenech nad operačním polem." },
    { x: 45, y: 40, label: "Robotický chirurgický systém / C-rameno", detail: "Velké articulované rameno pro robotickou chirurgii nebo RTG v reálném čase (fluoroskopie) — obraz na monitorech u zdi." },
    { x: 56, y: 70, label: "Operační stůl", detail: "Elektricky nastavitelný stůl; náklon do Trendelenburgu i na bok podle operačního přístupu." },
    { x: 68, y: 36, label: "Anesteziologický a chirurgický monitor", detail: "Sdružené displeje: SpO2, EKG, ETCO2, BIS (hloubka anestézie) i obraz z kamery/C-ramene." },
    { x: 10, y: 60, label: "Anesteziologický přístroj", detail: "Ventilátor + zásobníky plynů + vaporér — kompletní pracoviště anesteziologa u hlavy pacienta." },
    { x: 82, y: 60, label: "Přístrojový vozík", detail: "Elektrochirurgický přístroj (ESU) nebo další nástrojový vozík připravený u operačního stolu." }
  ]
});

EMS_DIAGRAMS["cathlab-hotspot"] = (el) => buildHotspotDiagram(el, {
  photo: "assets/images/cathlab.jpg",
  photoAlt: "Katetrizační sál s C-ramenem nad vyšetřovacím stolem",
  hotspots: [
    { x: 40, y: 40, label: "C-rameno s plochým detektorem", detail: "Velký RTG systém ve tvaru C otáčející se kolem pacienta; fluoroskopie = rentgen v reálném čase." },
    { x: 55, y: 78, label: "Katetrizační stůl", detail: "RTG průhledný stůl s ovládacím panelem — pacient leží, stůl se posunuje pod statickým C-ramenem." },
    { x: 78, y: 42, label: "Monitor s fluoroskopickým obrazem", detail: "Sledování katetrizace v reálném čase — poloha katétru, vodiče a kontrastní látky v cévách." },
    { x: 70, y: 80, label: "Ovládací panel stolu", detail: "Pedály a ovladače pro polohování stolu a spouštění RTG záznamu během výkonu." },
    { x: 45, y: 14, label: "Stropní kolejnicový systém", detail: "C-rameno zavěšené na stropní kolejnici (MAVIG) — umožňuje volný pohyb kolem celého stolu." },
    { x: 52, y: 55, label: "Infúzní a kontrastní vedení", detail: "Injekční automat na kontrast a infúzní linky vedené k pacientovi na stole." }
  ]
});

EMS_DIAGRAMS["icu-monitor-hotspot"] = (el) => buildHotspotDiagram(el, {
  photo: "assets/images/monitor.jpg",
  photoAlt: "Monitor a defibrilátor Lifepak 15 v AED režimu",
  hotspots: [
    { x: 48, y: 48, label: "Displej — EKG, SpO2 a životní funkce", detail: "Sdružený displej zobrazuje srdeční rytmus (EKG), saturaci kyslíkem (SpO2), krevní tlak (NIBP) a další vitální funkce najednou." },
    { x: 70, y: 82, label: "Volba energie a výboj", detail: "Otočný volič energie a tlačítko výboje pro manuální defibrilaci — klíčové při fibrilaci komor (VF)." },
    { x: 80, y: 52, label: "Synchronizovaná kardioverze a stimulace", detail: "Tlačítka SYNC/PACE/ALARM — synchronizovaný výboj u tachyarytmií nebo transkutánní kardiostimulace u bradykardie." },
    { x: 17, y: 52, label: "Konektory pro elektrody a snímače", detail: "Připojení pro 12-svodové EKG, SpO2 čidlo a manžetu na měření krevního tlaku (NIBP)." },
    { x: 12, y: 32, label: "Pouzdro s elektrodami", detail: "Boční kapsa s náhradními defibrilačními elektrodami a příslušenstvím — vždy po ruce při výjezdu." }
  ]
});

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
/* 10) START triage — step-through decision tree (ch05 §5.1)               */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["start-triage-tree"] = (el) => {
  const tree = {
    q: "Pacient chodí sám na výzvu „Chodit schopní, jděte tam“?",
    yes: { result: "green", label: "🟢 ZELENÁ — P3, lehce zraněný", detail: "Odkázat do zelené zóny. Rychlá identifikace nejlehčích pacientů hned na začátku uvolní ruce záchranáři pro těžší případy." },
    no: {
      q: "Dýchá pacient (i po záklonu hlavy)?",
      no: { result: "black", label: "⚫ ČERNÁ — Beznadějný / mrtvý", detail: "Neresuscitovat. Jeden záchranář provádějící KPR ošetří jednoho pacienta; stejný záchranář provádějící triáž roztřídí dvacet." },
      yes: {
        q: "Splňuje ALESPOŇ JEDNO: dýchá jen po záklonu hlavy / dechy nad 30/min / kapilární návrat nad 2 s / neplní jednoduché pokyny?",
        yes: { result: "red", label: "🔴 ČERVENÁ — P1, okamžitá", detail: "Ošetřit jako první. Pouze 60sekundová záchranná intervence (turniket, vzduchovod, hrudní záplata) — déle a přehlédnete další červené pacienty." },
        no: { result: "yellow", label: "🟡 ŽLUTÁ — P2, odložená", detail: "Může počkat 30–60 minut. Přehodnocujte stav každých 10 minut — žlutý pacient se může zhoršit na červeného." }
      }
    }
  };
  buildDecisionTree(el, tree, {
    green: { color: "var(--code3)" }, yellow: { color: "var(--code2)" },
    red: { color: "var(--code1)" }, black: { color: "var(--text-faint)" }
  });
};

/* ---------------------------------------------------------------------- */
/* 11) SBAR handover flow (ch06 §6.2)                                       */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["sbar-flow"] = (el) => buildLetterFlow(el, [
  { k: "S", label: "Situace", detail: "Kdo, co se stalo, identita pacienta. Např.: „Přivážím 35letého muže, řidiče, čelní náraz při vysoké rychlosti.“" },
  { k: "B", label: "Zázemí", detail: "Anamnéza, mechanismus, co jsme udělali. Např.: bezvědomí na místě, KPR 8 minut, ROSC, podezření na TBI." },
  { k: "A", label: "Hodnocení", detail: "Aktuální vitální funkce a klinický závěr — GCS, TK, puls, SpO2, provedené výkony." },
  { k: "R", label: "Doporučení", detail: "Co pacient okamžitě potřebuje — aktivace trauma týmu, urgentní CT, konzultace specialisty." }
], "var(--blue)");

/* ---------------------------------------------------------------------- */
/* 12) FAST+ stroke recognition flow (ch04 §4.13)                           */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["fast-stroke-flow"] = (el) => buildLetterFlow(el, [
  { k: "F", label: "Obličej", detail: "„Usmějte se“ — asymetrie, jeden koutek povislý. Lícní nerv řídí mimiku kontralaterálně k lézi." },
  { k: "A", label: "Paže", detail: "Zvedněte obě paže na 90° na 10 sekund — jedna klesá nebo ji nelze zvednout." },
  { k: "S", label: "Řeč", detail: "Opakujte větu — nesrozumitelná řeč, špatná slova, afázie." },
  { k: "T", label: "Čas", detail: "Kdy naposledy v normálu (LKW) — tPA okno je fixních 4,5 hodiny, přesný čas je klíčový." },
  { k: "+B", label: "Rovnováha", detail: "Náhlá nestabilita, ataxie — cerebelární CMP se bez tohoto písmene přehlédne." },
  { k: "+E", label: "Oči", detail: "Deviace pohledu ke straně léze, hemianopsie — výpadek poloviny zorného pole." },
  { k: "+H", label: "Bolest hlavy", detail: "Náhlá „nejsilnější bolest hlavy v životě“ = podezření na subarachnoidální krvácení do vyloučení." }
], "var(--red)");

/* ---------------------------------------------------------------------- */
/* 13) NRP neonatal resuscitation flow (ch13 §13.2)                         */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["nrp-flow"] = (el) => buildLetterFlow(el, [
  { k: "1", label: "Teplo, sucho, stimulace", detail: "Suchý ručník, výměna za suchý, stimulace tření zad a chodidel. Porodnice 26 °C." },
  { k: "2", label: "Zhodnocení", detail: "Dýchá? Má tonus? Dobrý pláč a tonus → k matce. Nedýchá nebo slabý tonus → pokračovat v NRP." },
  { k: "3", label: "Dýchací cesty", detail: "Sniffing position, jemné odsání max. 5 cm / 5 sekund — přehnané odsávání způsobuje bradykardii." },
  { k: "4", label: "PPV", detail: "Při apnoe nebo TF < 100/min: neonatální BVM 40–60 vdechů/min, kyslík titrovaný dle SpO2 cílů." },
  { k: "5", label: "Srdeční masáž", detail: "Při TF < 60/min po 30 s PPV: technika dvou palců, poměr 3:1 (90 kompresí + 30 vdechů/min)." },
  { k: "6", label: "Epinefrin", detail: "Při TF < 60/min po 60 s masáže: 0,01–0,03 mg/kg IV/IO; endotracheálně vyšší dávka, méně účinné." }
], "var(--teal)");

/* ---------------------------------------------------------------------- */
/* 14) Patient communication flashcards (ch07 §7.1)                        */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["patient-comm-flashcards"] = (el) => buildFlashcards(el, [
  { front: "😰 Panický pacient", back: "Neříkejte „uklidněte se“. Řekněte jméno: „Jsem Pavel, záchranář.“ Dýchejte s ním nahlas — nádech, výdech." },
  { front: "😠 Agresivní pacient", back: "Nestůjte naproti, neblokujte únik. Odstup 2+ m, klidný hlas, otevřené dlaně, přivolejte policii." },
  { front: "🧒 Dítě", back: "Neshlížejte shora — klekněte na jeho úroveň. Dejte mu pocit kontroly: „Smíš mě držet za ruku?“" },
  { front: "👵 Starší pacient", back: "Nepředpokládejte demenci ani hluchotu. Mluvte pomalu, zachovejte důstojnost, informujte rodinu." },
  { front: "🍺 Pod vlivem látek", back: "Nehádejte se, neopravujte. Jednoduché věty, klidný tón — priorita je bezpečnost obou stran." },
  { front: "🩹 Oběť násilí", back: "Neptejte se na detaily, neprojevujte šok. Souhlas před dotykem, ideálně záchranář stejného pohlaví." }
]);

/* ---------------------------------------------------------------------- */
/* 15) Abbreviation flashcards (ch08 §8.1)                                  */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["abbrev-flashcards"] = (el) => buildFlashcards(el, [
  { front: "GCS", back: "Glasgow Coma Scale — škála vědomí 3–15 (oči + řeč + motorika)." },
  { front: "XABCDE", back: "Krvácení → Dýchací cesty → Dýchání → Oběh → Neurologie → Odkrytí." },
  { front: "MARCH", back: "Taktický algoritmus: Masivní krvácení → Airway → Respirace → Circulation → Hypotermie/Hlava." },
  { front: "SBAR", back: "Situace, Background (zázemí), Assessment (hodnocení), Recommendation (doporučení)." },
  { front: "TQ", back: "Turniket — škrtidlo zastavující arteriální krvácení z končetiny." },
  { front: "ROSC", back: "Return of Spontaneous Circulation — obnova spontánního oběhu po zástavě srdce." },
  { front: "ETCO2", back: "Kapnometrie — CO2 na konci výdechu; potvrzuje intubaci a kvalitu KPR." },
  { front: "TnPTX", back: "Tenzní pneumothorax — vzduch pod tlakem stlačující srdce; jehla 14G ihned." },
  { front: "STEMI", back: "ST-Elevation Myocardial Infarction — nejzávažnější typ infarktu, urgentní katetrizace." },
  { front: "FAST", back: "Focused Assessment with Sonography in Trauma — rychlý trauma ultrazvuk." }
]);

/* ---------------------------------------------------------------------- */
/* 16) Surgical instruments flashcards (ch11B)                              */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["surgical-instruments-flashcards"] = (el) => buildFlashcards(el, [
  { front: "ESU (Bovie)", back: "Elektrochirurgický přístroj — vysokofrekvenční proud řeže tkáň nebo zastavuje krvácení koagulací." },
  { front: "Harmonic Scalpel", back: "Ultrasonický skalpel — čepel vibruje 55 000×/s, koaguluje tkáň pod 100 °C, méně kouře než ESU." },
  { front: "Laparoskopická věž", back: "Kamera + monitor + insuflátor CO2 pro minimálně invazivní chirurgii přes 3–4 malé řezy." },
  { front: "Da Vinci systém", back: "Robotický systém — chirurg ovládá ramena z konzole; 3D obraz, třes ruky se neprojeví." },
  { front: "Cell Saver", back: "Autotransfúze — odsaje krev z pole, přečistí a vrátí pacientovi jeho vlastní červené krvinky." },
  { front: "C-rameno RTG", back: "Pojízdný RTG ve tvaru C — obraz v reálném čase (fluoroskopie) pro ortopedii a cévní výkony." },
  { front: "Stapler", back: "Automatický svorkovací přístroj (GIA, TA, EEA) — rychlejší a přesnější než ruční šití." }
]);

/* ---------------------------------------------------------------------- */
/* 17) MVA additional hospital diagnoses flashcards (ch11 §11.6)            */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["mva-injury-flashcards"] = (el) => buildFlashcards(el, [
  { front: "Kontuze myokardu", back: "EKG: nové arytmie, ST změny; troponin stoupá za 6–12 h. Monitorace na kardio JIP 24–48 h." },
  { front: "Traumatická disekce aorty", back: "CT angiografie: intramurální hematom. Léčba: endovaskulární TEVAR nebo otevřená chirurgie." },
  { front: "Pneumothorax", back: "RTG/FAST: vzduch v pohrudnici. Léčba: hrudní drenáž 28–32 French na negativní tlak." },
  { front: "Hemothorax", back: "RTG: zastínění, přes 1500 ml krve. Hrudní drenáž; masivní krvácení = urgentní thorakotomie." },
  { front: "Ruptura sleziny", back: "FAST + CT: volná tekutina. Stabilní: angioembolizace. Nestabilní: urgentní splenektomie." },
  { front: "Poranění jater", back: "CT: lacerace, hematom. Grade I–II konzervativně; III angioembolizace; IV–V chirurgie." }
]);

/* ---------------------------------------------------------------------- */
/* 18) ESI triage scale (ch10 §10.2)                                       */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["esi-scale"] = (el) => buildScaleDiagram(el, [
  { label: "ESI 1", pct: 100, color: "var(--code1)", value: "0 min", desc: "Ihned (resuscitace) — zástava srdce, těžký šok, ucpané dýchací cesty." },
  { label: "ESI 2", pct: 78, color: "var(--code1)", value: "do 10 min", desc: "Urgentní, vysoké riziko — STEMI, mrtvice, těžká bolest na hrudi." },
  { label: "ESI 3", pct: 55, color: "var(--code2)", value: "30–60 min", desc: "Naléhavé — zlomeniny, bolest, zvracení, střední krvácení." },
  { label: "ESI 4", pct: 32, color: "var(--code3)", value: "60–120 min", desc: "Méně naléhavé — jednoduchá rána, zánět ucha, mírná bolest." },
  { label: "ESI 5", pct: 15, color: "var(--code3)", value: "2–4 hod", desc: "Nenaléhavé — studené příznaky, recepty, chronické stavy." }
]);

/* ---------------------------------------------------------------------- */
/* 19) tPA vs. EVT comparison (ch12 §12.2)                                  */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["tpa-vs-evt-scale"] = (el) => {
  el.innerHTML = `<div class="dg-cmp">
    <div class="dg-cmp-col">
      <div class="dg-cmp-title">tPA (trombolýza)</div>
      <div class="dg-cmp-row"><span>Časové okno</span><b>4,5 hodiny</b></div>
      <div class="dg-cmp-row"><span>Rekanalizace</span><b>55–60 %</b></div>
      <div class="dg-cmp-row"><span>Krvácivé riziko</span><b>2–6 %</b></div>
      <div class="dg-cmp-row"><span>Nejlepší pro</span><b>Menší uzávěry</b></div>
    </div>
    <div class="dg-cmp-vs">VS</div>
    <div class="dg-cmp-col">
      <div class="dg-cmp-title">EVT (trombektomie)</div>
      <div class="dg-cmp-row"><span>Časové okno</span><b>24 hodin*</b></div>
      <div class="dg-cmp-row"><span>Rekanalizace</span><b>80–90 %</b></div>
      <div class="dg-cmp-row"><span>Krvácivé riziko</span><b>&lt; 2 %</b></div>
      <div class="dg-cmp-row"><span>Nejlepší pro</span><b>Velké uzávěry</b></div>
    </div>
  </div>
  <div class="dg-cmp-note">* při dobrém CT perfúzním nálezu. Metody lze kombinovat (bridge therapy).</div>`;
  injectDiagramStyles(`
    .dg-cmp{display:flex;align-items:center;gap:14px}
    .dg-cmp-col{flex:1;background:var(--bg-2);border-radius:12px;padding:16px}
    .dg-cmp-title{font-weight:800;font-size:13.5px;color:var(--accent-strong);margin-bottom:10px;text-align:center}
    .dg-cmp-row{display:flex;justify-content:space-between;font-size:12.5px;padding:6px 0;border-top:1px solid var(--border)}
    .dg-cmp-row:first-of-type{border-top:none}
    .dg-cmp-row span{color:var(--text-faint)}
    .dg-cmp-vs{flex:none;font-family:var(--font-mono);font-weight:800;color:var(--text-faint);font-size:13px}
    .dg-cmp-note{margin-top:12px;font-size:11.5px;color:var(--text-faint);text-align:center}
  `);
};

/* ---------------------------------------------------------------------- */
/* 20) Vitals quick-reference gauges (ch09 §9.1)                            */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["vitals-gauges"] = (el) => {
  const vitals = [
    { label: "Systolický TK", unit: "mmHg", low: 90, high: 140, min: 40, max: 220, normalLabel: "100–139" },
    { label: "Tepová frekvence", unit: "/min", low: 60, high: 100, min: 20, max: 180, normalLabel: "60–100" },
    { label: "Dechová frekvence", unit: "/min", low: 12, high: 20, min: 0, max: 40, normalLabel: "12–20" },
    { label: "SpO2", unit: "%", low: 94, high: 100, min: 60, max: 100, normalLabel: "95–100" },
    { label: "Teplota", unit: "°C", low: 36.5, high: 37.3, min: 32, max: 42, normalLabel: "36,5–37,3" },
    { label: "GCS", unit: "bodů", low: 13, high: 15, min: 3, max: 15, normalLabel: "15 (max)" }
  ];
  function pct(v, min, max) { return Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100)); }
  el.innerHTML = `<div class="dg-vitals">${vitals.map(v => `
    <div class="dg-vital">
      <div class="dg-vital-label">${v.label} <span>(${v.unit})</span></div>
      <div class="dg-vital-track">
        <span class="dg-vital-zone low" style="width:${pct(v.low, v.min, v.max)}%"></span>
        <span class="dg-vital-zone normal" style="left:${pct(v.low, v.min, v.max)}%;width:${pct(v.high, v.min, v.max) - pct(v.low, v.min, v.max)}%"></span>
        <span class="dg-vital-zone high" style="left:${pct(v.high, v.min, v.max)}%;width:${100 - pct(v.high, v.min, v.max)}%"></span>
      </div>
      <div class="dg-vital-normal">normální: ${v.normalLabel}</div>
    </div>`).join("")}</div>`;
  injectDiagramStyles(`
    .dg-vitals{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px}
    .dg-vital-label{font-size:12px;font-weight:700;margin-bottom:8px}
    .dg-vital-label span{font-weight:400;color:var(--text-faint)}
    .dg-vital-track{position:relative;height:10px;border-radius:6px;overflow:hidden;background:var(--bg-2)}
    .dg-vital-zone{position:absolute;top:0;bottom:0}
    .dg-vital-zone.low{left:0;background:var(--amber)}
    .dg-vital-zone.normal{background:var(--green)}
    .dg-vital-zone.high{background:var(--amber)}
    .dg-vital-normal{margin-top:6px;font-size:10.5px;color:var(--text-faint)}
  `);
};

/* ---------------------------------------------------------------------- */
/* 21) Discharge readiness checklist (ch15 §15.1)                           */
/* ---------------------------------------------------------------------- */
EMS_DIAGRAMS["discharge-checklist"] = (el) => buildChecklist(el, [
  "Vitální funkce stabilní bez vazopresorů nebo O2 nad domácí normu pacienta",
  "Bolest zvladatelná perorálními analgetiky",
  "Schopen základní sebeobsluhy nebo zajištěna domácí/rehabilitační péče",
  "Pacient a rodina rozumí diagnóze, lékům, omezením a varovným příznakům",
  "Domluvena kontrola u specialisty nebo praktického lékaře do 1–2 týdnů",
  "Vystaveny recepty na pokračovací léčbu; vysvětleny vedlejší účinky"
]);

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

/* =========================================================================
   GENERIC: Hotspot image — an illustration with clickable numbered pins.
   Clicking a pin (or the matching list entry) shows the item's description.
   ========================================================================= */
function buildHotspotDiagram(el, { illustration, viewBox, photo, photoAlt, hotspots, bodymap }) {
  const pins = hotspots.map((h, i) => `
    <button class="dg-hs-pin" data-i="${i}" style="left:${h.x}%;top:${h.y}%" aria-label="${escapeHtml(h.label)}">${i + 1}</button>`).join("");
  const listItems = hotspots.map((h, i) => `
    <button class="dg-hs-item" data-i="${i}"><span class="dg-hs-item-num">${i + 1}</span>${escapeHtml(h.label)}</button>`).join("");
  const media = photo
    ? `<img src="${escapeHtml(photo)}" alt="${escapeHtml(photoAlt || "")}">`
    : `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${illustration}</svg>`;

  const gotoLink = (h) => h.href ? `<a class="dg-hs-goto" href="${escapeHtml(h.href)}">Otevřít v manuálu ${emsIcon("arrowRight", "icon-sm")}</a>` : "";

  el.innerHTML = `<div class="dg-hs${bodymap ? " dg-bodymap" : ""}">
    <div class="dg-hs-img">${media}<div class="dg-hs-pins">${pins}</div></div>
    <div class="dg-hs-side">
      <div class="dg-hs-list">${listItems}</div>
      <div class="dg-hs-detail" id="dgHsDetail-${el.id}"><b>${escapeHtml(hotspots[0].label)}</b>${hotspots[0].detail}${gotoLink(hotspots[0])}</div>
    </div>
  </div>`;

  injectDiagramStyles(`
    .dg-hs{display:flex;gap:22px;flex-wrap:wrap}
    .dg-hs-img{position:relative;flex:1 1 300px;max-width:380px;min-height:200px;border-radius:14px;overflow:hidden;background:var(--bg-2);border:1px solid var(--border)}
    .dg-hs-img svg, .dg-hs-img img{display:block;width:100%;height:auto}
    .dg-hs-pins{position:absolute;inset:0}
    .dg-hs-pin{position:absolute;transform:translate(-50%,-50%);width:24px;height:24px;border-radius:50%;background:var(--red);color:#fff;
      border:2px solid rgba(255,255,255,.85);font-family:var(--font-mono);font-weight:800;font-size:11.5px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.45);transition:transform .12s,background .12s}
    .dg-hs-pin:hover{transform:translate(-50%,-50%) scale(1.18)}
    .dg-hs-pin.active{background:var(--accent-strong);transform:translate(-50%,-50%) scale(1.28)}
    .dg-hs-side{flex:1 1 230px;min-width:210px;display:flex;flex-direction:column}
    .dg-hs-list{display:flex;flex-direction:column;gap:3px;margin-bottom:14px;max-height:230px;overflow-y:auto;padding-right:4px}
    .dg-hs-item{display:flex;align-items:center;gap:10px;background:none;border:1px solid transparent;text-align:left;
      padding:6px 8px;border-radius:8px;cursor:pointer;color:var(--text-dim);font-size:12.3px;font-family:var(--font)}
    .dg-hs-item:hover{background:var(--bg-2)}
    .dg-hs-item.active{background:var(--teal-soft);color:var(--text);font-weight:600}
    .dg-hs-item-num{width:19px;height:19px;border-radius:50%;background:var(--bg-2);display:flex;align-items:center;justify-content:center;
      font-family:var(--font-mono);font-size:10px;flex:none;color:var(--text-faint)}
    .dg-hs-item.active .dg-hs-item-num{background:var(--accent-strong);color:#fff}
    .dg-hs-detail{padding:14px 16px;background:var(--bg-2);border-radius:10px;font-size:12.8px;line-height:1.6;color:var(--text-dim);margin-top:auto}
    .dg-hs-detail b{color:var(--text);display:block;margin-bottom:5px;font-size:13.5px}
    .dg-hs-goto{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-size:12.5px;font-weight:700;color:var(--accent-strong);text-decoration:none}
    .dg-hs-goto:hover{text-decoration:underline}
    .dg-bodymap .dg-hs-img{max-width:340px;background:#0a0e14}
    .illus-shell{fill:var(--bg-1);stroke:var(--border-strong);stroke-width:2}
    .illus-muted{fill:var(--bg-2);stroke:var(--border-strong);stroke-width:1.5}
    .illus-outline{fill:none;stroke:var(--text-faint);stroke-width:2}
    .illus-line{stroke:var(--text-faint);stroke-width:2;fill:none}
    .illus-dim{fill:var(--text-faint)}
    .illus-a{fill:var(--red)}
    .illus-b{fill:var(--blue)}
    .illus-c{fill:var(--green)}
    .illus-d{fill:var(--amber)}
    .illus-e{fill:#9d6bd9}
  `);

  const pinEls = el.querySelectorAll(".dg-hs-pin");
  const itemEls = el.querySelectorAll(".dg-hs-item");
  const detail = el.querySelector(`#dgHsDetail-${el.id}`);
  function activate(i) {
    pinEls.forEach(p => p.classList.toggle("active", +p.dataset.i === i));
    itemEls.forEach(p => p.classList.toggle("active", +p.dataset.i === i));
    detail.innerHTML = `<b>${escapeHtml(hotspots[i].label)}</b>${hotspots[i].detail}${gotoLink(hotspots[i])}`;
  }
  pinEls.forEach(p => p.addEventListener("click", () => activate(+p.dataset.i)));
  itemEls.forEach(p => p.addEventListener("click", () => activate(+p.dataset.i)));
  activate(0);
}

/* =========================================================================
   GENERIC: Flip flashcards grid                                            */
function buildFlashcards(el, cards) {
  el.innerHTML = `<div class="dg-cards">${cards.map((c, i) => `
    <button class="dg-card" data-i="${i}">
      <div class="dg-card-inner">
        <div class="dg-card-face dg-card-front">${c.front}</div>
        <div class="dg-card-face dg-card-back">${c.back}</div>
      </div>
    </button>`).join("")}</div>
    <div class="dg-cards-hint">Klikni na kartičku pro otočení</div>`;
  injectDiagramStyles(`
    .dg-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
    .dg-card{perspective:900px;background:none;border:none;padding:0;cursor:pointer;height:120px;font-family:var(--font)}
    .dg-card-inner{position:relative;width:100%;height:100%;transition:transform .5s;transform-style:preserve-3d}
    .dg-card.flipped .dg-card-inner{transform:rotateY(180deg)}
    .dg-card-face{position:absolute;inset:0;backface-visibility:hidden;border-radius:12px;border:1px solid var(--border);
      display:flex;align-items:center;justify-content:center;text-align:center;padding:12px;background:var(--bg-2)}
    .dg-card-front{font-weight:800;font-size:14.5px;color:var(--text)}
    .dg-card-back{transform:rotateY(180deg);color:var(--text-dim);font-size:11.8px;line-height:1.4;background:var(--teal-soft)}
    .dg-cards-hint{margin-top:12px;font-size:11.5px;color:var(--text-faint);text-align:center}
  `);
  el.querySelectorAll(".dg-card").forEach(b => b.addEventListener("click", () => b.classList.toggle("flipped")));
}

/* =========================================================================
   GENERIC: Horizontal scale/bar comparison (levels or side-by-side metrics) */
function buildScaleDiagram(el, rows, opts = {}) {
  const gradient = opts.gradient || "linear-gradient(90deg,var(--green),var(--amber) 60%,var(--red))";
  el.innerHTML = `<div class="dg-scale">
    ${rows.map((r, i) => `
      <div class="dg-scale-row" data-i="${i}">
        <div class="dg-scale-label">${escapeHtml(r.label)}</div>
        <div class="dg-scale-bar"><span style="width:${r.pct}%;background:${r.color || gradient}"></span></div>
        ${r.value ? `<div class="dg-scale-value">${escapeHtml(r.value)}</div>` : ""}
      </div>`).join("")}
    <div class="dg-scale-detail" id="dgScaleDetail-${el.id}"><b>${escapeHtml(rows[0].label)}</b> — ${rows[0].desc}</div>
  </div>`;
  injectDiagramStyles(`
    .dg-scale{display:flex;flex-direction:column;gap:9px}
    .dg-scale-row{display:flex;align-items:center;gap:12px;cursor:pointer;padding:6px;border-radius:8px}
    .dg-scale-row:hover, .dg-scale-row.active{background:var(--bg-2)}
    .dg-scale-label{width:120px;flex:none;font-weight:700;font-size:12.5px}
    .dg-scale-bar{flex:1;height:13px;background:var(--bg-2);border-radius:7px;overflow:hidden}
    .dg-scale-bar span{display:block;height:100%}
    .dg-scale-value{width:64px;flex:none;text-align:right;font-family:var(--font-mono);font-size:11.5px;color:var(--text-faint)}
    .dg-scale-detail{margin-top:8px;padding:14px 16px;background:var(--bg-2);border-radius:10px;font-size:13px;line-height:1.6;color:var(--text-dim)}
    .dg-scale-detail b{color:var(--text)}
  `);
  const rowEls = el.querySelectorAll(".dg-scale-row");
  const detail = el.querySelector(`#dgScaleDetail-${el.id}`);
  rowEls.forEach((r, i) => r.addEventListener("click", () => {
    rowEls.forEach(x => x.classList.remove("active"));
    r.classList.add("active");
    detail.innerHTML = `<b>${escapeHtml(rows[i].label)}</b> — ${rows[i].desc}`;
  }));
  rowEls[0].classList.add("active");
}

/* =========================================================================
   GENERIC: Checklist with running counter (e.g. discharge readiness)       */
function buildChecklist(el, items, opts = {}) {
  el.innerHTML = `<div class="dg-checklist">
    ${items.map((it, i) => `
      <label class="dg-check-item" data-i="${i}">
        <input type="checkbox">
        <span class="dg-check-box">${emsIcon("compass", "icon-sm")}</span>
        <span>${escapeHtml(it)}</span>
      </label>`).join("")}
    <div class="dg-check-total"><span id="dgCheckCount-${el.id}">0</span> / ${items.length} kritérií splněno — <span id="dgCheckMsg-${el.id}"></span></div>
  </div>`;
  injectDiagramStyles(`
    .dg-checklist{display:flex;flex-direction:column;gap:8px}
    .dg-check-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:9px;border:1px solid var(--border);cursor:pointer;font-size:13px;color:var(--text-dim)}
    .dg-check-item:hover{background:var(--bg-2)}
    .dg-check-item input{position:absolute;opacity:0;width:0;height:0}
    .dg-check-box{width:20px;height:20px;border-radius:6px;border:2px solid var(--border-strong);flex:none;display:flex;align-items:center;justify-content:center;color:transparent}
    .dg-check-box .icon{width:13px;height:13px}
    .dg-check-item input:checked ~ .dg-check-box{background:var(--green);border-color:var(--green);color:#fff}
    .dg-check-item input:checked ~ span:last-child{color:var(--text)}
    .dg-check-total{margin-top:6px;padding:14px 16px;background:var(--bg-2);border-radius:10px;font-size:14px;font-weight:700;text-align:center}
    .dg-check-total span{font-family:var(--font-mono);color:var(--accent-strong)}
  `);
  const boxes = el.querySelectorAll(".dg-check-item input");
  const countEl = el.querySelector(`#dgCheckCount-${el.id}`);
  const msgEl = el.querySelector(`#dgCheckMsg-${el.id}`);
  function update() {
    const n = [...boxes].filter(b => b.checked).length;
    countEl.textContent = n;
    msgEl.textContent = n === items.length ? "pacient je připraven k propuštění" : "zbývá doplnit chybějící kritéria";
  }
  boxes.forEach(b => b.addEventListener("change", update));
  update();
}

/* =========================================================================
   GENERIC: Step-through binary decision tree (e.g. START triage)           */
function buildDecisionTree(el, tree, resultStyles) {
  function render(node, path) {
    if (node.result) {
      const style = resultStyles[node.result] || {};
      el.innerHTML = `<div class="dg-tree-result" style="--rc:${style.color || "var(--accent-strong)"}">
        <div class="dg-tree-result-label">${escapeHtml(node.label)}</div>
        <div class="dg-tree-result-detail">${node.detail}</div>
        <button class="dg-tree-reset">${emsIcon("compass", "icon-sm")} Začít znovu</button>
      </div>`;
      el.querySelector(".dg-tree-reset").addEventListener("click", () => render(tree, []));
      return;
    }
    el.innerHTML = `<div class="dg-tree">
      ${path.length ? `<div class="dg-tree-path">${path.map(p => `<span>${escapeHtml(p)}</span>`).join('<span class="sep">→</span>')}</div>` : ""}
      <div class="dg-tree-q">${escapeHtml(node.q)}</div>
      <div class="dg-tree-choices">
        <button class="dg-tree-btn yes">Ano</button>
        <button class="dg-tree-btn no">Ne</button>
      </div>
    </div>`;
    el.querySelector(".yes").addEventListener("click", () => render(node.yes, [...path, "Ano"]));
    el.querySelector(".no").addEventListener("click", () => render(node.no, [...path, "Ne"]));
  }
  injectDiagramStyles(`
    .dg-tree{text-align:center;padding:6px 0}
    .dg-tree-path{font-size:11px;color:var(--text-faint);margin-bottom:10px;display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
    .dg-tree-path .sep{color:var(--border-strong)}
    .dg-tree-q{font-size:15.5px;font-weight:700;margin-bottom:18px;line-height:1.5;max-width:520px;margin-inline:auto}
    .dg-tree-choices{display:flex;gap:14px;justify-content:center}
    .dg-tree-btn{padding:11px 28px;border-radius:10px;border:1px solid var(--border-strong);background:var(--bg-2);color:var(--text);font-weight:700;font-size:14px;cursor:pointer}
    .dg-tree-btn.yes:hover{background:var(--green-soft);border-color:var(--green)}
    .dg-tree-btn.no:hover{background:var(--red-soft);border-color:var(--red)}
    .dg-tree-result{text-align:center;padding:10px 0}
    .dg-tree-result-label{font-size:20px;font-weight:800;color:var(--rc);margin-bottom:10px}
    .dg-tree-result-detail{font-size:13.5px;color:var(--text-dim);line-height:1.6;max-width:480px;margin:0 auto 18px}
    .dg-tree-reset{display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:9px;border:1px solid var(--border-strong);background:var(--bg-2);color:var(--text);cursor:pointer;font-size:13px;font-weight:600}
  `);
  render(tree, []);
}
