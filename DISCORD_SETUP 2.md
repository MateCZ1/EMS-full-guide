# Podrobný návod: propojení FIELD s Discordem

Tento návod je napsaný pro macOS a nepočítá s předchozími zkušenostmi s
programováním.

Po dokončení bude propojení fungovat takto:

1. V aplikaci FIELD dokončíte výjezd a vytvoříte záznam.
2. Stisknete `Odeslat na Discord`.
3. Záznam se objeví ve vybraném Discord kanálu.

Mezi veřejnou stránkou a Discordem bude Cloudflare Worker. Je to malý
serverový prostředník, který ukryje tajnou adresu Discord webhooku. Do GitHubu
se webhook nevkládá.

## Co budete potřebovat

Než začnete, připravte si:

- Discord účet a oprávnění spravovat daný Discord server,
- bezplatný Cloudflare účet,
- GitHub repozitář s projektem,
- staženou a rozbalenou složku projektu FIELD,
- přibližně 15 až 30 minut.

Pro tento projekt jsou připravené tyto adresy:

- GitHub repozitář:
  `https://github.com/MateCZ1/EMS-full-guide`
- výsledná GitHub Pages stránka:
  `https://matecz1.github.io/EMS-full-guide/`

## Přehled celého nastavení

Budete postupně nastavovat tři služby:

| Služba | Co se v ní nastaví |
| --- | --- |
| Discord | Kanál a webhook, do kterého se budou posílat záznamy |
| Cloudflare | Worker, který bezpečně uchová webhook |
| GitHub | Veřejná adresa Workeru, kterou použije FIELD |

Je důležité nezaměnit dvě různé adresy:

- **Discord webhook URL** je tajná a uloží se pouze do Cloudflare.
- **Cloudflare Worker URL** tajná není a vloží se do GitHubu.

---

# Část A — vytvoření Discord webhooku

## 1. Vytvořte kanál pro záznamy

1. Otevřete Discord.
2. V levém sloupci vyberte server, na kterém chcete záznamy ukládat.
3. U kategorie textových kanálů klikněte na `+`.
4. Vyberte textový kanál.
5. Jako název můžete použít například:

   ```text
   ems-zaznamy
   ```

6. Pokud mají záznamy vidět jen vybrané osoby, zapněte soukromý kanál a
   nastavte odpovídající role.
7. Potvrďte vytvoření kanálu.

## 2. Vytvořte webhook

1. Klikněte na název Discord serveru vlevo nahoře.
2. Otevřete `Nastavení serveru`.
3. V levém menu vyberte `Integrace`.
4. Otevřete `Webhooky`.
5. Klikněte na `Nový webhook` nebo `Vytvořit webhook`.
6. Nastavte například:

   - název: `FIELD záznamy`,
   - kanál: `#ems-zaznamy`.

7. Klikněte na `Kopírovat URL webhooku`.

Zkopírovaná adresa vypadá přibližně takto:

```text
https://discord.com/api/webhooks/1234567890/dlouhy_tajny_retezec
```

Tuto adresu nikomu neposílejte. Nevkládejte ji do GitHubu, zdrojového kódu,
souboru `wrangler.jsonc` ani do proměnné `DISCORD_BRIDGE_URL`.

K adrese webhooku nepřidávejte `/github`. Tento projekt používá běžný Discord
webhook, nikoli GitHub webhook integraci.

### Jak poznáte, že je tato část hotová

- Máte vytvořený Discord kanál.
- V nastavení Discordu vidíte webhook `FIELD záznamy`.
- URL webhooku máte dočasně zkopírovanou nebo bezpečně uloženou.

---

# Část B — příprava Macu a Terminálu

## 3. Ověřte instalaci Node.js

1. Na Macu stiskněte `Command + mezerník`.
2. Napište `Terminál`.
3. Otevřete aplikaci Terminál.
4. Vložte následující příkaz a stiskněte Enter:

   ```bash
   node --version
   ```

Správný výsledek vypadá například takto:

```text
v22.19.0
```

Projekt vyžaduje Node.js 22 nebo novější.

Pokud Terminál napíše `command not found: node` nebo zobrazí verzi nižší než
22:

1. Otevřete `https://nodejs.org/`.
2. Stáhněte doporučenou LTS verzi pro macOS.
3. Otevřete stažený instalační soubor `.pkg`.
4. Dokončete instalaci.
5. Úplně zavřete Terminál a znovu jej otevřete.
6. Zopakujte:

   ```bash
   node --version
   ```

Můžete také ověřit správce balíčků npm:

```bash
npm --version
```

## 4. Otevřete složku projektu v Terminálu

