// Chord library with fingering patterns and theory
export interface ChordShape {
  name: string;
  fingering: (number | 'x')[];
  barres?: { fret: number; fromString: number; toString: number }[];
  baseFret: number;
  fingers: (number | 0)[];
}

export interface ChordProgression {
  chordName: string;
  rootNote: string;
  intervals: number[];
  shapes: ChordShape[];
}

// Common chord patterns for different scale degrees
const CHORD_PATTERNS: Record<string, number[][]> = {
  // Major scale chord patterns (triads and 7ths)
  major: [
    [0, 4, 7],       // I (major)
    [0, 3, 7],       // ii (minor)
    [0, 3, 7],       // iii (minor)
    [0, 4, 7],       // IV (major)
    [0, 4, 7],       // V (major)
    [0, 3, 7],       // vi (minor)
    [0, 3, 6],       // vii° (diminished)
  ],
  minor: [
    [0, 3, 7],       // i (minor)
    [0, 3, 6],       // ii° (diminished)
    [0, 4, 7],       // III (major)
    [0, 3, 7],       // iv (minor)
    [0, 3, 7],       // v (minor)
    [0, 4, 7],       // VI (major)
    [0, 4, 7],       // VII (major)
  ]
};

// Extended range chord shapes for 7 and 8 string guitars
const EXTENDED_SHAPES: Record<string, Record<number, ChordShape[]>> = {
  'C': {
    7: [
      {
        name: 'C Major 7-String Open',
        fingering: ['x', 3, 2, 0, 1, 0, 0],
        baseFret: 0,
        fingers: [0, 3, 2, 0, 1, 0, 0]
      }
    ],
    8: [
      {
        name: 'C Major 8-String Open',
        fingering: ['x', 'x', 3, 2, 0, 1, 0, 0],
        baseFret: 0,
        fingers: [0, 0, 3, 2, 0, 1, 0, 0]
      }
    ]
  },
  'D': {
    7: [
      {
        name: 'D Major 7-String Open',
        fingering: ['x', 'x', 0, 2, 3, 2, 0],
        baseFret: 0,
        fingers: [0, 0, 0, 1, 3, 2, 0]
      }
    ],
    8: [
      {
        name: 'D Major 8-String Open',
        fingering: ['x', 'x', 'x', 0, 2, 3, 2, 0],
        baseFret: 0,
        fingers: [0, 0, 0, 0, 1, 3, 2, 0]
      }
    ]
  },
  'E': {
    7: [
      {
        name: 'E Major 7-String Open',
        fingering: [0, 2, 2, 1, 0, 0, 0],
        baseFret: 0,
        fingers: [0, 2, 3, 1, 0, 0, 0]
      }
    ],
    8: [
      {
        name: 'E Major 8-String Open',
        fingering: [0, 0, 2, 2, 1, 0, 0, 0],
        baseFret: 0,
        fingers: [0, 0, 2, 3, 1, 0, 0, 0]
      }
    ]
  },
  'F': {
    7: [
      {
        name: 'F Major 7-String Barre',
        fingering: [1, 3, 3, 2, 1, 1, 1],
        barres: [{ fret: 1, fromString: 0, toString: 6 }],
        baseFret: 0,
        fingers: [1, 3, 4, 2, 1, 1, 1]
      }
    ],
    8: [
      {
        name: 'F Major 8-String Barre',
        fingering: [1, 1, 3, 3, 2, 1, 1, 1],
        barres: [{ fret: 1, fromString: 0, toString: 7 }],
        baseFret: 0,
        fingers: [1, 1, 3, 4, 2, 1, 1, 1]
      }
    ]
  },
  'G': {
    7: [
      {
        name: 'G Major 7-String Open',
        fingering: [3, 2, 0, 0, 3, 3, 0],
        baseFret: 0,
        fingers: [3, 2, 0, 0, 1, 4, 0]
      }
    ],
    8: [
      {
        name: 'G Major 8-String Open',
        fingering: [3, 3, 2, 0, 0, 3, 3, 0],
        baseFret: 0,
        fingers: [2, 3, 1, 0, 0, 4, 5, 0]
      }
    ]
  },
  'A': {
    7: [
      {
        name: 'A Major 7-String Open',
        fingering: ['x', 0, 2, 2, 2, 0, 0],
        baseFret: 0,
        fingers: [0, 0, 1, 2, 3, 0, 0]
      }
    ],
    8: [
      {
        name: 'A Major 8-String Open',
        fingering: ['x', 'x', 0, 2, 2, 2, 0, 0],
        baseFret: 0,
        fingers: [0, 0, 0, 1, 2, 3, 0, 0]
      }
    ]
  }
};

