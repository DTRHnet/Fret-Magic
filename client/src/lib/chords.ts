// Chord library with fingering patterns and theory
import { NOTES } from './music-theory';

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
  ],
  'Cm': [
    {
      name: 'C Minor Barre (3rd fret)',
      fingering: [3, 3, 5, 5, 4, 3],
      barres: [{ fret: 3, fromString: 0, toString: 5 }],
      baseFret: 0,
      fingers: [1, 1, 3, 4, 2, 1]
    }
  ],
  'Fm': [
    {
      name: 'F Minor Barre (1st fret)',
      fingering: [1, 1, 3, 3, 2, 1],
      barres: [{ fret: 1, fromString: 0, toString: 5 }],
      baseFret: 0,
      fingers: [1, 1, 3, 4, 2, 1]
    }
  ],
  'Gm': [
    {
      name: 'G Minor Barre (3rd fret)',
      fingering: [3, 3, 5, 5, 5, 3],
      barres: [{ fret: 3, fromString: 0, toString: 5 }],
      baseFret: 0,
      fingers: [1, 1, 3, 4, 4, 1]
    }
  ],
  'Bm': [
    {
      name: 'B Minor Barre (2nd fret)',
      fingering: [2, 2, 4, 4, 3, 2],
      barres: [{ fret: 2, fromString: 0, toString: 5 }],
      baseFret: 0,
      fingers: [1, 1, 3, 4, 2, 1]
    }
  ]
};

// Diminished chord shapes
const DIMINISHED_SHAPES: Record<string, ChordShape[]> = {
  'Cdim': [
    {
      name: 'C Diminished Open',
      fingering: ['x', 3, 1, 0, 1, 0],
      baseFret: 0,
      fingers: [0, 3, 1, 0, 1, 0]
    }
  ],
  'Ddim': [
    {
      name: 'D Diminished Open',
      fingering: ['x', 'x', 0, 1, 2, 1],
      baseFret: 0,
      fingers: [0, 0, 0, 1, 2, 1]
    }
  ],
  'Edim': [
    {
      name: 'E Diminished Open',
      fingering: [0, 1, 1, 0, 0, 0],
      baseFret: 0,
      fingers: [0, 1, 1, 0, 0, 0]
    }
  ]
};

// Augmented chord shapes
const AUGMENTED_SHAPES: Record<string, ChordShape[]> = {
  'Caug': [
    {
      name: 'C Augmented Open',
      fingering: ['x', 3, 2, 0, 1, 0],
      baseFret: 0,
      fingers: [0, 3, 2, 0, 1, 0]
    }
  ],
  'Daug': [
    {
      name: 'D Augmented Open',
      fingering: ['x', 'x', 0, 2, 3, 2],
      baseFret: 0,
      fingers: [0, 0, 0, 1, 3, 2]
    }
  ],
  'Eaug': [
    {
      name: 'E Augmented Open',
      fingering: [0, 2, 2, 0, 0, 0],
      baseFret: 0,
      fingers: [0, 2, 2, 0, 0, 0]
    }
  ]
};

// Suspended chord shapes
const SUSPENDED_SHAPES: Record<string, ChordShape[]> = {
  'Csus2': [
    {
      name: 'C Suspended 2 Open',
      fingering: ['x', 3, 0, 0, 1, 3], // C D G C G
      baseFret: 0,
      fingers: [0, 3, 0, 0, 1, 4]
    }
  ],
  'Dsus2': [
    {
      name: 'D Suspended 2 Open',
      fingering: ['x', 'x', 0, 2, 3, 0], // D A D
      baseFret: 0,
      fingers: [0, 0, 0, 1, 3, 0]
    }
  ],
  'Esus2': [
    {
      name: 'E Suspended 2 Open',
      fingering: [0, 2, 4, 4, 0, 0], // E B F# B E
      baseFret: 0,
      fingers: [0, 1, 3, 4, 0, 0]
    }
  ]
};

// Power chord shapes
const POWER_SHAPES: Record<string, ChordShape[]> = {
  'C5': [
    {
      name: 'C5 (A-string shape)',
      fingering: ['x', 3, 5, 5, 'x', 'x'], // C G C
      baseFret: 0,
      fingers: [0, 1, 3, 4, 0, 0]
    }
  ],
  'D5': [
    {
      name: 'D5 (D-string open shape)',
      fingering: ['x', 'x', 0, 2, 3, 'x'], // D A D
      baseFret: 0,
      fingers: [0, 0, 0, 1, 3, 0]
    }
  ],
  'E5': [
    {
      name: 'E5 (E-string open shape)',
      fingering: [0, 2, 2, 'x', 'x', 'x'], // E B E
      baseFret: 0,
      fingers: [0, 1, 3, 0, 0, 0]
    }
  ]
};

