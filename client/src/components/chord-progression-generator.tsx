import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shuffle, Play, Copy, Download } from 'lucide-react';
import { SCALES } from '@/lib/music-theory';
import { generateChordProgression, getChordNotes, romanNumeralToChord, ChordProgressionItem } from '@/lib/chords';

interface ChordProgressionGeneratorProps {
  rootNote: string;
  scaleType: string;
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

export default function ChordProgressionGenerator({ 
  rootNote, 
  scaleType, 
  onChordSelect 
}: ChordProgressionGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('I-V-vi-IV');
  const [customProgression, setCustomProgression] = useState<string[]>([]);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState<number | null>(null);

  // Generate chord progression based on scale
  const chordProgression = useMemo(() => {
    const template = progressionTemplates[selectedTemplate as keyof typeof progressionTemplates];
    if (!template) return [];
    
    return generateChordProgression(rootNote, scaleType, template.chords);
  }, [rootNote, scaleType, selectedTemplate]);

  const randomizeProgression = () => {
    const templates = Object.keys(progressionTemplates);
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    setSelectedTemplate(randomTemplate);
  };

  const handleChordClick = (chordSymbol: string, index: number) => {
    setCurrentChordIndex(index);
    const chordNotes = getChordNotes(rootNote, scaleType, chordSymbol);
    if (onChordSelect) {
      onChordSelect(chordNotes);
    }
  };

  const copyProgression = () => {
    const progressionText = chordProgression.map((chord: ChordProgressionItem) => chord.symbol).join(' - ');
    navigator.clipboard.writeText(progressionText);
  };

  const exportProgression = () => {
    const progressionData = {
      key: rootNote,
      scale: scaleType,
      template: selectedTemplate,
      chords: chordProgression.map((chord: ChordProgressionItem) => ({
        symbol: chord.symbol,
        roman: chord.roman,
        notes: chord.notes
      }))
    };
    
    const blob = new Blob([JSON.stringify(progressionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rootNote}-${scaleType}-progression.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Chord Progressions</span>
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
              onClick={copyProgression}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
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
      <CardContent className="space-y-4">
        {/* Template Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Progression Template</label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(progressionTemplates).map(([key, template]) => (
                <SelectItem key={key} value={key}>
                  {template.name} ({template.chords.join('-')})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Key and Scale Info */}
        <div className="flex gap-4 text-sm">
          <div>
            <span className="font-medium">Key:</span> {rootNote}
          </div>
          <div>
            <span className="font-medium">Scale:</span> {SCALES[scaleType as keyof typeof SCALES]?.name || scaleType}
          </div>
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
                className="flex flex-col items-center p-3 h-auto"
              >
                <span className="font-bold text-lg">{chord.symbol}</span>
                <span className="text-xs opacity-70">{chord.roman}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Current Chord Info */}
        {currentChordIndex !== null && chordProgression[currentChordIndex] && (
          <div className="p-4 bg-secondary rounded-lg">
            <div className="space-y-2">
              <div className="font-medium">
                {chordProgression[currentChordIndex].symbol} Chord
              </div>
              <div className="text-sm text-muted-foreground">
                Roman Numeral: {chordProgression[currentChordIndex].roman}
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="text-sm font-medium">Notes:</span>
                {chordProgression[currentChordIndex].notes.map((note: string, noteIndex: number) => (
                  <Badge key={noteIndex} variant="secondary">
                    {note}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progression Analysis */}
        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
          <div className="font-medium mb-1">Analysis</div>
          <div>
            This progression works in {rootNote} {SCALES[scaleType as keyof typeof SCALES]?.name || scaleType} scale.
            Click any chord to highlight its notes on the fretboard.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}