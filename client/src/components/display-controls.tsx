import { Eye, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DisplayControlsProps {
  displayMode: "notes" | "intervals" | "degrees";
  setDisplayMode: (mode: "notes" | "intervals" | "degrees") => void;
  noteSpelling?: "auto" | "sharps" | "flats";
  setNoteSpelling?: (policy: "auto" | "sharps" | "flats") => void;
  fretRange: number;
  setFretRange: (range: number) => void;
  showOptions: {
    rootNotes: boolean;
    scaleNotes: boolean;
    fretNumbers: boolean;
  };
  setShowOptions: (options: {
    rootNotes: boolean;
    scaleNotes: boolean;
    fretNumbers: boolean;
  }) => void;
}

export default function DisplayControls({
  displayMode,
  setDisplayMode,
  noteSpelling,
  setNoteSpelling,
  fretRange,
  setFretRange,
  showOptions,
  setShowOptions
}: DisplayControlsProps) {
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-primary" />
            Display Options
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Note Display
              </Label>
              <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
                <Button
                  variant={displayMode === "notes" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => setDisplayMode("notes")}
                >
                  Note Names
                </Button>
                <Button
                  variant={displayMode === "intervals" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => setDisplayMode("intervals")}
                >
                  Intervals
                </Button>
                <Button
                  variant={displayMode === "degrees" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => setDisplayMode("degrees")}
                >
                  Degrees
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Note Spelling
              </Label>
              <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
                <Button
                  variant={noteSpelling === "auto" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => setNoteSpelling && setNoteSpelling("auto")}
                >
                  Auto (Key)
                </Button>
                <Button
                  variant={noteSpelling === "sharps" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => setNoteSpelling && setNoteSpelling("sharps")}
                >
                  Sharps
                </Button>
                <Button
                  variant={noteSpelling === "flats" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => setNoteSpelling && setNoteSpelling("flats")}
                >
                  Flats
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Fret Range: {fretRange} frets
              </Label>
              <Slider
                value={[fretRange]}
                onValueChange={(value: number[]) => setFretRange(value[0])}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Note Display Mode
              </Label>
              <RadioGroup
                value={
                  !showOptions.rootNotes && !showOptions.scaleNotes
                    ? "all"
                    : showOptions.rootNotes && !showOptions.scaleNotes
                    ? "root"
                    : "scale"
                }
                onValueChange={(value: string) => {
                  if (value === "all") {
                    setShowOptions({ ...showOptions, rootNotes: false, scaleNotes: false });
                  } else if (value === "root") {
                    setShowOptions({ ...showOptions, rootNotes: true, scaleNotes: false });
                  } else if (value === "scale") {
                    setShowOptions({ ...showOptions, rootNotes: true, scaleNotes: true });
                  }
                }}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="text-sm text-slate-700">
                    All Notes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scale" id="scale" />
                  <Label htmlFor="scale" className="text-sm text-slate-700">
                    Scale Notes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="root" id="root" />
                  <Label htmlFor="root" className="text-sm text-slate-700">
                    Root Notes
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-frets"
                  checked={showOptions.fretNumbers}
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    setShowOptions({ ...showOptions, fretNumbers: !!checked })
                  }
                />
                <Label htmlFor="show-frets" className="text-sm text-slate-700">
                  Show Fret Numbers
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


    </>
  );
}
