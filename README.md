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
- automatické konečné zhodnocení stavu složené z kliknutí v průvodci bez
  ručního zadávání životních funkcí,
- rychlé záznamy pro turniket, záchvat, LKW, EKG, chlazení a další události,
- automatický návrh vhodného léčiva a cesty podání v relevantní větvi,
- trvalé označení zapsaných úkonů a krátká potvrzovací animace po stisku,
- samostatný dospělý resuscitační režim s dvouminutovým cyklem, výboji a 4H/4T,
- bezpečně potvrzované ukončení resuscitace nebo záznam úmrtí s přesným časem,
- kontexty pro těhotenství, vyšší věk/křehkost, antikoagulaci a popáleniny,
- závěrečný záznam se jménem, pohlavím, místem převzetí a úplnou chronologií,
- povinné uvedení jména a složky ošetřujícího (EMS nebo Fire Department) a
  odeslání přes skrytý serverový most na Discord,
- výstup připravený ke zkopírování,
- offline PWA režim a volitelný režim pro rukavice,
- návrat na předchozí krok a zahájení nového výjezdu odkudkoli,
- responzivní rozhraní pro telefon, tablet i počítač.

## Struktura projektu

- `app/guide-data.ts` — celý rozhodovací strom a texty intervencí,
- `app/medication-data.ts` — automaticky navrhovaná léčiva a cesty podání,
- `app/patient-assessment.ts` — automatické složení konečného stavu z voleb,
- `app/clinical-tools.tsx` — časová osa, kontexty, resuscitace a závěrečný záznam,
- `app/page.tsx` — interaktivní rozhraní, navigace a paměť výjezdu,
- `app/globals.css` — vzhled, responzivita a animace,
- `public/manifest.webmanifest` a `public/sw.js` — instalace a offline provoz,
- `MEDICAL_REVIEW.md` — medicínská revize a odůvodnění hlavních korekcí,
- `DISCORD_SETUP.md` — bezpečné propojení Discord webhooku krok za krokem,
- `discord-bridge/` — serverový most, který chrání tajnou URL webhooku,
- `tests/` — kontrola grafu, funkcí a produkčního renderu.

## Nasazení na GitHub Pages

Projekt obsahuje automatické nasazení přes GitHub Actions a funguje jak na
adrese uživatelského webu (`uzivatel.github.io`), tak v podsložce běžného
repozitáře (`uzivatel.github.io/nazev-repozitare/`).

1. Nahrajte do repozitáře celý obsah projektu včetně skryté složky `.github`.
2. Na GitHubu otevřete `Settings` → `Pages`.
3. U `Build and deployment` nastavte `Source` na `GitHub Actions`.
4. Odešlete změny do větve `main`, případně workflow spusťte ručně na kartě
   `Actions` → `Deploy GitHub Pages`.
5. Po dokončení se adresa webu zobrazí v přehledu nasazení a v nastavení Pages.

Název repozitáře není potřeba zapisovat do zdrojového kódu. Workflow jej zjistí
automaticky a při sestavení nastaví správnou cestu k JavaScriptu, manifestu,
ikoně i offline režimu.

Pro odesílání záznamů nastavte v GitHub Actions veřejnou proměnnou
`DISCORD_BRIDGE_URL`. Discord webhook patří výhradně do Cloudflare secrets.
Kompletní postup je v
[`DISCORD_SETUP.md`](./DISCORD_SETUP.md).

Statický výstup lze vytvořit také lokálně:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/nazev-repozitare npm run build:pages
```

Hotové soubory budou ve složce `out`. Pro repozitář pojmenovaný
`uzivatel.github.io` ponechte `NEXT_PUBLIC_BASE_PATH` prázdnou.

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
