import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '@/lib/audio';
import { getScaleNotes } from '@/lib/music-theory';

interface AudioControlsProps {
  rootNote: string;
  scaleType: string;
  currentScale: {
    name: string;
    notes: string[];
    pattern: string;
  };
}

export default function AudioControls({ rootNote, scaleType, currentScale }: AudioControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTone, setCurrentTone] = useState('acoustic');
  const [playbackMode, setPlaybackMode] = useState<'scale' | 'arpeggio' | 'chord'>('scale');
  const [tempo, setTempo] = useState(120);

  useEffect(() => {
    audioEngine.setVolume(volume / 100);
  }, [volume]);

  useEffect(() => {
    audioEngine.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    audioEngine.setTone(currentTone);
  }, [currentTone]);

  useEffect(() => {
    const checkPlaybackStatus = () => {
      setIsPlaying(audioEngine.isCurrentlyPlaying());
    };

    const interval = setInterval(checkPlaybackStatus, 100);
    return () => clearInterval(interval);
  }, []);

  const handlePlay = async () => {
    if (isPlaying) {
      audioEngine.stopPlayback();
      setIsPlaying(false);
      return;
    }

    const scaleNotes = getScaleNotes(rootNote, scaleType);
    
    try {
      setIsPlaying(true);
      
      switch (playbackMode) {
        case 'scale':
          await audioEngine.playScale(scaleNotes, tempo, "8n");
          break;
        case 'arpeggio':
          await audioEngine.playArpeggio(scaleNotes, [0, 2, 4, 2], tempo);
          break;
        case 'chord':
          // Play triads built from scale degrees
          const chord1 = [scaleNotes[0], scaleNotes[2], scaleNotes[4]]; // I
          const chord4 = [scaleNotes[3], scaleNotes[5], scaleNotes[0]]; // IV
          const chord5 = [scaleNotes[4], scaleNotes[6], scaleNotes[1]]; // V
          await audioEngine.playChordProgression([chord1, chord4, chord5, chord1], tempo, "2n");
          break;
      }
    } catch (error) {
      console.error('Playback error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toneOptions = audioEngine.getToneOptions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Audio Playback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Controls */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handlePlay}
            variant={isPlaying ? "destructive" : "default"}
            size="sm"
            className="min-w-[80px]"
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>

          <Button
            onClick={toggleMute}
            variant="outline"
            size="sm"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>

          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm font-medium min-w-[60px]">Volume:</span>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="flex-1"
              disabled={isMuted}
            />
            <span className="text-sm text-muted-foreground min-w-[35px]">
              {isMuted ? "Muted" : `${volume}%`}
            </span>
          </div>
        </div>

        {/* Playback Mode */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Playback Mode</label>
            <Select value={playbackMode} onValueChange={(value: any) => setPlaybackMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scale">Scale</SelectItem>
                <SelectItem value="arpeggio">Arpeggio</SelectItem>
                <SelectItem value="chord">Chord Progression</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Guitar Tone</label>
            <Select value={currentTone} onValueChange={setCurrentTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((tone) => (
                  <SelectItem key={tone} value={tone}>
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tempo Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Tempo</label>
            <Badge variant="secondary">{tempo} BPM</Badge>
          </div>
          <Slider
            value={[tempo]}
            onValueChange={(value) => setTempo(value[0])}
            min={60}
            max={200}
            step={5}
            className="w-full"
          />
        </div>

        {/* Current Scale Info */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Current Scale</div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline">{currentScale.name}</Badge>
            {currentScale.notes.map((note, index) => (
              <Badge key={index} variant="secondary">
                {note}
              </Badge>
            ))}
          </div>
        </div>

        {/* Playback Description */}
        <div className="text-xs text-muted-foreground">
          {playbackMode === 'scale' && "Plays scale notes in sequence"}
          {playbackMode === 'arpeggio' && "Plays scale as an arpeggio pattern"}
          {playbackMode === 'chord' && "Plays I-IV-V-I chord progression"}
        </div>
      </CardContent>
    </Card>
  );
}