export const TUNING_PRESETS: Record<string, {
  name: string;
  tuning: string[];
  strings: number;
}> = {
  "standard-6": {
    name: "Standard",
    tuning: ["E", "A", "D", "G", "B", "E"],
    strings: 6
  },
  "drop-d": {
    name: "Drop D",
    tuning: ["D", "A", "D", "G", "B", "E"],
    strings: 6
  },
  "drop-c": {
    name: "Drop C",
    tuning: ["C", "G", "C", "F", "A", "D"],
    strings: 6
  },
  "dadgad": {
    name: "DADGAD",
    tuning: ["D", "A", "D", "G", "A", "D"],
    strings: 6
  },
  "open-d": {
    name: "Open D",
    tuning: ["D", "A", "D", "F#", "A", "D"],
    strings: 6
  },
  "open-g": {
    name: "Open G",
    tuning: ["D", "G", "D", "G", "B", "D"],
    strings: 6
  },
  "standard-7": {
    name: "Standard 7-String",
    tuning: ["B", "E", "A", "D", "G", "B", "E"],
    strings: 7
  },
  "drop-a": {
    name: "Drop A (7-String)",
    tuning: ["A", "E", "A", "D", "G", "B", "E"],
    strings: 7
  },
  "standard-8": {
    name: "Standard 8-String",
    tuning: ["F#", "B", "E", "A", "D", "G", "B", "E"],
    strings: 8
  },
  "drop-e": {
    name: "Drop E (8-String)",
    tuning: ["E", "B", "E", "A", "D", "G", "B", "E"],
    strings: 8
  }
};

export function getDefaultTuningForGuitarType(strings: number): string[] {
  switch (strings) {
    case 7:
      return TUNING_PRESETS["standard-7"].tuning;
    case 8:
      return TUNING_PRESETS["standard-8"].tuning;
    default:
      return TUNING_PRESETS["standard-6"].tuning;
  }
}
