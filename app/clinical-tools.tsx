"use client";

import { useEffect, useMemo, useState } from "react";
import type { Phase } from "./guide-data";

export type RecordCategory = "Krok" | "Úkon" | "Lék" | "Událost";

export type CaseRecord = {
  id: string;
  at: number;
  category: RecordCategory;
  title: string;
  detail?: string;
  phase?: Phase;
  removable?: boolean;
};

export type RiskFlag =
  | "pregnancy"
  | "older"
  | "anticoagulated"
  | "burn";

const riskOptions: Array<{
  id: RiskFlag;
  label: string;
  helper: string;
}> = [
  {
    id: "pregnancy",
    label: "Těhotenství",
    helper: "Jiná poloha těla a včasná konzultace",
  },
  {
    id: "older",
    label: "Vyšší věk / křehkost",
    helper: "Menší odolnost, neobvyklé projevy a více užívaných léků",
  },
  {
    id: "anticoagulated",
    label: "Léky na ředění krve",
    helper: "Zjistit název, důvod a čas poslední dávky",
  },
  {
    id: "burn",
    label: "Popálení / chemická látka",
    helper: "Odstranění látky, dýchání, chlazení a teplo",
  },
];

const riskLabels: Record<RiskFlag, string> = {
  pregnancy: "Těhotenství",
  older: "Vyšší věk / křehkost",
  anticoagulated: "Léky na ředění krve",
  burn: "Popálení / chemická látka",
};

const contextTips: Record<RiskFlag, Partial<Record<Phase, string>>> = {
  pregnancy: {
    A: "Zajištění dýchacích cest může být obtížnější. Včas přivolejte zkušenou pomoc.",
    B: "Pečlivě sledujte okysličení a dýchání a při zhoršení rychle pomozte.",
    C: "V pokročilém těhotenství podle interního postupu posuňte dělohu doleva nebo tělo mírně nakloňte na levý bok.",
    D: "Při křečích nebo vysokém tlaku myslete na závažnou těhotenskou komplikaci a kontaktujte porodnické pracoviště.",
    E: "Zjistěte týden těhotenství, krvácení, bolest a pohyby plodu. Informujte vhodné cílové pracoviště.",
    X: "Krvácení může být zevní i porodnické; neodkládejte časnou konzultaci a transport.",
  },
  older: {
    X: "I zdánlivě menší úraz může způsobit závažné krvácení nebo zlomeniny.",
    A: "Zkontrolujte zubní náhrady a zjistěte obvyklý stav vědomí.",
    B: "Chronické plicní onemocnění nesmí zakrýt novou akutní poruchu dýchání.",
    C: "Normální tlak nevylučuje selhávání oběhu. Sledujte vývoj, užívané léky a obvyklé hodnoty.",
    D: "Zjistěte obvyklou kognici, soběstačnost a možné delirium.",
    E: "Hledejte křehkost, kožní poranění a následky pádu.",
  },
  anticoagulated: {
    X: "Zjistěte název léku, proč jej osoba užívá a čas poslední dávky. Silné krvácení včas oznamte cílovému pracovišti.",
    A: "Krev v dýchacích cestách může rychle zhoršit průchodnost; připravte odsávání.",
    B: "Myslete na skryté krvácení do hrudníku i po zdánlivě menším úrazu.",
    C: "Včas zahajte postup pro silné krvácení a informujte cílové pracoviště o léku na ředění krve.",
    D: "Po úrazu hlavy buďte obzvlášť opatrní a sledujte změny vědomí.",
    E: "Důsledně hledejte velké modřiny a skryté krvácení. Zapište název léku na ředění krve.",
  },
  burn: {
    X: "Zastavte hoření a současně řešte případné krvácení nebo jiné poranění.",
    A: "Hledejte saze, změnu hlasu, vdechnutí kouře a zvětšující se otok. Dýchací cesty řešte včas.",
    B: "Při vdechnutí kouře nebo podezření na oxid uhelnatý (CO) podejte kyslík. Běžné měření okysličení (SpO₂) otravu CO nevylučuje.",
    C: "Velké popálení vyžaduje opatrné podávání tekutin a častou kontrolu stavu.",
    D: "Porucha vědomí může být z nedostatku kyslíku, kouře, úrazu nebo otravy.",
    E: "Popálené místo chlaďte, ale celé tělo udržujte v teple.",
  },
};

