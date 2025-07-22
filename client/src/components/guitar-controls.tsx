import { Guitar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TUNING_PRESETS } from "@/lib/guitar-data";
import { validateNote } from "@/lib/music-theory";

interface GuitarControlsProps {
  guitarType: number;
  setGuitarType: (type: number) => void;
  tuning: string[];
  setTuning: (tuning: string[]) => void;
}

export default function GuitarControls({
  guitarType,
  setGuitarType,
  tuning,
  setTuning
}: GuitarControlsProps) {
  const currentPreset = Object.entries(TUNING_PRESETS).find(
    ([_, preset]) => 
      preset.strings === guitarType && 
      JSON.stringify(preset.tuning) === JSON.stringify(tuning.slice(0, guitarType))
  )?.[0] || "custom";

  const handlePresetChange = (presetName: string) => {
    if (presetName !== "custom" && TUNING_PRESETS[presetName]) {
      const preset = TUNING_PRESETS[presetName];
      setGuitarType(preset.strings);
      setTuning([...preset.tuning]);
    }
  };

  const handleCustomTuningChange = (index: number, value: string) => {
    const newTuning = [...tuning];
    const upperValue = value.toUpperCase();
    
    if (validateNote(upperValue) || upperValue === "") {
      newTuning[index] = upperValue;
      setTuning(newTuning);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Guitar className="w-5 h-5 mr-2 text-primary" />
          Guitar Setup
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="guitar-type" className="text-sm font-medium text-slate-700">
              Guitar Type
            </Label>
            <Select value={guitarType.toString()} onValueChange={(value) => setGuitarType(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6-String Guitar</SelectItem>
                <SelectItem value="7">7-String Guitar</SelectItem>
                <SelectItem value="8">8-String Guitar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="tuning-preset" className="text-sm font-medium text-slate-700">
              Tuning
            </Label>
            <Select value={currentPreset} onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TUNING_PRESETS)
                  .filter(([_, preset]) => preset.strings === guitarType)
                  .map(([key, preset]) => (
                    <SelectItem key={key} value={key}>
                      {preset.name} ({preset.tuning.join("")})
                    </SelectItem>
                  ))}
                <SelectItem value="custom">Custom Tuning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {currentPreset === "custom" && (
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Custom Tuning (Low to High)
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: guitarType }).map((_, i) => (
                  <Input
                    key={i}
                    value={tuning[i] || ""}
                    onChange={(e) => handleCustomTuningChange(i, e.target.value)}
                    placeholder={`String ${i + 1}`}
                    className="text-center"
                    maxLength={2}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Enter note names (e.g., E, A, D, G, B, E)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