// Basic chord shapes for 6-string guitar
const BASIC_SHAPES: Record<string, ChordShape[]> = {
  'C': [
    {
      name: 'C Major Open',
      fingering: ['x', 3, 2, 0, 1, 0],
      baseFret: 0,
      fingers: [0, 3, 2, 0, 1, 0]
    },
    {
      name: 'C Major Barre (3rd fret)',
      fingering: [3, 3, 5, 5, 5, 3],
      barres: [{ fret: 3, fromString: 0, toString: 5 }],
      baseFret: 0,
      fingers: [1, 1, 3, 4, 4, 1]
    }
  ],
  'D': [
    {
      name: 'D Major Open',
      fingering: ['x', 'x', 0, 2, 3, 2],
      baseFret: 0,
      fingers: [0, 0, 0, 1, 3, 2]
    },
    {
      name: 'D Major Barre (5th fret)',
      fingering: [5, 5, 7, 7, 7, 5],
      barres: [{ fret: 5, fromString: 0, toString: 5 }],
      baseFret: 0,
      fingers: [1, 1, 3, 4, 4, 1]
    }
  ],
  'E': [
    {
      name: 'E Major Open',
      fingering: [0, 2, 2, 1, 0, 0],
      baseFret: 0,
      fingers: [0, 2, 3, 1, 0, 0]
    }
  ],
  'F': [
    {
      name: 'F Major Barre (1st fret)',
      fingering: [1, 1, 3, 3, 3, 1],
      barres: [{ fret: 1, fromString: 0, toString: 5 }],
      baseFret: 0,
      fingers: [1, 1, 3, 4, 4, 1]
    }
  ],
  'G': [
    {
      name: 'G Major Open',
      fingering: [3, 2, 0, 0, 0, 3],
      baseFret: 0,
      fingers: [3, 2, 0, 0, 0, 4]
    },
    {
      name: 'G Major Barre (3rd fret)',
      fingering: [3, 3, 5, 5, 5, 3],
      barres: [{ fret: 3, fromString: 0, toString: 5 }],
      baseFret: 0,
      fingers: [1, 1, 3, 4, 4, 1]
    }
  ],
  'A': [
    {
      name: 'A Major Open',
      fingering: ['x', 0, 2, 2, 2, 0],
      baseFret: 0,
      fingers: [0, 0, 1, 2, 3, 0]
    }
  ],
  'B': [
    {
      name: 'B Major Barre (2nd fret)',
      fingering: [2, 2, 4, 4, 4, 2],
      barres: [{ fret: 2, fromString: 0, toString: 5 }],
      baseFret: 0,
      fingers: [1, 1, 3, 4, 4, 1]
    }
  ]
};