const quickEventLabels = [
  "Příjezd k osobě",
  "Čas úrazu / začátku potíží",
  "Turniket",
  "Začátek záchvatu",
  "Čas naposledy bez příznaků mrtvice",
  "Odjezd z místa",
];

const pickupLocations = [
  "Los Santos",
  "Sandy Shores",
  "Paleto Bay",
  "Grapeseed",
  "Harmony",
  "Chumash",
  "Mount Chiliad",
];

export function formatClock(timestamp: number) {
  return new Intl.DateTimeFormat("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}

export function formatDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function toLocalDateTime(timestamp: number) {
  const date = new Date(timestamp - new Date().getTimezoneOffset() * 60_000);
  return date.toISOString().slice(0, 16);
}

function formatReportDate(timestamp: number) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}

function ModalShell({
  open,
  title,
  kicker,
  className = "",
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  kicker: string;
  className?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`info-modal tool-modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Zavřít"
        >
          ×
        </button>
        <span className="modal-kicker">{kicker}</span>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}

export function ContextBanner({
  flags,
  phase,
}: {
  flags: RiskFlag[];
  phase: Phase;
}) {
  const activeTips = flags
    .map((flag) => ({
      flag,
      label: riskLabels[flag],
      tip: contextTips[flag][phase],
    }))
    .filter((item) => item.tip);

  if (!activeTips.length) return null;

  return (
    <aside className="context-banner" aria-label="Aktivní rizikový kontext">
      {activeTips.map((item) => (
        <div key={item.flag}>
          <strong>{item.label}</strong>
          <span>{item.tip}</span>
        </div>
      ))}
    </aside>
  );
}

export function ToolsPanel({
  open,
  onClose,
  records,
  addEvent,
  removeRecord,
  flags,
  onFlagsChange,
  gloveMode,
  onGloveModeChange,
  onEndCall,
}: {
  open: boolean;
  onClose: () => void;
  records: CaseRecord[];
  addEvent: (label: string, at?: number) => void;
  removeRecord: (id: string) => void;
  flags: RiskFlag[];
  onFlagsChange: (flags: RiskFlag[]) => void;
  gloveMode: boolean;
  onGloveModeChange: (enabled: boolean) => void;
  onEndCall: () => void;
}) {
  const [tab, setTab] = useState<"time" | "context">("time");
  const [eventLabel, setEventLabel] = useState("");
  const [eventAt, setEventAt] = useState("");
  const [now, setNow] = useState(0);
  const [confirmedEvent, setConfirmedEvent] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const initialize = window.setTimeout(() => {
      const timestamp = Date.now();
      setEventAt(toLocalDateTime(timestamp));
      setNow(timestamp);
    }, 0);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(initialize);
      window.clearInterval(timer);
    };
  }, [open]);

  const toggleFlag = (flag: RiskFlag) => {
    onFlagsChange(
      flags.includes(flag)
        ? flags.filter((item) => item !== flag)
        : [...flags, flag],
    );
  };

  const addAndConfirm = (label: string, at?: number, key = label) => {
    addEvent(label, at);
    setConfirmedEvent(key);
    window.setTimeout(
      () =>
        setConfirmedEvent((current) => (current === key ? null : current)),
      1600,
    );
  };

  const endCall = () => {
    if (
      !window.confirm(
        "Ukončit tento výjezd a odstranit jeho časovou osu a provedené kroky?",
      )
    ) {
      return;
    }
    onEndCall();
    onClose();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      kicker="NÁSTROJE"
      title="Časová osa a zvláštní okolnosti"
      className="wide-modal"
    >
      <div className="tool-tabs two-tabs" role="tablist" aria-label="Nástroje">
        <button
          type="button"
          className={tab === "time" ? "active" : ""}
          onClick={() => setTab("time")}
        >
          Časová osa
        </button>
        <button
          type="button"
          className={tab === "context" ? "active" : ""}
          onClick={() => setTab("context")}
        >
          Zvláštní okolnosti
        </button>
      </div>

      {tab === "time" && (
        <div className="tool-section">
          <p className="tool-intro">
            Kroky vyšetření se zaznamenávají automaticky. Zde lze doplnit další
            důležitou událost s přesným časem.
          </p>
          <div className="quick-event-grid">
            {quickEventLabels.map((label) => {
              const recordedCount = records.filter(
                (record) => record.title === label,
              ).length;
              const isConfirmed = confirmedEvent === label;
              return (
                <button
                  type="button"
                  key={label}
                  className={`${recordedCount ? "has-record" : ""} ${
                    isConfirmed ? "is-confirmed" : ""
                  }`}
                  onClick={() => addAndConfirm(label)}
                >
                  <span>{recordedCount ? "✓" : "＋"}</span>
                  {isConfirmed ? "Zapsáno ✓" : label}
                  {recordedCount > 0 && <small>{recordedCount}×</small>}
                </button>
              );
            })}
          </div>
          <div className="custom-event-row">
            <label>
              Vlastní událost
              <input
                value={eventLabel}
                onChange={(event) => setEventLabel(event.target.value)}
                placeholder="Např. aplikace pánevního pásu"
              />
            </label>
            <label>
              Datum a čas
              <input
                type="datetime-local"
                value={eventAt}
                onChange={(event) => setEventAt(event.target.value)}
              />
            </label>
            <button
              type="button"
              className={`primary-tool-button ${
                confirmedEvent === "custom" ? "is-confirmed" : ""
              }`}
              disabled={!eventLabel.trim() || !eventAt}
              onClick={() => {
                addAndConfirm(
                  eventLabel.trim(),
                  new Date(eventAt).getTime(),
                  "custom",
                );
                setEventLabel("");
                setEventAt(toLocalDateTime(Date.now()));
              }}
            >
              {confirmedEvent === "custom" ? "Zapsáno ✓" : "Přidat"}
            </button>
          </div>
          <div className="timeline-list">
            {!records.length && <p>Zatím není zaznamenaná žádná událost.</p>}
            {[...records]
              .sort((a, b) => b.at - a.at)
              .map((record) => (
                <div key={record.id} className="timeline-item">
                  <time>{formatClock(record.at)}</time>
                  <span>
                    <strong>{record.phase ? `${record.phase} • ` : ""}</strong>
                    {record.title}
                    {record.detail ? ` — ${record.detail}` : ""}
                  </span>
                  <small>{formatDuration((now - record.at) / 1000)}</small>
                  {record.removable ? (
                    <button
                      type="button"
                      onClick={() => removeRecord(record.id)}
                      aria-label={`Odstranit ${record.title}`}
                    >
                      ×
                    </button>
                  ) : (
                    <i aria-hidden="true">•</i>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {tab === "context" && (
        <div className="tool-section">
          <p className="tool-intro">
            Vybraná okolnost přidá ke každému písmenu krátké upozornění pro
            danou osobu.
          </p>
          <div className="risk-grid">
            {riskOptions.map((option) => {
              const active = flags.includes(option.id);
              return (
                <button
                  type="button"
                  key={option.id}
                  className={active ? "active" : ""}
                  aria-pressed={active}
                  onClick={() => toggleFlag(option.id)}
                >
                  <span>{active ? "✓" : "+"}</span>
                  <strong>{option.label}</strong>
                  <small>{option.helper}</small>
                </button>
              );
            })}
          </div>
          <label className="mode-toggle">
            <span>
              <strong>Režim pro rukavice</strong>
              <small>Větší ovládací prvky a vyšší kontrast</small>
            </span>
            <input
              type="checkbox"
              checked={gloveMode}
              onChange={(event) => onGloveModeChange(event.target.checked)}
            />
          </label>
          <button type="button" className="end-case-button" onClick={endCall}>
            Ukončit výjezd a smazat data
          </button>
        </div>
      )}
    </ModalShell>
  );
}

export function CprPanel({
  open,
  onClose,
  onRecord,
  onRosc,
}: {
  open: boolean;
  onClose: () => void;
  onRecord: (
    category: RecordCategory,
    title: string,
    detail?: string,
  ) => void;
  onRosc: () => void;
}) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [shocks, setShocks] = useState(0);
  const [confirmedAction, setConfirmedAction] = useState<string | null>(null);
  const [actionCounts, setActionCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!startedAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  const elapsed = startedAt ? Math.floor((now - startedAt) / 1000) : 0;
  const cycleElapsed = elapsed % 120;
  const cycleRemaining =
    cycleElapsed === 0 && elapsed > 0 ? 0 : 120 - cycleElapsed;

  const start = () => {
    const timestamp = Date.now();
    setStartedAt(timestamp);
    setNow(timestamp);
    onRecord("Úkon", "Zahájena resuscitace");
  };

  const showConfirmation = (key: string) => {
    setConfirmedAction(key);
    window.setTimeout(
      () =>
        setConfirmedAction((current) => (current === key ? null : current)),
      1600,
    );
  };

  const recordAction = (
    key: string,
    category: RecordCategory,
    title: string,
    detail?: string,
  ) => {
    onRecord(category, title, detail);
    setActionCounts((previous) => ({
      ...previous,
      [key]: (previous[key] ?? 0) + 1,
    }));
    showConfirmation(key);
  };

  const logShock = () => {
    const next = shocks + 1;
    setShocks(next);
    onRecord("Úkon", "Výboj defibrilátoru", `Pořadí: ${next}`);
    showConfirmation("shock");
  };

  const rosc = () => {
    onRecord("Úkon", "Obnoven vlastní krevní oběh");
    setStartedAt(null);
    setShocks(0);
    onRosc();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      kicker="DOSPĚLÝ • RESUSCITACE"
      title="Resuscitace"
      className="wide-modal cpr-modal"
    >
      {!startedAt ? (
        <div className="cpr-start">
          <div className="cpr-priorities">
            <span>1</span>
            <p>Rozpoznat zástavu, přivolat pomoc a začít stlačovat hrudník.</p>
            <span>2</span>
            <p>Připojit defibrilátor a řídit se zobrazeným srdečním rytmem.</p>
            <span>3</span>
            <p>Hledat napravitelné příčiny a co nejméně přerušovat stlačování.</p>
          </div>
          <button type="button" className="cpr-start-button" onClick={start}>
            Zahájit časovač resuscitace
          </button>
        </div>
      ) : (
        <>
          <div className="cpr-dashboard">
            <div className="cpr-time">
              <span>CELKOVÝ ČAS</span>
              <strong>{formatDuration(elapsed)}</strong>
            </div>
            <div className="cycle-time">
              <span>DALŠÍ 2MIN KONTROLA</span>
              <strong>{formatDuration(cycleRemaining)}</strong>
              <div>
                <span style={{ width: `${(cycleElapsed / 120) * 100}%` }} />
              </div>
            </div>
            <div className="shock-count">
              <span>VÝBOJE</span>
              <strong>{shocks}</strong>
            </div>
          </div>

          <div className="cpr-actions">
            <button
              type="button"
              className={`${actionCounts.rhythm ? "has-record" : ""} ${
                confirmedAction === "rhythm" ? "is-confirmed" : ""
              }`}
              onClick={() =>
                recordAction(
                  "rhythm",
                  "Úkon",
                  "Zkontrolován srdeční rytmus",
                )
              }
            >
              {confirmedAction === "rhythm"
                ? "Zapsáno ✓"
                : "Kontrola rytmu"}
              {!!actionCounts.rhythm && <small>{actionCounts.rhythm}×</small>}
            </button>
            <button
              type="button"
              className={`shock-button ${shocks ? "has-record" : ""} ${
                confirmedAction === "shock" ? "is-confirmed" : ""
              }`}
              onClick={logShock}
            >
              {confirmedAction === "shock" ? "Zapsáno ✓" : "Zapsat výboj"}
              {!!shocks && <small>{shocks}×</small>}
            </button>
            <button
              type="button"
              className={`${actionCounts.adrenaline ? "has-record" : ""} ${
                confirmedAction === "adrenaline" ? "is-confirmed" : ""
              }`}
              onClick={() =>
                recordAction(
                  "adrenaline",
                  "Lék",
                  "Adrenalin při resuscitaci",
                  "Do žíly (IV) nebo do kosti (IO)",
                )
              }
            >
              {confirmedAction === "adrenaline"
                ? "Zapsáno ✓"
                : "Adrenalin IV/IO"}
              {!!actionCounts.adrenaline && (
                <small>{actionCounts.adrenaline}×</small>
              )}
            </button>
            <button
              type="button"
              className={`${actionCounts.amiodarone ? "has-record" : ""} ${
                confirmedAction === "amiodarone" ? "is-confirmed" : ""
              }`}
              onClick={() =>
                recordAction(
                  "amiodarone",
                  "Lék",
                  "Amiodaron při resuscitaci",
                  "Do žíly (IV) nebo do kosti (IO)",
                )
              }
            >
              {confirmedAction === "amiodarone"
                ? "Zapsáno ✓"
                : "Amiodaron IV/IO"}
              {!!actionCounts.amiodarone && (
                <small>{actionCounts.amiodarone}×</small>
              )}
            </button>
            <button
              type="button"
              className={`${actionCounts.airway ? "has-record" : ""} ${
                confirmedAction === "airway" ? "is-confirmed" : ""
              }`}
              onClick={() =>
                recordAction(
                  "airway",
                  "Úkon",
                  "Zajištěny dýchací cesty a kontrolován vydechovaný CO₂",
                )
              }
            >
              {confirmedAction === "airway"
                ? "Zapsáno ✓"
                : "Dýchací cesty / CO₂"}
              {!!actionCounts.airway && <small>{actionCounts.airway}×</small>}
            </button>
            <button type="button" className="rosc-button" onClick={rosc}>
              Obnoven oběh
            </button>
          </div>

          <div className="reversible-causes">
            <div>
              <strong>TĚLO</strong>
              <span>Nedostatek kyslíku</span>
              <span>Velká ztráta krve nebo tekutin</span>
              <span>Porucha minerálů nebo látkové přeměny</span>
              <span>Silné prochladnutí</span>
            </div>
            <div>
              <strong>PŘEKÁŽKA</strong>
              <span>Přetlak vzduchu v hrudníku</span>
              <span>Tlak tekutiny kolem srdce</span>
              <span>Otrava nebo předávkování</span>
              <span>Krevní sraženina v srdci nebo plicích</span>
            </div>
          </div>
          <div className="modal-warning cpr-warning">
            Načasování léčiv, energie výboje a další postup se řídí platným
            interním protokolem. Časovač nenahrazuje vedoucího týmu ani
            defibrilátor.
          </div>
        </>
      )}
    </ModalShell>
  );
}

export function InjuryReportPanel({
  open,
  onClose,
  records,
  riskFlags,
  startedAt,
}: {
  open: boolean;
  onClose: () => void;
  records: CaseRecord[];
  riskFlags: RiskFlag[];
  startedAt: number | null;
}) {
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [location, setLocation] = useState("");
  const [generatedAt, setGeneratedAt] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const resetGenerated = window.setTimeout(() => {
      setGeneratedAt(null);
      setCopied(false);
    }, 0);
    return () => window.clearTimeout(resetGenerated);
  }, [open]);

  const report = useMemo(() => {
    if (!generatedAt) return "";
    const sorted = [...records].sort((a, b) => a.at - b.at);
    const chronology = sorted.length
      ? sorted
          .map((record) => {
            const phase = record.phase ? `[${record.phase}] ` : "";
            const detail = record.detail ? ` — ${record.detail}` : "";
            return `• ${formatClock(record.at)} | ${phase}${record.title}${detail}`;
          })
          .join("\n")
      : "• Bez zaznamenaných kroků.";
    const medications = sorted.filter((record) => record.category === "Lék");
    const medicationList = medications.length
      ? medications
          .map(
            (record) =>
              `• ${formatClock(record.at)} | ${record.title}${
                record.detail ? ` — ${record.detail}` : ""
              }`,
          )
          .join("\n")
      : "• Bez zaznamenaného podání.";
    const duration = startedAt
      ? formatDuration((generatedAt - startedAt) / 1000)
      : "Nezjištěna";

    return [
      "**ZÁZNAM O ZRANĚNÉ OSOBĚ**",
      "",
      `**Jméno:** ${name.trim() || "Nezjištěno"}`,
      `**Pohlaví:** ${sex}`,
      `**Místo převzetí:** ${location}`,
      `**Zahájení výjezdu:** ${
        startedAt ? formatReportDate(startedAt) : "Nezjištěno"
      }`,
      `**Doba zaznamenané péče:** ${duration}`,
      `**Zvláštní okolnosti:** ${
        riskFlags.length
          ? riskFlags.map((flag) => riskLabels[flag]).join(", ")
          : "Bez označených zvláštních okolností"
      }`,
      "",
      "**PRŮBĚH VYŠETŘENÍ A OŠETŘENÍ**",
      chronology,
      "",
      "**PODANÉ LÉKY**",
      medicationList,
      "",
      `**Záznam vytvořen:** ${formatReportDate(generatedAt)}`,
    ].join("\n");
  }, [generatedAt, location, name, records, riskFlags, sex, startedAt]);

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      kicker="ZÁVĚR VÝJEZDU"
      title="Vygenerovat záznam o zraněné osobě"
      className="wide-modal report-modal"
    >
      {!generatedAt ? (
        <div className="report-form">
          <p className="tool-intro">
            Jméno je volitelné. Pohlaví a místo převzetí jsou pro vytvoření
            záznamu povinné.
          </p>
          <label>
            Jméno osoby — volitelné
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Při neznámé totožnosti ponechte prázdné"
            />
          </label>
          <fieldset>
            <legend>Pohlaví osoby</legend>
            <div className="report-option-grid">
              {["Muž", "Žena", "Nezjištěno"].map((option) => (
                <button
                  type="button"
                  key={option}
                  className={sex === option ? "active" : ""}
                  onClick={() => setSex(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Oblast převzetí osoby</legend>
            <div className="report-option-grid locations">
              {pickupLocations.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={location === option ? "active" : ""}
                  onClick={() => setLocation(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
          <button
            type="button"
            className="primary-tool-button full-width generate-report-button"
            disabled={!sex || !location}
            onClick={() => setGeneratedAt(Date.now())}
          >
            Vygenerovat záznam
          </button>
        </div>
      ) : (
        <div className="generated-report">
          <pre>{report}</pre>
          <div className="report-actions">
            <button
              type="button"
              className="primary-tool-button"
              onClick={copyReport}
            >
              {copied ? "Zkopírováno" : "Zkopírovat záznam"}
            </button>
            <button type="button" onClick={() => setGeneratedAt(null)}>
              Upravit údaje
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
