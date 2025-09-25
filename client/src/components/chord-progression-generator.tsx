import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Shuffle, Play, Pause, Square, Copy, Download, Music } from 'lucide-react';
import { SCALES, NOTES } from '@/lib/music-theory';
import { generateChordProgression, getChordNotes, romanNumeralToChord, ChordProgressionItem, generateChordShapes, renderChordDiagram } from '@/lib/chords';
import { audioEngine } from '@/lib/audio';

interface ChordProgressionGeneratorProps {
  rootNote: string;
  scaleType: string;
  guitarType: number;
  tuning: string[];
  onChordSelect?: (chordNotes: string[]) => void;
}

const progressionTemplates = {
  'I-V-vi-IV': { name: 'Pop Progression', chords: ['I', 'V', 'vi', 'IV'] },
  'vi-IV-I-V': { name: 'Pop Variation', chords: ['vi', 'IV', 'I', 'V'] },
  'I-vi-IV-V': { name: '50s Progression', chords: ['I', 'vi', 'IV', 'V'] },
  'ii-V-I': { name: 'Jazz Standard', chords: ['ii', 'V', 'I'] },
  'I-VII-IV-I': { name: 'Rock Progression', chords: ['I', 'VII', 'IV', 'I'] },
  'vi-V-IV-V': { name: 'Emo/Pop-Punk', chords: ['vi', 'V', 'IV', 'V'] },
  'I-V-vi-iii-IV-I-IV-V': { name: 'Canon Progression', chords: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'] },
  'I-bVII-IV-I': { name: 'Modal Rock', chords: ['I', 'bVII', 'IV', 'I'] },
  'i-VI-III-VII': { name: 'Andalusian', chords: ['i', 'VI', 'III', 'VII'] },
  'i-v-iv-i': { name: 'Minor Blues', chords: ['i', 'v', 'iv', 'i'] }
};

const timeSignatures = {
  '4/4': { name: '4/4 (Common Time)', beats: 4, noteValue: 4 },
  '3/4': { name: '3/4 (Waltz)', beats: 3, noteValue: 4 },
  '2/4': { name: '2/4 (March)', beats: 2, noteValue: 4 },
  '6/8': { name: '6/8 (Compound)', beats: 6, noteValue: 8 },
  '12/8': { name: '12/8 (Blues)', beats: 12, noteValue: 8 }
};

export default function ChordProgressionGenerator({ 
  rootNote, 
  scaleType, 
  guitarType,
  tuning,
  onChordSelect 
}: ChordProgressionGeneratorProps) {
  const [selectedKey, setSelectedKey] = useState<string>(rootNote);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('I-V-vi-IV');
  const [selectedTimeSignature, setSelectedTimeSignature] = useState<string>('4/4');
  const [tempo, setTempo] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentChordIndex, setCurrentChordIndex] = useState<number | null>(null);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [showAsciiTab, setShowAsciiTab] = useState<boolean>(true);
  const [showRealtimeFretboard, setShowRealtimeFretboard] = useState<boolean>(true);
  
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const beatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate chord progression based on scale
  const chordProgression = useMemo(() => {
    const template = progressionTemplates[selectedTemplate as keyof typeof progressionTemplates];
    if (!template) return [];
    
    return generateChordProgression(selectedKey, scaleType, template.chords);
  }, [selectedKey, scaleType, selectedTemplate]);

  // Generate chord shapes for current progression
  const chordShapes = useMemo(() => {
    return chordProgression.map((chord: ChordProgressionItem) => {
      const rootNote = chord.symbol.replace(/[^A-G#b]/g, ''); // Extract root note
      const chordType = chord.symbol.includes('m') ? 'minor' : 'major';
      return generateChordShapes(rootNote, chordType, 'none', guitarType);
    });
  }, [chordProgression, guitarType]);

  // Playback controls
  const startPlayback = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setCurrentChordIndex(0);
    setCurrentBeat(0);
    
    const timeSignature = timeSignatures[selectedTimeSignature as keyof typeof timeSignatures];
    const beatDuration = (60 / tempo) * 1000; // Convert BPM to milliseconds per beat
    const chordDuration = beatDuration * timeSignature.beats; // Duration per chord
    
    // Play chord progression
    playbackIntervalRef.current = setInterval(() => {
      setCurrentChordIndex(prev => {
        const safePrev = typeof prev === 'number' ? prev : -1;
        const length = chordProgression.length || 1;
        const nextIndex = (safePrev + 1) % length;
        if (nextIndex === 0) {
          // Loop back to beginning
          return 0;
        }
        return nextIndex;
      });
    }, chordDuration);
    
    // Update beat counter
    beatIntervalRef.current = setInterval(() => {
      setCurrentBeat(prev => (prev + 1) % timeSignature.beats);
    }, beatDuration);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentChordIndex(null);
    setCurrentBeat(0);
    
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    
    if (beatIntervalRef.current) {
      clearInterval(beatIntervalRef.current);
      beatIntervalRef.current = null;
    }
  };

  const pausePlayback = () => {
    setIsPlaying(false);
    
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    
    if (beatIntervalRef.current) {
      clearInterval(beatIntervalRef.current);
      beatIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      if (beatIntervalRef.current) {
        clearInterval(beatIntervalRef.current);
      }
    };
  }, []);

  const randomizeProgression = () => {
    const templates = Object.keys(progressionTemplates);
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    setSelectedTemplate(randomTemplate);
  };

  const handleChordClick = (chordSymbol: string, index: number) => {
    setCurrentChordIndex(index);
    const chordNotes = getChordNotes(selectedKey, scaleType, chordSymbol);
    if (onChordSelect) {
      onChordSelect(chordNotes);
    }
    // Audition chord on click
    if (chordNotes && chordNotes.length > 0) {
      audioEngine.playChord(chordNotes, '2n');
    }
  };

  // Generate ASCII tab for current progression
  const generateAsciiTab = () => {
    if (!chordShapes.length) return '';
    
    const timeSignature = timeSignatures[selectedTimeSignature as keyof typeof timeSignatures];
    const beatsPerChord = timeSignature.beats;
    
    let tab = `Key: ${selectedKey} ${SCALES[scaleType as keyof typeof SCALES]?.name || scaleType}\n`;
    tab += `Time Signature: ${selectedTimeSignature}\n`;
    tab += `Tempo: ${tempo} BPM\n\n`;
    
    // Generate tab for each chord
    chordProgression.forEach((chord: ChordProgressionItem, chordIndex: number) => {
      const shapes = chordShapes[chordIndex];
      if (shapes && shapes.length > 0) {
        const shape = shapes[0]; // Use first shape for simplicity
        
        tab += `${chord.symbol} (${beatsPerChord} beats)\n`;
        
        // Generate tab lines
        for (let string = guitarType - 1; string >= 0; string--) {
          const stringNote = tuning[string] || 'X';
          const fret = shape.fingering[string];
          
          if (fret === 'x') {
            tab += `${stringNote}|---`;
          } else if (fret === 0) {
            tab += `${stringNote}|---`;
          } else {
            tab += `${stringNote}|---${fret}`;
          }
          
          // Add spacing for the chord duration
          for (let beat = 1; beat < beatsPerChord; beat++) {
            tab += '----';
          }
          tab += '\n';
        }
        tab += '\n';
      }
    });
    
    return tab;
  };

  const copyProgression = () => {
    const progressionText = chordProgression.map((chord: ChordProgressionItem) => chord.symbol).join(' - ');
    navigator.clipboard.writeText(progressionText);
  };

  const copyAsciiTab = () => {
    const tabText = generateAsciiTab();
    navigator.clipboard.writeText(tabText);
  };

  const exportProgression = () => {
    const progressionData = {
      key: selectedKey,
      scale: scaleType,
      template: selectedTemplate,
      timeSignature: selectedTimeSignature,
      tempo: tempo,
      chords: chordProgression.map((chord: ChordProgressionItem) => ({
        symbol: chord.symbol,
        roman: chord.roman,
        notes: chord.notes
      })),
      asciiTab: generateAsciiTab()
    };
    
    const blob = new Blob([JSON.stringify(progressionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedKey}-${scaleType}-progression.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Trigger audio when chord index changes during playback
  useEffect(() => {
    if (!isPlaying) return;
    if (!chordProgression || chordProgression.length === 0) return;
    if (currentChordIndex === null) return;
    const current = chordProgression[currentChordIndex];
    if (!current || !current.notes || current.notes.length === 0) return;
    audioEngine.playChord(current.notes, '2n');
  }, [isPlaying, currentChordIndex, chordProgression]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Chord Progression Creator
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={randomizeProgression}
              className="flex items-center gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Random
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAsciiTab}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Tab
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportProgression}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Key Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Key</label>
            <Select value={selectedKey} onValueChange={setSelectedKey}>
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

          {/* Progression Template */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Progression</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(progressionTemplates).map(([key, template]) => (
                  <SelectItem key={key} value={key}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Signature */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Signature</label>
            <Select value={selectedTimeSignature} onValueChange={setSelectedTimeSignature}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(timeSignatures).map(([key, signature]) => (
                  <SelectItem key={key} value={key}>
                    {signature.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tempo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tempo: {tempo} BPM</label>
            <Slider
              value={[tempo]}
              onValueChange={(value) => setTempo(value[0])}
              min={60}
              max={200}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Button
              variant={isPlaying ? "secondary" : "default"}
              size="sm"
              onClick={isPlaying ? pausePlayback : startPlayback}
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={stopPlayback}
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>
          </div>
          
          {/* Beat Counter */}
          {isPlaying && (
            <div className="flex items-center gap-2 text-sm">
              <span>Beat:</span>
              <div className="flex gap-1">
                {Array.from({ length: timeSignatures[selectedTimeSignature as keyof typeof timeSignatures].beats }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i === currentBeat ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chord Progression Display */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Progression</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {chordProgression.map((chord: ChordProgressionItem, index: number) => (
              <Button
                key={index}
                variant={currentChordIndex === index ? "default" : "outline"}
                onClick={() => handleChordClick(chord.symbol, index)}
                className={`flex flex-col items-center p-3 h-auto transition-all ${
                  currentChordIndex === index ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <span className="font-bold text-lg">{chord.symbol}</span>
                <span className="text-xs opacity-70">{chord.roman}</span>
                {isPlaying && currentChordIndex === index && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-1" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Chord Info */}
        {currentChordIndex !== null && chordProgression[currentChordIndex] && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="space-y-2">
              <div className="font-medium text-blue-900">
                {chordProgression[currentChordIndex].symbol} Chord
              </div>
              <div className="text-sm text-blue-700">
                Roman Numeral: {chordProgression[currentChordIndex].roman}
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="text-sm font-medium text-blue-800">Notes:</span>
                {chordProgression[currentChordIndex].notes.map((note: string, noteIndex: number) => (
                  <Badge key={noteIndex} variant="secondary" className="bg-blue-100 text-blue-800">
                    {note}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ASCII Tab Display */}
        {showAsciiTab && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">ASCII Tab</div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyAsciiTab}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            <div className="p-4 bg-slate-900 text-green-400 rounded-lg font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">{generateAsciiTab()}</pre>
            </div>
          </div>
        )}

        {/* Real-time Fretboard Visualizer */}
        {showRealtimeFretboard && currentChordIndex !== null && chordShapes[currentChordIndex] && chordShapes[currentChordIndex].length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium">Current Chord Shape</div>
            <div className="flex justify-center">
              <div
                dangerouslySetInnerHTML={{
                  __html: renderChordDiagram(chordShapes[currentChordIndex][0], 120, guitarType)
                }}
                className="chord-diagram-container"
              />
            </div>
          </div>
        )}

        {/* Progression Analysis */}
        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
          <div className="font-medium mb-1">Analysis</div>
          <div>
            This progression works in {selectedKey} {SCALES[scaleType as keyof typeof SCALES]?.name || scaleType} scale.
            {isPlaying ? ' Currently playing...' : ' Click any chord to highlight its notes on the fretboard.'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}