# EMS Operační Manuál — interaktivní příručka

Interaktivní vzdělávací portál pro FiveM roleplay EMS, postavený z interní příručky *EMS Operační Manuál v2.0*.
Statická stránka (HTML/CSS/vanilla JS, bez buildu a bez externích závislostí) připravená pro GitHub Pages.

## Co stránka obsahuje

- **17 kapitol / 86 podkapitol** rozdělených do Části I (přednemocniční péče) a Části II (nemocniční péče)
- **Inteligentní vyhledávání** — diakritiku ignorující, s tolerancí překlepů, hledá napříč nadpisy, zkratkami,
  odbornými pojmy i plným textem, s zvýrazněnými úryvky
- **Interaktivní diagramy**: žebříček úrovní záchranářů, pyramida priorit, triage kódy, algoritmus XABCDE,
  algoritmus MARCH, kalkulačka GCS, pravidlo devítek pro popáleniny (klikací tělo), úrovně traumacenter,
  časová osa zlaté hodiny
- Moderní responzivní design se světlým i tmavým režimem (přepínatelný, ukládá se do `localStorage`)

## Struktura projektu

```
index.html              — kostra stránky (SPA shell)
assets/css/style.css     — design systém (proměnné, layout, komponenty)
assets/js/manifest.js    — seznam kapitol pro navigaci
assets/js/icons.js       — sada inline SVG ikon
assets/js/render.js      — vykreslování obsahu kapitol z JSON
assets/js/diagrams.js    — interaktivní diagramové komponenty
assets/js/search.js      — vyhledávací index a scoring
assets/js/app.js         — routing (hash), načítání dat, UI logika
data/ch*.json            — obsah jednotlivých kapitol
```

## Spuštění lokálně

Stránka nepoužívá žádný build krok — stačí ji servírovat jako statické soubory (kvůli `fetch()` na JSON
soubory nefunguje otevření přes `file://`, je potřeba jednoduchý HTTP server):

```bash
python3 -m http.server 8811
```

a pak otevřít `http://localhost:8811`.

## Nahrání na GitHub Pages

1. Vytvořte nový repozitář na GitHub (např. `ems-manual`).
2. Nahrajte obsah této složky do repozitáře (větev `main`).
3. V nastavení repozitáře → **Pages** nastavte zdroj na větev `main`, kořenovou složku `/ (root)`.
4. Stránka bude dostupná na `https://<uzivatel>.github.io/<repozitar>/`.

## Obsah a kontext

Text vychází z fiktivní herní příručky pro FiveM roleplay server — jde o vzdělávací/herní obsah pro simulaci
role záchranáře, nikoliv o reálný medicínský návod.