Nejdříve ZIP projektu rozbalte dvojklikem ve Finderu. Potom:

1. Otevřete nový Terminál.
2. Napište `cd` a za něj jednu mezeru. Zatím nemačkejte Enter:

   ```text
   cd
   ```

3. Z Finderu přetáhněte rozbalenou složku projektu přímo do okna Terminálu.
   Terminál za `cd` automaticky doplní celou cestu.
4. Stiskněte Enter.
5. Spusťte:

   ```bash
   ls
   ```

Ve výpisu musí být mimo jiné:

```text
package.json
discord-bridge
app
```

Pokud `package.json` nevidíte, jste v nesprávné složce. Zopakujte tento krok a
přetáhněte složku, která přímo obsahuje soubor `package.json`.

## 5. Nainstalujte součásti projektu

Ve stejném okně Terminálu spusťte:

```bash
npm install
```

Instalace může trvat několik minut. Během instalace Terminál nezavírejte.
Varování začínající slovem `warning` většinou nevadí. Důležité je, aby příkaz
neskončil červenou chybou.

### Jak poznáte, že je tato část hotová

Spusťte:

```bash
npm run
```

Ve výpisu byste měli najít příkazy:

```text
discord:deploy
discord:secret:webhook
```

---

# Část C — nasazení Cloudflare Workeru

## 6. Vytvořte nebo otevřete Cloudflare účet

1. Otevřete `https://dash.cloudflare.com/`.
2. Přihlaste se nebo vytvořte bezplatný účet.
3. Pokud Cloudflare vyžaduje ověření e-mailu, dokončete jej.
4. Pro tento postup není potřeba kupovat doménu ani placený tarif.

Cloudflare stránku můžete poté ponechat otevřenou.

## 7. Propojte Terminál s Cloudflare

V Terminálu, který je stále otevřený ve složce projektu, spusťte:

```bash
npx wrangler login
```

Co se má stát:

1. Otevře se webový prohlížeč.
2. Přihlaste se ke správnému Cloudflare účtu.
3. Potvrďte oprávnění tlačítkem `Allow`, `Authorize` nebo podobným potvrzením.
4. Vraťte se do Terminálu.

Terminál by měl potvrdit úspěšné přihlášení.

Pokud se prohlížeč neotevře, Terminál obvykle zobrazí adresu. Zkopírujte ji do
prohlížeče ručně.

## 8. Nasaďte Worker

Ve stejném Terminálu spusťte:

```bash
npm run discord:deploy
```

Při prvním nasazení může Cloudflare požádat o vytvoření `workers.dev`
subdomény. Zvolte libovolný dostupný název a pokračujte.

Na konci se zobrazí adresa podobná této:

```text
https://field-discord-bridge.vase-jmeno.workers.dev
```

Toto je **Cloudflare Worker URL**. Celou adresu si zkopírujte a uložte. Budete
ji později vkládat do GitHubu.

Do adresy nepřidávejte `/reports`.

Pokud Terminál vypíše více adres, použijte veřejnou adresu končící
`.workers.dev`.

## 9. Uložte Discord webhook do Cloudflare

Nyní spusťte:

```bash
npm run discord:secret:webhook
```

Terminál zobrazí výzvu podobnou:

```text
Enter a secret value:
```

Postup:

1. Vložte URL Discord webhooku z části A pomocí `Command + V`.
2. Při vkládání nemusí být text vidět. Je to normální ochrana tajné hodnoty.
3. Stiskněte Enter.
4. Počkejte na potvrzení, že secret `DISCORD_WEBHOOK_URL` byl uložený.

Cloudflare při uložení secretu automaticky vytvoří a nasadí novou verzi
Workeru. Discord webhook tak není uložený v projektu ani v GitHubu.

## 10. Otestujte Worker samostatně

1. Otevřete novou kartu v prohlížeči.
2. Vložte Cloudflare Worker URL z kroku 8.
3. Otevřete pouze hlavní adresu bez `/reports`.

Správný výsledek:

```json
{"ok":true,"service":"FIELD Discord bridge","configured":true}
```

Význam výsledků:

- `configured:true` — Worker je připravený.
- `configured:false` — webhook není uložený; zopakujte krok 9.
- stránka se neotevře — ověřte Worker URL a zopakujte krok 8.
- `Nenalezeno` — pravděpodobně jste za URL přidali `/reports`; odstraňte jej.

### Jak poznáte, že je tato část hotová

- Znáte svoji veřejnou Cloudflare Worker URL.
- Po otevření Worker URL vidíte `configured:true`.
- Tajný Discord webhook je uložený v Cloudflare.

---

# Část D — propojení Workeru s GitHub Pages

## 11. Otevřete nastavení GitHub repozitáře

