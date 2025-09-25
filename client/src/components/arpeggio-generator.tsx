import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { NOTES } from "@/lib/music-theory";

type ArpeggioPattern = 'ascending' | 'descending' | 'updown' | 'sweep';
type ArpeggioPosition = 'open' | 'low' | 'mid' | 'high' | 'multi';

interface ArpeggioEvent {
  time: number;
  duration: number;
  note: string;
  string: number;
  fret: number;
  finger: number;
}

interface ArpeggioResponse {
  meta: { key: string; chord: string; pattern: ArpeggioPattern; position: ArpeggioPosition; tempo: number; subdivision: number };
  events: ArpeggioEvent[];
  ascii: string;
}

export default function ArpeggioGenerator({ onOverlay }: { onOverlay?: (events: { string: number; fret: number }[]) => void }) {
  const [key, setKey] = useState<string>("G");
  const [chord, setChord] = useState<string>("Gmaj7");
  const [pattern, setPattern] = useState<ArpeggioPattern>("ascending");
  const [position, setPosition] = useState<ArpeggioPosition>("low");
  const [length, setLength] = useState<number>(16);
  const [tempo, setTempo] = useState<number>(120);
  const [subdivision, setSubdivision] = useState<number>(2);
  const [ascii, setAscii] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generate = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/arpeggio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, chord, pattern, position, length, tempo, subdivision })
      });
      if (!res.ok) throw new Error('Generation failed');
      const data: ArpeggioResponse = await res.json();
      setAscii(data.ascii);
      if (onOverlay) {
        onOverlay(data.events.map(e => ({ string: e.string, fret: e.fret })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="text-lg font-semibold text-slate-900">Arpeggio Generator</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm">Key</Label>
            <Select value={key} onValueChange={(v: string) => setKey(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTES.map(n => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Chord</Label>
            <Input value={chord} onChange={(e) => setChord(e.target.value)} placeholder="e.g., Gmaj7, Em7b5, C9" />
          </div>
          <div>
            <Label className="text-sm">Pattern</Label>
            <Select value={pattern} onValueChange={(v: string) => setPattern(v as ArpeggioPattern)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ascending">Ascending</SelectItem>
                <SelectItem value="descending">Descending</SelectItem>
                <SelectItem value="updown">Up-Down</SelectItem>
                <SelectItem value="sweep">Sweep</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Position</Label>
            <Select value={position} onValueChange={(v: string) => setPosition(v as ArpeggioPosition)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="mid">Mid</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="multi">Multi-Position</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Length: {length}</Label>
            <Slider value={[length]} min={4} max={64} step={1} onValueChange={(v: number[]) => setLength(v[0])} />
          </div>
          <div>
            <Label className="text-sm">Tempo: {tempo} BPM</Label>
            <Slider value={[tempo]} min={40} max={240} step={5} onValueChange={(v: number[]) => setTempo(v[0])} />
          </div>
          <div>
            <Label className="text-sm">Subdivision</Label>
            <Select value={String(subdivision)} onValueChange={(v: string) => setSubdivision(parseInt(v, 10))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Quarter</SelectItem>
                <SelectItem value="2">Eighths</SelectItem>
                <SelectItem value="3">Triplets</SelectItem>
                <SelectItem value="4">Sixteenths</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate'}</Button>
        </div>
        {ascii && (
          <div className="mt-4">
            <Label className="text-sm">ASCII TAB</Label>
            <pre className="p-3 bg-slate-900 text-green-400 rounded-md overflow-x-auto text-sm whitespace-pre">{ascii}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