// Minor chord shapes
const MINOR_SHAPES: Record<string, ChordShape[]> = {
  'Am': [
    {
      name: 'A Minor Open',
      fingering: ['x', 0, 2, 2, 1, 0],
      baseFret: 0,
      fingers: [0, 0, 2, 3, 1, 0]
    }
  ],
  'Dm': [
    {
      name: 'D Minor Open',
      fingering: ['x', 'x', 0, 2, 3, 1],
      baseFret: 0,
      fingers: [0, 0, 0, 1, 3, 2]
    }
  ],
  'Em': [
    {
      name: 'E Minor Open',
      fingering: [0, 2, 2, 0, 0, 0],
      baseFret: 0,
      fingers: [0, 2, 3, 0, 0, 0]
    }
  ]
};

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transposeChordShape(baseShape: ChordShape, semitones: number): ChordShape {
  return {
    ...baseShape,
    name: baseShape.name.replace(/\d+(st|nd|rd|th)/, (match) => {
      const num = parseInt(match);
      return `${num + semitones}${getOrdinalSuffix(num + semitones)}`;
    }),
    fingering: baseShape.fingering.map(fret => 
      fret === 'x' || fret === 0 ? fret : (fret as number) + semitones
    ),
    barres: baseShape.barres?.map(barre => ({
      ...barre,
      fret: barre.fret + semitones
    })),
    baseFret: baseShape.baseFret + semitones
  };
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

export function generateChordsForScale(rootNote: string, scaleIntervals: number[], guitarType: number = 6): ChordProgression[] {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);
  if (rootIndex === -1) return [];

  const scaleNotes = scaleIntervals.map(interval => 
    CHROMATIC_NOTES[(rootIndex + interval) % 12]
  );

  const chordProgressions: ChordProgression[] = [];

  // Generate triads for each scale degree
  scaleIntervals.forEach((_, degree) => {
    const chordRoot = scaleNotes[degree];
    const chordRootIndex = CHROMATIC_NOTES.indexOf(chordRoot);
    
    // Build chord intervals (root, third, fifth)
    const thirdDegree = (degree + 2) % scaleNotes.length;
    const fifthDegree = (degree + 4) % scaleNotes.length;
    
    const thirdNote = scaleNotes[thirdDegree];
    const fifthNote = scaleNotes[fifthDegree];
    
    const thirdInterval = (CHROMATIC_NOTES.indexOf(thirdNote) - chordRootIndex + 12) % 12;
    const fifthInterval = (CHROMATIC_NOTES.indexOf(fifthNote) - chordRootIndex + 12) % 12;
    
    const intervals = [0, thirdInterval, fifthInterval];
    
    // Determine chord quality
    const isMinor = thirdInterval === 3;
    const isDiminished = thirdInterval === 3 && fifthInterval === 6;
    
    let chordName = chordRoot;
    if (isDiminished) chordName += '°';
    else if (isMinor) chordName += 'm';
    
    // Get base shapes and transpose them
    let baseShapes: ChordShape[] = [];
    
    // Check for extended range shapes first based on guitar type
    if (EXTENDED_SHAPES[chordRoot] && EXTENDED_SHAPES[chordRoot][guitarType]) {
      baseShapes = EXTENDED_SHAPES[chordRoot][guitarType];
    } else if (isMinor && MINOR_SHAPES[chordRoot + 'm']) {
      baseShapes = MINOR_SHAPES[chordRoot + 'm'];
    } else if (BASIC_SHAPES[chordRoot]) {
      baseShapes = BASIC_SHAPES[chordRoot];
    }
    
    let shapes: ChordShape[] = [];
    
    if (baseShapes.length > 0) {
      shapes = baseShapes;
    } else {
      // Generate transposed shapes from C major or A minor
      const referenceShapes = isMinor ? MINOR_SHAPES['Am'] || [] : BASIC_SHAPES['C'] || [];
      const referenceSemitones = isMinor ? 9 : 0; // A=9, C=0
      const targetSemitones = chordRootIndex;
      const transposeSemitones = (targetSemitones - referenceSemitones + 12) % 12;
      
      shapes = referenceShapes.map(shape => transposeChordShape(shape, transposeSemitones));
    }

    chordProgressions.push({
      chordName,
      rootNote: chordRoot,
      intervals,
      shapes: shapes.slice(0, 2) // Limit to 2 shapes per chord
    });
  });

  return chordProgressions;
}