1. Přihlaste se na GitHub.
2. Otevřete:
   `https://github.com/MateCZ1/EMS-full-guide`
3. V horním menu repozitáře klikněte na `Settings`.

Pokud kartu `Settings` nevidíte, pravděpodobně nejste přihlášený jako vlastník
repozitáře nebo nemáte potřebné oprávnění.

## 12. Vytvořte GitHub proměnnou

V nastavení repozitáře:

1. V levém menu otevřete `Secrets and variables`.
2. Klikněte na `Actions`.
3. V hlavní části otevřete kartu `Variables`, nikoli kartu `Secrets`.
4. Klikněte na `New repository variable`.
5. Do pole `Name` vložte přesně:

   ```text
   DISCORD_BRIDGE_URL
   ```

6. Do pole `Value` vložte Cloudflare Worker URL z kroku 8, například:

   ```text
   https://field-discord-bridge.vase-jmeno.workers.dev
   ```

7. Zkontrolujte, že:

   - hodnota začíná `https://`,
   - neobsahuje uvozovky,
   - nekončí `/reports`,
   - není to Discord webhook URL.

8. Klikněte na `Add variable` nebo `Save variable`.

Tato proměnná není tajná. Je v pořádku, že obsahuje veřejnou adresu Workeru.

## 13. Zkontrolujte nastavení GitHub Pages

1. Stále v `Settings` otevřete v levém menu `Pages`.
2. V části `Build and deployment` najděte položku `Source`.
3. Vyberte `GitHub Actions`.

Pokud už je `GitHub Actions` vybrané, nic neměňte.

## 14. Spusťte nové nasazení stránky

Proměnná se projeví až při novém sestavení webu:

1. Vraťte se na hlavní stránku repozitáře.
2. Nahoře otevřete kartu `Actions`.
3. V levém seznamu vyberte `Deploy GitHub Pages`.
4. Klikněte na `Run workflow`.
5. Ponechte větev `main`.
6. Potvrďte zeleným tlačítkem `Run workflow`.

Nový běh se může objevit až po několika sekundách. Klikněte na něj a počkejte,
až kroky `build` a `deploy` skončí zelenou značkou.

Pokud jste právě nahráli novou verzi projektu do větve `main`, workflow se
obvykle spustí automaticky a ruční spuštění není nutné.

Po úspěšném nasazení otevřete:

```text
https://matecz1.github.io/EMS-full-guide/
```

### Jak poznáte, že je tato část hotová

- GitHub proměnná `DISCORD_BRIDGE_URL` existuje na kartě `Variables`.
- Poslední běh `Deploy GitHub Pages` je zelený.
- FIELD stránka se otevře na GitHub Pages.

---

# Část E — závěrečná zkouška

## 15. Odešlete zkušební záznam

1. Otevřete FIELD na GitHub Pages.
2. Klikněte na `Začít nový výjezd`.
3. Projděte postup až do dokončení XABCDE.
4. Klikněte na `Vygenerovat záznam o zraněné osobě`.
5. Vyplňte:

   - jméno osoby, pokud jej znáte,
   - jméno ošetřujícího EMS,
   - pohlaví,
   - oblast převzetí.

6. Klikněte na `Vygenerovat záznam`.
7. Zkontrolujte vytvořený text.
8. Klikněte na `Odeslat na Discord`.

Tlačítko postupně zobrazí:

```text
Odesílám…
Odesláno ✓
```

V Discord kanálu by se měla objevit:

- zpráva se základními údaji,
- jméno ošetřujícího EMS,
- průběh ošetření,
- přiložený textový soubor s celým záznamem.

Pokud se záznam objevil, propojení je hotové.

---

# Aktualizace už dříve nasazeného Workeru

Pokud jste Cloudflare Worker vytvářeli podle starší verze návodu, po stažení
nového projektu stačí v jeho složce spustit:

```bash
npm install
npx wrangler login
npm run discord:deploy
```

Uložený Discord webhook se běžným nasazením nesmaže. Pokud po nasazení Worker
ukazuje `configured:false`, znovu spusťte:

```bash
npm run discord:secret:webhook
```

Poté na GitHubu znovu spusťte workflow `Deploy GitHub Pages`.

---

# Nejčastější chyby

## `command not found: node`

Node.js není nainstalovaný. Vraťte se ke kroku 3, nainstalujte LTS verzi a
znovu otevřete Terminál.

## `npm error ... package.json`

Terminál je otevřený v nesprávné složce. Spusťte:

```bash
ls
```

Pokud nevidíte `package.json`, vraťte se ke kroku 4.

## Cloudflare přihlášení se nezdařilo

