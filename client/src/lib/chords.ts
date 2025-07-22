import { getNoteIndex, getNoteAtIndex, getScaleNotes } from "./music-theory";

export interface ChordPattern {
  name: string;
  intervals: number[];
  symbol: string;
}

export interface DetectedChord {
  name: string;
  symbol: string;
  notes: string[];
  positions: Array<{ string: number; fret: number }>;
  quality: "major" | "minor" | "diminished" | "augmented" | "dominant" | "other";
}

// Common chord patterns
export const CHORD_PATTERNS: ChordPattern[] = [
  { name: "Major", intervals: [0, 4, 7], symbol: "" },
  { name: "Minor", intervals: [0, 3, 7], symbol: "m" },
  { name: "Diminished", intervals: [0, 3, 6], symbol: "dim" },
  { name: "Augmented", intervals: [0, 4, 8], symbol: "aug" },
  { name: "Major 7th", intervals: [0, 4, 7, 11], symbol: "maj7" },
  { name: "Minor 7th", intervals: [0, 3, 7, 10], symbol: "m7" },
  { name: "Dominant 7th", intervals: [0, 4, 7, 10], symbol: "7" },
  { name: "Minor Major 7th", intervals: [0, 3, 7, 11], symbol: "m(maj7)" },
  { name: "Half Diminished 7th", intervals: [0, 3, 6, 10], symbol: "m7b5" },
  { name: "Diminished 7th", intervals: [0, 3, 6, 9], symbol: "dim7" },
  { name: "Suspended 2nd", intervals: [0, 2, 7], symbol: "sus2" },
  { name: "Suspended 4th", intervals: [0, 5, 7], symbol: "sus4" },
  { name: "Add 9", intervals: [0, 4, 7, 14], symbol: "add9" },
  { name: "Major 9th", intervals: [0, 4, 7, 11, 14], symbol: "maj9" },
  { name: "Minor 9th", intervals: [0, 3, 7, 10, 14], symbol: "m9" },
  { name: "Dominant 9th", intervals: [0, 4, 7, 10, 14], symbol: "9" },
  { name: "Power Chord", intervals: [0, 7], symbol: "5" },
  { name: "Major 6th", intervals: [0, 4, 7, 9], symbol: "6" },
  { name: "Minor 6th", intervals: [0, 3, 7, 9], symbol: "m6" }
];

export function normalizeIntervals(intervals: number[]): number[] {
  return intervals.map(interval => interval % 12).sort((a, b) => a - b);
}

export function findChordPattern(intervals: number[]): ChordPattern | null {
  const normalized = normalizeIntervals(intervals);
  
  for (const pattern of CHORD_PATTERNS) {
    const patternNormalized = normalizeIntervals(pattern.intervals);
    
    if (normalized.length === patternNormalized.length &&
        normalized.every((interval, index) => interval === patternNormalized[index])) {
      return pattern;
    }
  }
  
  return null;
}

