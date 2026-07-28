"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ContextBanner,
  CprPanel,
  InjuryReportPanel,
  ToolsPanel,
  type CaseRecord,
  type RecordCategory,
  type RiskFlag,
} from "./clinical-tools";
import {
  nodes,
  phases,
  type Choice,
  type Phase,
} from "./guide-data";
import { medications } from "./medication-data";

type HistoryEntry = {
  nodeId: string;
  recordId?: string;
};

type ContextualAction = {
  label: string;
  category: RecordCategory;
  detail?: string;
};

const contextualActions: Record<string, ContextualAction[]> = {
  x_arm: [
    {
      label: "Turniket nasazen",
      category: "Úkon",
      detail: "Život ohrožující krvácení z horní končetiny",
    },
  ],
  x_leg: [
    {
      label: "Turniket nasazen",
      category: "Úkon",
      detail: "Život ohrožující krvácení z dolní končetiny",
    },
  ],
  d_seizure: [
    {
      label: "Zahájen čas záchvatu",
      category: "Událost",
    },
  ],
  d_stroke: [
    {
      label: "Zapsán čas naposledy bez příznaků",
      category: "Událost",
      detail: "Naposledy bez příznaků mrtvice",
    },
  ],
  c_chest_pain: [
    {
      label: "Natočeno 12svodové EKG",
      category: "Úkon",
    },
  ],
  e_burn: [
    {
      label: "Zahájeno chlazení popáleniny",
      category: "Úkon",
    },
  ],
};

function getPhaseIndex(phase: Phase) {
  return phases.findIndex((item) => item.id === phase);
}

function currentTimestamp() {
  return Date.now();
}

