import { Music2, Play, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetectedChord, detectChordsInScale, getCommonChordsInKey } from "@/lib/chords";
import { audioEngine } from "@/lib/audio";
import { useState, useEffect } from "react";

interface ChordDetectorProps {
  rootNote: string;
  scaleType: string;
  tuning: string[];
  guitarType: number;
}

export default function ChordDetector({
  rootNote,
  scaleType,
  tuning,
  guitarType
}: ChordDetectorProps) {
  const [detectedChords, setDetectedChords] = useState<DetectedChord[]>([]);
  const [commonChords, setCommonChords] = useState<string[]>([]);
  const [playingChord, setPlayingChord] = useState<string | null>(null);

  useEffect(() => {
    const chords = detectChordsInScale(rootNote, scaleType, tuning.slice(0, guitarType), 12);
    const common = getCommonChordsInKey(rootNote, scaleType);
    
    setDetectedChords(chords);
    setCommonChords(common);
  }, [rootNote, scaleType, tuning, guitarType]);

  const handlePlayChord = async (chord: DetectedChord) => {
    setPlayingChord(chord.name);
    try {
      await audioEngine.playChord(chord.notes, 2.0);
    } catch (error) {
      console.error("Failed to play chord:", error);
    }
    setTimeout(() => setPlayingChord(null), 2000);
  };

  const getQualityColor = (quality: DetectedChord["quality"]) => {
    switch (quality) {
      case "major": return "bg-blue-100 text-blue-800";
      case "minor": return "bg-green-100 text-green-800";
      case "dominant": return "bg-orange-100 text-orange-800";
      case "diminished": return "bg-red-100 text-red-800";
      case "augmented": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Music2 className="w-5 h-5 mr-2 text-primary" />
          Chord Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Common chords in key */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">
            Common Chords in {rootNote} {scaleType}
          </h4>
          <div className="flex flex-wrap gap-1">
            {commonChords.map((chord, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {chord}
              </Badge>
            ))}
          </div>
        </div>

        {/* Detected chords */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">
            Available Chord Shapes ({detectedChords.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {detectedChords.map((chord, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Badge className={getQualityColor(chord.quality)}>
                    {chord.name}
                  </Badge>
                  <span className="text-xs text-slate-600">
                    {chord.notes.join(", ")}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handlePlayChord(chord)}
                  disabled={playingChord === chord.name}
                  className="h-6 w-6 p-0"
                >
                  {playingChord === chord.name ? (
                    <Volume2 className="w-3 h-3 animate-pulse" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {detectedChords.length === 0 && (
          <div className="text-center py-4 text-slate-500 text-sm">
            No chords detected in this scale.
            Try a different scale or tuning.
          </div>
        )}
      </CardContent>
    </Card>
  );
}