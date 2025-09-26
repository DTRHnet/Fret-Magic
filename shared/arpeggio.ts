import { NOTES, getNoteIndex, getNoteAtIndex, normalizeNote } from "@/lib/music-theory";

export type ArpeggioPattern = 'ascending' | 'descending' | 'updown' | 'sweep';
export type ArpeggioPosition = 'open' | 'low' | 'mid' | 'high' | 'multi';

export interface ArpeggioInput {
  key: string; // e.g., "G"
  chord: string; // e.g., "Gmaj7"
  pattern: ArpeggioPattern;
  position: ArpeggioPosition;
  length: number; // number of notes
  tempo: number; // bpm
  subdivision: number; // notes per beat
}

export interface ArpeggioEvent {
  time: number; // seconds
  duration: number; // seconds
  note: string; // e.g., "G3"
  string: number; // 1-6 (1 = high E)
  fret: number; // 0..24
  finger: number; // 0=open, 1-4 fingers, 5=barre
}

export interface ArpeggioResult {
  meta: {
    key: string;
    chord: string;
    pattern: ArpeggioPattern;
    position: ArpeggioPosition;
    tempo: number;
    subdivision: number;
  };
  events: ArpeggioEvent[];
  ascii: string;
}

// Standard tuning open string MIDI numbers: E2, A2, D3, G3, B3, E4
const OPEN_STRING_MIDI = [40, 45, 50, 55, 59, 64]; // E2..E4 low->high

