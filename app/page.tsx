"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ContextBanner,
  CprPanel,
  DeathConfirmationPanel,
  formatDuration,
  InjuryReportPanel,
  NewCallConfirmationPanel,
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
  type Tone,
} from "./guide-data";
import { medications } from "./medication-data";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type HistoryEntry = {
  nodeId: string;
  recordId?: string;
};

type ContextualAction = {
  label: string;
  category: RecordCategory;
  detail?: string;
};

type RecordMetadata = {
  sourceNodeId?: string;
  targetNodeId?: string;
  choiceTone?: Tone;
};

type DeathRequest = {
  afterResuscitation: boolean;
  returnTo: "cpr" | "tools" | "guide";
  elapsedSeconds?: number;
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
  const [showNewCallConfirmation, setShowNewCallConfirmation] = useState(false);
  const [
    returnToReportAfterNewCallCancel,
    setReturnToReportAfterNewCallCancel,
  ] = useState(false);
  const [deathRequest, setDeathRequest] = useState<DeathRequest | null>(null);
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
  const isDeceased = currentId === "deceased";
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
      navigator.serviceWorker
        .register(`${publicBasePath}/sw.js`)
        .catch(() => {
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
    metadata?: RecordMetadata,
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
        ...metadata,
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
    setShowNewCallConfirmation(false);
    setReturnToReportAfterNewCallCancel(false);
    setDeathRequest(null);
    setCallKey((value) => value + 1);
  };

  const requestNewCall = () => {
    if (callStartedAt) {
      setReturnToReportAfterNewCallCancel(false);
      setShowNewCallConfirmation(true);
      return;
    }
    startNewCall();
  };

  const requestNewCallFromReport = () => {
    setReturnToReportAfterNewCallCancel(true);
    setShowReport(false);
    setShowNewCallConfirmation(true);
  };

  const closeNewCallConfirmation = () => {
    setShowNewCallConfirmation(false);
    setReturnToReportAfterNewCallCancel(false);
    if (returnToReportAfterNewCallCancel) {
      setShowReport(true);
    }
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
        undefined,
        {
          sourceNodeId: currentId,
          targetNodeId: target,
          choiceTone: choice.tone ?? "default",
        },
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
    if (choice.target === "deceased") {
      setDeathRequest({
        afterResuscitation: true,
        returnTo: "guide",
      });
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
    if (currentId === "intro" || isDeceased || isLeaving) return;
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
    setShowNewCallConfirmation(false);
    setReturnToReportAfterNewCallCancel(false);
    setDeathRequest(null);
    setIsLeaving(false);
    setCallKey((value) => value + 1);
  };

  const handleRosc = () => {
    setShowCpr(false);
    setHistory([]);
    setCurrentId("x_start");
  };

  const requestDeath = (
    afterResuscitation: boolean,
    returnTo: DeathRequest["returnTo"],
    elapsedSeconds?: number,
  ) => {
    setShowCpr(false);
    setShowTools(false);
    setDeathRequest({ afterResuscitation, returnTo, elapsedSeconds });
  };

  const closeDeathConfirmation = () => {
    const returnTo = deathRequest?.returnTo;
    setDeathRequest(null);
    if (returnTo === "cpr") setShowCpr(true);
    if (returnTo === "tools") setShowTools(true);
  };

  const confirmDeath = () => {
    if (!deathRequest) return;
    const timestamp = currentTimestamp();

    if (deathRequest.afterResuscitation) {
      const duration =
        typeof deathRequest.elapsedSeconds === "number"
          ? `Bez obnovení vlastního oběhu • zaznamenaný čas ${formatDuration(
              deathRequest.elapsedSeconds,
            )}`
          : "Bez obnovení vlastního oběhu";
      createRecord(
        "Úkon",
        "Resuscitace ukončena",
        duration,
        "C",
        false,
        timestamp,
      );
    }

    createRecord(
      "Událost",
      "Osoba zemřela",
      "Úmrtí potvrzeno oprávněnou osobou podle platného postupu",
      undefined,
      false,
      timestamp,
    );
    setDeathRequest(null);
    setShowCpr(false);
    setShowTools(false);
    setHistory([]);
    setCurrentId("deceased");
    setShowReport(true);
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
            if (currentId !== "intro" && !isDeceased) {
              jumpToX("Zahájeno kontrolní XABCDE");
            }
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
            disabled={!callStartedAt || isDeceased}
            title={
              !callStartedAt
                ? "Nejdříve začněte nový výjezd"
                : isDeceased
                  ? "Výjezd je ukončený"
                  : undefined
            }
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
            disabled={currentId === "intro" || isDeceased}
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
            } ${isDeceased ? "deceased-card" : ""}`}
            aria-live="polite"
          >
            <div className="card-accent" aria-hidden="true" />

            {node.complete && (
              <div className="success-orbit" aria-hidden="true">
                <span>{isDeceased ? "—" : "✓"}</span>
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

            {node.complete && (
              <button
                type="button"
                className="complete-new-call-button"
                onClick={requestNewCall}
              >
                <span aria-hidden="true">＋</span>
                <span>
                  <strong>Začít nový záznam</strong>
                  <small>
                    Uzavřít tento výjezd a začít od začátku
                  </small>
                </span>
                <i aria-hidden="true">→</i>
              </button>
            )}
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

      {currentId !== "intro" && !isDeceased && (
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
        canDeclareDeath={Boolean(callStartedAt) && !isDeceased}
        onRequestDeath={() => requestDeath(false, "tools")}
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
        onRequestDeath={(afterResuscitation, elapsedSeconds) =>
          requestDeath(afterResuscitation, "cpr", elapsedSeconds)
        }
      />

      <DeathConfirmationPanel
        open={Boolean(deathRequest)}
        afterResuscitation={Boolean(deathRequest?.afterResuscitation)}
        onClose={closeDeathConfirmation}
        onConfirm={confirmDeath}
      />

      <NewCallConfirmationPanel
        open={showNewCallConfirmation}
        onClose={closeNewCallConfirmation}
        onConfirm={startNewCall}
      />

      <InjuryReportPanel
        key={`report-${callKey}`}
        open={showReport}
        onClose={() => setShowReport(false)}
        onRequestNewCall={requestNewCallFromReport}
        records={records}
        riskFlags={riskFlags}
        startedAt={callStartedAt}
      />
    </main>
  );
}
