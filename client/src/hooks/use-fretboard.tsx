import { useState, useMemo } from "react";
import { calculateFretboardNotes, getScaleInfo } from "@/lib/music-theory";
import { getDefaultTuningForGuitarType } from "@/lib/guitar-data";

export function useFretboard() {
  const [guitarType, setGuitarType] = useState<number>(6);
  const [tuning, setTuning] = useState<string[]>(getDefaultTuningForGuitarType(6));
  const [rootNote, setRootNote] = useState<string>("C");
  const [scaleType, setScaleType] = useState<string>("ionian");
  const [displayMode, setDisplayMode] = useState<"notes" | "intervals">("notes");
  const [fretRange, setFretRange] = useState<number>(15);
  const [showOptions, setShowOptions] = useState({
    rootNotes: true,
    scaleNotes: true,
    fretNumbers: false
  });

  // Update tuning when guitar type changes
  const handleGuitarTypeChange = (type: number) => {
    setGuitarType(type);
    setTuning(getDefaultTuningForGuitarType(type));
  };

  // Calculate fretboard notes
  const fretboardNotes = useMemo(() => {
    const currentTuning = tuning.slice(0, guitarType);
    return calculateFretboardNotes(currentTuning, rootNote, scaleType, fretRange);
  }, [tuning, guitarType, rootNote, scaleType, fretRange]);

  // Get current scale info
  const currentScale = useMemo(() => {
    return getScaleInfo(rootNote, scaleType);
  }, [rootNote, scaleType]);

  return {
    guitarType,
    setGuitarType: handleGuitarTypeChange,
    tuning,
    setTuning,
    rootNote,
    setRootNote,
    scaleType,
    setScaleType,
    displayMode,
    setDisplayMode,
    fretRange,
    setFretRange,
    showOptions,
    setShowOptions,
    currentScale,
    fretboardNotes
  };
}
