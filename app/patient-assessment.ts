export type AssessmentSourceRecord = {
  at: number;
  category: string;
  title: string;
  detail?: string;
  sourceNodeId?: string;
  targetNodeId?: string;
};

export type PatientAssessmentItem = {
  label: string;
  value: string;
};

export type PatientAssessment = {
  outcome: string;
  items: PatientAssessmentItem[];
  isDeceased: boolean;
  endedAt?: number;
};

type AssessmentState = {
  bleeding?: string;
  airway?: string;
  breathing?: string;
  circulation?: string;
  consciousness?: string;
  neurology?: string;
  outcome?: string;
  isDeceased: boolean;
  endedAt?: number;
};

type TransitionUpdate = Partial<Omit<AssessmentState, "isDeceased">>;

const transitions: Record<string, TransitionUpdate> = {
  "x_start>a_start": {
    bleeding: "Bez zjištěného život ohrožujícího zevního krvácení.",
  },
  "x_start>x_source": {
    bleeding: "Bylo zjištěno život ohrožující zevní krvácení.",
  },
  "x_control>a_start": {
    bleeding: "Život ohrožující krvácení bylo po ošetření zastaveno.",
  },
  "x_control>x_failure": {
    bleeding: "Krvácení pokračovalo i po prvním ošetření.",
  },
  "x_failure>a_start": {
    bleeding: "Krvácení bylo po zesílení ošetření zastaveno.",
  },
  "x_failure>x_uncontrolled": {
    bleeding: "Krvácení se nepodařilo zastavit.",
  },
  "x_uncontrolled>a_start": {
    bleeding: "Krvácení zůstalo nezastavené během dalšího vyšetření.",
  },

  "a_start>b_start": {
    airway: "Dýchací cesty byly při kontrole volné.",
  },
  "a_start>a_partial": {
    airway: "Bylo zjištěno částečné ucpání dýchacích cest.",
  },
  "a_start>a_complete": {
    airway: "Bylo zjištěno úplné ucpání dýchacích cest.",
  },
  "a_start>a_spine": {
    airway: "Dýchací cesty byly řešeny s ohledem na možné poranění krku.",
  },
  "a_start>a_unconscious": {
    airway: "Osoba byla v bezvědomí a ochrana dýchacích cest byla nejistá.",
  },
  "a_unconscious>b_start": {
    airway:
      "Osoba byla v bezvědomí, ale dýchací cesty zůstaly průchodné a dýchání bylo dostatečné.",
  },
  "a_unconscious>a_escalate": {
    airway:
      "Osoba nedokázala bezpečně chránit dýchací cesty a byla nutná jejich další podpora.",
  },
  "a_spine>b_start": {
    airway: "Dýchací cesty zůstaly průchodné při ochraně krku.",
  },
  "a_spine>a_escalate": {
    airway: "Dýchací cesty zůstaly neprůchodné a vyžadovaly další podporu.",
  },
  "a_escalate>b_start": {
    airway: "Dýchací cesty byly zajištěny.",
  },
  "a_escalate>b_apnoea": {
    airway: "Zajištění dýchacích cest nebylo dostatečné; pokračovala podpora dýchání.",
  },
  "a_control>b_start": {
    airway: "Dýchací cesty byly po ošetření průchodné.",
  },
  "a_control>a_escalate": {
    airway: "Dýchací cesty zůstaly po prvním ošetření neprůchodné.",
  },

  "b_start>c_start": {
    breathing: "Dýchání bylo účinné a bez zjevné poruchy.",
  },
  "b_start>b_slow": {
    breathing: "Dýchání bylo pomalé nebo mělké.",
  },
  "b_start>b_fast": {
    breathing: "Dýchání bylo rychlé nebo namáhavé.",
  },
  "b_start>b_bronchospasm": {
    breathing: "Bylo přítomné pískání nebo stažení průdušek.",
  },
  "b_start>b_low_spo2": {
    breathing: "Bylo zjištěno nízké okysličení nebo modrání.",
  },
  "b_start>b_apnoea": {
    breathing: "Osoba nedýchala.",
  },
  "b_start>b_asymmetry": {
    breathing: "Hrudník se při dýchání nezvedal stejně.",
  },
  "b_start>b_chest_wound": {
    breathing: "Byla zjištěna rána na hrudníku.",
  },
  "b_apnoea>b_ventilate": {
    breathing: "Osoba nedýchala, ale puls byl přítomen; bylo zahájeno dýchání za osobu.",
  },
  "b_apnoea>c_no_pulse": {
    breathing: "Osoba nedýchala a puls nebyl jistě přítomen.",
    circulation: "Byla zjištěna zástava oběhu.",
  },
  "b_ventilate>b_control": {
    breathing: "Po podpoře se obnovilo vlastní dýchání.",
  },
  "b_ventilate>c_no_pulse": {
    breathing: "Osoba nedýchala.",
    circulation: "Při podpoře dýchání došlo ke ztrátě pulsu.",
  },
  "b_control>c_start": {
    breathing: "Dýchání bylo po ošetření dostatečné nebo se zlepšovalo.",
  },
  "b_control>b_start": {
    breathing: "Dýchání zůstalo nedostatečné nebo se zhoršovalo.",
  },

  "c_start>d_start": {
    circulation: "Krevní oběh byl bez zjevných známek selhávání.",
  },
  "c_start>c_chest_pain": {
    circulation: "Krevní oběh byl přijatelný, přetrvávala bolest na hrudi.",
  },
  "c_start>c_unstable": {
    circulation: "Puls byl přítomen, ale krevní oběh nebyl dostatečný.",
  },
  "c_start>c_no_pulse": {
    circulation: "Byla zjištěna zástava oběhu.",
  },
  "c_control>d_start": {
    circulation: "Krevní oběh se po ošetření stabilizoval nebo zlepšil.",
  },
  "c_control>c_unstable": {
    circulation:
      "Krevní oběh zůstal nestabilní a bylo nutné pokračovat v léčbě během transportu.",
  },
  "c_no_pulse>x_start": {
    circulation: "Vlastní krevní oběh se obnovil.",
  },

  "d_start>d_neuro": {
    consciousness: "Osoba byla bdělá a orientovaná.",
  },
  "d_start>d_altered": {
    consciousness: "Osoba reagovala pouze na hlas nebo bolest.",
  },
  "d_start>d_unresponsive": {
    consciousness: "Osoba nereagovala.",
  },
  "d_unresponsive>d_neuro": {
    consciousness: "Osoba nereagovala, ale puls a dýchání byly zachované.",
  },
  "d_unresponsive>c_no_pulse": {
    consciousness: "Osoba nereagovala.",
    circulation: "Nebyl přítomen puls nebo normální dýchání.",
  },
  "d_neuro>d_stroke": {
    neurology: "Byla zjištěna jednostranná slabost nebo porucha řeči.",
  },
  "d_neuro>d_seizure": {
    neurology: "Probíhal nebo se opakoval záchvat.",
  },
  "d_neuro>d_pupils": {
    neurology: "Pohyb obou stran byl stejný a bez probíhajících křečí.",
  },
  "d_pupils>e_start": {
    neurology: "Zornice byly stejné a reagovaly.",
  },
  "d_seizure>d_pupils": {
    neurology: "Záchvat ustal.",
  },

  "e_decision>e_critical": {
    outcome: "Kritický nebo časově závislý stav.",
  },
  "e_decision>e_stable": {
    outcome: "Stabilní stav po prvním vyšetření.",
  },
  "e_decision>e_refusal": {
    outcome: "Osoba odmítla péči nebo transport.",
  },
  "e_refusal>e_critical": {
    outcome: "Kritický nebo časově závislý stav.",
  },
  "e_refusal>e_stable": {
    outcome: "Stabilní stav po prvním vyšetření.",
  },
};

