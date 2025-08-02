import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Music2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { generateChordsForScale, renderChordDiagram, ChordProgression } from "@/lib/chords";
import { SCALES } from "@/lib/music-theory";

// Helper function to convert pattern to intervals
function patternToIntervals(pattern: string): number[] {
  const steps = pattern.split('-');
  const intervals = [0]; // Always start with root
  let currentInterval = 0;
  
  for (let i = 0; i < steps.length - 1; i++) {
    const step = steps[i];
    if (step === 'W') {
      currentInterval += 2; // Whole step
    } else if (step === 'H') {
      currentInterval += 1; // Half step
    } else if (step === 'WH') {
      currentInterval += 3; // Whole + Half step
    }
    intervals.push(currentInterval);
  }
  
  return intervals;
}

interface ChordShapesProps {
  rootNote: string;
  scaleType: string;
  guitarType: number;
  currentScale: {
    name: string;
    notes: string[];
    pattern?: string;
    intervals?: number[];
  };
}

export default function ChordShapes({ rootNote, scaleType, guitarType, currentScale }: ChordShapesProps) {
  const [selectedChord, setSelectedChord] = useState<number>(0);
  const [isNoteExpanded, setIsNoteExpanded] = useState<boolean>(false);
  
  // Generate chords for the current scale
  // Convert pattern to intervals if needed
  let intervals = currentScale.intervals;
  if (!intervals && currentScale.pattern) {
    intervals = patternToIntervals(currentScale.pattern);
  }
  
  const chordProgressions = intervals ? generateChordsForScale(rootNote, intervals) : [];
  
  if (chordProgressions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Music2 className="w-5 h-5 mr-2 text-primary" />
            Chord Shapes
          </h3>
          <p className="text-slate-500 text-center py-8">
            No chord shapes available for this scale combination.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedChordProgression = chordProgressions[selectedChord];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Music2 className="w-5 h-5 mr-2 text-primary" />
            Chord Shapes
          </h3>
          <div className="text-sm text-slate-600">
            {currentScale.name} • {chordProgressions.length} chords
          </div>
        </div>

        {/* Chord Selection */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {chordProgressions.map((chord, index) => (
              <button
                key={index}
                onClick={() => setSelectedChord(index)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedChord === index
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {chord.chordName}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Chord Details */}
        {selectedChordProgression && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-800">
                {selectedChordProgression.chordName}
              </h4>
              <div className="text-sm text-slate-500">
                Root: {selectedChordProgression.rootNote}
              </div>
            </div>

            {/* Chord Shapes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedChordProgression.shapes.map((shape, shapeIndex) => (
                <div key={shapeIndex} className="p-4 bg-slate-50 rounded-lg">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderChordDiagram(shape, 150, guitarType)
                    }}
                    className="flex justify-center"
                  />
                  <div className="mt-3 text-center">
                    <div className="font-medium text-slate-700">{shape.name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Fingering: {shape.fingering.map((f, i) => f === 'x' ? 'X' : f).join('-')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chord Theory */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Chord Theory</h5>
              <div className="text-sm text-blue-800 space-y-1">
                <div>
                  <strong>Intervals:</strong> {selectedChordProgression.intervals.map(interval => {
                    const names = ['R', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
                    return names[interval];
                  }).join(' - ')}
                </div>
                <div>
                  <strong>Notes:</strong> {selectedChordProgression.intervals.map(interval => {
                    const rootIndex = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
                      .indexOf(selectedChordProgression.rootNote);
                    const noteIndex = (rootIndex + interval) % 12;
                    return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][noteIndex];
                  }).join(' - ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scale Context */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h5 className="font-medium text-green-900 mb-2">Scale Context</h5>
          <div className="text-sm text-green-800">
            <div className="mb-1">
              <strong>Scale:</strong> {currentScale.name} in {rootNote}
            </div>
            <div className="mb-1">
              <strong>Scale Notes:</strong> {currentScale.notes.join(' - ')}
            </div>
            <div>
              <strong>Available Chords:</strong> {chordProgressions.map(c => c.chordName).join(', ')}
            </div>
          </div>
        </div>

        {/* Custom Tuning Note */}
        <div className="mt-4 border border-amber-200 rounded-lg bg-amber-50">
          <button
            onClick={() => setIsNoteExpanded(!isNoteExpanded)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-amber-100 transition-colors"
          >
            <div className="flex items-center">
              <Info className="w-4 h-4 mr-2 text-amber-600" />
              <span className="font-medium text-amber-900">Custom Tuning Tip</span>
            </div>
            {isNoteExpanded ? (
              <ChevronUp className="w-4 h-4 text-amber-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-600" />
            )}
          </button>
          
          {isNoteExpanded && (
            <div className="px-4 pb-4">
              <p className="text-sm text-amber-800">
                Select <strong>"Custom Tuning"</strong> from the tuning dropdown above to activate 
                the half-step tuning controls. This will give you precise up/down arrow buttons 
                for each string, allowing you to create any custom tuning with audio feedback.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}