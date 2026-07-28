# Medicínská revize rozhodovacího stromu XABCDE

Revize provedena: 28. července 2026

## Rozsah a cílová skupina

Rozhodovací strom v `app/guide-data.ts` vychází z dodaného podkladu
`XABCDE_web_podklad.md`. Podklad byl porovnán s aktuálními autoritativními
doporučeními pro první pomoc, resuscitaci a přednemocniční traumatologii.

Verze 3.0 je určena pro dospělou zraněnou osobu. Pediatrické a
novorozenecké algoritmy nejsou součástí produktu.

Výsledkem je klinicky korigovaný edukační prototyp, nikoli schválený postup
konkrétní zdravotnické záchranné služby. Před ostrým nasazením musí obsah
validovat medicínský garant a doplnit lokální kompetence, vybavení, cílové
hodnoty, dávky, pediatrické varianty a právní postupy.

## Nejdůležitější korekce proti podkladu

### X — masivní krvácení

- Turniket je určen pro život ohrožující krvácení z končetiny. Umísťuje se
  proximálně od rány a ne přes kloub; vysoké umístění je vyhrazeno situaci, kdy
  nelze ránu v kritickém čase přesně lokalizovat.
- Zlomenina femuru ani rána pod kolenem samy o sobě nejsou automatickou
  indikací k turniketu.
- Neúčinná tamponáda se musí znovu založit od zdroje. Nestačí jen vrstvit další
  materiál na neúčinně vyplněnou ránu.
- U skrytého krvácení byly odstraněny univerzální cílové tlaky a automatické
  objemy krystaloidů. Léčba se řídí příčinou, dominantním TBI, dostupností krve
  a místním protokolem.

### A — dýchací cesty

- GCS ≤ 8 je významný varovný nález a důvod k časnému zapojení poskytovatele
  pokročilého airway managementu. Není to izolovaný automatický příkaz k
  intubaci.
- Při podezření na poranění páteře se začíná předsunutím dolní čelisti, ale
  průchodnost dýchacích cest a oxygenace mají při selhání přednost.
- Odstraněn byl slepý výtěr prstem. Pokročilé pomůcky a invazivní airway jsou
  omezeny kompetencemi a lokálním protokolem.

### B — dýchání

- Nízká frekvence ani SpO₂ nejsou samostatnou diagnózou; nejdříve se ověřuje
  měření, kvalita ventilace a příčina.
- U opioidní toxicity je cílem naloxonu obnovení dostatečné ventilace, nikoli
  nutně úplné probuzení.
- Tenzní pneumotorax je klinická diagnóza. Dekompresi provádí pouze vyškolený
  poskytovatel při závažné respirační nebo oběhové nestabilitě podle místního
  protokolu.
- U otevřené rány hrudníku ji strom primárně neuzavírá improvizovaným
  okluzivním krytím; vyškolený tým může použít specializované ventilované nebo
  neokluzivní krytí a musí sledovat jeho průchodnost.

### C — krevní oběh

- Přítomnost radiálního pulzu se nepřevádí na pevnou hodnotu systolického tlaku.
  Rozhoduje celková perfuze, opakovaně měřený tlak a trend.
- Šok je rozdělen podle pravděpodobné příčiny. Odstraněny byly automatické
  agresivní tekutinové režimy i absolutní zákaz tekutin u kardiogenního šoku.
- IM adrenalin zůstává první volbou u klinické anafylaxe, ale dávka a opakování
  jsou výslovně ponechány věku a místnímu protokolu.

### D — neurologie

- Hypoglykémie se léčí po změření glykémie. Odstraněna byla jedna univerzální
  dávka koncentrované glukózy.
- Anizokorie se interpretuje v kontextu trendu, traumatu a možných očních příčin.
- Benzodiazepiny, naloxon i glukóza jsou uvedeny bez univerzální dávky; ta závisí
  na věku, hmotnosti, cestě podání a protokolu.

### E — expozice

- Pánev se opakovaně nestlačuje ani „nepruží“. Pánevní pás se při indikaci
  umísťuje přes velké trochantery.
- Rutinní log-roll je omezen, zejména při podezření na nestabilní poranění pánve.
  Dlouhá páteřní deska je označena jako pomůcka pro vyproštění, nikoli rutinní
  transport.
