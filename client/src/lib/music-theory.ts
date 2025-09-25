export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const SCALES = {
  "ionian": {
    name: "Ionian (Major)",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    pattern: "W-W-H-W-W-W-H",
    category: "modes"
  },
  "dorian": {
    name: "Dorian",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    pattern: "W-H-W-W-W-H-W",
    category: "modes"
  },
  "phrygian": {
    name: "Phrygian",
    intervals: [0, 1, 3, 5, 7, 8, 10],
    pattern: "H-W-W-W-H-W-W",
    category: "modes"
  },
  "lydian": {
    name: "Lydian",
    intervals: [0, 2, 4, 6, 7, 9, 11],
    pattern: "W-W-W-H-W-W-H",
    category: "modes"
  },
  "mixolydian": {
    name: "Mixolydian",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    pattern: "W-W-H-W-W-H-W",
    category: "modes"
  },
  "aeolian": {
    name: "Aeolian (Natural Minor)",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    pattern: "W-H-W-W-H-W-W",
    category: "modes"
  },
  "locrian": {
    name: "Locrian",
    intervals: [0, 1, 3, 5, 6, 8, 10],
    pattern: "H-W-W-H-W-W-W",
    category: "modes"
  },
  "major-pentatonic": {
    name: "Major Pentatonic",
    intervals: [0, 2, 4, 7, 9],
    pattern: "W-W-WH-W-WH",
    category: "pentatonic"
  },
  "minor-pentatonic": {
    name: "Minor Pentatonic",
    intervals: [0, 3, 5, 7, 10],
    pattern: "WH-W-W-WH-W",
    category: "pentatonic"
  },
  "harmonic-minor": {
    name: "Harmonic Minor",
    intervals: [0, 2, 3, 5, 7, 8, 11],
    pattern: "W-H-W-W-H-WH-H",
    category: "other"
  },
  "melodic-minor": {
    name: "Melodic Minor",
    intervals: [0, 2, 3, 5, 7, 9, 11],
    pattern: "W-H-W-W-W-W-H",
    category: "other"
  },
  "blues": {
    name: "Blues Scale",
    intervals: [0, 3, 5, 6, 7, 10],
    pattern: "WH-W-H-H-WH-W",
    category: "other"
  },
  "whole-tone": {
    name: "Whole Tone",
    intervals: [0, 2, 4, 6, 8, 10],
    pattern: "W-W-W-W-W-W",
    category: "other"
  },
  "chromatic": {
    name: "Chromatic",
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    pattern: "H-H-H-H-H-H-H-H-H-H-H-H",
    category: "other"
  },
  "diminished": {
    name: "Diminished (Half-Whole)",
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    pattern: "H-W-H-W-H-W-H-W",
    category: "other"
  },
  "augmented": {
    name: "Augmented",
    intervals: [0, 3, 4, 7, 8, 11],
    pattern: "WH-H-WH-H-WH-H",
    category: "other"
  },
  "hungarian-minor": {
    name: "Hungarian Minor",
    intervals: [0, 2, 3, 6, 7, 8, 11],
    pattern: "W-H-WH-H-H-WH-H",
    category: "exotic"
  },
  "japanese": {
    name: "Japanese (Hirajoshi)",
    intervals: [0, 2, 3, 7, 8],
    pattern: "W-H-2W-H-2W",
    category: "exotic"
  },
  "arabic": {
    name: "Arabic",
    intervals: [0, 1, 4, 5, 7, 8, 11],
    pattern: "H-WH-H-W-H-WH-H",
    category: "exotic"
  },
  "gypsy": {
    name: "Gypsy",
    intervals: [0, 1, 4, 5, 7, 8, 10],
    pattern: "H-WH-H-W-H-W-W",
    category: "exotic"
  },
  "neapolitan-minor": {
    name: "Neapolitan Minor",
    intervals: [0, 1, 3, 5, 7, 8, 11],
    pattern: "H-W-W-W-H-WH-H",
    category: "exotic"
  },
  "enigmatic": {
    name: "Enigmatic",
    intervals: [0, 1, 4, 6, 8, 10, 11],
    pattern: "H-WH-W-W-W-W-H",
    category: "exotic"
  },
  "bebop-dominant": {
    name: "Bebop Dominant",
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    pattern: "W-W-H-W-W-H-H-H",
    category: "jazz"
  },
  "bebop-major": {
    name: "Bebop Major",
    intervals: [0, 2, 4, 5, 7, 8, 9, 11],
    pattern: "W-W-H-W-H-H-W-H",
    category: "jazz"
  },
  "altered": {
    name: "Altered (Super Locrian)",
    intervals: [0, 1, 3, 4, 6, 8, 10],
    pattern: "H-W-H-W-W-W-W",
    category: "jazz"
  },
  "lydian-dominant": {
    name: "Lydian Dominant",
    intervals: [0, 2, 4, 6, 7, 9, 10],
    pattern: "W-W-W-H-W-H-W",
    category: "jazz"
  },
  
  // Additional Exotic and Rare Scales
  "prometheus": {
    name: "Prometheus",
    intervals: [0, 2, 4, 6, 9, 10],
    pattern: "W-W-W-WH-H-W",
    category: "exotic"
  },
  "scriabin": {
    name: "Scriabin",
    intervals: [0, 1, 4, 7, 9, 10],
    pattern: "H-WH-WH-W-H-W",
    category: "exotic"
  },
  "tritone": {
    name: "Tritone",
    intervals: [0, 1, 4, 6, 7, 10],
    pattern: "H-WH-W-H-WH-W",
    category: "exotic"
  },
  "balinese": {
    name: "Balinese Pelog",
    intervals: [0, 1, 3, 7, 8],
    pattern: "H-W-2W-H-2W",
    category: "world"
  },
  "chinese": {
    name: "Chinese",
    intervals: [0, 4, 6, 7, 11],
    pattern: "2W-W-H-2W-H",
    category: "world"
  },
  "kumoi": {
    name: "Kumoi",
    intervals: [0, 2, 3, 7, 9],
    pattern: "W-H-2W-W-WH",
    category: "pentatonic"
  },
  "iwato": {
    name: "Iwato",
    intervals: [0, 1, 5, 6, 10],
    pattern: "H-2W-H-2W-W",
    category: "pentatonic"
  },
  "insen": {
    name: "In Sen",
    intervals: [0, 1, 5, 7, 10],
    pattern: "H-2W-W-WH-W",
    category: "pentatonic"
  },
  "yo": {
    name: "Yo Scale",
    intervals: [0, 2, 5, 7, 9],
    pattern: "W-WH-W-W-WH",
    category: "pentatonic"
  },
  "egyptian": {
    name: "Egyptian Pentatonic",
    intervals: [0, 2, 5, 7, 10],
    pattern: "W-WH-W-WH-W",
    category: "pentatonic"
  },
  "phrygian-dominant": {
    name: "Phrygian Dominant (Spanish)",
    intervals: [0, 1, 4, 5, 7, 8, 10],
    pattern: "H-WH-H-W-H-W-W",
    category: "world"
  },
  "persian": {
    name: "Persian",
    intervals: [0, 1, 4, 5, 6, 8, 11],
    pattern: "H-WH-H-H-W-WH-H",
    category: "world"
  },
  "byzantine": {
    name: "Byzantine (Double Harmonic)",
    intervals: [0, 1, 4, 5, 7, 8, 11],
    pattern: "H-WH-H-W-H-WH-H",
    category: "world"
  },
  "jewish": {
    name: "Jewish (Ahava Rabbah)",
    intervals: [0, 1, 4, 5, 7, 8, 10],
    pattern: "H-WH-H-W-H-W-W",
    category: "world"
  },
  "mongolian": {
    name: "Mongolian",
    intervals: [0, 2, 4, 7, 9],
    pattern: "W-W-WH-W-WH",
    category: "world"
  },
  "double-harmonic": {
    name: "Double Harmonic Major",
    intervals: [0, 1, 4, 5, 7, 8, 11],
    pattern: "H-WH-H-W-H-WH-H",
    category: "exotic"
  },
  "neapolitan-major": {
    name: "Neapolitan Major",
    intervals: [0, 1, 4, 5, 7, 9, 11],
    pattern: "H-W-W-W-W-W-H",
    category: "exotic"
  },
  "hungarian-major": {
    name: "Hungarian Major",
    intervals: [0, 3, 4, 6, 7, 9, 11],
    pattern: "WH-H-W-H-W-H-W",
    category: "exotic"
  },
  "oriental": {
    name: "Oriental",
    intervals: [0, 1, 4, 5, 6, 9, 10],
    pattern: "H-WH-H-H-WH-H-W",
    category: "exotic"
  },
  "flamenco": {
    name: "Flamenco",
    intervals: [0, 1, 4, 5, 7, 8, 11],
    pattern: "H-WH-H-W-H-WH-H",
    category: "world"
  },
  "blues-major": {
    name: "Major Blues",
    intervals: [0, 2, 3, 4, 7, 9],
    pattern: "W-H-H-WH-W-WH",
    category: "blues"
  },
  "mixolydian-blues": {
    name: "Mixolydian Blues",
    intervals: [0, 2, 4, 5, 6, 7, 9, 10],
    pattern: "W-W-H-H-H-W-H-W",
    category: "blues"
  },
  "dominant-diminished": {
    name: "Dominant Diminished (Half-Whole)",
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    pattern: "H-W-H-W-H-W-H-W",
    category: "symmetrical"
  },
  "diminished-wh": {
    name: "Diminished (Whole-Half)",
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    pattern: "W-H-W-H-W-H-W-H",
    category: "symmetrical"
  }
} as const;