export function detectChordsInScale(rootNote: string, scaleType: string, tuning: string[], maxFrets: number = 12): DetectedChord[] {
  const scaleNotes = getScaleNotes(rootNote, scaleType);
  const scaleNoteIndices = scaleNotes.map(note => getNoteIndex(note));
  const detectedChords: DetectedChord[] = [];

  // Check common chord positions across fretboard
  for (let baseFret = 0; baseFret <= maxFrets - 4; baseFret++) {
    // Check major barre chord shapes
    const barreShapes = [
      // E-shape barre chord (6th string root)
      { strings: [0, 2, 2, 1, 0, 0], name: "E-shape" },
      // A-shape barre chord (5th string root)
      { strings: [-1, 0, 2, 2, 2, 0], name: "A-shape" },
      // Open position chords
      { strings: [0, 0, 2, 2, 2, 0], name: "Open A" },
      { strings: [0, 2, 2, 1, 0, 0], name: "Open E" },
      { strings: [-1, -1, 0, 2, 3, 2], name: "Open D" },
      { strings: [3, 2, 0, 0, 0, 3], name: "Open G" },
      { strings: [-1, 3, 2, 0, 1, 0], name: "Open C" }
    ];

    for (const shape of barreShapes) {
      if (shape.strings.length > tuning.length) continue;

      const chordNotes: string[] = [];
      const positions: Array<{ string: number; fret: number }> = [];

      // Calculate notes for this chord shape
      for (let stringIndex = 0; stringIndex < Math.min(shape.strings.length, tuning.length); stringIndex++) {
        const fretOffset = shape.strings[stringIndex];
        if (fretOffset === -1) continue; // Muted string

        const actualFret = baseFret + fretOffset;
        if (actualFret > maxFrets) continue;

        const openNoteIndex = getNoteIndex(tuning[stringIndex]);
        const noteIndex = (openNoteIndex + actualFret) % 12;
        const note = getNoteAtIndex(noteIndex);

        // Only include notes that are in the current scale
        if (scaleNoteIndices.includes(noteIndex)) {
          chordNotes.push(note);
          positions.push({ string: stringIndex, fret: actualFret });
        }
      }

      // Need at least 3 notes for a chord
      if (chordNotes.length >= 3) {
        // Remove duplicates but keep track of the lowest instance for root detection
        const uniqueNotes = [...new Set(chordNotes)];
        
        if (uniqueNotes.length >= 3) {
          // Determine the root note (usually the lowest/bass note)
          const bassNote = chordNotes[0];
          const bassNoteIndex = getNoteIndex(bassNote);

          // Calculate intervals from the bass note
          const intervals = uniqueNotes.map(note => {
            const noteIndex = getNoteIndex(note);
            return (noteIndex - bassNoteIndex + 12) % 12;
          }).sort((a, b) => a - b);

          // Find matching chord pattern
          const pattern = findChordPattern(intervals);
          
          if (pattern && scaleNoteIndices.includes(bassNoteIndex)) {
            const chordName = `${bassNote}${pattern.symbol}`;
            
            // Determine chord quality
            let quality: DetectedChord["quality"] = "other";
            if (pattern.symbol === "" || pattern.symbol.includes("maj")) quality = "major";
            else if (pattern.symbol.includes("m") && !pattern.symbol.includes("maj")) quality = "minor";
            else if (pattern.symbol.includes("dim")) quality = "diminished";
            else if (pattern.symbol.includes("aug")) quality = "augmented";
            else if (pattern.symbol.includes("7") && !pattern.symbol.includes("maj")) quality = "dominant";

            // Check if this chord is already detected (avoid duplicates)
            const exists = detectedChords.some(chord => 
              chord.name === chordName && 
              chord.positions.length === positions.length &&
              chord.positions.every((pos, idx) => 
                positions[idx] && pos.string === positions[idx].string && pos.fret === positions[idx].fret
              )
            );

            if (!exists) {
              detectedChords.push({
                name: chordName,
                symbol: pattern.symbol,
                notes: uniqueNotes,
                positions,
                quality
              });
            }
          }
        }
      }
    }
  }

  // Sort by chord complexity (simpler chords first)
  return detectedChords
    .sort((a, b) => {
      // Prioritize by chord quality (major, minor, then others)
      const qualityOrder = { major: 0, minor: 1, dominant: 2, diminished: 3, augmented: 4, other: 5 };
      const qualityDiff = qualityOrder[a.quality] - qualityOrder[b.quality];
      if (qualityDiff !== 0) return qualityDiff;
      
      // Then by number of notes (simpler first)
      const notesDiff = a.notes.length - b.notes.length;
      if (notesDiff !== 0) return notesDiff;
      
      // Finally by name
      return a.name.localeCompare(b.name);
    })
    .slice(0, 12); // Limit to 12 most relevant chords
}

export function getCommonChordsInKey(rootNote: string, scaleType: string): string[] {
  const scaleNotes = getScaleNotes(rootNote, scaleType);
  
  if (scaleType === "ionian" || scaleType === "major") {
    // Major scale chord progression: I, ii, iii, IV, V, vi, vii°
    return [
      `${scaleNotes[0]}`,           // I (major)
      `${scaleNotes[1]}m`,          // ii (minor)
      `${scaleNotes[2]}m`,          // iii (minor)
      `${scaleNotes[3]}`,           // IV (major)
      `${scaleNotes[4]}`,           // V (major)
      `${scaleNotes[5]}m`,          // vi (minor)
      `${scaleNotes[6]}dim`         // vii° (diminished)
    ];
  } else if (scaleType === "aeolian" || scaleType === "minor") {
    // Natural minor scale chord progression: i, ii°, III, iv, v, VI, VII
    return [
      `${scaleNotes[0]}m`,          // i (minor)
      `${scaleNotes[1]}dim`,        // ii° (diminished)
      `${scaleNotes[2]}`,           // III (major)
      `${scaleNotes[3]}m`,          // iv (minor)
      `${scaleNotes[4]}m`,          // v (minor)
      `${scaleNotes[5]}`,           // VI (major)
      `${scaleNotes[6]}`            // VII (major)
    ];
  }
  
  // For other scales, return basic triads
  return scaleNotes.slice(0, 4).map(note => note);
}