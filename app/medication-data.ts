export type MedicationCategory =
  | "Resuscitace"
  | "Krvácení"
  | "Dýchání"
  | "Oběh"
  | "Vědomí a nervy"
  | "Bolest";

export type Medication = {
  id: string;
  name: string;
  category: MedicationCategory;
  indication: string;
  route: string;
  goal: string;
  safety: string[];
  relatedNode: string;
  source: string;
};

export const medications: Medication[] = [
  {
    id: "adrenaline-anaphylaxis",
    name: "Adrenalin",
    category: "Oběh",
    indication:
      "Silná alergická reakce s otokem dýchacích cest, dušností nebo selháváním oběhu.",
    route: "Do svalu na vnější straně stehna (IM)",
    goal: "Rychle zmenšit otok, uvolnit dýchání a podpořit krevní oběh.",
    safety: [
      "Podání neodkládejte kvůli jiným lékům na alergii.",
      "Dávku a případné opakování určete podle platného interního postupu.",
      "Po podání znovu zkontrolujte dýchání a oběh a zapište přesný čas.",
    ],
    relatedNode: "c_anaphylaxis",
    source:
      "https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/special-circumstances-guidelines",
  },
  {
    id: "tranexamic-acid",
    name: "Tranexamová kyselina",
    category: "Krvácení",
    indication:
      "Silné nebo pravděpodobné vnitřní krvácení, pokud od úrazu neuplynuly více než tři hodiny.",
    route: "Do žíly (IV) nebo do kosti (IO)",
    goal: "Pomoci omezit pokračující krvácení.",
    safety: [
      "Nenahrazuje tlak na ránu, turniket ani rychlý transport.",
      "Po více než třech hodinách nepodávejte, pokud interní postup neurčuje konkrétní výjimku.",
      "Dávku a rychlost podání určete podle platného interního postupu.",
    ],
    relatedNode: "c_hemorrhagic",
    source:
      "https://www.nice.org.uk/guidance/ng39/chapter/Recommendations",
  },
  {
    id: "naloxone",
    name: "Naloxon",
    category: "Dýchání",
    indication:
      "Podezření na předávkování opioidy, když osoba dýchá příliš pomalu nebo mělce.",
    route: "Do žíly (IV), do kosti (IO), do svalu (IM) nebo do nosu (IN)",
    goal: "Obnovit dostatečné samostatné dýchání; úplné probuzení není nutné.",
    safety: [
      "Nejdříve uvolněte dýchací cesty a pomáhejte s dýcháním.",
      "Způsob a opakování podání určete podle interního postupu; potíže se mohou vrátit.",
      "Samotné velmi malé zornice předávkování nepotvrzují.",
    ],
    relatedNode: "b_slow",
    source:
      "https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/first-aid-guidelines",
  },
  {
    id: "glucose-glucagon",
    name: "Glukóza nebo glukagon",
    category: "Vědomí a nervy",
    indication: "Naměřený nízký cukr v krvi s odpovídajícími potížemi.",
    route:
      "Při bezpečném polykání glukóza ústy (PO); jinak glukóza do žíly (IV), do kosti (IO) nebo glukagon do svalu (IM)",
    goal: "Zvýšit cukr v krvi a zlepšit stav vědomí.",
    safety: [
      "Pokud osoba bezpečně nepolyká, nic jí nedávejte ústy.",
      "Volba přípravku závisí na dostupném vstupu a interním postupu.",
      "Po podání znovu změřte cukr v krvi a sledujte, zda potíže nevracejí.",
    ],
    relatedNode: "d_hypoglycemia",
    source:
      "https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/first-aid-guidelines",
  },
  {
    id: "benzodiazepine",
    name: "Lék proti křečím (benzodiazepin)",
    category: "Vědomí a nervy",
    indication:
      "Křeče trvají přibližně 5 minut nebo se opakují bez návratu vědomí.",
    route:
      "Do žíly (IV) nebo do kosti (IO); bez vstupu do svalu (IM) nebo do nosu (IN)",
    goal: "Zastavit dlouhotrvající křeče a zabránit nedostatku kyslíku.",
    safety: [
      "Měřte čas, podávejte kyslík, připravte odsávání a pomoc s dýcháním.",
      "Konkrétní přípravek, cestu a dávku určete podle interního postupu.",
      "Po podání pozorně sledujte dýchání a krevní tlak.",
    ],
    relatedNode: "d_seizure",
    source:
      "https://www.nice.org.uk/guidance/ng217/chapter/7-Treating-status-epilepticus-repeated-or-cluster-seizures-and-prolonged-seizures",
  },
  {
    id: "bronchodilator",
    name: "Salbutamol ± ipratropium",
    category: "Dýchání",
    indication:
      "Pískání při dýchání, obtížný výdech nebo výrazně stažené průdušky.",
    route: "Vdechnutím z inhalátoru nebo přes masku s rozprašovačem",
    goal: "Uvolnit průdušky a usnadnit dýchání.",
    safety: [
      "Kyslík upravujte podle naměřené hodnoty a průběžně kontrolujte dýchání.",
      "Způsob podání a opakování určete podle interního postupu.",
      "Sledujte celkové zlepšení, rychlost tepu a známky vyčerpání.",
    ],
    relatedNode: "b_bronchospasm",
    source:
      "https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/first-aid-guidelines",
  },
  {
    id: "analgesia",
    name: "Fentanyl / morfin / ketamin",
    category: "Bolest",
    indication:
      "Silná náhlá bolest po úrazu nebo při bolestivém ošetření.",
    route:
      "Fentanyl do žíly (IV), do kosti (IO) nebo do nosu (IN); morfin do žíly (IV) nebo do kosti (IO); ketamin do žíly (IV), do kosti (IO) nebo do svalu (IM)",
    goal: "Zmírnit bolest bez zhoršení dýchání a krevního oběhu.",
    safety: [
      "Volbu léku přizpůsobte dýchání, oběhu, poranění a dříve užitým lékům.",
      "Dávku určete podle interního postupu; sledujte vědomí, dýchání a tlak.",
      "Podání léku proti bolesti nesmí oddálit zastavení krvácení ani transport.",
    ],
    relatedNode: "e_fracture",
    source:
      "https://www.nice.org.uk/guidance/ng39/chapter/Recommendations",
  },
  {
    id: "aspirin",
    name: "Aspirin (kyselina acetylsalicylová)",
    category: "Oběh",
    indication:
      "Podezření na srdeční příhodu po rychlém celkovém zhodnocení. EKG natočte co nejdříve, ale vhodné podání kvůli němu neodkládejte.",
    route: "Ústy, tabletu rozkousat (PO)",
    goal: "Snížit další tvorbu krevní sraženiny při podezření na infarkt.",
    safety: [
      "Nepodávejte při závažné alergii, silném krvácení nebo pokud potíže zřejmě mají jinou příčinu.",
      "Ověřte, zda už osoba aspirin neužila, a postupujte podle interního postupu.",
      "Kvůli dalším úkonům na místě neodkládejte transport.",
    ],
    relatedNode: "c_chest_pain",
    source:
      "https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/first-aid-guidelines",
  },
  {
    id: "nitroglycerin",
    name: "Nitroglycerin",
    category: "Oběh",
    indication:
      "Bolest na hrudi při podezření na srdeční příčinu nebo náhlé městnání tekutiny v plicích, pokud to dovoluje krevní tlak.",
    route: "Pod jazyk (SL)",
    goal: "Zmírnit bolest nebo dušnost bez nebezpečného snížení tlaku.",
    safety: [
      "Před podáním zkontrolujte tlak a možné zakázané kombinace s jinými léky.",
      "Nepodávejte automaticky každému s bolestí na hrudi.",
      "Dávku, odstup a důvody, kdy lék nepodat, určete podle interního postupu.",
    ],
    relatedNode: "c_chest_pain",
    source:
      "https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/first-aid-guidelines",
  },
  {
    id: "adrenaline-als",
    name: "Adrenalin při resuscitaci",
    category: "Resuscitace",
    indication:
      "Srdeční zástava v okamžiku určeném resuscitačním postupem.",
    route: "Do žíly (IV) nebo do kosti (IO)",
    goal: "Podpořit oběh během resuscitace.",
    safety: [
      "Kvůli podání nepřerušujte stlačování hrudníku ani neodkládejte výboj.",
      "Čas a dávku určete podle platného resuscitačního postupu.",
      "Po obnovení oběhu znovu začněte vyšetření od X.",
    ],
    relatedNode: "c_no_pulse",
    source:
      "https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/executive-summary-main-changes-2021-guidelines",
  },
  {
    id: "amiodarone-als",
    name: "Amiodaron při resuscitaci",
    category: "Resuscitace",
    indication:
      "Opakovaně přetrvávající rytmus vhodný k výboji v okamžiku určeném resuscitačním postupem.",
    route: "Do žíly (IV) nebo do kosti (IO)",
    goal: "Pomoci upravit nebezpečný srdeční rytmus.",
    safety: [
      "Nenahrazuje kvalitní stlačování hrudníku, správně nalepené elektrody ani včasný výboj.",
      "Počet výbojů, dávku a opakování určete podle resuscitačního postupu.",
      "Každé podání a každý výboj přesně časově zapište.",
    ],
    relatedNode: "c_no_pulse",
    source:
      "https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/executive-summary-main-changes-2021-guidelines",
  },
  {
    id: "blood-fluids",
    name: "Krevní přípravky nebo náhradní roztok",
    category: "Krvácení",
    indication:
      "Selhávání oběhu kvůli silnému krvácení nebo jiný jasný důvod k doplnění objemu.",
    route: "Do žíly (IV) nebo do kosti (IO)",
    goal: "Podpořit krevní oběh bez zbytečného naředění krve nebo přetížení tekutinou.",
    safety: [
      "Při silném krvácení upřednostněte krevní přípravky, pokud jsou dostupné; náhradní roztok podávejte opatrně.",
      "Potřebné množství se liší při poranění mozku a podle příčiny selhávání oběhu.",
      "Množství a další součásti léčby určete podle interního postupu.",
    ],
    relatedNode: "c_hemorrhagic",
    source:
      "https://www.nice.org.uk/guidance/ng39/chapter/Recommendations",
  },
];
