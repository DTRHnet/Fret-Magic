import { Eye, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface DisplayControlsProps {
  displayMode: "notes" | "intervals";
  setDisplayMode: (mode: "notes" | "intervals") => void;
  fretRange: number;
  setFretRange: (range: number) => void;
  showOptions: {
    rootNotes: boolean;
    scaleNotes: boolean;
    allNotes: boolean;
    fretNumbers: boolean;
  };
  setShowOptions: (options: {
    rootNotes: boolean;
    scaleNotes: boolean;
    allNotes: boolean;
    fretNumbers: boolean;
  }) => void;
}

export default function DisplayControls({
  displayMode,
  setDisplayMode,
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
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Fret Range: {fretRange} frets
              </Label>
              <Slider
                value={[fretRange]}
                onValueChange={(value) => setFretRange(value[0])}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-root"
                  checked={showOptions.rootNotes}
                  onCheckedChange={(checked) =>
                    setShowOptions({ ...showOptions, rootNotes: !!checked })
                  }
                />
                <Label htmlFor="show-root" className="text-sm text-slate-700">
                  Show Root Notes
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-scale"
                  checked={showOptions.scaleNotes}
                  onCheckedChange={(checked) =>
                    setShowOptions({ ...showOptions, scaleNotes: !!checked })
                  }
                />
                <Label htmlFor="show-scale" className="text-sm text-slate-700">
                  Show Scale Notes
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-all"
                  checked={showOptions.allNotes}
                  onCheckedChange={(checked) =>
                    setShowOptions({ ...showOptions, allNotes: !!checked })
                  }
                />
                <Label htmlFor="show-all" className="text-sm text-slate-700">
                  Show All Notes
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-frets"
                  checked={showOptions.fretNumbers}
                  onCheckedChange={(checked) =>
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