export interface FretboardNote {
  note: string;
  interval: string;
  isRoot: boolean;
  isInScale: boolean;
  noteIndex: number;
}

export function formatNoteName(note: string): string {
  if (!note) return "";
  let s = note.trim();
  if (s === "") return "";
  s = s.replace(/♭/g, "b").replace(/♯/g, "#");
  const match = s.match(/^\s*([A-Ga-g])([#b])?\s*$/);
  if (!match) return "";
  const letter = match[1].toUpperCase();
  const accidental = match[2] === "#" ? "#" : match[2] === "b" ? "b" : "";
  return `${letter}${accidental}`;
}

export function validateNote(note: string): boolean {
  if (note === "") return true;
  const formatted = formatNoteName(note);
  return /^[A-G](#|b)?$/.test(formatted);
}

export function normalizeNote(note: string): string {
  const formatted = formatNoteName(note);
  if (formatted === "") return "";
  const noteMap: Record<string, string> = {
    // Flats to sharps
    "Db": "C#",
    "Eb": "D#",
    "Gb": "F#",
    "Ab": "G#",
    "Bb": "A#",
    // Theoretical spellings
    "Cb": "B",
    "Fb": "E",
    "E#": "F",
    "B#": "C"
  };
  return noteMap[formatted] || formatted;
}

export function getNoteIndex(note: string): number {
  if (!note || note.trim() === '') {
    return 0; // Default to C if note is empty
  }
  const normalized = normalizeNote(note);
  const index = NOTES.indexOf(normalized);
  return index >= 0 ? index : 0; // Default to C if note not found
}

export function getNoteAtIndex(index: number): string {
  return NOTES[index % 12];
}

export type NoteSpellingPolicy = 'auto' | 'sharps' | 'flats';

const FLAT_EQUIVS: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb'
};

const SHARP_KEYS = new Set(['G', 'D', 'A', 'E', 'B', 'F#', 'C#']);
const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']);

export function formatNoteForDisplay(
  note: string,
  policy: NoteSpellingPolicy,
  keyRoot?: string
): string {
  const n = normalizeNote(note);
  if (policy === 'sharps') return n;
  if (policy === 'flats') return FLAT_EQUIVS[n] || n;
  const root = formatNoteName(keyRoot || '');
  if (root && (root.includes('b') || FLAT_KEYS.has(root))) {
    return FLAT_EQUIVS[n] || n;
  }
  if (root && (root.includes('#') || SHARP_KEYS.has(root))) {
    return n;
  }
  return n;
}

export function getScaleNotes(rootNote: string, scaleType: string): string[] {
  const scale = SCALES[scaleType as keyof typeof SCALES];
  if (!scale) return [];
  
  const rootIndex = getNoteIndex(rootNote);
  return scale.intervals.map(interval => 
    getNoteAtIndex(rootIndex + interval)
  );
}

export function getIntervalName(rootNote: string, targetNote: string): string {
  const rootIndex = getNoteIndex(rootNote);
  const targetIndex = getNoteIndex(targetNote);
  let interval = (targetIndex - rootIndex + 12) % 12;
  
  const intervalNames: Record<number, string> = {
    0: "R",    // Root
    1: "b2",   // Minor 2nd
    2: "2",    // Major 2nd
    3: "b3",   // Minor 3rd
    4: "3",    // Major 3rd
    5: "4",    // Perfect 4th
    6: "b5",   // Tritone
    7: "5",    // Perfect 5th
    8: "b6",   // Minor 6th
    9: "6",    // Major 6th
    10: "b7",  // Minor 7th
    11: "7"    // Major 7th
  };
  
  return intervalNames[interval] || "";
}

export function calculateFretboardNotes(
  tuning: string[],
  rootNote: string,
  scaleType: string,
  maxFrets: number = 24
): FretboardNote[][] {
  // Handle empty or invalid tuning
  if (!tuning || tuning.length === 0) {
    return [];
  }
  
  const scaleNotes = getScaleNotes(rootNote, scaleType);
  const scaleNoteIndices = scaleNotes.map(note => getNoteIndex(note));
  
  return tuning.map(openNote => {
    const openNoteIndex = getNoteIndex(openNote);
    
    return Array.from({ length: maxFrets + 1 }, (_, fret) => {
      const noteIndex = (openNoteIndex + fret) % 12;
      const note = getNoteAtIndex(noteIndex);
      const isInScale = scaleNoteIndices.includes(noteIndex);
      const isRoot = note === rootNote;
      const interval = getIntervalName(rootNote, note);
      
      return {
        note,
        interval,
        isRoot,
        isInScale,
        noteIndex
      };
    });
  });
}

export function getScaleInfo(rootNote: string, scaleType: string) {
  const scale = SCALES[scaleType as keyof typeof SCALES];
  if (!scale) return { name: "", notes: [], pattern: "" };
  
  const notes = getScaleNotes(rootNote, scaleType);
  return {
    name: `${rootNote} ${scale.name}`,
    notes,
    pattern: scale.pattern
  };
}
