import * as Tone from "tone";

// Audio engine for guitar tuner and note playback
export class AudioEngine {
  private synth: Tone.Synth | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await Tone.start();
      this.synth = new Tone.Synth({
        oscillator: {
          type: "triangle"
        },
        envelope: {
          attack: 0.1,
          decay: 0.3,
          sustain: 0.5,
          release: 1.2
        }
      }).toDestination();
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }

  // Convert note to frequency
  noteToFrequency(note: string, octave: number = 4): number {
    const noteMap: Record<string, number> = {
      "C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5,
      "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11
    };
    
    const noteIndex = noteMap[note];
    if (noteIndex === undefined) return 440;
    
    // A4 = 440Hz
    return 440 * Math.pow(2, (octave - 4) + (noteIndex - 9) / 12);
  }

  // Get standard guitar string frequencies
  getStringFrequency(note: string): number {
    const stringOctaves: Record<string, number> = {
      "E": 2, // Low E (6th string)
      "A": 2, // A string (5th string)
      "D": 3, // D string (4th string)
      "G": 3, // G string (3rd string)
      "B": 3, // B string (2nd string)
      "F#": 2, // For 7-string and 8-string guitars
      "C#": 2,
      "F": 2,
      "C": 3
    };

    // Handle sharp notes
    if (note.includes("#")) {
      const baseNote = note[0];
      return this.noteToFrequency(note, stringOctaves[baseNote] || 3);
    }

    // Special cases for high strings
    if (note === "E" && Math.random() > 0.5) {
      return this.noteToFrequency(note, 4); // High E (1st string)
    }

    const octave = stringOctaves[note] || 3;
    return this.noteToFrequency(note, octave);
  }

  async playNote(note: string, duration: number = 1.0) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.synth) return;

    try {
      const frequency = this.getStringFrequency(note);
      this.synth.triggerAttackRelease(frequency, duration);
    } catch (error) {
      console.error("Failed to play note:", error);
    }
  }

  async playChord(notes: string[], duration: number = 1.5) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.synth) return;

    try {
      const polySynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.5, release: 1.2 }
      }).toDestination();

      const frequencies = notes.map(note => this.getStringFrequency(note));
      polySynth.triggerAttackRelease(frequencies, duration);
      
      // Clean up
      setTimeout(() => polySynth.dispose(), duration * 1000 + 1000);
    } catch (error) {
      console.error("Failed to play chord:", error);
    }
  }

  stop() {
    if (this.synth) {
      this.synth.triggerRelease();
    }
  }

  dispose() {
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
    this.isInitialized = false;
  }
}

// Global audio engine instance
export const audioEngine = new AudioEngine();