Zopakujte:

```bash
npx wrangler login
```

Ověřte, že v prohlížeči potvrzujete stejný Cloudflare účet, na kterém chcete
Worker provozovat.

## Worker zobrazuje `configured:false`

Spusťte:

```bash
npm run discord:secret:webhook
```

Vložte celou Discord webhook URL a stiskněte Enter.

## FIELD píše, že Discord není propojený

Nejčastěji chybí GitHub proměnná nebo po jejím vytvoření neproběhlo nové
nasazení.

Zkontrolujte:

1. `Settings` → `Secrets and variables` → `Actions` → `Variables`.
2. Název je přesně `DISCORD_BRIDGE_URL`.
3. Hodnota obsahuje Cloudflare Worker URL.
4. Workflow `Deploy GitHub Pages` bylo po uložení proměnné spuštěné znovu.

## Chyba „Odesílání z této adresy webu není povolené“

Worker kontroluje, ze kterého webu požadavek přichází. Projekt už povoluje:

```text
https://matecz1.github.io
https://field-ems-guide.matasekov.chatgpt.site
```

Pokud používáte jinou doménu:

1. Otevřete soubor `discord-bridge/wrangler.jsonc`.
2. Najděte `ALLOWED_ORIGINS`.
3. Přidejte začátek své adresy bez cesty.
4. Více adres oddělte čárkou.
5. Znovu spusťte:

   ```bash
   npm run discord:deploy
   ```

Pro GitHub Pages se uvádí jen:

```text
https://uzivatel.github.io
```

Název repozitáře `/EMS-full-guide` se do `ALLOWED_ORIGINS` nepřidává.

## Po odeslání se zobrazí chyba 401

Na Cloudflare je ještě stará verze Workeru. V projektu spusťte:

```bash
npm run discord:deploy
```

Nová verze žádný přístupový kód nevyžaduje.

## Discord zprávu nepřijal

Webhook mohl být smazán, změněn nebo vložen neúplně:

1. V Discordu vytvořte nový webhook nebo znovu zkopírujte jeho URL.
2. Spusťte:

   ```bash
   npm run discord:secret:webhook
   ```

3. Vložte novou URL.
4. Otevřete Worker URL a ověřte `configured:true`.
5. Zopakujte zkušební odeslání.

## Workflow na GitHubu skončilo červeně

1. Otevřete `Actions`.
2. Klikněte na neúspěšný běh `Deploy GitHub Pages`.
3. Otevřete červený krok a přečtěte poslední chybové řádky.
4. Ověřte, že byl do repozitáře nahrán celý projekt včetně složky `.github`.

Na macOS zobrazíte skryté soubory ve Finderu klávesami:

```text
Command + Shift + .
```

Po opravě znovu spusťte `Run workflow`.

---

# Co si bezpečně uložit

Uložte si:

- Cloudflare Worker URL,
- odkaz na GitHub repozitář,
- informaci, ve kterém Discord kanálu je webhook nastavený.

Tajně uchovávejte:

- Discord webhook URL,
- přístup k Discord, Cloudflare a GitHub účtu.

Discord webhook nikdy nevkládejte do:

- GitHub proměnné `DISCORD_BRIDGE_URL`,
- souboru `discord-bridge/wrangler.jsonc`,
- veřejného chatu nebo Discord zprávy,
- zdrojového kódu stránky.

Pokud máte podezření, že webhook někdo získal, v Discordu jej smažte, vytvořte
nový a spusťte `npm run discord:secret:webhook`.

---

# Rychlá závěrečná kontrola

Než začnete propojení používat, ověřte si:

- [ ] Discord kanál a webhook existují.
- [ ] `node --version` ukazuje verzi 22 nebo novější.
- [ ] `npm install` doběhl bez chyby.
- [ ] `npx wrangler login` přihlásil správný Cloudflare účet.
- [ ] `npm run discord:deploy` vypsal Worker URL.
- [ ] `npm run discord:secret:webhook` uložil webhook.
- [ ] Worker URL ukazuje `configured:true`.
- [ ] GitHub proměnná se jmenuje přesně `DISCORD_BRIDGE_URL`.
- [ ] GitHub Pages používá jako zdroj `GitHub Actions`.
- [ ] Poslední workflow `Deploy GitHub Pages` je zelené.
- [ ] Zkušební záznam dorazil do Discord kanálu.

## Oficiální dokumentace

- [Discord — vytvoření a používání webhooků](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
- [Cloudflare — příkazy Wrangleru](https://developers.cloudflare.com/workers/wrangler/commands/workers/)
- [Cloudflare — bezpečné ukládání secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [GitHub — vytvoření repository variable](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-variables)
