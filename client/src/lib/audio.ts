import * as Tone from "tone";

// Note frequencies in Hz (4th octave)
const NOTE_FREQUENCIES: Record<string, number> = {
  "C": 261.63,
  "C#": 277.18,
  "Db": 277.18,
  "D": 293.66,
  "D#": 311.13,
  "Eb": 311.13,
  "E": 329.63,
  "F": 349.23,
  "F#": 369.99,
  "Gb": 369.99,
  "G": 392.00,
  "G#": 415.30,
  "Ab": 415.30,
  "A": 440.00,
  "A#": 466.16,
  "Bb": 466.16,
  "B": 493.88
};

// Guitar string octaves (standard tuning as reference)
const STRING_OCTAVES: Record<number, number[]> = {
  6: [2, 2, 3, 3, 3, 4], // E2, A2, D3, G3, B3, E4
  7: [1, 2, 2, 3, 3, 3, 4], // B1, E2, A2, D3, G3, B3, E4
  8: [1, 1, 2, 2, 3, 3, 3, 4] // F#1, B1, E2, A2, D3, G3, B3, E4
};

class AudioEngine {
  private synth: Tone.Synth | null = null;
  private volume = 0.5;
  private isMuted = false;

  async initialize() {
    if (!this.synth) {
      await Tone.start();
      this.synth = new Tone.Synth({
        oscillator: {
          type: "sawtooth"
        },
        envelope: {
          attack: 0.05,
          decay: 0.1,
          sustain: 0.2,
          release: 0.5
        }
      }).toDestination();
    }
    return this.synth;
  }

  setVolume(volume: number) {
    this.volume = volume;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  getStringFrequency(note: string, stringIndex: number, guitarType: number): number {
    const baseFreq = NOTE_FREQUENCIES[note];
    if (!baseFreq) return 440; // Default to A4
    
    const octave = STRING_OCTAVES[guitarType]?.[stringIndex] || 3;
    return baseFreq * Math.pow(2, octave - 4); // Adjust to correct octave
  }

  getFretFrequency(note: string, stringIndex: number, fret: number, guitarType: number): number {
    const openStringFreq = this.getStringFrequency(note, stringIndex, guitarType);
    // Each fret is a semitone higher, frequency multiplier is 2^(1/12) per semitone
    return openStringFreq * Math.pow(2, fret / 12);
  }

  async playNote(frequency: number, duration = "8n") {
    try {
      const synth = await this.initialize();
      const actualVolume = this.isMuted ? 0 : this.volume;
      
      synth.volume.value = Tone.gainToDb(actualVolume);
      synth.triggerAttackRelease(frequency, duration);
      
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  }

  async playFretboardNote(note: string, stringIndex: number, fret: number, guitarType: number) {
    const frequency = this.getFretFrequency(note, stringIndex, fret, guitarType);
    await this.playNote(frequency, "4n");
  }

  dispose() {
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
  }
}

// Singleton audio engine
export const audioEngine = new AudioEngine();

// Helper function to normalize note names
export function normalizeNote(note: string): string {
  // Convert flat notes to sharp equivalents for consistency
  const noteMap: Record<string, string> = {
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#'
  };
  
  return noteMap[note] || note;
}