function makeRecordId(timestamp: number) {
  return `${timestamp}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function Home() {
  const [currentId, setCurrentId] = useState("intro");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [showCpr, setShowCpr] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [records, setRecords] = useState<CaseRecord[]>([]);
  const [riskFlags, setRiskFlags] = useState<RiskFlag[]>([]);
  const [gloveMode, setGloveMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [callStartedAt, setCallStartedAt] = useState<number | null>(null);
  const [callKey, setCallKey] = useState(0);
  const [recentConfirmation, setRecentConfirmation] = useState<string | null>(
    null,
  );
  const cardRef = useRef<HTMLElement>(null);

  const node = nodes[currentId];
  const activePhaseIndex = getPhaseIndex(node.phase);
  const quickActions = contextualActions[currentId] ?? [];
  const suggestedMedications = medications.filter(
    (medication) => medication.relatedNode === currentId,
  );
  const visitedPhases = useMemo(() => {
    const visited = new Set(
      history.map((entry) => nodes[entry.nodeId]?.phase),
    );
    visited.add(node.phase);
    return visited;
  }, [history, node.phase]);

  useEffect(() => {
    if (!isLeaving) {
      cardRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentId, isLeaving]);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    const initialize = window.setTimeout(() => {
      setIsOnline(window.navigator.onLine);
      try {
        setGloveMode(
          window.localStorage.getItem("field-glove-mode") === "enabled",
        );
      } catch {
        // Preference storage is optional.
      }
    }, 0);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline support is progressive and must not block the guide.
      });
    }

    return () => {
      window.clearTimeout(initialize);
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  const createRecord = (
    category: RecordCategory,
    title: string,
    detail?: string,
    phase?: Phase,
    removable = true,
    at?: number,
  ) => {
    const timestamp = at ?? currentTimestamp();
    const id = makeRecordId(timestamp);
    setRecords((previous) => [
      ...previous,
      {
        id,
        at: timestamp,
        category,
        title,
        detail,
        phase,
        removable,
      },
    ]);
    return id;
  };

  const addEvent = (label: string, at?: number) => {
    createRecord("Událost", label, undefined, undefined, true, at);
  };

  const removeRecord = (id: string) => {
    setRecords((previous) => previous.filter((record) => record.id !== id));
  };

  const startNewCall = () => {
    const timestamp = currentTimestamp();
    setRecords([
      {
        id: makeRecordId(timestamp),
        at: timestamp,
        category: "Událost",
        title: "Výjezd zahájen",
        removable: false,
      },
    ]);
    setRiskFlags([]);
    setCallStartedAt(timestamp);
    setHistory([]);
    setCurrentId("x_start");
    setIsLeaving(false);
    setShowCpr(false);
    setShowReport(false);
    setShowTools(false);
    setCallKey((value) => value + 1);
  };

  const requestNewCall = () => {
    if (
      callStartedAt &&
      !window.confirm(
        "Začít nový výjezd? Dosavadní kroky a časová osa budou odstraněny.",
      )
    ) {
      return;
    }
    startNewCall();
  };

  const navigate = (
    target: string,
    choice?: Choice,
    remember = true,
  ) => {
    if (isLeaving || !nodes[target]) return;

    let recordId: string | undefined;
    if (choice) {
      recordId = createRecord(
        "Krok",
        node.title,
        choice.label,
        node.phase,
        false,
      );
    }

    if (target === "c_no_pulse") {
      setShowCpr(true);
    }

    setIsLeaving(true);
    window.setTimeout(() => {
      if (remember) {
        setHistory((previous) => [
          ...previous,
          { nodeId: currentId, recordId },
        ]);
      }
      setCurrentId(target);
      setIsLeaving(false);
    }, 180);
  };

  const handleChoice = (choice: Choice) => {
    if (currentId === "intro" && choice.target === "x_start") {
      startNewCall();
      return;
    }
    navigate(choice.target, choice);
  };

  const goBack = () => {
    if (!history.length || isLeaving) return;
    setIsLeaving(true);
    window.setTimeout(() => {
      const previous = history[history.length - 1];
      setHistory((items) => items.slice(0, -1));
      if (previous.recordId) removeRecord(previous.recordId);
      setCurrentId(previous.nodeId);
      setIsLeaving(false);
    }, 180);
  };

  const jumpToX = (reason: string) => {
    if (currentId === "intro" || isLeaving) return;
    addEvent(reason);
    setIsLeaving(true);
    window.setTimeout(() => {
      setHistory([]);
      setCurrentId("x_start");
      setIsLeaving(false);
    }, 180);
  };

  const changeGloveMode = (enabled: boolean) => {
    setGloveMode(enabled);
    try {
      window.localStorage.setItem(
        "field-glove-mode",
        enabled ? "enabled" : "disabled",
      );
    } catch {
      // Preference storage is optional.
    }
  };

  const endCall = () => {
    setRecords([]);
    setRiskFlags([]);
    setCallStartedAt(null);
    setHistory([]);
    setCurrentId("intro");
    setShowCpr(false);
    setShowReport(false);
    setIsLeaving(false);
    setCallKey((value) => value + 1);
  };

  const handleRosc = () => {
    setShowCpr(false);
    setHistory([]);
    setCurrentId("x_start");
  };

  const confirmMedication = (medication: (typeof medications)[number]) => {
    createRecord(
      "Lék",
      medication.name,
      medication.route,
      node.phase,
      true,
    );
    const confirmationKey = `medication:${medication.id}`;
    setRecentConfirmation(confirmationKey);
    window.setTimeout(
      () =>
        setRecentConfirmation((current) =>
          current === confirmationKey ? null : current,
        ),
      1600,
    );
  };

  const confirmQuickAction = (action: ContextualAction) => {
    createRecord(
      action.category,
      action.label,
      action.detail,
      node.phase,
      true,
    );
    const confirmationKey = `action:${action.label}`;
    setRecentConfirmation(confirmationKey);
    window.setTimeout(
      () =>
        setRecentConfirmation((current) =>
          current === confirmationKey ? null : current,
        ),
      1600,
    );
  };

  return (
    <main
      className={`app-shell ${gloveMode ? "glove-mode" : ""} ${
        isOnline ? "" : "is-offline"
      }`}
    >
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="grid-noise" aria-hidden="true" />

      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => {
            if (currentId !== "intro") jumpToX("Zahájeno kontrolní XABCDE");
          }}
          aria-label="Zahájit kontrolní XABCDE"
        >
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="brand-copy">
            <strong>FIELD</strong>
            <small>PRŮVODCE XABCDE</small>
          </span>
        </button>

        <div className="top-actions">
          <span
            className={`connection-status ${isOnline ? "online" : "offline"}`}
            title={isOnline ? "Připraveno i pro offline použití" : "Offline"}
          >
            <i />
            {isOnline ? "PŘIPRAVENO" : "BEZ SÍTĚ"}
          </span>
          <button
            type="button"
            className="top-tool-button"
            onClick={() => setShowTools(true)}
          >
            <span aria-hidden="true">◷</span>
            <strong>Nástroje</strong>
          </button>
          <button
            type="button"
            className="top-tool-button cpr-top-button"
            onClick={() => setShowCpr(true)}
          >
            <span aria-hidden="true">♥</span>
            <strong>Resuscitace</strong>
          </button>
          <button
            type="button"
            className="top-tool-button new-call-button"
            onClick={requestNewCall}
          >
            <span aria-hidden="true">＋</span>
            <strong>Nový výjezd</strong>
          </button>
          <button
            type="button"
            className="restart-button"
            onClick={() => jumpToX("Zahájeno kontrolní XABCDE")}
            disabled={currentId === "intro"}
          >
            <span className="restart-icon" aria-hidden="true">
              ↻
            </span>
            <span>Nové XABCDE</span>
          </button>
        </div>
      </header>

      <section className="workspace" aria-label="Průvodce XABCDE">
        <nav className="phase-rail" aria-label="Postup XABCDE">
          {phases.map((phase, index) => {
            const isActive = phase.id === node.phase;
            const isPassed =
              index < activePhaseIndex && visitedPhases.has(phase.id);
            return (
              <div
                key={phase.id}
                className={`phase-item ${isActive ? "active" : ""} ${
                  isPassed ? "passed" : ""
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="phase-letter">
                  {isPassed ? <span aria-hidden="true">✓</span> : phase.id}
                </span>
                <span className="phase-label">{phase.label}</span>
              </div>
            );
          })}
        </nav>

        <div className="content-column">
          <div className="mobile-progress" aria-hidden="true">
            <div className="mobile-progress-copy">
              <span>Krok {activePhaseIndex + 1} z 6</span>
              <strong>{node.phase}</strong>
            </div>
            <div className="progress-track">
              <span
                style={{
                  width: `${((activePhaseIndex + 1) / phases.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <ContextBanner flags={riskFlags} phase={node.phase} />

          <article
            key={currentId}
            ref={cardRef}
            tabIndex={-1}
            className={`guide-card ${isLeaving ? "is-leaving" : ""} ${
              node.complete ? "complete-card" : ""
            }`}
            aria-live="polite"
          >
            <div className="card-accent" aria-hidden="true" />

            {node.complete && (
              <div className="success-orbit" aria-hidden="true">
                <span>✓</span>
              </div>
            )}

            <div className="card-heading">
              <div className="kicker-row">
                <span className="phase-chip">{node.phase}</span>
                <p>{node.kicker}</p>
              </div>
              <h1>{node.title}</h1>
              {node.description && (
                <p className="description">{node.description}</p>
              )}
            </div>

            {node.alert && (
              <div className="alert-box">
                <span className="alert-pulse" aria-hidden="true" />
                <p>{node.alert}</p>
              </div>
            )}

            {node.steps && (
              <ol className="action-list">
                {node.steps.map((step, index) => (
                  <li key={step}>
                    <span className="step-number">{index + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            )}

            {node.note && (
              <div className="note-box">
                <span aria-hidden="true">+</span>
                <p>{node.note}</p>
              </div>
            )}

            {!!suggestedMedications.length && (
              <section
                className="medication-suggestions"
                aria-label="Doporučený lék"
              >
                <header>
                  <span>DOPORUČENÝ LÉK</span>
                  <strong>Co lze při tomto nálezu podat</strong>
                </header>
                <div>
                  {suggestedMedications.map((medication) => {
                    const recordedCount = records.filter(
                      (record) =>
                        record.category === "Lék" &&
                        record.title === medication.name,
                    ).length;
                    return (
                      <article key={medication.id}>
                        <span>{medication.category}</span>
                        <h3>{medication.name}</h3>
                        <dl>
                          <div>
                            <dt>Podání</dt>
                            <dd>{medication.route}</dd>
                          </div>
                          <div>
                            <dt>Indikace</dt>
                            <dd>{medication.indication}</dd>
                          </div>
                        </dl>
                        <ul>
                          {medication.safety.slice(0, 2).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          className={`record-action-button ${
                            recordedCount > 0 ? "has-record" : ""
                          } ${
                            recentConfirmation ===
                            `medication:${medication.id}`
                              ? "is-confirmed"
                              : ""
                          }`}
                          onClick={() => confirmMedication(medication)}
                        >
                          <span aria-hidden="true">✓</span>
                          {recentConfirmation ===
                          `medication:${medication.id}`
                            ? "Zapsáno ✓"
                            : "Podáno — zapsat"}
                          {recordedCount > 0 && (
                            <small>Celkem: {recordedCount}×</small>
                          )}
                        </button>
                      </article>
                    );
                  })}
                </div>
                <p>
                  Před podáním ověřte důvod podání, situace, kdy se lék podat
                  nesmí, a správnou dávku podle interního postupu.
                </p>
              </section>
            )}

            {!!quickActions.length && (
              <div className="contextual-event-row" aria-label="Rychlé záznamy">
                {quickActions.map((action) => {
                  const recordedCount = records.filter(
                    (record) => record.title === action.label,
                  ).length;
                  const isConfirmed =
                    recentConfirmation === `action:${action.label}`;
                  return (
                    <button
                      type="button"
                      key={action.label}
                      className={`${recordedCount ? "has-record" : ""} ${
                        isConfirmed ? "is-confirmed" : ""
                      }`}
                      onClick={() => confirmQuickAction(action)}
                    >
                      <span aria-hidden="true">
                        {recordedCount ? "✓" : "◷"}
                      </span>
                      {isConfirmed
                        ? "Zapsáno ✓"
                        : `Zapsat: ${action.label}`}
                      {recordedCount > 0 && <small>{recordedCount}×</small>}
                    </button>
                  );
                })}
              </div>
            )}

            {node.complete && (
              <button
                type="button"
                className="report-open-button"
                onClick={() => setShowReport(true)}
              >
                <span aria-hidden="true">▤</span>
                <strong>Vygenerovat záznam o zraněné osobě</strong>
                <small>
                  Doplnit základní údaje a zkopírovat celý průběh
                </small>
              </button>
            )}

            <div
              className={`choice-grid ${
                node.choices.length === 1 ? "single-choice" : ""
              }`}
            >
              {node.choices.map((choice) => (
                <button
                  type="button"
                  key={`${choice.label}-${choice.target}`}
                  className={`choice-button tone-${choice.tone ?? "default"}`}
                  onClick={() => handleChoice(choice)}
                >
                  <span className="choice-copy">
                    <strong>{choice.label}</strong>
                    {choice.helper && <small>{choice.helper}</small>}
                  </span>
                  <span className="choice-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              ))}
            </div>
          </article>

          <div className="below-card">
            <button
              type="button"
              className="back-button"
              onClick={goBack}
              disabled={!history.length}
            >
              <span aria-hidden="true">←</span> Předchozí krok
            </button>
            <button
              type="button"
              className="case-summary-button"
              onClick={() => setShowTools(true)}
            >
              {records.length
                ? `${records.length} záznamů ve výjezdu`
                : "Otevřít časovou osu"}
            </button>
            <p>Dávkování se řídí platným interním protokolem.</p>
          </div>
        </div>
      </section>

      {currentId !== "intro" && (
        <button
          type="button"
          className="deterioration-button"
          onClick={() => jumpToX("Zhoršení stavu — zahájeno nové XABCDE")}
        >
          <span aria-hidden="true">!</span>
          <strong>Osoba se zhoršila</strong>
          <small>Okamžitě znovu od X</small>
        </button>
      )}

      <footer>
        <span>FIELD • XABCDE • FUNGUJE I BEZ SÍTĚ</span>
        <button type="button" onClick={requestNewCall}>
          Začít nový výjezd
        </button>
      </footer>

      <ToolsPanel
        open={showTools}
        onClose={() => setShowTools(false)}
        records={records}
        addEvent={addEvent}
        removeRecord={removeRecord}
        flags={riskFlags}
        onFlagsChange={setRiskFlags}
        gloveMode={gloveMode}
        onGloveModeChange={changeGloveMode}
        onEndCall={endCall}
      />

      <CprPanel
        key={callKey}
        open={showCpr}
        onClose={() => setShowCpr(false)}
        onRecord={(category, title, detail) =>
          createRecord(category, title, detail, undefined, true)
        }
        onRosc={handleRosc}
      />

      <InjuryReportPanel
        key={`report-${callKey}`}
        open={showReport}
        onClose={() => setShowReport(false)}
        records={records}
        riskFlags={riskFlags}
        startedAt={callStartedAt}
      />
    </main>
  );
}
