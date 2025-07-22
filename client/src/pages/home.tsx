import { useState } from "react";
import { Guitar } from "lucide-react";
import { useFretboard } from "@/hooks/use-fretboard";
import GuitarControls from "@/components/guitar-controls";
import ScaleControls from "@/components/scale-controls";
import DisplayControls from "@/components/display-controls";
import Fretboard from "@/components/fretboard";

export default function Home() {
  const {
    guitarType,
    setGuitarType,
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
  } = useFretboard();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Guitar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">FretMagic</h1>
                <p className="hidden sm:block text-sm text-slate-500 font-medium">
                  Guitar Scales & Modes Explorer
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <GuitarControls
              guitarType={guitarType}
              setGuitarType={setGuitarType}
              tuning={tuning}
              setTuning={setTuning}
            />
            
            <ScaleControls
              rootNote={rootNote}
              setRootNote={setRootNote}
              scaleType={scaleType}
              setScaleType={setScaleType}
            />
            
            <DisplayControls
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              fretRange={fretRange}
              setFretRange={setFretRange}
              showOptions={showOptions}
              setShowOptions={setShowOptions}
            />
          </div>
          
          {/* Main Fretboard */}
          <div className="lg:col-span-9">
            <Fretboard
              guitarType={guitarType}
              tuning={tuning}
              rootNote={rootNote}
              scaleType={scaleType}
              displayMode={displayMode}
              fretRange={fretRange}
              showOptions={showOptions}
              currentScale={currentScale}
              fretboardNotes={fretboardNotes}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