- Eviscerované orgány se nevracejí zpět a netlačí se na ně.
- Trakční dlaha se zvažuje u vhodné izolované zlomeniny femuru; není povinná ve
  všech případech.
- Odmítnutí péče vyžaduje posouzení rozhodovací schopnosti, poučení, místní
  právní postup a dokumentaci.

## Automatická doporučení léčiv ve verzi 3.0

Data v `app/medication-data.ts` zahrnují následující situace a přípravky:

- IM adrenalin při klinické anafylaxi,
- tranexamovou kyselinu při významném traumatickém krvácení,
- naloxon při pravděpodobné opioidní toxicitě s hypoventilací,
- glukózu nebo glukagon při změřené hypoglykémii,
- benzodiazepin při konvulzivním status epilepticus,
- salbutamol s případným ipratropiem při bronchospasmu,
- fentanyl, morfin nebo ketamin pro protokolární analgezii,
- kyselinu acetylsalicylovou a nitroglycerin ve větvi bolesti na hrudi,
- adrenalin a amiodaron v samostatném ALS režimu,
- krevní přípravky a restriktivní krystaloidy při hemoragickém šoku.

Léčivo se zobrazí automaticky jen v relevantní větvi a uživatel potvrzením
„Podáno — zapsat“ přidá čas podání do záznamu výjezdu. Karty uvádějí cestu
podání, ale úmyslně neobsahují univerzální dávky. Každá dávka, koncentrace,
opakování a kontraindikace musí odpovídat schválenému internímu protokolu.

## Provozní bezpečnost verze 3.0

- Časová osa a závěrečný záznam se ukládají jen do paměti otevřené relace a lze
  je odstranit tlačítkem „Ukončit výjezd a smazat data“.
- Aplikace nevyžaduje jméno, rodné číslo ani adresu pacienta.
- Režim pro rukavice je pouze lokální preference zařízení.
- Resuscitační režim je časovač a dokumentační pomůcka, nikoli náhrada algoritmu,
  defibrilátoru nebo vedoucího týmu.
- Offline režim se aktivuje po prvním úspěšném načtení aplikace na zařízení.

## Hlavní použité zdroje

- [European Resuscitation Council Guidelines 2025 — First Aid](https://www.erc.edu/media/i2vllpae/gl2025-12-faid-e.pdf)
- [NICE NG39 — Major trauma: assessment and initial management](https://www.nice.org.uk/guidance/ng39/chapter/Recommendations)
- [NICE NG41 — Spinal injury: assessment and initial management](https://www.nice.org.uk/guidance/ng41/chapter/Recommendations)
- [NICE NG37 — Fractures (complex): assessment and management](https://www.nice.org.uk/guidance/ng37/chapter/recommendations)
- [NICE NG232 — Head injury: assessment and early management](https://www.nice.org.uk/guidance/ng232/chapter/recommendations)
- [Resuscitation Council UK — The ABCDE approach](https://www.resus.org.uk/library/abcde-approach)
- [Resuscitation Council UK — 2025 Adult ALS executive summary](https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/executive-summary-main-changes-2021-guidelines)
- [NICE NG40 — Major trauma service delivery and pre-alert](https://www.nice.org.uk/guidance/ng40/chapter/recommendations)
- [NICE NG217 — Convulsive status epilepticus](https://www.nice.org.uk/guidance/ng217/chapter/7-Treating-status-epilepticus-repeated-or-cluster-seizures-and-prolonged-seizures)
- [NHS — First aid, burns and scalds](https://www.nhs.uk/tests-and-treatments/first-aid/)
- [AHA 2025 — Adult Basic Life Support](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-basic-life-support)
- [Brain Trauma Foundation — Prehospital Guidelines, 2nd edition](https://braintrauma.org/coma/guidelines/pre-hospital-2nd-edition)
- [American College of Surgeons — Stop the Bleed resources](https://www.facs.org/media-center/resources-for-journalists/stop-the-bleed-resources-for-journalists/)

## Omezení

Zdroje používají odlišné cílové populace a jurisdikce. V místních protokolech
se mohou lišit zejména dávky, cílové hodnoty oxygenace a tlaku, technika
dekomprese hrudníku, indikace pomůcek, transportní triáž a právní řešení
odmítnutí péče. Tyto položky proto strom úmyslně neprezentuje jako univerzální
příkaz.