export function buildPatientAssessment(
  records: AssessmentSourceRecord[],
): PatientAssessment {
  const state: AssessmentState = { isDeceased: false };
  const sorted = [...records].sort((a, b) => a.at - b.at);

  for (const record of sorted) {
    if (record.sourceNodeId && record.targetNodeId) {
      Object.assign(
        state,
        transitions[`${record.sourceNodeId}>${record.targetNodeId}`] ?? {},
      );
    }

    if (record.title === "Zahájena resuscitace") {
      state.circulation = "Probíhala resuscitace pro zástavu oběhu.";
    }

    if (record.title === "Obnoven vlastní krevní oběh") {
      state.circulation = "Vlastní krevní oběh se po resuscitaci obnovil.";
    }

    if (record.title === "Osoba zemřela") {
      state.isDeceased = true;
      state.endedAt = record.at;
      state.outcome = "Osoba zemřela.";
      state.circulation = sorted.some(
        (item) =>
          item.at <= record.at && item.title === "Resuscitace ukončena",
      )
        ? "Resuscitace byla ukončena bez obnovení vlastního oběhu."
        : "Úmrtí bylo potvrzeno podle platného postupu.";
    }
  }

  const items: PatientAssessmentItem[] = [
    state.bleeding && { label: "Krvácení", value: state.bleeding },
    state.airway && { label: "Dýchací cesty", value: state.airway },
    state.breathing && { label: "Dýchání", value: state.breathing },
    state.circulation && { label: "Krevní oběh", value: state.circulation },
    state.consciousness && { label: "Vědomí", value: state.consciousness },
    state.neurology && { label: "Pohyb a nervové funkce", value: state.neurology },
  ].filter((item): item is PatientAssessmentItem => Boolean(item));

  return {
    outcome:
      state.outcome ??
      (items.length
        ? "Stav byl zhodnocen podle zaznamenaných voleb."
        : "Průvodce zatím neobsahuje dostatek voleb pro zhodnocení."),
    items,
    isDeceased: state.isDeceased,
    endedAt: state.endedAt,
  };
}
