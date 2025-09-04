import { useState } from "react";
import { ChevronDown, ChevronUp, Info, Music2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateChordShapes, renderChordDiagram } from "@/lib/chords";
import { NOTES } from "@/lib/music-theory";

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

// Chord type definitions with their interval patterns
const CHORD_TYPES = {
  "major": { name: "Major", intervals: [0, 4, 7], symbol: "" },
  "minor": { name: "Minor", intervals: [0, 3, 7], symbol: "m" },
  "diminished": { name: "Diminished", intervals: [0, 3, 6], symbol: "dim" },
  "augmented": { name: "Augmented", intervals: [0, 4, 8], symbol: "aug" },
  "sus2": { name: "Suspended 2nd", intervals: [0, 2, 7], symbol: "sus2" },
  "sus4": { name: "Suspended 4th", intervals: [0, 5, 7], symbol: "sus4" },
  "power": { name: "Power Chord", intervals: [0, 7], symbol: "5" },
};

// Chord extensions and modifications
const CHORD_EXTENSIONS = {
  "none": { name: "No Extension", intervals: [], symbol: "" },
  "7": { name: "Dominant 7th", intervals: [10], symbol: "7" },
  "maj7": { name: "Major 7th", intervals: [11], symbol: "maj7" },
  "m7": { name: "Minor 7th", intervals: [10], symbol: "m7" },
  "dim7": { name: "Diminished 7th", intervals: [9], symbol: "dim7" },
  "aug7": { name: "Augmented 7th", intervals: [10], symbol: "aug7" },
  "add9": { name: "Add 9th", intervals: [14], symbol: "add9" },
  "add11": { name: "Add 11th", intervals: [17], symbol: "add11" },
  "add13": { name: "Add 13th", intervals: [21], symbol: "add13" },
};

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
  const [selectedRoot, setSelectedRoot] = useState<string>(rootNote);
  const [selectedType, setSelectedType] = useState<string>("major");
  const [selectedExtension, setSelectedExtension] = useState<string>("none");
  const [isNoteExpanded, setIsNoteExpanded] = useState<boolean>(false);
  
  // Generate chord shapes based on selections
  const chordShapes = generateChordShapes(selectedRoot, selectedType, selectedExtension, guitarType);
  
  // Build the full chord name
  const getChordName = () => {
    const type = CHORD_TYPES[selectedType as keyof typeof CHORD_TYPES];
    const extension = CHORD_EXTENSIONS[selectedExtension as keyof typeof CHORD_EXTENSIONS];
    
    let name = selectedRoot;
    if (type.symbol) {
      name += type.symbol;
    }
    if (extension.symbol) {
      name += extension.symbol;
    }
    return name;
  };

  // Get all intervals for the selected chord
  const getAllIntervals = () => {
    const type = CHORD_TYPES[selectedType as keyof typeof CHORD_TYPES];
    const extension = CHORD_EXTENSIONS[selectedExtension as keyof typeof CHORD_EXTENSIONS];
    
    const baseIntervals = [...type.intervals];
    const extensionIntervals = extension.intervals.map(interval => interval % 12);
    
    const allIntervals = [...baseIntervals, ...extensionIntervals];
    const uniqueIntervals = allIntervals.filter((interval, index) => allIntervals.indexOf(interval) === index);
    return uniqueIntervals.sort((a, b) => a - b);
  };

  const intervals = getAllIntervals();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Music2 className="w-5 h-5 mr-2 text-primary" />
            Chord Shapes
          </h3>
          <div className="text-sm text-slate-600">
            {getChordName()} • {chordShapes.length} shapes
          </div>
        </div>

        {/* Chord Selection Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Root Note Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Root Note
            </label>
            <Select value={selectedRoot} onValueChange={setSelectedRoot}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTES.map((note) => (
                  <SelectItem key={note} value={note}>
                    {note}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chord Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Chord Type
            </label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CHORD_TYPES).map(([key, chord]) => (
                  <SelectItem key={key} value={key}>
                    {chord.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Extension Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Extension
            </label>
            <Select value={selectedExtension} onValueChange={setSelectedExtension}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CHORD_EXTENSIONS).map(([key, ext]) => (
                  <SelectItem key={key} value={key}>
                    {ext.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chord Display */}
        {chordShapes.length > 0 ? (
          <div className="space-y-6">
            {/* Chord Shapes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chordShapes.map((shape, shapeIndex) => (
                <div key={shapeIndex} className="p-4 bg-slate-50 rounded-lg border">
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
                    {shape.baseFret > 0 && (
                      <div className="text-xs text-slate-500 mt-1">
                        Base Fret: {shape.baseFret}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chord Theory */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-3">Chord Theory</h5>
              <div className="text-sm text-blue-800 space-y-2">
                <div>
                  <strong>Intervals:</strong> {intervals.map(interval => {
                    const names = ['R', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
                    return names[interval % 12];
                  }).join(' - ')}
                </div>
                <div>
                  <strong>Notes:</strong> {intervals.map(interval => {
                    const rootIndex = NOTES.indexOf(selectedRoot);
                    const noteIndex = (rootIndex + interval) % 12;
                    return NOTES[noteIndex];
                  }).join(' - ')}
                </div>
                <div>
                  <strong>Formula:</strong> {CHORD_TYPES[selectedType as keyof typeof CHORD_TYPES].name} 
                  {selectedExtension !== 'none' && ` + ${CHORD_EXTENSIONS[selectedExtension as keyof typeof CHORD_EXTENSIONS].name}`}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">
              No chord shapes available for {getChordName()}
            </p>
            <p className="text-sm text-slate-400">
              Try selecting a different chord type or extension
            </p>
          </div>
        )}

        {/* Scale Context */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h5 className="font-medium text-green-900 mb-2">Scale Context</h5>
          <div className="text-sm text-green-800">
            <div className="mb-1">
              <strong>Current Scale:</strong> {currentScale.name} in {rootNote}
            </div>
            <div className="mb-1">
              <strong>Scale Notes:</strong> {currentScale.notes.join(' - ')}
            </div>
            <div>
              <strong>Selected Chord:</strong> {getChordName()} 
              {currentScale.notes.includes(selectedRoot) && (
                <span className="ml-2 text-green-600">✓ In scale</span>
              )}
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