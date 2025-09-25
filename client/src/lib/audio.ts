import * as Soundfont from "soundfont-player";
import type { InstrumentName } from "soundfont-player";
import { normalizeNote, NOTES } from "@/lib/music-theory";

// Guitar string octaves (standard tuning as reference)
const STRING_OCTAVES: Record<number, number[]> = {
  6: [2, 2, 3, 3, 3, 4], // E2, A2, D3, G3, B3, E4
  7: [1, 2, 2, 3, 3, 3, 4], // B1, E2, A2, D3, G3, B3, E4
  8: [1, 1, 2, 2, 3, 3, 3, 4] // F#1, B1, E2, A2, D3, G3, B3, E4
};

// Audio tone options
export type AudioInstrument = 'acoustic' | 'electric' | 'clean' | 'distorted' | 'bass';

class AudioEngine {
  private ac: AudioContext | null = null;
  private instrument: any | null = null;
  private volume = 0.5;
  private isMuted = false;
  private currentInstrument: AudioInstrument = 'acoustic';
  private isPlaying = false;

  async initialize() {
    if (!this.ac) {
      this.ac = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (!this.instrument) {
      const name = this.getSoundfontName(this.currentInstrument);
      this.instrument = await Soundfont.instrument(this.ac, name);
    }
    return this.instrument;
  }

  private getSoundfontName(instr: AudioInstrument): InstrumentName {
    const map: Record<AudioInstrument, InstrumentName> = {
      electric: 'electric_guitar_clean',
      clean: 'electric_guitar_clean',
      distorted: 'distortion_guitar',
      bass: 'acoustic_bass',
      acoustic: 'acoustic_guitar_nylon'
    };
    return map[instr];
  }

  setVolume(volume: number) {
    this.volume = volume;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  setTone(toneType: AudioInstrument) {
    this.currentInstrument = toneType;
    // Recreate instrument lazily on next initialize
    this.instrument = null;
  }

  getToneOptions() {
    return ['acoustic', 'electric', 'clean', 'distorted', 'bass'];
  }

  getCurrentTone() {
    return this.currentInstrument;
  }

  private getStringMidi(note: string, stringIndex: number, fret: number, guitarType: number): number {
    const normalized = normalizeNote(note);
    const noteIndex = NOTES.indexOf(normalized);
    const octave = STRING_OCTAVES[guitarType]?.[stringIndex] ?? 3;
    const baseMidi = (octave + 1) * 12 + noteIndex; // C-1=0, C4=60
    return baseMidi + fret;
  }

  private midiToNoteName(midi: number): string {
    const noteIndex = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    const name = NOTES[noteIndex];
    return `${name}${octave}`;
  }

  async playNoteName(noteName: string, durationSeconds = 0.5) {
    try {
      const instr = await this.initialize();
      if (!instr || !this.ac) return;
      const when = this.ac.currentTime;
      const gain = this.isMuted ? 0 : this.volume;
      instr.play(noteName, when, { gain, duration: durationSeconds });
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  }

  async playFretboardNote(note: string, stringIndex: number, fret: number, guitarType: number) {
    const midi = this.getStringMidi(note, stringIndex, fret, guitarType);
    const noteName = this.midiToNoteName(midi);
    await this.playNoteName(noteName, 0.5);
  }

  // Play a scale pattern
  async playScale(notes: string[], tempo = 120, noteLength = "8n") {
    if (this.isPlaying) {
      this.stopPlayback();
      return;
    }

    this.isPlaying = true;
    const secondsPerBeat = 60 / tempo;
    const intervalTime = secondsPerBeat; // simple beat per note

    try {
      await this.initialize();
      
      for (let i = 0; i < notes.length && this.isPlaying; i++) {
        const name = `${normalizeNote(notes[i])}4`;
        await this.playNoteName(name, intervalTime * 0.9);
        
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
    const intervalTime = 60 / tempo * 2; // approx half-note per chord

    try {
      await this.initialize();
      
      for (let i = 0; i < chords.length && this.isPlaying; i++) {
        const chord = chords[i];
        // Play all notes in the chord simultaneously (use 4th octave)
        await Promise.all(chord.map(n => this.playNoteName(`${normalizeNote(n)}4`, intervalTime * 0.95)));
        
        // Wait for the chord duration before playing the next chord
        await new Promise(resolve => setTimeout(resolve, intervalTime * 1000));
      }
    } catch (error) {
      console.error("Chord progression playback error:", error);
    } finally {
      this.isPlaying = false;
    }
  }

  // Play a single chord (all notes simultaneously)
  async playChord(notes: string[], duration: string = "2n") {
    try {
      await this.initialize();
      await Promise.all(notes.map(n => this.playNoteName(`${normalizeNote(n)}4`, 1.5)));
    } catch (error) {
      console.error('Chord playback error:', error);
    }
  }

  // Play an arpeggio pattern
  async playArpeggio(notes: string[], pattern: number[] = [0, 1, 2, 1], tempo = 120) {
    if (this.isPlaying) {
      this.stopPlayback();
      return;
    }

    this.isPlaying = true;
    const secondsPerBeat = 60 / tempo;

    try {
      await this.initialize();
      for (let i = 0; i < pattern.length && this.isPlaying; i++) {
        const idx = Math.abs(pattern[i]) % notes.length;
        const name = `${normalizeNote(notes[idx])}4`;
        await this.playNoteName(name, secondsPerBeat * 0.9);
        await new Promise(resolve => setTimeout(resolve, secondsPerBeat * 1000));
      }
    } catch (error) {
      console.error("Arpeggio playback error:", error);
    } finally {
      this.isPlaying = false;
    }
  }

  stopPlayback() {
    this.isPlaying = false;
  }

  isCurrentlyPlaying() {
    return this.isPlaying;
  }

  dispose() {
    this.instrument = null;
    if (this.ac) {
      this.ac.close();
      this.ac = null;
    }
  }
}

// Singleton audio engine
export const audioEngine = new AudioEngine();

// Helper function to normalize note names
export { normalizeNote };