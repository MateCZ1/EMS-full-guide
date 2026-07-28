# FIELD — XABCDE Guide

Interaktivní rozhodovací a provozní průvodce primárním vyšetřením dospělé
zraněné osoby. Na obrazovce zobrazuje vždy jen aktuální otázku nebo zásah a po
volbě odpovědi přejde do odpovídající větve. Klinický obsah byl v červenci 2026
revidován proti aktuálním doporučením uvedeným v
[`MEDICAL_REVIEW.md`](./MEDICAL_REVIEW.md).

## Funkce

- kompletní větvení X, A, B, C, D a E,
- texty v běžné češtině s vysvětlením nezbytných zkratek,
- kontrola účinku po zásadních intervencích,
- trvalé tlačítko pro zhoršení a okamžité nové XABCDE,
- automatická časová osa všech voleb, provedených úkonů a podaných léčiv,
- rychlé záznamy pro turniket, záchvat, LKW, EKG, chlazení a další události,
- automatický návrh vhodného léčiva a cesty podání v relevantní větvi,
- trvalé označení zapsaných úkonů a krátká potvrzovací animace po stisku,
- samostatný dospělý resuscitační režim s dvouminutovým cyklem, výboji a 4H/4T,
- kontexty pro těhotenství, vyšší věk/křehkost, antikoagulaci a popáleniny,
- závěrečný záznam se jménem, pohlavím, místem převzetí a úplnou chronologií,
- výstup připravený ke zkopírování,
- offline PWA režim a volitelný režim pro rukavice,
- návrat na předchozí krok a zahájení nového výjezdu odkudkoli,
- responzivní rozhraní pro telefon, tablet i počítač.

## Struktura projektu

- `app/guide-data.ts` — celý rozhodovací strom a texty intervencí,
- `app/medication-data.ts` — automaticky navrhovaná léčiva a cesty podání,
- `app/clinical-tools.tsx` — časová osa, kontexty, resuscitace a závěrečný záznam,
- `app/page.tsx` — interaktivní rozhraní, navigace a paměť výjezdu,
- `app/globals.css` — vzhled, responzivita a animace,
- `public/manifest.webmanifest` a `public/sw.js` — instalace a offline provoz,
- `MEDICAL_REVIEW.md` — medicínská revize a odůvodnění hlavních korekcí,
- `tests/` — kontrola grafu, funkcí a produkčního renderu.

## Lokální spuštění

Projekt vyžaduje Node.js 22.13 nebo novější.

```bash
npm install
npm run dev
```

Produkční kontrola:

```bash
npm run lint
npm test
```

Projekt je připraven jako zdrojový repozitář. Složky `node_modules`, build
výstupy a lokální proměnné prostředí jsou v `.gitignore` a do GitHubu nepatří.

## Bezpečnostní poznámka

Jde o edukační prototyp. Před ostrým použitím musí medicínský garant ověřit
obsah, kompetence, léčiva, dávkování a cílové hodnoty podle platného interního
protokolu. Aplikace dávky úmyslně neuvádí, nenahrazuje klinický úsudek ani
schválené lokální postupy.