export function renderChordDiagram(shape: ChordShape, size: number = 120, guitarStrings: number = 6): string {
  const frets = 5;
  const strings = guitarStrings; // Use the actual guitar string count
  const fretHeight = size / (frets + 1);
  const stringSpacing = size / (strings + 1);
  const dotRadius = stringSpacing / 6;
  
  // Extend or truncate shape fingering to match guitar strings
  const adjustedFingering = [...shape.fingering];
  const adjustedFingers = [...shape.fingers];
  
  while (adjustedFingering.length < strings) {
    adjustedFingering.unshift('x'); // Add muted strings for extended range
    adjustedFingers.unshift(0);
  }
  
  while (adjustedFingering.length > strings) {
    adjustedFingering.shift(); // Remove extra strings if needed
    adjustedFingers.shift();
  }
  
  let svg = `
    <svg width="${size}" height="${size * 1.2}" viewBox="0 0 ${size} ${size * 1.2}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="${size}" height="${size * 1.2}" fill="white" stroke="none"/>
      
      <!-- Title -->
      <text x="${size/2}" y="${fretHeight/2}" text-anchor="middle" font-family="Arial" font-size="${size/12}" font-weight="bold" fill="#333">
        ${shape.name}
      </text>
  `;

  // Draw strings (vertical lines)
  for (let string = 0; string < strings; string++) {
    const x = stringSpacing * (string + 1);
    svg += `<line x1="${x}" y1="${fretHeight}" x2="${x}" y2="${fretHeight * (frets + 1)}" stroke="#666" stroke-width="1"/>`;
  }

  // Draw frets (horizontal lines)
  for (let fret = 0; fret <= frets; fret++) {
    const y = fretHeight * (fret + 1);
    const strokeWidth = fret === 0 ? 3 : 1; // Nut is thicker
    svg += `<line x1="${stringSpacing}" y1="${y}" x2="${stringSpacing * strings}" y2="${y}" stroke="#333" stroke-width="${strokeWidth}"/>`;
  }

  // Draw fret numbers
  if (shape.baseFret > 0) {
    svg += `<text x="${stringSpacing/2}" y="${fretHeight * 1.5}" text-anchor="middle" font-family="Arial" font-size="${size/15}" fill="#666">
      ${shape.baseFret + 1}
    </text>`;
  }

  // Draw barres
  if (shape.barres) {
    shape.barres.forEach(barre => {
      const fretY = fretHeight * (barre.fret - shape.baseFret + 1.5);
      const startX = stringSpacing * (barre.fromString + 1);
      const endX = stringSpacing * (barre.toString + 1);
      
      svg += `<line x1="${startX}" y1="${fretY}" x2="${endX}" y2="${fretY}" stroke="#333" stroke-width="${dotRadius * 2}" stroke-linecap="round"/>`;
    });
  }

  // Draw fingering dots and mutes
  adjustedFingering.forEach((fret, string) => {
    const x = stringSpacing * (string + 1);
    
    if (fret === 'x') {
      // Draw X for muted strings
      const y = fretHeight * 0.7;
      const size = dotRadius;
      svg += `
        <line x1="${x - size}" y1="${y - size}" x2="${x + size}" y2="${y + size}" stroke="#d00" stroke-width="2"/>
        <line x1="${x - size}" y1="${y + size}" x2="${x + size}" y2="${y - size}" stroke="#d00" stroke-width="2"/>
      `;
    } else if (fret === 0) {
      // Draw O for open strings
      const y = fretHeight * 0.7;
      svg += `<circle cx="${x}" cy="${y}" r="${dotRadius}" fill="white" stroke="#333" stroke-width="2"/>`;
    } else {
      // Draw finger position dot
      const adjustedFret = (fret as number) - shape.baseFret;
      const y = fretHeight * (adjustedFret + 1.5);
      const fingerNum = adjustedFingers[string];
      
      svg += `<circle cx="${x}" cy="${y}" r="${dotRadius}" fill="#333"/>`;
      
      // Add finger number
      if (fingerNum > 0) {
        svg += `<text x="${x}" y="${y + dotRadius/3}" text-anchor="middle" font-family="Arial" font-size="${size/20}" fill="white" font-weight="bold">
          ${fingerNum}
        </text>`;
      }
    }
  });

  svg += '</svg>';
  return svg;
}

// Roman numeral mappings for chord progressions
const ROMAN_NUMERALS = {
  'I': 0, 'ii': 1, 'iii': 2, 'IV': 3, 'V': 4, 'vi': 5, 'vii': 6,
  'i': 0, 'II': 1, 'III': 2, 'iv': 3, 'v': 4, 'VI': 5, 'VII': 6,
  'bVII': 6, 'bVI': 5, 'bIII': 2, 'bII': 1
};

// Chord progression interface for the generator
export interface ChordProgressionItem {
  symbol: string;
  roman: string;
  notes: string[];
  quality: 'major' | 'minor' | 'diminished' | 'augmented';
}

