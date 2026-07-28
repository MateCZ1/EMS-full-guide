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
  const [pageSource, toolsSource] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/clinical-tools.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(pageSource, /title: "Výjezd zahájen"/);
  assert.match(pageSource, /"Krok",\s*node\.title,\s*choice\.label/s);
  assert.match(pageSource, /Podáno — zapsat/);
  assert.match(pageSource, /is-confirmed/);
  assert.match(pageSource, /Vygenerovat záznam o zraněné osobě/);
  assert.match(toolsSource, /\*\*PRŮBĚH VYŠETŘENÍ A OŠETŘENÍ\*\*/);
  assert.match(toolsSource, /Zkopírovat záznam/);
  assert.match(toolsSource, /formatClock\(record\.at\)/);
  assert.match(toolsSource, /Zapsáno ✓/);
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
  assert.match(workflow, /npm run build:pages/);
  assert.match(workflow, /path: \.\/out/);
});