// 7th chord shapes
const SEVENTH_SHAPES: Record<string, ChordShape[]> = {
  'C7': [
    {
      name: 'C Dominant 7th Open',
      fingering: ['x', 3, 2, 3, 1, 0],
      baseFret: 0,
      fingers: [0, 3, 2, 4, 1, 0]
    }
  ],
  'D7': [
    {
      name: 'D Dominant 7th Open',
      fingering: ['x', 'x', 0, 2, 1, 2],
      baseFret: 0,
      fingers: [0, 0, 0, 2, 1, 3]
    }
  ],
  'E7': [
    {
      name: 'E Dominant 7th Open',
      fingering: [0, 2, 0, 1, 0, 0],
      baseFret: 0,
      fingers: [0, 2, 0, 1, 0, 0]
    }
  ],
  'A7': [
    {
      name: 'A Dominant 7th Open',
      fingering: ['x', 0, 2, 0, 2, 0],
      baseFret: 0,
      fingers: [0, 0, 2, 0, 3, 0]
    }
  ],
  'G7': [
    {
      name: 'G Dominant 7th Open',
      fingering: [3, 2, 0, 0, 0, 1],
      baseFret: 0,
      fingers: [3, 2, 0, 0, 0, 1]
    }
  ]
};

// Major 7th chord shapes
const MAJOR_SEVENTH_SHAPES: Record<string, ChordShape[]> = {
  'Cmaj7': [
    {
      name: 'C Major 7th Open',
      fingering: ['x', 3, 2, 0, 0, 0],
      baseFret: 0,
      fingers: [0, 3, 2, 0, 0, 0]
    }
  ],
  'Dmaj7': [
    {
      name: 'D Major 7th Open',
      fingering: ['x', 'x', 0, 2, 2, 2],
      baseFret: 0,
      fingers: [0, 0, 0, 1, 2, 3]
    }
  ],
  'Emaj7': [
    {
      name: 'E Major 7th Open',
      fingering: [0, 2, 1, 1, 0, 0],
      baseFret: 0,
      fingers: [0, 2, 1, 3, 0, 0]
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
    const strokeWidth = (shape.baseFret === 0 && fret === 0) ? 3 : 1; // Only draw nut thicker when base fret is open
    svg += `<line x1="${stringSpacing}" y1="${y}" x2="${stringSpacing * strings}" y2="${y}" stroke="#333" stroke-width="${strokeWidth}"/>`;
  }

  // Draw base fret number (e.g., "3" for positions starting at 3rd fret)
  if (shape.baseFret > 0) {
    svg += `<text x="${stringSpacing/2}" y="${fretHeight * 1.5}" text-anchor="middle" font-family="Arial" font-size="${size/15}" fill="#666">
      ${shape.baseFret}
    </text>`;
  }

  // Draw barres
  if (shape.barres) {
    shape.barres.forEach(barre => {
      const adjustedBarreFret = barre.fret - shape.baseFret;
      const verticalOffset = shape.baseFret > 0 ? 1.5 : 0.5; // Open-position vs moved-position diagrams
      const fretY = fretHeight * (adjustedBarreFret + verticalOffset);
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
      const verticalOffset = shape.baseFret > 0 ? 1.5 : 0.5; // Center of the correct fret box
      const y = fretHeight * (adjustedFret + verticalOffset);
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
    // Avoid CommonJS require in ESM; inline minimal scale map
    const scaleMap: Record<string, { intervals: number[] }> = {
      ionian: { intervals: [0,2,4,5,7,9,11] },
      major: { intervals: [0,2,4,5,7,9,11] },
      aeolian: { intervals: [0,2,3,5,7,8,10] },
      minor: { intervals: [0,2,3,5,7,8,10] },
      dorian: { intervals: [0,2,3,5,7,9,10] },
      phrygian: { intervals: [0,1,3,5,7,8,10] },
      lydian: { intervals: [0,2,4,6,7,9,11] },
      mixolydian: { intervals: [0,2,4,5,7,9,10] },
      locrian: { intervals: [0,1,3,5,6,8,10] }
    };
    const scale = scaleMap[scaleType] || scaleMap['ionian'];

    const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);
    if (rootIndex === -1) return '';

    const scaleNotes = scale.intervals.map((interval: number) => 
      CHROMATIC_NOTES[(rootIndex + interval) % 12]
    );

    const chordRoot = scaleNotes[degree];
    const isMinor = roman === roman.toLowerCase() || /i/.test(roman);
    const isDiminished = roman.includes('°') || roman.toLowerCase() === 'vii';

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

// --- Added chord detection helpers for UI components ---

export interface DetectedChord {
  name: string;
  notes: string[];
  quality: 'major' | 'minor' | 'augmented' | 'dominant' | 'diminished';
}

// Provide a list of common diatonic chords in the key
export function getCommonChordsInKey(rootNote: string, scaleType: string): string[] {
  try {
    // Choose a default diatonic set based on the scale family
    const majorRomans = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];
    const minorRomans = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
    const dorianRomans = ['i', 'ii', 'III', 'IV', 'v', 'vi', 'VII'];

    let romans = majorRomans;
    const st = scaleType.toLowerCase();
    if (st.includes('aeolian') || st === 'minor') romans = minorRomans;
    else if (st.includes('dorian')) romans = dorianRomans;

    // Use our existing progression generator to convert to chord symbols
    const progression = generateChordProgression(rootNote, scaleType, romans);
    return progression.map(p => p.symbol);
  } catch (err) {
    console.error('getCommonChordsInKey failed:', err);
    return [];
  }
}

// Light-weight detector that surfaces diatonic triads as available shapes
export function detectChordsInScale(
  rootNote: string,
  scaleType: string,
  _tuning: string[],
  _maxFrets: number
): DetectedChord[] {
  try {
    const romans = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];
    const items = generateChordProgression(rootNote, scaleType, romans);
    return items.map(item => ({
      name: item.symbol,
      notes: item.notes,
      quality: item.quality
    })) as DetectedChord[];
  } catch (err) {
    console.error('detectChordsInScale failed:', err);
    return [];
  }
}

// Generate chord shapes based on root note, chord type, and extensions
export function generateChordShapes(
  rootNote: string, 
  chordType: string, 
  extension: string, 
  guitarType: number
): ChordShape[] {
  // Get all available shapes for the root note and chord type
  const allShapes = getAllShapesForChord(rootNote, chordType, extension, guitarType);
  
  // Filter shapes based on chord type and extension
  return allShapes.filter(shape => {
    // Basic validation - ensure the shape has the right number of strings
    if (shape.fingering.length !== guitarType) {
      return false;
    }
    
    // For now, return all valid shapes - we can add more sophisticated filtering later
    // based on the actual chord intervals vs shape intervals
    return true;
  });
}

// Helper function to get all shapes for a specific chord
function getAllShapesForChord(note: string, chordType: string, extension: string, guitarType: number): ChordShape[] {
  const shapes: ChordShape[] = [];
  
  // Get the base chord shapes for the specific type
  const baseShapes = getBaseShapesForChordType(note, chordType, extension, guitarType);
  shapes.push(...baseShapes);
  
  // Add extended shapes for 7+ string guitars
  if (guitarType >= 7) {
    const extendedShapes = getExtendedShapesForChordType(note, chordType, guitarType);
    shapes.push(...extendedShapes);
  }
  
  // Add transposed shapes from other notes
  const transposedShapes = getTransposedShapesForChordType(note, chordType, guitarType);
  shapes.push(...transposedShapes);
  
  return shapes;
}

// Get base shapes for a specific chord type
function getBaseShapesForChordType(note: string, chordType: string, extension: string, guitarType: number): ChordShape[] {
  const shapes: ChordShape[] = [];
  
  // Major chords
  if (chordType === 'major') {
    if (BASIC_SHAPES[note]) {
      shapes.push(...BASIC_SHAPES[note]);
    }
  }
  
  // Minor chords
  if (chordType === 'minor') {
    if (MINOR_SHAPES[note + 'm']) {
      shapes.push(...MINOR_SHAPES[note + 'm']);
    }
    // Also add major shapes transposed to minor (lowering the 3rd)
    if (BASIC_SHAPES[note]) {
      BASIC_SHAPES[note].forEach(shape => {
        const minorShape = createMinorVersion(shape, note);
        if (minorShape) {
          shapes.push(minorShape);
        }
      });
    }
  }
  
  // Diminished chords
  if (chordType === 'diminished') {
    if (DIMINISHED_SHAPES[note + 'dim']) {
      shapes.push(...DIMINISHED_SHAPES[note + 'dim']);
    }
  }
  
  // Augmented chords
  if (chordType === 'augmented') {
    if (AUGMENTED_SHAPES[note + 'aug']) {
      shapes.push(...AUGMENTED_SHAPES[note + 'aug']);
    }
  }
  
  // Suspended chords
  if (chordType === 'sus2') {
    if (SUSPENDED_SHAPES[note + 'sus2']) {
      shapes.push(...SUSPENDED_SHAPES[note + 'sus2']);
    }
  }
  
  if (chordType === 'sus4') {
    if (SUSPENDED_SHAPES[note + 'sus4']) {
      shapes.push(...SUSPENDED_SHAPES[note + 'sus4']);
    }
  }
  
  // Power chords
  if (chordType === 'power') {
    if (POWER_SHAPES[note + '5']) {
      shapes.push(...POWER_SHAPES[note + '5']);
    }
  }
  
  // 7th chords
  if (extension === '7') {
    if (SEVENTH_SHAPES[note + '7']) {
      shapes.push(...SEVENTH_SHAPES[note + '7']);
    }
  }
  
  // Major 7th chords
  if (extension === 'maj7') {
    if (MAJOR_SEVENTH_SHAPES[note + 'maj7']) {
      shapes.push(...MAJOR_SEVENTH_SHAPES[note + 'maj7']);
    }
  }
  
  // Minor 7th chords
  if (extension === 'm7') {
    if (SEVENTH_SHAPES[note + '7']) {
      // Use dominant 7th shapes but modify the name
      SEVENTH_SHAPES[note + '7'].forEach(shape => {
        const minor7Shape = {
          ...shape,
          name: shape.name.replace('Dominant 7th', 'Minor 7th')
        };
        shapes.push(minor7Shape);
      });
    }
  }
  
  return shapes;
}

// Get extended shapes for 7+ string guitars
function getExtendedShapesForChordType(note: string, chordType: string, guitarType: number): ChordShape[] {
  const shapes: ChordShape[] = [];
  
  if (EXTENDED_SHAPES[note] && EXTENDED_SHAPES[note][guitarType]) {
    // Filter extended shapes based on chord type
    EXTENDED_SHAPES[note][guitarType].forEach(shape => {
      if (shape.name.toLowerCase().includes(chordType)) {
        shapes.push(shape);
      }
    });
  }
  
  return shapes;
}

// Get transposed shapes from other notes
function getTransposedShapesForChordType(note: string, chordType: string, guitarType: number): ChordShape[] {
  const shapes: ChordShape[] = [];
  const noteIndex = NOTES.indexOf(note);
  
  if (noteIndex === -1) return shapes;
  
  // Transpose C shapes to the target note
  if (BASIC_SHAPES['C']) {
    const transposeAmount = noteIndex;
    BASIC_SHAPES['C'].forEach(shape => {
      if (shape.baseFret === 0) {
        const transposedShape = createBarreChord(shape, transposeAmount, guitarType, chordType);
        if (transposedShape) {
          shapes.push(transposedShape);
        }
      }
    });
  }
  
  // Transpose E shapes to the target note
  if (BASIC_SHAPES['E']) {
    const transposeAmount = (noteIndex - NOTES.indexOf('E') + 12) % 12;
    BASIC_SHAPES['E'].forEach(shape => {
      if (shape.baseFret === 0) {
        const transposedShape = createBarreChord(shape, transposeAmount, guitarType, chordType);
        if (transposedShape) {
          shapes.push(transposedShape);
        }
      }
    });
  }
  
  // Transpose A shapes to the target note
  if (BASIC_SHAPES['A']) {
    const transposeAmount = (noteIndex - NOTES.indexOf('A') + 12) % 12;
    BASIC_SHAPES['A'].forEach(shape => {
      if (shape.baseFret === 0) {
        const transposedShape = createBarreChord(shape, transposeAmount, guitarType, chordType);
        if (transposedShape) {
          shapes.push(transposedShape);
        }
      }
    });
  }
  
  return shapes;
}

// Create a minor version of a major chord shape
function createMinorVersion(shape: ChordShape, note: string): ChordShape | null {
  // For now, just return the shape with a modified name
  // In a more sophisticated system, we'd actually modify the fingering
  return {
    ...shape,
    name: `${note} Minor ${shape.name.replace(/^[A-Z][a-z]*\s*/, '')}`
  };
}

// Helper function to create barre chord versions of open shapes
function createBarreChord(openShape: ChordShape, transposeAmount: number, guitarType: number, chordType: string): ChordShape | null {
  if (transposeAmount === 0) return null;
  
  const newFingering = openShape.fingering.map(fret => {
    if (fret === 'x' || fret === 0) return fret;
    return (fret as number) + transposeAmount;
  });
  
  const newFingers = openShape.fingers.map(finger => {
    if (finger === 0) return 0;
    return finger;
  });
  
  // Create barre across all strings
  const barres = [{
    fret: transposeAmount,
    fromString: 0,
    toString: guitarType - 1
  }];
  
  // Determine the chord type suffix
  let typeSuffix = '';
  if (chordType === 'minor') typeSuffix = ' Minor';
  else if (chordType === 'diminished') typeSuffix = ' Diminished';
  else if (chordType === 'augmented') typeSuffix = ' Augmented';
  else if (chordType === 'sus2') typeSuffix = ' Sus2';
  else if (chordType === 'sus4') typeSuffix = ' Sus4';
  else if (chordType === 'power') typeSuffix = ' Power';
  
  return {
    name: `${NOTES[transposeAmount]}${typeSuffix} Barre (${transposeAmount}${getOrdinalSuffix(transposeAmount)} fret)`,
    fingering: newFingering,
    barres,
    baseFret: transposeAmount,
    fingers: newFingers
  };
}

