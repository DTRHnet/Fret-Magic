import { useState, useCallback } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import * as Tone from "tone";
import { normalizeNote } from "@/lib/music-theory";

interface TuningHelperProps {
  guitarType: number;
  tuning: string[];
}

// Note frequencies in Hz (4th octave)
const NOTE_FREQUENCIES: Record<string, number> = {
  "C": 261.63,
  "C#": 277.18,
  "D": 293.66,
  "D#": 311.13,
  "E": 329.63,
  "F": 349.23,
  "F#": 369.99,
  "G": 392.00,
  "G#": 415.30,
  "A": 440.00,
  "A#": 466.16,
  "B": 493.88
};

// Guitar string octaves (standard tuning as reference)
const STRING_OCTAVES: Record<number, number[]> = {
  6: [2, 2, 3, 3, 3, 4], // E2, A2, D3, G3, B3, E4
  7: [1, 2, 2, 3, 3, 3, 4], // B1, E2, A2, D3, G3, B3, E4
  8: [1, 1, 2, 2, 3, 3, 3, 4] // F#1, B1, E2, A2, D3, G3, B3, E4
};

export default function TuningHelper({ guitarType, tuning }: TuningHelperProps) {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [volume, setVolume] = useState([0.5]);
  const [isMuted, setIsMuted] = useState(false);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);

  const initializeSynth = useCallback(async () => {
    if (!synth) {
      await Tone.start();
      const newSynth = new Tone.Synth({
        oscillator: {
          type: "sawtooth"
        },
        envelope: {
          attack: 0.1,
          decay: 0.2,
          sustain: 0.3,
          release: 1
        }
      }).toDestination();
      
      setSynth(newSynth);
      return newSynth;
    }
    return synth;
  }, [synth]);

  const getStringFrequency = (note: string, stringIndex: number): number => {
    const baseFreq = NOTE_FREQUENCIES[normalizeNote(note)];
    if (!baseFreq) return 440; // Default to A4
    
    const octave = STRING_OCTAVES[guitarType]?.[stringIndex] || 3;
    return baseFreq * Math.pow(2, octave - 4); // Adjust to correct octave
  };

  const playNote = async (stringIndex: number) => {
    try {
      const currentSynth = await initializeSynth();
      const note = tuning[stringIndex];
      if (!note) return;

      const frequency = getStringFrequency(note, stringIndex);
      const actualVolume = isMuted ? 0 : volume[0];
      
      currentSynth.volume.value = Tone.gainToDb(actualVolume);
      
      setIsPlaying(stringIndex);
      currentSynth.triggerAttackRelease(frequency, "2n");
      
      // Stop playing indicator after note duration
      setTimeout(() => {
        setIsPlaying(null);
      }, 500);
      
    } catch (error) {
      console.error("Audio playback error:", error);
      setIsPlaying(null);
    }
  };

  const playAllStrings = async () => {
    for (let i = 0; i < guitarType; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      await playNote(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const stopAll = () => {
    if (synth) {
      synth.triggerRelease();
    }
    setIsPlaying(null);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Volume2 className="w-5 h-5 mr-2 text-primary" />
            Tuning Helper
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className="p-2"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={playAllStrings}
              disabled={isPlaying !== null}
            >
              {isPlaying !== null ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Play All
            </Button>
          </div>
        </div>

        {/* Volume Control */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Volume
          </Label>
          <Slider
            value={volume}
            onValueChange={setVolume}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
            disabled={isMuted}
          />
        </div>

        {/* String Tuning Display */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">
            Click to play each string:
          </Label>
          
          <div className="grid gap-2">
            {tuning.slice(0, guitarType).map((note, index) => {
              const stringNumber = index + 1;
              const isCurrentlyPlaying = isPlaying === index;
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {stringNumber}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        String {stringNumber}
                      </div>
                      <div className="text-sm text-slate-500">
                        Tune to {note}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-primary min-w-[3rem] text-center">
                      {note}
                    </div>
                    <Button
                      variant={isCurrentlyPlaying ? "default" : "outline"}
                      size="sm"
                      onClick={() => playNote(index)}
                      disabled={!note || isPlaying !== null}
                      className="min-w-[4rem]"
                    >
                      {isCurrentlyPlaying ? (
                        <>
                          <Pause className="w-4 h-4 mr-1" />
                          Playing
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Play
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      </CardContent>
    </Card>
  );
}