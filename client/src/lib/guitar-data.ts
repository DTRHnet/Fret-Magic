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
  },
  // Additional 6-string tunings
  "half-step-down": {
    name: "Half Step Down",
    tuning: ["D#", "G#", "C#", "F#", "A#", "D#"],
    strings: 6
  },
  "whole-step-down": {
    name: "Whole Step Down",
    tuning: ["D", "G", "C", "F", "A", "D"],
    strings: 6
  },
  "drop-c#": {
    name: "Drop C#",
    tuning: ["C#", "G#", "C#", "F#", "A#", "D#"],
    strings: 6
  },
  "drop-b": {
    name: "Drop B",
    tuning: ["B", "F#", "B", "E", "G#", "C#"],
    strings: 6
  },
  "open-c": {
    name: "Open C",
    tuning: ["C", "G", "C", "G", "C", "E"],
    strings: 6
  },
  "open-e": {
    name: "Open E",
    tuning: ["E", "B", "E", "G#", "B", "E"],
    strings: 6
  },
  "open-a": {
    name: "Open A",
    tuning: ["E", "A", "E", "A", "C#", "E"],
    strings: 6
  },
  "modal-d": {
    name: "Modal D (DADAAD)",
    tuning: ["D", "A", "D", "A", "A", "D"],
    strings: 6
  },
  "nick-drake": {
    name: "Nick Drake (BEBEBE)",
    tuning: ["B", "E", "B", "E", "B", "E"],
    strings: 6
  },
  "modal-g": {
    name: "Modal G (DGDGCD)",
    tuning: ["D", "G", "D", "G", "C", "D"],
    strings: 6
  },
  "celtic": {
    name: "Celtic (DADGAD variant)",
    tuning: ["C", "A", "D", "G", "A", "D"],
    strings: 6
  },
  "russian": {
    name: "Russian (DGBDGD)",
    tuning: ["D", "G", "B", "D", "G", "D"],
    strings: 6
  },
  // 7-string tunings
  "drop-a-7": {
    name: "Drop A (7-String)",
    tuning: ["A", "E", "A", "D", "G", "B", "E"],
    strings: 7
  },
  "standard-a": {
    name: "Standard A Tuning",
    tuning: ["A", "D", "G", "C", "F", "A", "D"],
    strings: 7
  },
  "new-standard": {
    name: "New Standard Tuning",
    tuning: ["C", "G", "D", "A", "E", "G", "C"],
    strings: 7
  },
  // 8-string tunings
  "drop-f#": {
    name: "Drop F# (8-String)",
    tuning: ["F#", "C#", "F#", "B", "E", "A", "D", "G"],
    strings: 8
  },
  "standard-f#": {
    name: "Standard F# (8-String)",
    tuning: ["F#", "B", "E", "A", "D", "G", "B", "E"],
    strings: 8
  },
  "meshuggah": {
    name: "Meshuggah Tuning",
    tuning: ["F", "Bb", "Eb", "Ab", "Db", "Gb", "Bb", "Eb"],
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
