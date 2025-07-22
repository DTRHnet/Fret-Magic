import { Music, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NOTES, SCALES } from "@/lib/music-theory";

interface ScaleControlsProps {
  rootNote: string;
  setRootNote: (note: string) => void;
  scaleType: string;
  setScaleType: (scale: string) => void;
}

export default function ScaleControls({
  rootNote,
  setRootNote,
  scaleType,
  setScaleType
}: ScaleControlsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Music className="w-5 h-5 mr-2 text-primary" />
          Scale & Mode
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="root-note" className="text-sm font-medium text-slate-700">
              Root Note
            </Label>
            <Select value={rootNote} onValueChange={setRootNote}>
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
          
          <div>
            <Label htmlFor="scale-type" className="text-sm font-medium text-slate-700">
              Scale/Mode
            </Label>
            <Select value={scaleType} onValueChange={setScaleType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Major Scale Modes
                </div>
                {Object.entries(SCALES)
                  .filter(([_, scale]) => scale.category === "modes")
                  .map(([key, scale]) => (
                    <SelectItem key={key} value={key}>
                      {scale.name}
                    </SelectItem>
                  ))}
                
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Pentatonic Scales
                </div>
                {Object.entries(SCALES)
                  .filter(([_, scale]) => scale.category === "pentatonic")
                  .map(([key, scale]) => (
                    <SelectItem key={key} value={key}>
                      {scale.name}
                    </SelectItem>
                  ))}
                
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Other Scales
                </div>
                {Object.entries(SCALES)
                  .filter(([_, scale]) => scale.category === "other")
                  .map(([key, scale]) => (
                    <SelectItem key={key} value={key}>
                      {scale.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button className="w-full" variant="default">
            <Play className="w-4 h-4 mr-2" />
            Generate Scale
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
