export type Phase = "X" | "A" | "B" | "C" | "D" | "E";
export type Tone = "default" | "danger" | "safe" | "warning";

export type Choice = {
  label: string;
  helper?: string;
  target: string;
  tone?: Tone;
};

export type GuideNode = {
  phase: Phase;
  kicker: string;
  title: string;
  description?: string;
  alert?: string;
  steps?: string[];
  note?: string;
  choices: Choice[];
  complete?: boolean;
};

export const phases: Array<{ id: Phase; label: string }> = [
  { id: "X", label: "Krvácení" },
  { id: "A", label: "Dýchací cesty" },
  { id: "B", label: "Dýchání" },
  { id: "C", label: "Oběh" },
  { id: "D", label: "Vědomí a nervy" },
  { id: "E", label: "Celkové vyšetření" },
];

export const nodes: Record<string, GuideNode> = {
  intro: {
    phase: "X",
    kicker: "XABCDE • první vyšetření",
    title: "Jedna osoba. Jeden krok.",
    description:
      "Jednoduchý průvodce vyšetřením. Zkontrolujte aktuální stav, proveďte potřebný úkon a zvolte odpověď.",
    alert:
      "Nejdříve ověřte bezpečí na místě, použijte ochranné pomůcky, zjistěte počet zraněných a včas přivolejte další pomoc.",
    note:
      "Průvodce je určen pro dospělé. Těhotenství, vyšší věk, léky na ředění krve a popálení lze označit v panelu Nástroje.",
    choices: [
      {
        label: "Začít nový výjezd",
        helper: "Vytvoří se nový časový záznam a začne X",
        target: "x_start",
        tone: "safe",
      },
    ],
  },

  x_start: {
    phase: "X",
    kicker: "X.0 • prvotní pohled",
    title: "Je přítomné život ohrožující zevní krvácení?",
    description:
      "Hledejte rychle vytékající nebo hromadící se krev, silně prosáklý oděv, utrženou část končetiny nebo rychlé zhoršování stavu.",
    choices: [
      {
        label: "Ano",
        helper: "Okamžitě lokalizovat zdroj",
        target: "x_source",
        tone: "danger",
      },
      {
        label: "Ne",
        helper: "Pokračovat na dýchací cesty",
        target: "a_start",
        tone: "safe",
      },
    ],
  },
  x_source: {
    phase: "X",
    kicker: "X.1 • místo krvácení",
    title: "Odkud osoba silně krvácí?",
    description:
      "Odkryjte pouze potřebnou oblast a současně tlačte přímo do rány.",
    choices: [
      {
        label: "Paže nebo ruka",
        helper: "Rána končetiny nebo utržená část",
        target: "x_arm",
        tone: "danger",
      },
      {
        label: "Noha nebo stehno",
        helper: "Rána končetiny nebo utržená část",
        target: "x_leg",
        tone: "danger",
      },
      {
        label: "Tříslo nebo podpaží",
        helper: "Místo, kam běžný turniket nelze nasadit",
        target: "x_junction",
        tone: "warning",
      },
      {
        label: "Krk nebo hlava",
        helper: "Pozor na dýchací cesty a poranění lebky",
        target: "x_head_neck",
        tone: "warning",
      },
      {
        label: "Hrudník nebo břicho",
        helper: "Zevní rána nebo podezření na vnitřní zdroj",
        target: "x_trunk",
        tone: "warning",
      },
      {
        label: "Více míst",
        helper: "Rozdělit úkoly a určit nejzávažnější zdroj",
        target: "x_multiple",
        tone: "danger",
      },
    ],
  },
  x_arm: {
    phase: "X",
    kicker: "X.2a • paže nebo ruka",
    title: "Kontrolujte krvácení z horní končetiny",
    steps: [
      "Okamžitě tlačte přímo do rány. Krytí použijte jen tehdy, pokud nezdrží silný a nepřerušovaný tlak.",
      "Pokud silné krvácení tlak rychle nezastaví, nasaďte turniket nad ránu směrem k tělu, nikdy přes kloub.",
      "Pokud v kritické situaci nelze ránu rychle najít, umístěte turniket vysoko na končetinu podle výcviku a interního postupu.",
      "Utáhněte do zastavení krvácení, zajistěte turniket proti povolení, zapište čas a ponechte jej viditelný.",
    ],
    note:
      "Při utržení části končetiny řešte nejdříve krvácení. Oddělenou část čistě zabalte, uzavřete do nepropustného obalu a chlaďte nepřímo — nikdy přímo na ledu.",
    choices: [
      {
        label: "Zkontrolovat účinek",
        target: "x_control",
        tone: "safe",
      },
    ],
  },
  x_leg: {
    phase: "X",
    kicker: "X.2b • noha nebo stehno",
    title: "Kontrolujte krvácení z dolní končetiny",
    steps: [
      "Okamžitě tlačte přímo do rány a určete její skutečnou polohu.",
      "Pokud silné krvácení tlak rychle nezastaví, nasaďte turniket nad ránu směrem k tělu, ne přes koleno ani do třísla.",
      "Samotná zlomenina stehenní kosti není důvodem k turniketu. Rozhodující je silné zevní krvácení.",
      "Utáhněte do zastavení krvácení, zapište čas, ponechte jej viditelný a bez výslovného protokolu jej v terénu neuvolňujte.",
    ],
    choices: [
      {
        label: "Zkontrolovat účinek",
        target: "x_control",
        tone: "safe",
      },
    ],
  },
  x_junction: {
    phase: "X",
    kicker: "X.2c • tříslo nebo podpaží",
    title: "Vyplňte hlubokou ránu až ke zdroji krvácení",
    steps: [
      "Vyplňte ránu od nejhlubšího místa vhodným materiálem na zástavu krvácení.",
      "Poté nepřerušovaně silně tlačte po dobu uvedenou na použitém materiálu.",
      "Po dosažení kontroly vše zajistěte tlakovým obvazem a průběžně kontrolujte prosakování.",
      "Speciální turniket pro tříslo nebo podpaží použijte jen tehdy, pokud je dostupný a umíte jej správně použít.",
    ],
    choices: [
      {
        label: "Zkontrolovat účinek",
        target: "x_control",
        tone: "safe",
      },
    ],
  },
  x_head_neck: {
    phase: "X",
    kicker: "X.2d • krk nebo hlava",
    title: "Tlačte cíleně a chraňte dýchací cesty",
    steps: [
      "Na místo krvácení tlačte přímo; hlubokou ránu vyplňte vhodným materiálem podle výcviku.",
      "U krku nikdy neutahujte obvaz kolem celého krku. Nesmí bránit dýchání ani průtoku krve na zdravé straně.",
      "Pokud může být lebka promáčknutá dovnitř, netlačte přímo na poškozenou kost. Krvácení zastavujte opatrně kolem rány.",
      "Průběžně sledujte dýchání, hlas, otok a změny vědomí.",
    ],
    choices: [
      {
        label: "Zkontrolovat účinek",
        target: "x_control",
        tone: "safe",
      },
    ],
  },
  x_trunk: {
    phase: "X",
    kicker: "X.2e • hrudník nebo břicho",
    title: "Rozlište zevní a skryté krvácení",
    alert:
      "Rychle se horšící osoba s podezřením na krvácení do hrudníku, břicha nebo pánve potřebuje rychlý transport a včasné upozornění cílového pracoviště.",
    steps: [
      "Kontrolujte dostupné zevní krvácení přímým tlakem, aniž byste neprodyšně uzavřeli otevřenou ránu hrudníku.",
      "Rychle zkontrolujte známky selhávání oběhu a pokračujte v dalších písmenech. Úkony na místě nesmí zbytečně oddálit transport.",
      "Zajistěte vstup do žíly (IV) nebo do kosti (IO) bez zdržení transportu. Pokud jsou dostupné, upřednostněte krevní přípravky; náhradní roztok podávejte opatrně.",
      "Podle interního postupu zvažte včasné podání tranexamové kyseliny, osobu udržujte v teple a stav opakovaně kontrolujte.",
    ],
    note:
      "Při vážném poranění hlavy se cílový krevní tlak může lišit. Nepoužívejte automaticky jednu hodnotu pro všechny.",
    choices: [
      {
        label: "Pokračovat na A",
        target: "a_start",
        tone: "danger",
      },
    ],
  },
  x_multiple: {
    phase: "X",
    kicker: "X.2f • více zdrojů",
    title: "Rozdělte si úkoly a jednejte současně",
    steps: [
      "Vyžádejte další pomoc a určete člena týmu pro trvalou kontrolu každého závažného zdroje.",
      "Nejdříve řešte nejrychlejší život ohrožující krvácení. Na končetině použijte turniket, jinde přímý tlak nebo vyplnění hluboké rány.",
      "Označte časy použitých turniketů a všechna místa průběžně znovu kontrolujte.",
      "Zkraťte čas na místě, informujte cílové pracoviště a pokračujte v XABCDE současně s přípravou transportu.",
    ],
    choices: [
      {
        label: "Zkontrolovat nejzávažnější zdroj",
        target: "x_control",
        tone: "danger",
      },
    ],
  },
  x_control: {
    phase: "X",
    kicker: "X • kontrola účinku",
    title: "Zastavilo se život ohrožující krvácení?",
    description:
      "Sledujte aktivní krvácení, rychlé prosakování, krev pod osobou a pokračující známky krevní ztráty.",
    choices: [
      {
        label: "Ano, je pod kontrolou",
        target: "a_start",
        tone: "safe",
      },
      {
        label: "Ne, stále krvácí",
        target: "x_failure",
        tone: "danger",
      },
    ],
  },
  x_failure: {
    phase: "X",
    kicker: "X • první pokus nestačil",
    title: "Zesilte kontrolu krvácení",
    alert:
      "Nepřerušujte účinný tlak na ránu. Použitou pomůcku opravujte současně s přípravou transportu a informováním cílového pracoviště.",
    steps: [
      "Znovu odhalte zdroj a zkontrolujte polohu, těsnost a techniku použité pomůcky.",
      "Neúčinný turniket více dotáhněte. Pokud to nestačí, přiložte druhý těsně vedle prvního směrem k tělu.",
      "Pokud vyplnění rány nefunguje, materiál odstraňte, ránu znovu vyplňte od zdroje krvácení a nepřerušovaně tlačte.",
      "Vyžádejte pokročilou podporu a oznamte nekontrolované krvácení cílovému pracovišti.",
    ],
    choices: [
      {
        label: "Krvácení se zastavilo",
        target: "a_start",
        tone: "safe",
      },
      {
        label: "Krvácení pokračuje",
        target: "x_uncontrolled",
        tone: "danger",
      },
    ],
  },
  x_uncontrolled: {
    phase: "X",
    kicker: "X • kritický stav",
    title: "Stále tlačte na ránu a neodkládejte transport",
    alert:
      "Krvácení, které se nedaří zastavit, bezprostředně ohrožuje život. Stále na ránu tlačte i během dalšího vyšetření a přesunu.",
    steps: [
      "Nenechávejte ránu bez přímého tlaku.",
      "Další prostředky na zástavu krvácení použijte jen tehdy, pokud je umíte správně použít.",
      "Pokračujte v A–E, podporujte krevní oběh, udržujte osobu v teple a stav často kontrolujte.",
    ],
    choices: [
      {
        label: "Pokračovat na A",
        target: "a_start",
        tone: "danger",
      },
    ],
  },

  a_start: {
    phase: "A",
    kicker: "A.0 • dýchací cesty",
    title: "Jsou dýchací cesty volné?",
    description:
      "Poslouchejte hlas a zvuky dýchání, vnímejte proud vzduchu a hledejte krev, zvratky, cizí předmět, otok nebo poranění.",
    choices: [
      {
        label: "Mluví normálně",
        helper: "Dýchací cesty jsou nyní průchodné",
        target: "b_start",
        tone: "safe",
      },
      {
        label: "Dýchací cesty jsou částečně ucpané",
        helper: "Chrápání, chrčení, pískavý zvuk, krev nebo hlen",
        target: "a_partial",
        tone: "warning",
      },
      {
        label: "Dýchací cesty jsou úplně ucpané",
        helper: "Nemůže mluvit ani účinně kašlat, vzduch neproudí",
        target: "a_complete",
        tone: "danger",
      },
      {
        label: "Podezření na poranění krční páteře",
        helper: "Rizikový úraz, bolest nebo změny citlivosti a pohybu",
        target: "a_spine",
        tone: "warning",
      },
      {
        label: "Pacient je v bezvědomí",
        helper: "Nelze spolehlivě chránit dýchací cesty",
        target: "a_unconscious",
        tone: "danger",
      },
    ],
  },
  a_partial: {
    phase: "A",
    kicker: "A.1 • částečné ucpání",
    title: "Uvolněte dýchací cesty",
    steps: [
      "Uvolněte dýchací cesty. Při podezření na poranění páteře nejdříve předsuňte dolní čelist, jinak zakloňte hlavu a zvedněte bradu.",
      "Odsajte krev, zvratky a hlen. Odstraňte pouze cizí předmět, který skutečně vidíte — nesahejte naslepo do úst.",
      "Ústní vzduchovod (OPA) použijte jen bez dávivého reflexu. Nosní vzduchovod (NPA) nepoužívejte při závažném poranění středu obličeje, pokud to interní postup zakazuje.",
      "Podávejte kyslík a podle potřeby pomáhejte s dýcháním.",
    ],
    choices: [
      {
        label: "Zkontrolovat průchodnost",
        target: "a_control",
        tone: "safe",
      },
    ],
  },
  a_complete: {
    phase: "A",
    kicker: "A.2 • úplné ucpání",
    title: "Co je pravděpodobnou příčinou?",
    alert:
      "Úplně ucpané dýchací cesty nebo zástava dechu vyžadují okamžitý zásah. Přivolejte pomoc a připravte pomůcky pro podporu dýchání.",
    choices: [
      {
        label: "Cizí těleso — při vědomí",
        helper: "Neúčinný kašel / neschopnost mluvit",
        target: "a_fbao",
        tone: "danger",
      },
      {
        label: "Bezvědomí nebo příčina nejasná",
        helper: "Uvolnit, odsát a pomáhat s dýcháním",
        target: "a_apnoea",
        tone: "danger",
      },
    ],
  },
  a_fbao: {
    phase: "A",
    kicker: "A.2 • cizí těleso",
    title: "Postupujte jako při dušení",
    steps: [
      "Při účinném kašli osobu povzbuzujte ke kašli a průběžně ji sledujte.",
      "Při neúčinném kašli střídejte údery mezi lopatky a stlačení podle postupu pro dušení dospělého.",
      "Pokud osoba ztratí vědomí, zahajte resuscitaci. Při otevření úst odstraňte pouze předmět, který skutečně vidíte.",
      "Po úspěšném vypuzení znovu vyšetřete A a B; přetrvávající potíže vyžadují odborné zhodnocení.",
    ],
    choices: [
      {
        label: "Zkontrolovat průchodnost",
        target: "a_control",
        tone: "safe",
      },
    ],
  },
  a_apnoea: {
    phase: "A",
    kicker: "A.2 • bez proudění vzduchu",
    title: "Uvolněte dýchací cesty a pomáhejte s dýcháním",
    steps: [
      "Uvolněte dýchací cesty, odsajte jejich obsah a vložte vhodnou základní pomůcku podle reakce osoby.",
      "Začněte dýchat za osobu vakem s maskou a kyslíkem. Vdechujte jen tolik, aby se viditelně zvedal hrudník.",
      "Pokud vzduch nejde dovnitř, upravte polohu hlavy a masky, držte masku oběma rukama a znovu hledejte překážku.",
      "Pokročilou pomůcku do dýchacích cest použijte jen podle výcviku a interního postupu.",
    ],
    choices: [
      {
        label: "Zkontrolovat průchodnost",
        target: "a_control",
        tone: "safe",
      },
    ],
  },
  a_spine: {
    phase: "A",
    kicker: "A.3 • krční páteř",
    title: "Chraňte páteř, ale dejte přednost dýchacím cestám",
    steps: [
      "Držte hlavu a krk rovně v ose těla a dýchací cesty nejdříve uvolněte předsunutím dolní čelisti.",
      "Pokud to nestačí, přednost má uvolnění dýchacích cest a dostatek kyslíku.",
      "O omezení pohybu páteře rozhodněte podle typu úrazu, nálezu a interního postupu, ne automaticky u každého úrazu.",
      "Po nasazení límce nebo jiné pomůcky znovu zkontrolujte dýchací cesty a dýchání. Pomůcka je nesmí zhoršit.",
    ],
    choices: [
      {
        label: "Dýchací cesty průchodné",
        target: "b_start",
        tone: "safe",
      },
      {
        label: "Stále neprůchodné",
        target: "a_escalate",
        tone: "danger",
      },
    ],
  },
  a_unconscious: {
    phase: "A",
    kicker: "A.4 • bezvědomí",
    title: "Dokáže osoba chránit své dýchací cesty?",
    steps: [
      "Okamžitě zkontrolujte normální dýchání a puls na krku nebo v třísle podle resuscitačního postupu.",
      "Uvolněte a odsajte dýchací cesty. Použijte vhodnou základní pomůcku a při nedostatečném dýchání pomáhejte vakem s maskou.",
      "Při hlubokém bezvědomí nebo neschopnosti chránit dýchací cesty včas přivolejte někoho se zkušeností s jejich pokročilým zajištěním. Samotné skóre vědomí ale automaticky neznamená zavedení trubice.",
      "Hledejte příčinu: nedostatek kyslíku, nízký cukr, úraz, otrava, mrtvice nebo stav po křečích.",
    ],
    choices: [
      {
        label: "Dýchací cesty chrání a dýchá dostatečně",
        target: "b_start",
        tone: "safe",
      },
      {
        label: "Dýchací cesty nechrání nebo dýchá nedostatečně",
        target: "a_escalate",
        tone: "danger",
      },
    ],
  },
  a_escalate: {
    phase: "A",
    kicker: "A • další podpora",
    title: "Použijte další dostupnou podporu dýchacích cest",
    alert:
      "Během přípravy pokročilé pomůcky stále zajišťujte kyslík a pomáhejte s dýcháním. Nesmí vzniknout neřešená pauza.",
    steps: [
      "Pokračujte v dýchání vakem s maskou, odsávání a úpravě polohy hlavy.",
      "Pokročilou pomůcku do dýchacích cest použijte jen podle výcviku, dostupnosti a interního postupu.",
      "Po zavedení zkontrolujte, zda vzduch skutečně proudí do plic. Je-li dostupné měření vydechovaného CO₂, použijte je k potvrzení polohy.",
      "Pomůcku zajistěte a polohu znovu ověřte po každém přesunu a při náhlé změně stavu.",
    ],
    choices: [
      {
        label: "Dýchací cesty jsou zajištěné",
        target: "b_start",
        tone: "safe",
      },
      {
        label: "Zajištění selhává",
        helper: "Pokračovat v nejlepší dostupné podpoře dýchání",
        target: "b_apnoea",
        tone: "danger",
      },
    ],
  },
  a_control: {
    phase: "A",
    kicker: "A • kontrola účinku",
    title: "Jsou dýchací cesty nyní průchodné?",
    choices: [
      {
        label: "Ano",
        target: "b_start",
        tone: "safe",
      },
      {
        label: "Ne",
        target: "a_escalate",
        tone: "danger",
      },
    ],
  },

  b_start: {
    phase: "B",
    kicker: "B.0 • dýchání",
    title: "Je dýchání účinné a přiměřené?",
    description:
      "Sledujte rychlost a námahu dýchání, stejné zvedání obou stran hrudníku, poslechněte plíce a změřte okysličení krve (SpO₂). Číslo vždy porovnejte s celkovým stavem.",
    choices: [
      {
        label: "Ano, bez zjevné poruchy",
        target: "c_start",
        tone: "safe",
      },
      {
        label: "Pomalé nebo mělké",
        target: "b_slow",
        tone: "warning",
      },
      {
        label: "Rychlé / zvýšená práce",
        target: "b_fast",
        tone: "warning",
      },
      {
        label: "Pískání nebo stažené průdušky",
        target: "b_bronchospasm",
        tone: "warning",
      },
      {
        label: "Nízké okysličení nebo modrání",
        target: "b_low_spo2",
        tone: "danger",
      },
      {
        label: "Nedýchá",
        target: "b_apnoea",
        tone: "danger",
      },
      {
        label: "Hrudník se nezvedá stejně",
        target: "b_asymmetry",
        tone: "warning",
      },
      {
        label: "Rána na hrudníku",
        target: "b_chest_wound",
        tone: "danger",
      },
    ],
  },
  b_slow: {
    phase: "B",
    kicker: "B.1 • pomalé nebo mělké dýchání",
    title: "Pomáhejte s dýcháním a hledejte příčinu",
    steps: [
      "Pokud osoba dýchá příliš pomalu nebo mělce, pomáhejte jí vakem s maskou a kyslíkem podle interního postupu.",
      "Znovu zkontrolujte dýchací cesty. Hledejte předávkování opioidy, poranění hlavy, prochladnutí, vyčerpání nebo účinek léků.",
      "Při podezření na opioidy má přednost pomoc s dýcháním. Naloxon podávejte tak, aby osoba znovu dostatečně dýchala; úplné probuzení není nutné.",
      "Sledujte okysličení (SpO₂), vydechovaný CO₂ a vědomí, pokud jsou měření dostupná.",
    ],
    choices: [
      {
        label: "Zkontrolovat dýchání",
        target: "b_control",
        tone: "safe",
      },
    ],
  },
  b_fast: {
    phase: "B",
    kicker: "B.2 • rychlé nebo namáhavé dýchání",
    title: "Hledejte a řešte příčinu namáhavého dýchání",
    steps: [
      "Zkontrolujte okysličení, poslech plic, bolest, teplotu, známky selhávání oběhu a možné poranění hrudníku.",
      "Podejte kyslík podle naměřené hodnoty. Při stažených průduškách podejte lék na jejich uvolnění podle interního postupu.",
      "Pokud se osoba vyčerpává, ztrácí vědomí nebo dýchá stále hůř, připravte pomoc s dýcháním.",
      "Samotné rychlé dýchání neurčuje diagnózu. Sledujte vývoj a reakci na léčbu.",
    ],
    choices: [
      {
        label: "Zkontrolovat dýchání",
        target: "b_control",
        tone: "safe",
      },
    ],
  },
  b_bronchospasm: {
    phase: "B",
    kicker: "B.2 • stažené průdušky",
    title: "Zhodnoťte závažnost a podejte lék na uvolnění průdušek",
    steps: [
      "Sledujte, zda osoba dokáže mluvit, jak namáhavě dýchá, okysličení (SpO₂), poslech plic a známky vyčerpání. Téměř neslyšné dýchání je varovné.",
      "Podejte salbutamol, případně ipratropium, způsobem a v opakování podle platného interního protokolu.",
      "Množství kyslíku upravte podle naměřené hodnoty. Při nedostatečném dýchání připravte pomoc vakem s maskou.",
      "Myslete i na silnou alergickou reakci, tekutinu v plicích nebo cizí předmět v dýchacích cestách.",
    ],
    note:
      "U silné alergické reakce je první volbou adrenalin do svalu (IM). Samotný lék na průdušky nestačí.",
    choices: [
      {
        label: "Zkontrolovat dýchání",
        target: "b_control",
        tone: "safe",
      },
    ],
  },
  b_low_spo2: {
    phase: "B",
    kicker: "B.3 • málo kyslíku v krvi",
    title: "Ověřte měření a upravte podávání kyslíku",
    steps: [
      "Zkontrolujte kvalitu signálu, prokrvení prstu, pohyb, lak a porovnejte hodnotu s klinickým stavem.",
      "U většiny akutních stavů upravujte kyslík na SpO₂ 94–98 %. U osoby, která běžně zadržuje CO₂, bývá cíl 88–92 %, pokud interní postup neurčuje jinak.",
      "Pokud osoba nedýchá dostatečně, samotný kyslík nestačí — pomáhejte s dýcháním vakem a znovu zkontrolujte dýchací cesty.",
      "Při podezření na otravu kouřem nebo oxidem uhelnatým (CO) podejte vysokou koncentraci kyslíku. Běžný snímač na prstu může ukazovat klamně dobrou hodnotu.",
    ],
    choices: [
      {
        label: "Zkontrolovat dýchání",
        target: "b_control",
        tone: "safe",
      },
    ],
  },
  b_apnoea: {
    phase: "B",
    kicker: "B.4 • nedýchá",
    title: "Je hmatný puls na krku nebo v třísle?",
    alert:
      "Posouzení proveďte bez zbytečného prodlení podle resuscitačního protokolu.",
    choices: [
      {
        label: "Ano, puls je přítomen",
        helper: "Ventilovat a řešit příčinu",
        target: "b_ventilate",
        tone: "danger",
      },
      {
        label: "Ne / nejsem si jistý",
        helper: "Zahájit resuscitační postup",
        target: "c_no_pulse",
        tone: "danger",
      },
    ],
  },
  b_ventilate: {
    phase: "B",
    kicker: "B.4 • zástava dechu",
    title: "Dýchejte za osobu a průběžně kontrolujte puls",
    steps: [
      "Dýchejte za osobu vakem s maskou a kyslíkem podle postupu pro dospělého, jen do viditelného zvednutí hrudníku.",
      "Použijte dvouruční těsnění masky, základní pomůcku a odsávání podle potřeby.",
      "Pokročilou pomůcku do dýchacích cest připravte jen podle výcviku. Sledujte vydechovaný CO₂, pokud je měření dostupné.",
      "Opakovaně kontrolujte puls a při jeho ztrátě ihned přejděte k resuscitaci.",
    ],
    choices: [
      {
        label: "Spontánní dýchání obnoveno",
        target: "b_control",
        tone: "safe",
      },
      {
        label: "Puls zmizel",
        target: "c_no_pulse",
        tone: "danger",
      },
    ],
  },
  b_asymmetry: {
    phase: "B",
    kicker: "B.5 • nestejné zvedání hrudníku",
    title: "Co nejlépe vysvětluje rozdíl mezi stranami hrudníku?",
    choices: [
      {
        label: "Těžká dušnost a selhávání oběhu",
        helper: "Podezření na nebezpečný přetlak vzduchu v hrudníku",
        target: "b_tension",
        tone: "danger",
      },
      {
        label: "Otevřená rána hrudníku",
        target: "b_open_ptx",
        tone: "danger",
      },
      {
        label: "Část hrudníku se pohybuje opačně",
        helper: "Více zlomených žeber a nestabilní hrudní stěna",
        target: "b_flail",
        tone: "warning",
      },
      {
        label: "Jednostranně oslabené dýchání",
        helper: "Možný vzduch nebo krev v hrudníku bez známek přetlaku",
        target: "b_pleural",
        tone: "warning",
      },
    ],
  },
  b_chest_wound: {
    phase: "B",
    kicker: "B.6 • rána hrudníku",
    title: "Je rána otevřená do hrudníku?",
    choices: [
      {
        label: "Ano / nasává vzduch",
        target: "b_open_ptx",
        tone: "danger",
      },
      {
        label: "Ne, ale dýchání je jednostranně oslabené",
        target: "b_pleural",
        tone: "warning",
      },
      {
        label: "Pacient se rychle horší",
        helper: "Těžká dušnost nebo selhávání oběhu",
        target: "b_tension",
        tone: "danger",
      },
    ],
  },
  b_open_ptx: {
    phase: "B",
    kicker: "B.6a • otevřená rána do hrudníku",
    title: "Umožněte volný odchod vzduchu",
    steps: [
      "Ránu ihned neuzavírejte improvizovaným neprodyšným krytím. Vzduch musí mít možnost odcházet ven.",
      "Pokud máte výcvik a správnou pomůcku, použijte speciální krytí, které umožní odchod vzduchu.",
      "Kontrolujte vstupní i výstupní ránu, krvácení a průchodnost ventilu; krevní sraženina může odtok zablokovat.",
      "Při zhoršení ihned zvažte nebezpečný přetlak vzduchu v hrudníku a postupujte podle interního postupu.",
    ],
    choices: [
      {
        label: "Zkontrolovat dýchání",
        target: "b_control",
        tone: "safe",
      },
    ],
  },
  b_tension: {
    phase: "B",
    kicker: "B.6c • nebezpečný přetlak v hrudníku",
    title: "Při rychlém zhoršování jednejte bez prodlení",
    alert:
      "Rozhoduje celkový stav. Posunutí průdušnice ani naplněné žíly na krku nemusí být vidět; nečekejte na ně, pokud se osoba rychle horší.",
    steps: [
      "Podejte kyslík, pomáhejte s dýcháním a řešte současné selhávání oběhu.",
      "Při těžké dušnosti nebo selhávání oběhu uvolněte přetlak jen tehdy, pokud jste pro výkon vyškoleni, a podle interního postupu.",
      "Místo, techniku a pomůcku zvolte podle aktuálního výcviku a interního postupu.",
      "Po výkonu sledujte, zda se stav zlepšil a zda se potíže nevracejí. Pokračujte v rychlém transportu.",
    ],
    choices: [
      {
        label: "Zkontrolovat dýchání",
        target: "b_control",
        tone: "safe",
      },
    ],
  },
  b_pleural: {
    phase: "B",
    kicker: "B.6b • vzduch nebo krev v hrudníku",
    title: "Podávejte kyslík a sledujte možné zhoršení",
    steps: [
      "Podejte kyslík podle potřeby a s dýcháním pomáhejte opatrně podle stavu.",
      "Sledujte rozdíl mezi stranami hrudníku, námahu při dýchání, okysličení (SpO₂), prokrvení a vývoj životních funkcí.",
      "Při podezření na krev v hrudníku současně léčte selhávání oběhu z krvácení. Polohu zvolte podle dýchání a oběhu, ne automaticky vsedě.",
      "Při rychlém zhoršení přejděte na větev nebezpečného přetlaku v hrudníku a neodkládejte transport.",
    ],
    choices: [
      {
        label: "Zkontrolovat dýchání",
        target: "b_control",
        tone: "safe",
      },
    ],
  },
  b_flail: {
    phase: "B",
    kicker: "B.5 • nestabilní hrudní stěna",
    title: "Pomáhejte s dýcháním a tlumte bolest",
    steps: [
      "Podejte kyslík podle potřeby a sledujte známky pohmoždění plic a vyčerpání.",
      "Podejte lék proti bolesti podle interního postupu. Uložte osobu do polohy, kterou snáší a která nezhoršuje oběh.",
      "Při nedostatečném dýchání pomáhejte vakem s maskou. Na hrudník nepřikládejte těžké předměty.",
      "Hrudník opakovaně kontrolujte a včas informujte vhodné cílové pracoviště.",
    ],
    choices: [
      {
        label: "Zkontrolovat dýchání",
        target: "b_control",
        tone: "safe",
      },
    ],
  },
  b_control: {
    phase: "B",
    kicker: "B • kontrola účinku",
    title: "Je okysličení a dýchání nyní dostatečné?",
    choices: [
      {
        label: "Ano / stav se zlepšuje",
        target: "c_start",
        tone: "safe",
      },
      {
        label: "Ne / stav se zhoršuje",
        helper: "Znovu zkontrolovat A, pomůcky a příčinu",
        target: "b_start",
        tone: "danger",
      },
    ],
  },

  c_start: {
    phase: "C",
    kicker: "C.0 • krevní oběh",
    title: "Je krevní oběh dostatečný?",
    description:
      "Sledujte vědomí, sílu pulzu, barvu a teplotu kůže, návrat barvy po stlačení nehtu, krevní tlak a hlavně vývoj těchto hodnot.",
    note:
      "Hmatný puls na zápěstí neznamená automaticky bezpečný krevní tlak. Vždy sledujte celkový stav a vývoj.",
    choices: [
      {
        label: "Ano, bez známek šoku",
        target: "d_start",
        tone: "safe",
      },
      {
        label: "Oběh je přijatelný, ale bolí na hrudi",
        helper: "Možná srdeční příčina",
        target: "c_chest_pain",
        tone: "warning",
      },
      {
        label: "Ne, ale puls je přítomen",
        helper: "Slabý puls, horší vědomí, chladná nebo skvrnitá kůže, klesající tlak",
        target: "c_unstable",
        tone: "danger",
      },
      {
        label: "Centrální puls není hmatný",
        target: "c_no_pulse",
        tone: "danger",
      },
    ],
  },
  c_no_pulse: {
    phase: "C",
    kicker: "C • zástava oběhu",
    title: "Zahajte resuscitační algoritmus",
    alert:
      "Při zástavě oběhu ihned přejděte na resuscitaci dospělého a současně hledejte příčinu, kterou lze rychle napravit.",
    steps: [
      "Zahajte kvalitní stlačování hrudníku a dýchání podle platného resuscitačního postupu.",
      "Připojte defibrilátor, zhodnoťte srdeční rytmus a řiďte se jeho pokyny.",
      "U úrazu současně řešte silné krvácení, nedostatek kyslíku a možný přetlak vzduchu v hrudníku.",
      "Léky a výkony uvnitř těla použijte jen podle výcviku a interního postupu.",
    ],
    choices: [
      {
        label: "Oběh se obnovil — vrátit se k XABCDE",
        target: "x_start",
        tone: "safe",
      },
      {
        label: "Pokračovat v resuscitačním protokolu",
        target: "c_no_pulse",
        tone: "danger",
      },
      {
        label: "Resuscitace byla ukončena — osoba zemřela",
        helper: "Pouze po rozhodnutí oprávněné osoby podle platného postupu",
        target: "deceased",
        tone: "danger",
      },
    ],
  },
  c_chest_pain: {
    phase: "C",
    kicker: "C • bolest na hrudi",
    title: "Postupujte jako při podezření na srdeční příhodu",
    steps: [
      "Co nejdříve natočte 12svodové EKG. Sledujte srdeční rytmus, tlak, okysličení a vývoj bolesti.",
      "Aspirin podejte jen při pravděpodobné srdeční příhodě a po kontrole důvodů, kdy se podat nesmí.",
      "Nitroglycerin podejte jen tehdy, pokud to dovoluje krevní tlak a interní postup. Kyslík podejte při nízkém okysličení.",
      "Podejte lék proti bolesti a zvolte další směr transportu podle EKG, času a interního postupu.",
    ],
    alert:
      "Pokud je bolest náhlá a velmi silná, liší se puls mezi končetinami, osoba má slabost jedné strany nebo selhává oběh, může jít o jiný kritický stav. Léky na infarkt nepodávejte automaticky.",
    choices: [
      {
        label: "Pokračovat na D",
        target: "d_start",
        tone: "safe",
      },
      {
        label: "Pacient je oběhově nestabilní",
        target: "c_unstable",
        tone: "danger",
      },
    ],
  },
  c_unstable: {
    phase: "C",
    kicker: "C.1–C.4 • selhávání oběhu",
    title: "Co selhávání oběhu nejlépe vysvětluje?",
    choices: [
      {
        label: "Silné krvácení nebo úraz",
        helper: "Viditelné nebo skryté krvácení",
        target: "c_hemorrhagic",
        tone: "danger",
      },
      {
        label: "Těžká dušnost nebo problém v hrudníku",
        helper: "Možný přetlak vzduchu, tlak na srdce nebo krevní sraženina v plicích",
        target: "c_obstructive",
        tone: "danger",
      },
      {
        label: "Silná alergie, infekce nebo poranění páteře",
        helper: "Náhlé rozšíření cév a pokles tlaku",
        target: "c_distributive",
        tone: "warning",
      },
      {
        label: "Bolest na hrudi nebo srdeční potíže",
        helper: "Infarkt, nebezpečný rytmus nebo selhávání srdce",
        target: "c_cardiogenic",
        tone: "warning",
      },
      {
        label: "Příčina není jasná",
        helper: "Znovu zkontrolovat krvácení, dýchací cesty a dýchání",
        target: "c_unknown",
        tone: "warning",
      },
    ],
  },
  c_hemorrhagic: {
    phase: "C",
    kicker: "C.4 • selhávání oběhu z krvácení",
    title: "Kontrolujte krvácení a podporujte oběh",
    steps: [
      "Vraťte se k X a zkontrolujte turnikety, vyplněné rány, hrudník, břicho, pánev a dlouhé kosti.",
      "Bez zdržení transportu zajistěte vstup do žíly (IV) nebo do kosti (IO). Pokud jsou dostupné, upřednostněte krevní přípravky.",
      "Náhradní roztok podávejte opatrně a po malých dávkách s opakovanou kontrolou. Při vážném poranění hlavy může být cíl jiný.",
      "Podle interního postupu zvažte včasnou tranexamovou kyselinu, osobu zahřívejte a informujte vhodné cílové pracoviště.",
    ],
    choices: [
      {
        label: "Zkontrolovat oběh",
        target: "c_control",
        tone: "safe",
      },
    ],
  },
  c_obstructive: {
    phase: "C",
    kicker: "C.4 • překážka krevního oběhu",
    title: "Hledejte tlak nebo překážku, která brání oběhu",
    steps: [
      "Znovu zkontrolujte dýchání: rozdíl mezi stranami hrudníku, těžkou dušnost a známky nebezpečného přetlaku vzduchu.",
      "Při podezření na přetlak postupujte podle příslušné větve B a interního postupu pro jeho uvolnění.",
      "Při podezření na tlak kolem srdce nebo jinou překážku podpořte dýchání a oběh, vyžádejte pokročilou péči a neodkládejte transport.",
      "Tekutiny a léky na podporu tlaku používejte po malých krocích podle pravděpodobné příčiny a interního postupu.",
    ],
    choices: [
      {
        label: "Je podezření na přetlak v hrudníku",
        target: "b_tension",
        tone: "danger",
      },
      {
        label: "Jiná příčina nebo stav po ošetření",
        target: "c_control",
        tone: "warning",
      },
    ],
  },
  c_distributive: {
    phase: "C",
    kicker: "C.4 • výrazný pokles tlaku",
    title: "Co náhlý pokles tlaku nejlépe vysvětluje?",
    choices: [
      {
        label: "Silná alergická reakce",
        helper: "Náhlý otok, dušnost, selhávání oběhu, často vyrážka",
        target: "c_anaphylaxis",
        tone: "danger",
      },
      {
        label: "Těžká infekce",
        helper: "Horečka nebo podchlazení, změna vědomí, slabý oběh",
        target: "c_sepsis",
        tone: "warning",
      },
      {
        label: "Poranění páteře nebo jiná příčina",
        helper: "Také účinek léků nebo hormonální problém",
        target: "c_unknown",
        tone: "warning",
      },
    ],
  },
  c_anaphylaxis: {
    phase: "C",
    kicker: "C.4 • silná alergická reakce",
    title: "Podejte adrenalin do svalu",
    alert:
      "Při silné alergické reakci je první volbou adrenalin do svalu na vnější straně stehna (IM). Dávku a případné opakování určete podle interního postupu.",
    steps: [
      "Přerušte kontakt s vyvolávající látkou, je-li to možné, a přivolejte potřebnou podporu.",
      "Podejte IM adrenalin bez zbytečného odkladu a zaznamenejte čas.",
      "Podejte kyslík, sledujte životní funkce, zajistěte vstup do žíly (IV) nebo do kosti (IO) a tekutiny podávejte po menších dávkách podle oběhu.",
      "Průběžně sledujte dýchací cesty. Při otoku nebo zhoršování včas připravte pokročilou pomůcku.",
    ],
    choices: [
      {
        label: "Zkontrolovat dýchací cesty, dýchání a oběh",
        target: "c_control",
        tone: "safe",
      },
    ],
  },
  c_sepsis: {
    phase: "C",
    kicker: "C.4 • podezření na těžkou infekci",
    title: "Podpořte oběh a informujte cílové pracoviště",
    steps: [
      "Změřte životní funkce, teplotu a cukr v krvi a hledejte pravděpodobný zdroj infekce.",
      "Při nízkém okysličení podejte kyslík, zajistěte vstup do žíly (IV) nebo do kosti (IO) a tekutiny podávejte po menších dávkách s opakovanou kontrolou.",
      "Sledujte, zda se osoba tekutinami nepřetěžuje, hlavně při onemocnění srdce nebo ledvin. Velké množství nepodávejte automaticky.",
      "Informujte cílové pracoviště, pokračujte v časném transportu a řiďte se interním postupem pro těžkou infekci.",
    ],
    choices: [
      {
        label: "Zkontrolovat oběh",
        target: "c_control",
        tone: "safe",
      },
    ],
  },
  c_cardiogenic: {
    phase: "C",
    kicker: "C.4 • selhávání srdce",
    title: "Podpořte oběh, ale nepodávejte automaticky velké množství tekutin",
    steps: [
      "Natočte 12svodové EKG, sledujte srdeční rytmus a hledejte známky nedokrvení srdce nebo tekutiny v plicích.",
      "Kyslík podejte jen při nízkém okysličení. Při nedostatečném dýchání použijte vhodnou podporu.",
      "Tekutinu podejte jen při jasném důvodu a po malých dávkách s opakovanou kontrolou. Léky na podporu tlaku použijte podle výcviku a interního postupu.",
      "Nebezpečný srdeční rytmus léčte podle resuscitačního postupu a zajistěte rychlý transport.",
    ],
    choices: [
      {
        label: "Zkontrolovat oběh",
        target: "c_control",
        tone: "safe",
      },
    ],
  },
  c_unknown: {
    phase: "C",
    kicker: "C.4 • příčina nejistá",
    title: "Znovu zkontrolujte X až B a řešte zjištěné problémy",
    steps: [
      "Znovu zkontrolujte krvácení, dýchací cesty, dýchání a hrudník. Ověřte, že měřicí přístroje ukazují správně.",
      "Sledujte životní funkce, natočte EKG a opakovaně měřte tlak, cukr v krvi a teplotu podle situace.",
      "Provádějte jen úkony, které odpovídají pravděpodobné příčině, a po každém zkontrolujte účinek. Vyžádejte odbornou podporu.",
      "Neodkládejte transport jen proto, abyste na místě určili přesnou diagnózu.",
    ],
    choices: [
      {
        label: "Zkontrolovat oběh",
        target: "c_control",
        tone: "safe",
      },
    ],
  },
  c_control: {
    phase: "C",
    kicker: "C • kontrola účinku",
    title: "Je krevní oběh nyní stabilní nebo se zlepšuje?",
    choices: [
      {
        label: "Ano",
        target: "d_start",
        tone: "safe",
      },
      {
        label: "Ne",
        helper: "Pokračovat v léčbě příčiny během transportu",
        target: "c_unstable",
        tone: "danger",
      },
    ],
  },

  d_start: {
    phase: "D",
    kicker: "D.0 • vědomí",
    title: "Jak osoba reaguje?",
    description:
      "Zapište, zda je bdělá, reaguje na hlas, reaguje až na bolest, nebo nereaguje. Při úrazu či změně vědomí doplňte používané číselné hodnocení vědomí.",
    choices: [
      {
        label: "Je bdělá a orientovaná",
        target: "d_neuro",
        tone: "safe",
      },
      {
        label: "Reaguje na hlas / bolest",
        target: "d_altered",
        tone: "warning",
      },
      {
        label: "Nereaguje",
        target: "d_unresponsive",
        tone: "danger",
      },
    ],
  },
  d_altered: {
    phase: "D",
    kicker: "D.1 • porucha vědomí",
    title: "Nejdříve znovu zkontrolujte dýchání a oběh",
    steps: [
      "Zopakujte A až C a ihned řešte nedostatek kyslíku, slabé dýchání nebo selhávání oběhu.",
      "Změřte cukr v krvi a teplotu. Myslete na úraz, mrtvici, křeče, otravu nebo infekci.",
      "Zaznamenejte, jak se vědomí mění, včetně času a jednotlivých částí používaného hodnocení.",
      "Při hlubokém bezvědomí nebo dalším zhoršování včas přivolejte pomoc se zajištěním dýchacích cest. O pomůcce rozhoduje celkový stav.",
    ],
    choices: [
      {
        label: "Cukr v krvi je nízký",
        target: "d_hypoglycemia",
        tone: "danger",
      },
      {
        label: "Cukr v krvi není nízký",
        target: "d_neuro",
        tone: "warning",
      },
    ],
  },
  d_hypoglycemia: {
    phase: "D",
    kicker: "D.1 • nízký cukr v krvi",
    title: "Léčte potvrzený nízký cukr v krvi",
    steps: [
      "Pokud osoba bezpečně polyká, podejte glukózu ústy podle interního postupu.",
      "Při poruše vědomí podejte glukózu do žíly (IV) nebo do kosti (IO), případně glukagon do svalu (IM), podle dostupného vstupu.",
      "Chraňte dýchací cesty. Pokud osoba bezpečně nepolyká, nic jí nedávejte ústy.",
      "Po léčbě znovu změřte cukr v krvi, zkontrolujte vědomí a hledejte příčinu i riziko návratu potíží.",
    ],
    choices: [
      {
        label: "Zkontrolovat vědomí a pohyb",
        target: "d_neuro",
        tone: "safe",
      },
    ],
  },
  d_unresponsive: {
    phase: "D",
    kicker: "D.1 • bez reakce",
    title: "Podpořte základní životní funkce a rychle hledejte příčinu",
    steps: [
      "Ihned znovu zkontrolujte dýchací cesty, dýchání a oběh. Při zástavě zahajte resuscitaci.",
      "Změřte cukr v krvi, zkontrolujte zornice, známky úrazu, slabost jedné strany, křeče a možné otravy.",
      "Při nedostatečném dýchání pomáhejte vakem s maskou a zajistěte dýchací cesty podle výcviku. Zabraňte nedostatku kyslíku a nízkému tlaku.",
      "Informujte cílové pracoviště o kritickém stavu a pokračujte v rychlém transportu.",
    ],
    choices: [
      {
        label: "Puls a dýchání jsou zachované",
        target: "d_neuro",
        tone: "warning",
      },
      {
        label: "Není puls / normální dýchání",
        target: "c_no_pulse",
        tone: "danger",
      },
    ],
  },
  d_neuro: {
    phase: "D",
    kicker: "D.2–D.5 • pohyb, řeč a křeče",
    title: "Je jedna strana těla slabší nebo probíhají křeče?",
    description:
      "Porovnejte pohyb a čití na obou stranách, řeč, pokles koutku, koordinaci a přítomnost křečí.",
    choices: [
      {
        label: "Jednostranná slabost / porucha řeči",
        target: "d_stroke",
        tone: "danger",
      },
      {
        label: "Probíhající nebo opakovaný záchvat",
        target: "d_seizure",
        tone: "danger",
      },
      {
        label: "Obě strany jsou stejné, bez křečí",
        target: "d_pupils",
        tone: "safe",
      },
    ],
  },
  d_pupils: {
    phase: "D",
    kicker: "D.2 • zornice",
    title: "Jak reagují zornice?",
    choices: [
      {
        label: "Stejné a reagují",
        target: "e_start",
        tone: "safe",
      },
      {
        label: "Různě velké / nově nereagující",
        target: "d_anisocoria",
        tone: "danger",
      },
      {
        label: "Velmi malé",
        target: "d_pinpoint",
        tone: "warning",
      },
      {
        label: "Oboustranně široké / nereagující",
        target: "d_dilated",
        tone: "warning",
      },
    ],
  },
  d_anisocoria: {
    phase: "D",
    kicker: "D.3a • různě velké zornice",
    title: "Zjistěte, zda je rozdíl nový a zda se mění",
    steps: [
      "Ověřte, zda je rozdíl nový a zda osoba nemá známé oční onemocnění, operaci nebo lék pouze v jednom oku.",
      "Po úrazu, při klesajícím vědomí nebo nové slabosti jedné strany myslete na vážné poškození uvnitř lebky.",
      "Zabraňte nedostatku kyslíku a nízkému tlaku. Pomáhejte s dýcháním normálním tempem, ne zbytečně rychle.",
      "Informujte cílové pracoviště o podezření na vážné poranění hlavy a zvolte vhodné místo transportu.",
    ],
    choices: [
      {
        label: "Pokračovat na E",
        target: "e_start",
        tone: "warning",
      },
    ],
  },
  d_pinpoint: {
    phase: "D",
    kicker: "D.3b • velmi malé zornice",
    title: "Zvažte předávkování opioidy, ale hledejte i jiné příčiny",
    steps: [
      "Zkontrolujte rychlost a hloubku dýchání, vydechovaný CO₂ a známky jiné příčiny poruchy vědomí.",
      "Při pomalém nebo mělkém dýchání nejdříve uvolněte dýchací cesty a pomáhejte vakem s maskou.",
      "Při pravděpodobném předávkování podejte naloxon podle interního postupu tak, aby osoba znovu dostatečně dýchala.",
      "Sledujte návrat útlumu, prudkou reakci po vysazení drogy a možnost kombinace více látek.",
    ],
    choices: [
      {
        label: "Pokračovat na E",
        target: "e_start",
        tone: "warning",
      },
    ],
  },
  d_dilated: {
    phase: "D",
    kicker: "D.3c • velmi široké zornice",
    title: "Hledejte vážné poškození mozku nebo otravu",
    steps: [
      "Znovu zkontrolujte dýchací cesty, dýchání, oběh, vědomí, cukr v krvi, teplotu a známky úrazu.",
      "Myslete na nedostatek kyslíku, vážné poškození mozku, povzbuzující drogy, jiné otravy nebo oční příčinu.",
      "Léčte zjištěný problém, ne samotnou velikost zornic, a sledujte změny.",
      "Při zhoršujícím se oběhu nebo vědomí informujte cílové pracoviště a neodkládejte transport.",
    ],
    choices: [
      {
        label: "Pokračovat na E",
        target: "e_start",
        tone: "warning",
      },
    ],
  },
  d_stroke: {
    phase: "D",
    kicker: "D.4 • podezření na mrtvici",
    title: "Postupujte jako při podezření na mrtvici",
    steps: [
      "Zjistěte přesný čas, kdy byla osoba naposledy bez příznaků, a proveďte místní test na mrtvici.",
      "Změřte cukr v krvi, zkontrolujte dýchací cesty a okysličení a zabraňte nízkému tlaku.",
      "Zjistěte léky na ředění krve, předchozí soběstačnost, důležitá onemocnění a kontakt na svědky.",
      "Informujte centrum pro léčbu mrtvice a vyberte cílové pracoviště podle interního postupu.",
    ],
    choices: [
      {
        label: "Zkontrolovat zornice",
        target: "d_pupils",
        tone: "safe",
      },
    ],
  },
  d_seizure: {
    phase: "D",
    kicker: "D.5 • křeče",
    title: "Chraňte osobu a zastavte dlouhotrvající křeče",
    steps: [
      "Odstraňte nebezpečné předměty, chraňte hlavu, osobu násilně nedržte a nic jí nevkládejte do úst.",
      "Měřte čas křečí, podejte kyslík a připravte odsávání. Po odeznění znovu zkontrolujte dýchací cesty.",
      "Změřte cukr v krvi a teplotu. Hledejte úraz, těhotenství, otravu nebo známou epilepsii.",
      "Při záchvatu trvajícím přibližně 5 minut nebo při opakování bez zotavení podejte benzodiazepin podle hmotnosti a platného interního protokolu.",
    ],
    choices: [
      {
        label: "Záchvat ustal",
        target: "d_pupils",
        tone: "safe",
      },
      {
        label: "Záchvat pokračuje",
        helper: "Pokračovat v léčbě a připravit pomoc s dýcháním",
        target: "d_seizure",
        tone: "danger",
      },
    ],
  },

  e_start: {
    phase: "E",
    kicker: "E.0 • celé tělo",
    title: "Našli jste při celkovém ohledání významný nález?",
    description:
      "Rychle prohlédněte osobu od hlavy k patě. Odkryjte jen potřebné části, chraňte soukromí a zabraňte prochladnutí.",
    steps: [
      "Hledejte rány, deformity, popálení, bolest, otok a další zranění, která nebyla dříve vidět.",
      "Mokrý oděv odstraňte, osobu izolujte od země a přikryjte ji.",
    ],
    choices: [
      {
        label: "Ano — je přítomný nález",
        helper: "Vybrat oblast nejzávažnějšího nálezu",
        target: "e_finding",
        tone: "warning",
      },
      {
        label: "Ne — bez významného nálezu",
        helper: "Přeskočit jednotlivé části těla",
        target: "e_finish",
        tone: "safe",
      },
    ],
  },
  e_finding: {
    phase: "E",
    kicker: "E.0 • nalezené poranění",
    title: "Kde je nejzávažnější nález?",
    description:
      "Pokud je nálezů více, začněte tím, který osobu ohrožuje nejvíce.",
    choices: [
      {
        label: "Hlava nebo krk",
        target: "e_head",
        tone: "warning",
      },
      {
        label: "Hrudník",
        target: "e_chest",
        tone: "danger",
      },
      {
        label: "Břicho nebo pánev",
        target: "e_abdomen",
        tone: "danger",
      },
      {
        label: "Záda nebo páteř",
        target: "e_back",
        tone: "warning",
      },
      {
        label: "Paže nebo nohy",
        target: "e_extremities",
        tone: "warning",
      },
      {
        label: "Popálení nebo chemická látka",
        target: "e_burn",
        tone: "danger",
      },
      {
        label: "Více míst nebo si nejsem jistý",
        helper: "Projít jednotlivé části těla postupně",
        target: "e_head",
        tone: "warning",
      },
    ],
  },
  e_burn: {
    phase: "E",
    kicker: "E • popálení nebo chemická látka",
    title: "Zastavte působení, chlaďte popálené místo a udržujte osobu v teple",
    steps: [
      "Ověřte bezpečí na místě, zastavte hoření a u chemické látky použijte správné ochranné pomůcky a postup pro její smytí nebo odstranění.",
      "Popáleninu chlaďte chladnou tekoucí vodou přibližně 20 minut, pokud to nezdrží péči o bezprostřední ohrožení. Nepoužívejte led.",
      "Odstraňte volný oděv a šperky, ale nestrhávejte nic přilepeného ke kůži. Po chlazení místo volně překryjte čistým nepřilnavým krytím.",
      "Současně zabraňte prochladnutí celého těla, odhadněte velikost a hloubku popálení, podejte lék proti bolesti a informujte vhodné cílové pracoviště.",
    ],
    alert:
      "Saze, změna hlasu, pískavý zvuk při nádechu, popálení obličeje nebo vdechnutí kouře vyžadují rychlou kontrolu dýchacích cest a dýchání. Běžná SpO₂ nevylučuje otravu oxidem uhelnatým.",
    choices: [
      {
        label: "Podezření na vdechnutí kouře nebo horkého vzduchu",
        target: "a_start",
        tone: "danger",
      },
      {
        label: "Pokračovat systematicky hlavou",
        target: "e_head",
        tone: "safe",
      },
    ],
  },
  e_head: {
    phase: "E",
    kicker: "E.1 • hlava",
    title: "Je na hlavě závažný nález?",
    description:
      "Prohlédněte vlasatou část hlavy, obličej, ústa, oči a uši. Hledejte krev, čirou tekutinu, deformaci nebo známky zlomeniny spodiny lebky.",
    choices: [
      {
        label: "Deformita / známky závažného úrazu",
        target: "e_head_injury",
        tone: "danger",
      },
      {
        label: "Krvácející rána bez deformity",
        target: "x_head_neck",
        tone: "warning",
      },
      {
        label: "Bez závažného nálezu",
        target: "e_neck",
        tone: "safe",
      },
    ],
  },
  e_head_injury: {
    phase: "E",
    kicker: "E.1 • poranění hlavy",
    title: "Zabraňte dalšímu poškození mozku",
    steps: [
      "Zabraňte nedostatku kyslíku a nízkému tlaku. Sledujte změny vědomí, zornice, křeče a zvracení.",
      "Netlačte přímo na vpáčenou zlomeninu a nevytahujte pronikající předmět.",
      "Nosní vzduchovod (NPA) nepoužívejte při vážném poranění středu obličeje nebo spodiny lebky, pokud to interní postup zakazuje.",
      "Informujte cílové pracoviště o vážném poranění hlavy a pokračujte k vyšetření krku bez zdržení transportu.",
    ],
    choices: [
      {
        label: "Pokračovat na krk",
        target: "e_neck",
        tone: "warning",
      },
    ],
  },
  e_neck: {
    phase: "E",
    kicker: "E.2 • krk",
    title: "Je na krku kritický nález?",
    description:
      "Hledejte ránu, otok, vzduch pod kůží, posunutí průdušnice, nápadně naplněné žíly, bolest a změny citlivosti nebo pohybu.",
    choices: [
      {
        label: "Rána nebo rychle se zvětšující otok",
        target: "x_head_neck",
        tone: "danger",
      },
      {
        label: "Dušnost a známky přetlaku v hrudníku",
        target: "b_tension",
        tone: "danger",
      },
      {
        label: "Podezření na poranění páteře",
        target: "a_spine",
        tone: "warning",
      },
      {
        label: "Bez kritického nálezu",
        target: "e_chest",
        tone: "safe",
      },
    ],
  },
  e_chest: {
    phase: "E",
    kicker: "E.3 • hrudník",
    title: "Je na hrudníku závažný nález?",
    description:
      "Prohlédněte přední, boční i dostupnou zadní část. Sledujte stejné zvedání obou stran, rány, deformaci, křupání pod kůží a rozdíl při poslechu.",
    choices: [
      {
        label: "Otevřená rána",
        target: "b_open_ptx",
        tone: "danger",
      },
      {
        label: "Nestabilita, rozdíl mezi stranami nebo oslabené dýchání",
        target: "b_asymmetry",
        tone: "warning",
      },
      {
        label: "Bez závažného nálezu",
        target: "e_abdomen",
        tone: "safe",
      },
    ],
  },
  e_abdomen: {
    phase: "E",
    kicker: "E.4 • břicho",
    title: "Je na břiše závažný nález?",
    description:
      "Hledejte ránu, modřinu, nafouknutí, tvrdé břicho, bolestivost, otisk bezpečnostního pásu nebo orgány vyhřezlé z rány.",
    choices: [
      {
        label: "Orgány vyhřezlé z rány",
        target: "e_evisceration",
        tone: "danger",
      },
      {
        label: "Bolest, tvrdé nebo nafouklé břicho či velká modřina",
        helper: "Podezření na vnitřní krvácení",
        target: "x_trunk",
        tone: "danger",
      },
      {
        label: "Bez závažného nálezu",
        target: "e_pelvis",
        tone: "safe",
      },
    ],
  },
  e_evisceration: {
    phase: "E",
    kicker: "E.4 • orgány vyhřezlé z rány",
    title: "Chraňte orgány a netlačte na ně",
    steps: [
      "Orgány nevracejte do dutiny a nevyvíjejte na ně přímý tlak.",
      "Překryjte je čistým krytím navlhčeným sterilním solným roztokem a podle interního postupu volně přidejte neprodyšnou vrstvu.",
      "Zabraňte vysychání a prochladnutí, sledujte známky selhávání oběhu a nepodávejte nic ústy.",
      "Informujte cílové pracoviště o pronikajícím poranění a pokračujte v rychlém transportu.",
    ],
    choices: [
      {
        label: "Pokračovat na pánev",
        target: "e_pelvis",
        tone: "warning",
      },
    ],
  },
  e_pelvis: {
    phase: "E",
    kicker: "E.5 • pánev",
    title: "Je podezření na vážné poranění pánve?",
    description:
      "Rozhodujte podle síly úrazu, bolesti, deformace a známek krvácení. Pánev opakovaně nestlačujte ani nezkoušejte, zda se pohybuje.",
    choices: [
      {
        label: "Podezření na vážné poranění pánve",
        helper: "Silný náraz, bolest, deformita nebo známky krvácení",
        target: "e_pelvis_injury",
        tone: "danger",
      },
      {
        label: "Oběh selhává, příčina není jasná",
        helper: "Vrátit se na C a znovu hledat příčinu",
        target: "c_unstable",
        tone: "warning",
      },
      {
        label: "Bez podezření na vážné poranění",
        target: "e_back",
        tone: "safe",
      },
    ],
  },
  e_pelvis_injury: {
    phase: "E",
    kicker: "E.5 • poranění pánve",
    title: "Nasaďte pánevní pás ve výši horní části stehen",
    steps: [
      "Pánev již dále mechanicky netestujte a minimalizujte zbytečné pohyby.",
      "Při podezření na krvácení po silném úrazu nasaďte pánevní pás přes horní část stehen v úrovni kyčelních kloubů podle návodu.",
      "Podporujte oběh při krvácení, zabraňte prochladnutí a včas informujte vhodné cílové pracoviště.",
      "Osobu zbytečně nepřetáčejte na bok. Udělejte to jen tehdy, když je to nutné pro dýchací cesty nebo nalezení skryté pronikající rány.",
    ],
    choices: [
      {
        label: "Pokračovat na záda",
        target: "e_back",
        tone: "warning",
      },
    ],
  },
  e_back: {
    phase: "E",
    kicker: "E.6 • záda",
    title: "Je vyšetření zad nyní nutné a bezpečné?",
    description:
      "Záda prohlédněte při bezpečném přesunu nebo tehdy, když výsledek změní okamžitou léčbu. Při podezření na poranění pánve osobu zbytečně nepřetáčejte.",
    choices: [
      {
        label: "Ano — tým provede společný bezpečný přesun",
        helper: "Udržet osu, prohlédnout, prohmatat a znovu zkontrolovat pomůcky",
        target: "e_extremities",
        tone: "warning",
      },
      {
        label: "Ne — nyní by zvýšil riziko",
        helper: "Vyšetřit při nejbližší bezpečné příležitosti",
        target: "e_extremities",
        tone: "safe",
      },
    ],
    note:
      "Dlouhá páteřní deska slouží hlavně k vyproštění, ne jako běžná podložka pro celý transport. Další omezení pohybu zvolte podle interního postupu.",
  },
  e_extremities: {
    phase: "E",
    kicker: "E.7 • končetiny",
    title: "Jaký je nejzávažnější nález na končetinách?",
    description:
      "Hledejte deformaci, ránu, otok a bolest. Na obou končetinách porovnejte puls pod poraněním, návrat barvy po stlačení nehtu, citlivost a pohyb.",
    choices: [
      {
        label: "Otevřená / jiná zlomenina",
        target: "e_fracture",
        tone: "warning",
      },
      {
        label: "Podezření na samostatnou zlomeninu stehenní kosti",
        target: "e_femur",
        tone: "warning",
      },
      {
        label: "Pod poraněním není puls nebo je končetina bledá a chladná",
        target: "e_perfusion",
        tone: "danger",
      },
      {
        label: "Bez závažného nálezu",
        target: "e_finish",
        tone: "safe",
      },
    ],
  },
  e_fracture: {
    phase: "E",
    kicker: "E.7 • zlomenina",
    title: "Ránu překryjte, končetinu znehybněte a kontrolujte prokrvení",
    steps: [
      "Zastavte krvácení, otevřenou ránu sterilně kryjte a nevytahujte cizí předmět.",
      "Před znehybněním zapište puls pod poraněním, návrat barvy po stlačení nehtu, citlivost a pohyb.",
      "Končetinu znehybněte v nalezené poloze pomocí vhodné dlahy podle místního protokolu.",
      "Po nasazení dlahy znovu zkontrolujte a zapište puls, barvu, citlivost a pohyb pod poraněním.",
    ],
    choices: [
      {
        label: "Pokračovat k závěru E",
        target: "e_finish",
        tone: "safe",
      },
    ],
  },
  e_femur: {
    phase: "E",
    kicker: "E.7 • stehenní kost",
    title: "Tahovou dlahu zvažte jen u vhodné samostatné zlomeniny",
    steps: [
      "Ověřte, zda jde o samostatnou zlomeninu stehenní kosti nad kolenem a zda interní postup použití tahové dlahy dovoluje.",
      "Tahovou dlahu použijte jen při odpovídajícím výcviku. Jinak použijte běžnou dlahu nebo fixaci k druhé končetině.",
      "Turniket se na uzavřenou zlomeninu běžně nedává. Použijte jej jen při život ohrožujícím zevním krvácení.",
      "Před i po znehybnění zkontrolujte puls, barvu, citlivost a pohyb pod poraněním. Současně podporujte případně selhávající oběh.",
    ],
    choices: [
      {
        label: "Pokračovat k závěru E",
        target: "e_finish",
        tone: "safe",
      },
    ],
  },
  e_perfusion: {
    phase: "E",
    kicker: "E.7 • ohrožená končetina",
    title: "Řešte končetinu bez pulzu nebo se špatným prokrvením",
    steps: [
      "Uvolněte vše, co může končetinu zvenku příliš stlačovat, a zkontrolujte polohu dlahy nebo obvazu.",
      "Pokud je prokrvení stále ohrožené, zvažte jeden šetrný pokus o srovnání podle výcviku a interního postupu.",
      "S končetinou nemanipulujte opakovaně. Znehybněte ji a po každém kroku znovu zkontrolujte puls, citlivost a pohyb.",
      "Dokumentujte časy a nálezy a zajistěte urgentní transport na vhodné pracoviště.",
    ],
    choices: [
      {
        label: "Pokračovat k závěru E",
        target: "e_finish",
        tone: "warning",
      },
    ],
  },
  e_finish: {
    phase: "E",
    kicker: "E.8 • dokončení primárního vyšetření",
    title: "Zahřejte osobu, doplňte informace a opakujte XABCDE",
    steps: [
      "Pacienta osušte, izolujte od chladu, přikryjte a průběžně sledujte teplotu.",
      "Zjistěte, co se stalo, potíže, alergie, užívané léky včetně léků na ředění krve, předchozí onemocnění, poslední jídlo a časový průběh.",
      "Zapište vývoj životních funkcí, vědomí, cukru v krvi, provedené úkony a jejich časy.",
      "Po každé změně stavu, důležitém úkonu nebo přesunu znovu začněte u X a pokračujte XABCDE.",
    ],
    choices: [
      {
        label: "Rozhodnout o dalším postupu",
        target: "e_decision",
        tone: "safe",
      },
    ],
  },
  e_decision: {
    phase: "E",
    kicker: "E.9 • transportní rozhodnutí",
    title: "Jaký je výsledný stav osoby?",
    choices: [
      {
        label: "Kritický / časově závislý",
        helper: "Selhávající životní funkce nebo vážný úraz a nález",
        target: "e_critical",
        tone: "danger",
      },
      {
        label: "Stabilní",
        helper: "Po prvním vyšetření bez bezprostředního ohrožení",
        target: "e_stable",
        tone: "safe",
      },
      {
        label: "Odmítá péči nebo transport",
        target: "e_refusal",
        tone: "warning",
      },
    ],
  },
  e_critical: {
    phase: "E",
    kicker: "E.9 • kritický stav",
    title: "Zkraťte čas na místě a včas informujte cílové pracoviště",
    steps: [
      "Cílové pracoviště a naléhavost transportu zvolte podle nejvážnějšího problému a interních pravidel.",
      "Pokračujte v život zachraňujících úkonech, které lze bezpečně provést během přesunu nebo transportu.",
      "Předejte: co se stalo nebo jaké jsou potíže, nálezy XABCDE, vývoj životních funkcí, provedenou léčbu a její účinek.",
      "Čas a způsob jízdy vždy řiďte místními bezpečnostními a operačními pravidly.",
    ],
    choices: [
      {
        label: "Dokončit průvodce",
        target: "complete",
        tone: "safe",
      },
    ],
  },
  e_stable: {
    phase: "E",
    kicker: "E.9 • stabilní stav",
    title: "Dokončete podrobnější vyšetření a naplánujte transport",
    steps: [
      "Doplňte informace o zdravotním stavu a podrobnější vyšetření podle potíží a typu úrazu.",
      "Ošetřete bolest, rány a další nálezy dle místního protokolu.",
      "Dále sledujte životní funkce a pravidelně opakujte XABCDE. Současně dobrý stav se může změnit.",
      "Cílové pracoviště a způsob transportu zvolte podle stavu osoby a místních pravidel.",
    ],
    choices: [
      {
        label: "Dokončit průvodce",
        target: "complete",
        tone: "safe",
      },
    ],
  },
  e_refusal: {
    phase: "E",
    kicker: "E.9 • odmítnutí",
    title: "Ověřte, zda osoba rozumí rozhodnutí a jeho následkům",
    alert:
      "Samotné slovní odmítnutí nestačí. Pacient musí být schopen informaci pochopit, zvážit důsledky, rozhodnutí vyjádřit a udržet.",
    steps: [
      "Vylučte nedostatek kyslíku, nízký cukr, otravu, poranění hlavy, zmatenost a další příčiny, které mohou zhoršit rozhodování.",
      "Srozumitelně vysvětlete nález, doporučený postup, rizika odmítnutí a dostupné alternativy.",
      "Při pochybnosti kontaktujte lékaře a postupujte podle místních právních a organizačních pravidel.",
      "Zapište posouzení schopnosti rozhodnout, podané vysvětlení, rozhodnutí, svědky, nabídnuté možnosti a bezpečnostní pokyny.",
    ],
    choices: [
      {
        label: "Odmítnutí je platné",
        target: "complete",
        tone: "safe",
      },
      {
        label: "Pokračovat v péči — kritický stav",
        target: "e_critical",
        tone: "danger",
      },
      {
        label: "Pokračovat v péči — stabilní stav",
        target: "e_stable",
        tone: "warning",
      },
    ],
  },
  complete: {
    phase: "E",
    kicker: "XABCDE • dokončeno",
    title: "První vyšetření je dokončené",
    description:
      "Dále sledujte životní funkce, vše zapisujte a předejte informace v jasném pořadí. Při každém zhoršení začněte znovu od X.",
    alert:
      "Při předání popište, jak se stav měnil a jak osoba reagovala na léčbu, ne pouze poslední naměřené hodnoty.",
    complete: true,
    choices: [
      {
        label: "Provést kontrolní XABCDE",
        helper: "Pokračovat ve stejném výjezdu od X",
        target: "x_start",
        tone: "safe",
      },
    ],
  },
  deceased: {
    phase: "E",
    kicker: "VÝJEZD • UKONČENÍ PÉČE",
    title: "Úmrtí osoby bylo zaznamenáno",
    description:
      "Čas a průběh provedených úkonů zůstaly uložené v časové ose. Doplňte údaje a vytvořte závěrečný záznam.",
    alert:
      "Aplikace pouze zaznamenává potvrzené rozhodnutí. Další postup se řídí platnými místními pravidly.",
    complete: true,
    choices: [],
  },
};
