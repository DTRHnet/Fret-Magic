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
  }
} as const;

export interface FretboardNote {
  note: string;
  interval: string;
  isRoot: boolean;
  isInScale: boolean;
  noteIndex: number;
}

export function validateNote(note: string): boolean {
  const validNotes = ["A", "A#", "AB", "B", "C", "C#", "CB", "D", "D#", "DB", "E", "F", "F#", "FB", "G", "G#", "GB"];
  return validNotes.includes(note.toUpperCase()) || note === "";
}

export function normalizeNote(note: string): string {
  const noteMap: Record<string, string> = {
    "AB": "G#",
    "CB": "B",
    "DB": "C#",
    "EB": "D#",
    "FB": "E",
    "GB": "F#"
  };
  return noteMap[note] || note;
}

export function getNoteIndex(note: string): number {
  const normalized = normalizeNote(note);
  return NOTES.indexOf(normalized);
}

export function getNoteAtIndex(index: number): string {
  return NOTES[index % 12];
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
