import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Volume2, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { audioEngine } from "@/lib/audio";

interface CustomTuningProps {
  guitarType: number;
  tuning: string[];
  setTuning: (tuning: string[]) => void;
}

const CHROMATIC_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Standard tunings as starting points
const STANDARD_TUNINGS: Record<number, string[]> = {
  6: ["E", "A", "D", "G", "B", "E"],
  7: ["B", "E", "A", "D", "G", "B", "E"], 
  8: ["F#", "B", "E", "A", "D", "G", "B", "E"]
};

export default function CustomTuning({ guitarType, tuning, setTuning }: CustomTuningProps) {
  const [customTuning, setCustomTuning] = useState<string[]>([]);
  const [playingString, setPlayingString] = useState<number | null>(null);

  // Initialize custom tuning from standard when component mounts or guitar type changes
  useEffect(() => {
    const standard = STANDARD_TUNINGS[guitarType] || STANDARD_TUNINGS[6];
    setCustomTuning([...standard]);
  }, [guitarType]);

  const moveNoteUp = (stringIndex: number) => {
    const currentNote = customTuning[stringIndex];
    const currentIndex = CHROMATIC_NOTES.indexOf(currentNote);
    const newIndex = (currentIndex + 1) % CHROMATIC_NOTES.length;
    const newNote = CHROMATIC_NOTES[newIndex];
    
    const newTuning = [...customTuning];
    newTuning[stringIndex] = newNote;
    setCustomTuning(newTuning);
    setTuning(newTuning);
    
    // Play the new note
    playStringNote(stringIndex, newNote);
  };

  const moveNoteDown = (stringIndex: number) => {
    const currentNote = customTuning[stringIndex];
    const currentIndex = CHROMATIC_NOTES.indexOf(currentNote);
    const newIndex = (currentIndex - 1 + CHROMATIC_NOTES.length) % CHROMATIC_NOTES.length;
    const newNote = CHROMATIC_NOTES[newIndex];
    
    const newTuning = [...customTuning];
    newTuning[stringIndex] = newNote;
    setCustomTuning(newTuning);
    setTuning(newTuning);
    
    // Play the new note
    playStringNote(stringIndex, newNote);
  };

  const playStringNote = async (stringIndex: number, note: string) => {
    try {
      setPlayingString(stringIndex);
      await audioEngine.playFretboardNote(note, stringIndex, 0, guitarType);
      setTimeout(() => setPlayingString(null), 500);
    } catch (error) {
      console.error('Failed to play note:', error);
      setPlayingString(null);
    }
  };

  const resetToStandard = () => {
    const standard = STANDARD_TUNINGS[guitarType] || STANDARD_TUNINGS[6];
    setCustomTuning([...standard]);
    setTuning([...standard]);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Volume2 className="w-5 h-5 mr-2 text-primary" />
            Custom Tuning
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToStandard}
          >
            Reset to Standard
          </Button>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">
            Adjust each string's tuning:
          </Label>
          
          <div className="grid gap-3">
            {customTuning.slice(0, guitarType).map((note, index) => {
              const stringNumber = index + 1;
              const isPlaying = playingString === index;
              
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
                      <div className="text-xs text-slate-500">
                        Current: {note}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Note Display */}
                    <div className={`text-2xl font-bold min-w-[3rem] text-center transition-colors ${
                      isPlaying ? 'text-primary' : 'text-slate-900'
                    }`}>
                      {note}
                    </div>
                    
                    {/* Controls */}
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveNoteUp(index)}
                        className="h-6 w-8 p-0"
                        disabled={isPlaying}
                      >
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveNoteDown(index)}
                        className="h-6 w-8 p-0"
                        disabled={isPlaying}
                      >
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {/* Play Button */}
                    <Button
                      variant={isPlaying ? "default" : "outline"}
                      size="sm"
                      onClick={() => playStringNote(index, note)}
                      disabled={isPlaying}
                      className="min-w-[3rem]"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use ↑/↓ buttons to adjust each string by half steps</li>
            <li>• Click Play to hear the current tuning for each string</li>
            <li>• Changes are applied immediately to the fretboard</li>
            <li>• Click "Reset to Standard" to return to standard tuning</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}