export function generateChordProgression(
  rootNote: string, 
  scaleType: string, 
  romanNumerals: string[]
): ChordProgressionItem[] {
  try {
    // Create scale manually to avoid circular imports
    const majorScale = { intervals: [0, 2, 4, 5, 7, 9, 11] };
    const minorScale = { intervals: [0, 2, 3, 5, 7, 8, 10] };
    const dorianScale = { intervals: [0, 2, 3, 5, 7, 9, 10] };
    
    const scaleMap: Record<string, { intervals: number[] }> = {
      'major': majorScale,
      'ionian': majorScale,
      'minor': minorScale,
      'aeolian': minorScale,
      'dorian': dorianScale,
      'phrygian': { intervals: [0, 1, 3, 5, 7, 8, 10] },
      'lydian': { intervals: [0, 2, 4, 6, 7, 9, 11] },
      'mixolydian': { intervals: [0, 2, 4, 5, 7, 9, 10] },
      'locrian': { intervals: [0, 1, 3, 5, 6, 8, 10] }
    };
    
    const scale = scaleMap[scaleType] || majorScale;

    const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);
    if (rootIndex === -1) return [];

    const scaleNotes = scale.intervals.map((interval: number) => 
      CHROMATIC_NOTES[(rootIndex + interval) % 12]
    );

    const result: ChordProgressionItem[] = [];
    
    for (const roman of romanNumerals) {
      const degree = ROMAN_NUMERALS[roman as keyof typeof ROMAN_NUMERALS];
      if (degree === undefined) continue;

      const chordRoot = scaleNotes[degree];
      const isMinor = roman === roman.toLowerCase() || roman.includes('i');
      const isDiminished = roman.includes('°') || roman === 'vii';

      let symbol = chordRoot;
      let quality: 'major' | 'minor' | 'diminished' | 'augmented' = 'major';

      if (isDiminished) {
        symbol += '°';
        quality = 'diminished';
      } else if (isMinor) {
        symbol += 'm';
        quality = 'minor';
      }

      const notes = getChordNotes(chordRoot, scaleType, symbol);

      result.push({
        symbol,
        roman,
        notes,
        quality
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error generating chord progression:', error);
    return [];
  }
}

export function getChordNotes(rootNote: string, scaleType: string, chordSymbol: string): string[] {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);
  if (rootIndex === -1) return [];

  // Determine chord type from symbol
  const isMinor = chordSymbol.includes('m') && !chordSymbol.includes('maj');
  const isDiminished = chordSymbol.includes('°') || chordSymbol.includes('dim');
  const isAugmented = chordSymbol.includes('+') || chordSymbol.includes('aug');

  let intervals: number[];
  if (isDiminished) {
    intervals = [0, 3, 6]; // Root, minor third, diminished fifth
  } else if (isAugmented) {
    intervals = [0, 4, 8]; // Root, major third, augmented fifth
  } else if (isMinor) {
    intervals = [0, 3, 7]; // Root, minor third, perfect fifth
  } else {
    intervals = [0, 4, 7]; // Root, major third, perfect fifth
  }

  return intervals.map(interval => 
    CHROMATIC_NOTES[(rootIndex + interval) % 12]
  );
}

export function romanNumeralToChord(roman: string, rootNote: string, scaleType: string): string {
  const degree = ROMAN_NUMERALS[roman as keyof typeof ROMAN_NUMERALS];
  if (degree === undefined) return '';

  try {
    const musicTheory = require('./music-theory');
    const scale = musicTheory.SCALES[scaleType];
    if (!scale) return '';

    const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);
    if (rootIndex === -1) return '';

    const scaleNotes = scale.intervals.map((interval: number) => 
      CHROMATIC_NOTES[(rootIndex + interval) % 12]
    );

    const chordRoot = scaleNotes[degree];
    const isMinor = roman === roman.toLowerCase() || roman.includes('i');
    const isDiminished = roman.includes('°');

    let symbol = chordRoot;
    if (isDiminished) {
      symbol += '°';
    } else if (isMinor) {
      symbol += 'm';
    }

    return symbol;
  } catch (error) {
    console.error('Error converting roman numeral to chord:', error);
    return '';
  }
}