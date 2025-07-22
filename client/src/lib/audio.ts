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

// Audio tone options
export interface AudioToneSettings {
  type: 'acoustic' | 'electric' | 'clean' | 'distorted' | 'bass';
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

const TONE_PRESETS: Record<string, AudioToneSettings> = {
  acoustic: {
    type: 'acoustic',
    attack: 0.01,
    decay: 0.2,
    sustain: 0.3,
    release: 1.0
  },
  electric: {
    type: 'electric',
    attack: 0.05,
    decay: 0.1,
    sustain: 0.6,
    release: 0.5
  },
  clean: {
    type: 'clean',
    attack: 0.02,
    decay: 0.1,
    sustain: 0.4,
    release: 0.8
  },
  distorted: {
    type: 'distorted',
    attack: 0.01,
    decay: 0.05,
    sustain: 0.8,
    release: 0.3
  },
  bass: {
    type: 'bass',
    attack: 0.02,
    decay: 0.3,
    sustain: 0.7,
    release: 1.2
  }
};

class AudioEngine {
  private synth: Tone.Synth | null = null;
  private volume = 0.5;
  private isMuted = false;
  private currentTone: AudioToneSettings = TONE_PRESETS.acoustic;
  private isPlaying = false;
  private playbackQueue: Array<{ frequency: number; time: number; duration: string }> = [];

  async initialize() {
    if (!this.synth) {
      await Tone.start();
      this.createSynth();
    }
    return this.synth;
  }

  private createSynth() {
    if (this.synth) {
      this.synth.dispose();
    }

    const oscillatorType = this.getOscillatorType(this.currentTone.type);
    
    this.synth = new Tone.Synth({
      oscillator: {
        type: oscillatorType as any
      },
      envelope: {
        attack: this.currentTone.attack,
        decay: this.currentTone.decay,
        sustain: this.currentTone.sustain,
        release: this.currentTone.release
      }
    }).toDestination();
  }

  private getOscillatorType(toneType: string): string {
    switch (toneType) {
      case 'acoustic': return 'triangle';
      case 'electric': return 'sawtooth';
      case 'clean': return 'sine';
      case 'distorted': return 'square';
      case 'bass': return 'sawtooth';
      default: return 'triangle';
    }
  }

  setVolume(volume: number) {
    this.volume = volume;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  setTone(toneType: string) {
    if (TONE_PRESETS[toneType]) {
      this.currentTone = TONE_PRESETS[toneType];
      this.createSynth();
    }
  }

  getToneOptions() {
    return Object.keys(TONE_PRESETS);
  }

  getCurrentTone() {
    return this.currentTone.type;
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
      if (!synth) return;
      
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

  // Play a scale pattern
  async playScale(notes: string[], tempo = 120, noteLength = "8n") {
    if (this.isPlaying) {
      this.stopPlayback();
      return;
    }

    this.isPlaying = true;
    const noteDuration = Tone.Time(noteLength).toSeconds();
    const intervalTime = (60 / tempo) * (Tone.Time("4n").toSeconds() / Tone.Time(noteLength).toSeconds());

    try {
      const synth = await this.initialize();
      if (!synth) return;
      
      for (let i = 0; i < notes.length && this.isPlaying; i++) {
        const frequency = NOTE_FREQUENCIES[normalizeNote(notes[i])] || 440;
        
        const actualVolume = this.isMuted ? 0 : this.volume;
        synth.volume.value = Tone.gainToDb(actualVolume);
        
        synth.triggerAttackRelease(frequency, noteLength);
        
        // Wait for the interval before playing the next note
        await new Promise(resolve => setTimeout(resolve, intervalTime * 1000));
      }
    } catch (error) {
      console.error("Scale playback error:", error);
    } finally {
      this.isPlaying = false;
    }
  }

  // Play a chord progression
  async playChordProgression(chords: string[][], tempo = 120, chordDuration = "2n") {
    if (this.isPlaying) {
      this.stopPlayback();
      return;
    }

    this.isPlaying = true;
    const chordTime = Tone.Time(chordDuration).toSeconds();
    const intervalTime = (60 / tempo) * (Tone.Time("4n").toSeconds() / Tone.Time(chordDuration).toSeconds());

    try {
      const synth = await this.initialize();
      if (!synth) return;
      
      for (let i = 0; i < chords.length && this.isPlaying; i++) {
        const chord = chords[i];
        const actualVolume = this.isMuted ? 0 : this.volume;
        synth.volume.value = Tone.gainToDb(actualVolume);
        
        // Play all notes in the chord simultaneously
        chord.forEach(note => {
          const frequency = NOTE_FREQUENCIES[normalizeNote(note)] || 440;
          synth.triggerAttackRelease(frequency, chordDuration);
        });
        
        // Wait for the chord duration before playing the next chord
        await new Promise(resolve => setTimeout(resolve, intervalTime * 1000));
      }
    } catch (error) {
      console.error("Chord progression playback error:", error);
    } finally {
      this.isPlaying = false;
    }
  }

  // Play an arpeggio pattern
  async playArpeggio(notes: string[], pattern: number[] = [0, 1, 2, 1], tempo = 120) {
    if (this.isPlaying) {
      this.stopPlayback();
      return;
    }

    this.isPlaying = true;
    const noteLength = "8n";
    const intervalTime = (60 / tempo) * (Tone.Time("4n").toSeconds() / Tone.Time(noteLength).toSeconds());

    try {
      const synth = await this.initialize();
      if (!synth) return;
      
      for (let i = 0; i < pattern.length && this.isPlaying; i++) {
        const noteIndex = pattern[i] % notes.length;
        const note = notes[noteIndex];
        const frequency = NOTE_FREQUENCIES[normalizeNote(note)] || 440;
        
        const actualVolume = this.isMuted ? 0 : this.volume;
        synth.volume.value = Tone.gainToDb(actualVolume);
        
        synth.triggerAttackRelease(frequency, noteLength);
        
        await new Promise(resolve => setTimeout(resolve, intervalTime * 1000));
      }
    } catch (error) {
      console.error("Arpeggio playback error:", error);
    } finally {
      this.isPlaying = false;
    }
  }

  stopPlayback() {
    this.isPlaying = false;
    this.playbackQueue = [];
  }

  isCurrentlyPlaying() {
    return this.isPlaying;
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