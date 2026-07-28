// Static chapter manifest — drives sidebar navigation, home page cards, and load order.
// Content itself lives in /data/<id>.json and is fetched on demand.
const EMS_MANIFEST = [
  { id: "ch01", number: "1", part: "I", title: "Úvod a základní principy", icon: "compass" },
  { id: "ch02", number: "2", part: "I", title: "Vybavení záchranáře EMS", icon: "kit" },
  { id: "ch03", number: "3", part: "I", title: "Diagnostické algoritmy", icon: "chart" },
  { id: "ch04", number: "4", part: "I", title: "Léčebné postupy — zranění a stavy", icon: "bandage" },
  { id: "ch05", number: "5", part: "I", title: "Speciální situace", icon: "flame" },
  { id: "ch06", number: "6", part: "I", title: "Komunikace, dokumentace a předání pacienta", icon: "radio" },
  { id: "ch07", number: "7", part: "I", title: "Psychologie záchranáře a komunikace s pacientem", icon: "brainpsych" },
  { id: "ch08", number: "8", part: "I", title: "Úplný seznam zkratek", icon: "book" },
  { id: "ch09", number: "9", part: "I", title: "Záchranářský tahák — rychlý přehled", icon: "cheatsheet" },
  { id: "ch10A", number: "10A", part: "I", title: "Vybavení nemocničních místností", icon: "building" },
  { id: "ch10", number: "10", part: "II", title: "Struktura americké nemocnice a příjem pacienta", icon: "hospital" },
  { id: "ch11", number: "11", part: "II", title: "Nemocniční péče — úrazy", icon: "bandage" },
  { id: "ch11B", number: "11B", part: "II", title: "Chirurgické postupy", icon: "scalpel" },
  { id: "ch12", number: "12", part: "II", title: "Nemocniční péče — interní stavy", icon: "heart" },
  { id: "ch13", number: "13", part: "II", title: "Speciální nemocniční situace", icon: "clipboard" },
  { id: "ch14", number: "14", part: "II", title: "Jednotka intenzivní péče (JIP / ICU)", icon: "lungs" },
  { id: "ch15", number: "15", part: "II", title: "Propuštění z nemocnice a rehabilitace", icon: "graduation" }
];

const EMS_PARTS = {
  "I": "Přednemocniční péče",
  "II": "Nemocniční péče"
};