function noteNameToMidi(name: string): number {
  // e.g., G3
  const m = name.match(/^([A-G](?:#|b)?)(-?\d+)$/);
  if (!m) return 60; // default C4
  const n = normalizeNote(m[1]);
  const octave = parseInt(m[2], 10);
  const idx = NOTES.indexOf(n);
  return (octave + 1) * 12 + idx;
}

function midiToNoteName(midi: number): string {
  const idx = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTES[idx]}${octave}`;
}

function parseChordIntervals(symbol: string): number[] {
  // Returns unique semitone offsets from root
  // Supports: maj, m, dim, aug, 7, maj7, m7, m7b5 (half-diminished), dim7, add9/9, 11, 13
  let intervals = new Set<number>([0]);
  const s = symbol.toLowerCase();
  const isMinor = /(^|[^a-z])m(?!aj)/.test(s);
  const isDim = s.includes('dim') || s.includes('°');
  const isAug = s.includes('aug') || s.includes('+');
  const has7 = /(maj7|m7b5|dim7|7)/.test(s);
  const hasMaj7 = s.includes('maj7');
  const hasDom7 = /(^|[^a-z])7(?!\d)/.test(s) && !hasMaj7 && !s.includes('dim7') && !s.includes('m7b5');
  const hasMin7 = s.includes('m7') && !s.includes('maj7') && !s.includes('m7b5');
  const isHalfDim = s.includes('m7b5');
  const isDim7 = s.includes('dim7');

  // Triad
  if (isDim) {
    intervals.add(3); intervals.add(6);
  } else if (isAug) {
    intervals.add(4); intervals.add(8);
  } else if (isMinor) {
    intervals.add(3); intervals.add(7);
  } else {
    intervals.add(4); intervals.add(7); // major
  }

  // 7th
  if (hasMaj7) intervals.add(11);
  else if (isHalfDim) { intervals.add(6); intervals.add(10); }
  else if (isDim7) { intervals.add(6); intervals.add(9); }
  else if (hasMin7) intervals.add(10);
  else if (hasDom7) intervals.add(10);

  // Extensions
  if (s.includes('9')) intervals.add(14 % 12);
  if (s.includes('11')) intervals.add(17 % 12);
  if (s.includes('13')) intervals.add(21 % 12);

  // Normalize
  return Array.from(new Set(Array.from(intervals).map(v => ((v % 12) + 12) % 12))).sort((a,b)=>a-b);
}

function buildArpeggioPitchClasses(root: string, chord: string, length: number, pattern: ArpeggioPattern): number[] {
  const rootIdx = getNoteIndex(root);
  const ivls = parseChordIntervals(chord);
  // Build one-octave sequence (sorted)
  const seq = ivls.map(i => (rootIdx + i) % 12);
  const order = seq.slice();
  let pc: number[] = [];
  const cycles = Math.ceil(length / order.length) + 1;
  if (pattern === 'descending') order.reverse();
  if (pattern === 'updown') {
    const up = order.slice();
    const down = order.slice(0, -1).reverse().slice(1);
    const ud = up.concat(down);
    for (let i=0;i<cycles;i++) pc = pc.concat(ud);
  } else {
    for (let i=0;i<cycles;i++) pc = pc.concat(order);
  }
  return pc.slice(0, length);
}

function positionRange(position: ArpeggioPosition): { min: number; max: number } {
  switch (position) {
    case 'open': return { min: 0, max: 3 };
    case 'low': return { min: 1, max: 5 };
    case 'mid': return { min: 5, max: 9 };
    case 'high': return { min: 9, max: 14 };
    default: return { min: 0, max: 15 };
  }
}

function buildStringTraversal(length: number): number[] {
  // 6->1 then 1->6 repeating: indices 5..0..5
  const up = [5,4,3,2,1,0];
  const down = [1,2,3,4,5];
  const cycle = up.concat(down);
  const order: number[] = [];
  for (let i=0;i<Math.ceil(length / cycle.length)+1;i++) order.push(...cycle);
  return order.slice(0, length);
}

function mapToFretboard(pcSeq: number[], root: string, position: ArpeggioPosition, stringOrder?: number[]): { midi: number; string: number; fret: number }[] {
  // Aim for minimal movement within a position, optionally traverse specific string order (e.g., sweep 6->1->6)
  const range = positionRange(position);
  let prevFret = (range.min + range.max) / 2;
  const mapped: { midi: number; string: number; fret: number }[] = [];
  let currentOctaveBias = 3; // favor lower-mid register
  for (let i = 0; i < pcSeq.length; i++) {
    const pc = pcSeq[i];
    let best: { string: number; fret: number; midi: number; cost: number } | null = null;
    const sCandidates = stringOrder ? [stringOrder[i % stringOrder.length]] : [0,1,2,3,4,5];
    for (const s of sCandidates) {
      const openMidi = OPEN_STRING_MIDI[s];
      for (let fret = range.min; fret <= range.max; fret++) {
        const midi = openMidi + fret;
        const pitchClass = ((midi % 12) + 12) % 12;
        if (pitchClass !== pc) continue;
        const cost = Math.abs(fret - prevFret) + (5 - s) * 0.1 + Math.abs(Math.floor(midi/12) - (currentOctaveBias+1)) * 0.2;
        if (!best || cost < best.cost) best = { string: s, fret, midi, cost };
      }
    }
    if (!best) {
      // fallback expand search outside position slightly
      const sFallback = sCandidates.length ? sCandidates : [0,1,2,3,4,5];
      for (const s of sFallback) {
        const openMidi = OPEN_STRING_MIDI[s];
        for (let fret = Math.max(0, range.min-2); fret <= Math.min(18, range.max+2); fret++) {
          const midi = openMidi + fret;
          const pitchClass = ((midi % 12) + 12) % 12;
          if (pitchClass !== pc) continue;
          const cost = Math.abs(fret - prevFret) + (5 - s) * 0.1;
          if (!best || cost < best.cost) best = { string: s, fret, midi, cost };
        }
      }
    }
    if (best) {
      prevFret = best.fret;
      mapped.push({ midi: best.midi, string: best.string, fret: best.fret });
      currentOctaveBias = Math.floor(best.midi/12) - 1;
    }
  }
  return mapped;
}

function estimateFinger(fret: number, position: ArpeggioPosition): number {
  if (fret === 0) return 0;
  const { min } = positionRange(position);
  const rel = Math.max(1, fret - min + 1);
  return Math.max(1, Math.min(4, rel));
}

export function renderAsciiTab(events: ArpeggioEvent[], secondsPerStep: number, steps: number): string {
  // 6 strings: high e (1) to low E (6)
  const names = ['e', 'B', 'G', 'D', 'A', 'E'];
  const cols: string[][] = Array.from({ length: 6 }, () => Array.from({ length: steps * 2 + 1 }, () => '-'));
  events.forEach(ev => {
    const stringIdx = 6 - ev.string; // convert to 0..5 (top=0)
    const col = Math.round(ev.time / secondsPerStep) * 2;
    const fretStr = String(ev.fret);
    cols[stringIdx][col] = fretStr[0];
    if (fretStr.length > 1 && col + 1 < cols[stringIdx].length) cols[stringIdx][col + 1] = fretStr[1];
  });
  const lines = names.map((n, i) => `${n}|${cols[i].join('')}|`);
  return lines.join('\n');
}

export function generateArpeggio(input: ArpeggioInput): ArpeggioResult {
  const key = normalizeNote(input.key);
  const pcSeq = buildArpeggioPitchClasses(key, input.chord, input.length, input.pattern);
  const stringOrder = (input.pattern === 'sweep' || input.pattern === 'updown') ? buildStringTraversal(input.length) : undefined;
  const mapped = mapToFretboard(pcSeq, key, input.position, stringOrder);
  const secondsPerBeat = 60 / input.tempo;
  const secondsPerStep = secondsPerBeat / input.subdivision;
  const events: ArpeggioEvent[] = mapped.map((m, i) => {
    const note = midiToNoteName(m.midi);
    const time = i * secondsPerStep;
    const duration = secondsPerStep * 0.9;
    const finger = estimateFinger(m.fret, input.position);
    return { time, duration, note, string: m.string + 1, fret: m.fret, finger };
  });
  const ascii = renderAsciiTab(events, secondsPerStep, input.length);
  return {
    meta: { key: input.key, chord: input.chord, pattern: input.pattern, position: input.position, tempo: input.tempo, subdivision: input.subdivision },
    events,
    ascii
  };
}

