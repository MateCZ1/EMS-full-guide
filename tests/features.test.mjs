import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("medication links point to existing guide nodes", async () => {
  const [guideSource, medicationSource] = await Promise.all([
    readFile(new URL("../app/guide-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/medication-data.ts", import.meta.url), "utf8"),
  ]);

  const nodes = new Set(
    [...guideSource.matchAll(/^  ([a-z][a-z0-9_]*): \{$/gm)].map(
      (match) => match[1],
    ),
  );
  const targets = [
    ...medicationSource.matchAll(/relatedNode: "([^"]+)"/g),
  ].map((match) => match[1]);

  assert.ok(targets.length >= 10);
  assert.deepEqual(
    targets.filter((target) => !nodes.has(target)),
    [],
  );
  assert.equal(
    [...medicationSource.matchAll(/^    route:/gm)].length,
    targets.length,
  );
});

test("a call records choices and produces a copyable injury report", async () => {
  const [pageSource, toolsSource, assessmentSource, guideSource] =
    await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/clinical-tools.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/patient-assessment.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/guide-data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(pageSource, /title: "Výjezd zahájen"/);
  assert.match(pageSource, /"Krok",\s*node\.title,\s*choice\.label/s);
  assert.match(pageSource, /Podáno — zapsat/);
  assert.match(pageSource, /is-confirmed/);
  assert.match(pageSource, /Vygenerovat záznam o zraněné osobě/);
  assert.match(toolsSource, /\*\*PRŮBĚH VYŠETŘENÍ A OŠETŘENÍ\*\*/);
  assert.match(toolsSource, /Zkopírovat záznam/);
  assert.match(toolsSource, /Jméno ošetřujícího/);
  assert.match(toolsSource, /<legend>Department<\/legend>/);
  assert.match(toolsSource, /"\*\*OŠETŘUJÍCÍ\*\*"/);
  assert.match(toolsSource, /`\*\*Department:\*\*/);
  assert.match(toolsSource, /"\*\*PACIENT\*\*"/);
  assert.match(toolsSource, /\["EMS", "Fire Department"\]/);
  assert.match(toolsSource, /Odeslat záznam do archivu/);
  assert.match(toolsSource, /Uloženo v archivu ✓/);
  assert.match(toolsSource, /formatClock\(record\.at\)/);
  assert.match(toolsSource, /Zapsáno ✓/);
  assert.match(toolsSource, /AUTOMATICKÉ ZHODNOCENÍ/);
  assert.match(toolsSource, /\*\*KONEČNÝ STAV OSOBY\*\*/);
  assert.match(assessmentSource, /buildPatientAssessment/);
  assert.match(assessmentSource, /sourceNodeId/);
  assert.match(assessmentSource, /Osoba zemřela\./);
  assert.match(pageSource, /Resuscitace ukončena/);
  assert.match(pageSource, /setCurrentId\("deceased"\)/);
  assert.match(pageSource, /choiceTone: choice\.tone \?\? "default"/);
  assert.match(toolsSource, /dismissible=\{!startedAt\}/);
  assert.match(
    toolsSource,
    /Resuscitační režim zůstane otevřený/,
  );
  assert.match(toolsSource, /"\*\*ZHORŠENÍ STAVU\*\*"/);
  assert.match(toolsSource, /record\.title\.startsWith\("Zhoršení stavu"\)/);
  assert.match(toolsSource, /record\.choiceTone === "danger"/);
  assert.match(toolsSource, /record\.choiceTone === "warning"/);
  assert.match(toolsSource, /ZÁVAŽNÉ ROZHODNUTÍ/);
  assert.match(toolsSource, /Potvrdit — osoba zemřela/);
  assert.match(guideSource, /^  deceased: \{$/m);
  assert.match(pageSource, /<NewCallConfirmationPanel/);
  assert.match(pageSource, /className="complete-new-call-button"/);
  assert.match(pageSource, /requestNewCallFromReport/);
  assert.match(pageSource, /onRequestNewCall=\{requestNewCallFromReport\}/);
  assert.match(toolsSource, /className="report-new-call-button"/);
  assert.match(toolsSource, /Začít nový záznam/);
  assert.doesNotMatch(pageSource, /window\.confirm/);
  assert.ok(
    toolsSource.indexOf("Jméno ošetřujícího") <
      toolsSource.indexOf("Jméno pacienta — volitelné"),
  );
  assert.ok(
    toolsSource.indexOf('"**OŠETŘUJÍCÍ**"') <
      toolsSource.indexOf('"**PACIENT**"'),
  );
  assert.ok(
    toolsSource.indexOf('className="cpr-death-button"') <
      toolsSource.indexOf('className="rosc-button"'),
  );
  assert.doesNotMatch(
    toolsSource,
    /Na Discord|Discord most|Odeslání na Discord|webhook|DISCORD_SETUP/,
  );
});

test("offline manifest and service worker contain the app shell", async () => {
  const [manifestText, serviceWorker] = await Promise.all([
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
  ]);
  const manifest = JSON.parse(manifestText);

  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, ".");
  assert.equal(manifest.scope, ".");
  assert.match(serviceWorker, /manifest\.webmanifest/);
  assert.match(serviceWorker, /self\.registration\.scope/);
  assert.match(serviceWorker, /scopedPath\("\/"\)/);
  assert.match(serviceWorker, /caches\.open/);
});

test("short clinical branches have clear outcomes without dead ends", async () => {
  const [guideSource, assessmentSource, medicationSource] = await Promise.all([
    readFile(new URL("../app/guide-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/patient-assessment.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/medication-data.ts", import.meta.url), "utf8"),
  ]);

  assert.match(guideSource, /label: "Podezření na vážné poranění pánve"/);
  assert.match(
    guideSource,
    /label: "Oběh selhává, příčina není jasná"[\s\S]*?target: "c_unstable"/,
  );
  assert.match(
    guideSource,
    /label: "Pokračovat v péči — kritický stav"[\s\S]*?target: "e_critical"/,
  );
  assert.match(
    guideSource,
    /label: "Pokračovat v péči — stabilní stav"[\s\S]*?target: "e_stable"/,
  );
  assert.doesNotMatch(
    guideSource,
    /label: "Schopnost rozhodnout je pochybná"[\s\S]*?target: "e_refusal"/,
  );
  assert.match(assessmentSource, /"a_unconscious>b_start"/);
  assert.match(assessmentSource, /"a_unconscious>a_escalate"/);
  assert.match(assessmentSource, /"c_control>d_start"/);
  assert.match(assessmentSource, /"c_control>c_unstable"/);
  assert.match(assessmentSource, /"e_refusal>e_critical"/);
  assert.match(assessmentSource, /"e_refusal>e_stable"/);
  assert.match(medicationSource, /více než tři hodiny/);
  assert.match(medicationSource, /glukóza ústy \(PO\)/);
  assert.match(
    medicationSource,
    /EKG natočte co nejdříve, ale vhodné podání kvůli němu neodkládejte/,
  );
});

test("whole-body check can skip regional questions or open a finding", async () => {
  const guideSource = await readFile(
    new URL("../app/guide-data.ts", import.meta.url),
    "utf8",
  );

  assert.match(
    guideSource,
    /label: "Ano — je přítomný nález"[\s\S]*?target: "e_finding"/,
  );
  assert.match(
    guideSource,
    /label: "Ne — bez významného nálezu"[\s\S]*?target: "e_finish"/,
  );
  assert.match(guideSource, /^  e_finding: \{$/m);
  assert.match(
    guideSource,
    /label: "Popálení nebo chemická látka"[\s\S]*?target: "e_burn"/,
  );
  assert.match(
    guideSource,
    /label: "Více míst nebo si nejsem jistý"[\s\S]*?target: "e_head"/,
  );
});

test("GitHub Pages builds and deploys the static export from Actions", async () => {
  const [nextConfig, workflow] = await Promise.all([
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../.github/workflows/deploy-pages.yml", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(nextConfig, /output: "export"/);
  assert.match(nextConfig, /basePath: githubPagesBasePath/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(workflow, /NEXT_PUBLIC_SITE_URL/);
  assert.match(workflow, /vars\.DISCORD_BRIDGE_URL/);
  assert.match(workflow, /npm run build:pages/);
  assert.match(workflow, /path: \.\/out/);
});
