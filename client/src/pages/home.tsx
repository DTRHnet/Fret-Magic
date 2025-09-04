import { useState, useEffect } from "react";
import { Guitar, Download, FileImage, FileText, Move3D } from "lucide-react";
import { useFretboard } from "@/hooks/use-fretboard";
import GuitarControls from "@/components/guitar-controls";
import ScaleControls from "@/components/scale-controls";
import DisplayControls from "@/components/display-controls";
import TuningHelper from "@/components/tuning-helper";
import CustomTuning from "@/components/custom-tuning";
import Fretboard from "@/components/fretboard";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ExternalLink } from "lucide-react";
import { exportToPNG, exportToPDF, createExportMetadata, parseConfigFromUrl } from "@/lib/export";
import { SCALES } from "@/lib/music-theory";
import { TUNING_PRESETS } from "@/lib/guitar-data";
import ChordShapes from "@/components/chord-shapes";
import { TutorialButton } from "@/components/tutorial-mode";
import ChordProgressionGenerator from "@/components/chord-progression-generator";
import AudioControls from "@/components/audio-controls";
import ShareControls from "@/components/share-controls";

export default function Home() {
  const [forceCustomTuning, setForceCustomTuning] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<HTMLElement | null>(null);
  
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

  // Determine if current tuning is custom
  const currentPreset = Object.entries(TUNING_PRESETS).find(([_, preset]) => 
    preset.strings === guitarType && 
    JSON.stringify(preset.tuning) === JSON.stringify(tuning.slice(0, guitarType))
  )?.[0];
  
  const isCustomTuning = !currentPreset || forceCustomTuning;

  // Load configuration from URL parameters on mount
  useEffect(() => {
    const urlConfig = parseConfigFromUrl();
    if (urlConfig) {
      if (urlConfig.rootNote) setRootNote(urlConfig.rootNote);
      if (urlConfig.scaleType) setScaleType(urlConfig.scaleType);
      if (urlConfig.guitarType) setGuitarType(urlConfig.guitarType);
      if (urlConfig.displayMode) setDisplayMode(urlConfig.displayMode);
      if (urlConfig.fretRange) setFretRange(urlConfig.fretRange);
      if (urlConfig.showNotes !== undefined || urlConfig.showIntervals !== undefined || urlConfig.showFretNumbers !== undefined) {
        setShowOptions({
          rootNotes: urlConfig.showNotes ?? showOptions.rootNotes,
          scaleNotes: urlConfig.showIntervals ?? showOptions.scaleNotes,
          allNotes: showOptions.allNotes, // Keep current allNotes setting
          fretNumbers: urlConfig.showFretNumbers ?? showOptions.fretNumbers
        });
      }
      
      // Force custom tuning mode if tuning was provided
      if (urlConfig.tuning) {
        setForceCustomTuning(true);
      }
    }
  }, []);

  const handleExportPNG = async () => {
    try {
      const metadata = createExportMetadata(
        guitarType,
        tuning,
        scaleType,
        SCALES[scaleType as keyof typeof SCALES]?.name || scaleType,
        rootNote
      );
      await exportToPNG('fretboard-container', metadata);
    } catch (error) {
      console.error('PNG export failed:', error);
    }
  };

  const handleExportPDF = async () => {
    try {
      const metadata = createExportMetadata(
        guitarType,
        tuning,
        scaleType,
        SCALES[scaleType as keyof typeof SCALES]?.name || scaleType,
        rootNote
      );
      await exportToPDF('fretboard-container', metadata);
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  };

  // Drag and drop functionality
  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData('text/plain', componentId);
    setDraggedElement(componentId);
    setDraggedComponent(e.currentTarget as HTMLElement);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
    
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId !== targetId && draggedComponent) {
      // Check if it's a valid drop (e.g., fretboard can't go to left column)
      if (sourceId === 'fretboard-container' && targetId.includes('left-column')) {
        return; // Invalid drop - fretboard too large for left column
      }
      
      // Swap components
      const sourceElement = document.getElementById(sourceId);
      const targetElement = document.getElementById(targetId);
      
      if (sourceElement && targetElement) {
        const sourceParent = sourceElement.parentNode;
        const targetParent = targetElement.parentNode;
        const sourceNextSibling = sourceElement.nextSibling;
        const targetNextSibling = targetElement.nextSibling;
        
        if (sourceParent && targetParent) {
          if (sourceNextSibling) {
            sourceParent.insertBefore(targetElement, sourceNextSibling);
          } else {
            sourceParent.appendChild(targetElement);
          }
          
          if (targetNextSibling) {
            targetParent.insertBefore(sourceElement, targetNextSibling);
          } else {
            targetParent.appendChild(sourceElement);
          }
        }
      }
    }
    
    setDraggedElement(null);
    setDraggedComponent(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Drag Mode Overlay */}
      {isDragMode && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 pointer-events-none" />
      )}
      

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
            
            {/* Controls */}
            <div className="flex items-center space-x-2">
              <TutorialButton />
              
              {/* Drag Mode Toggle */}
              <Button 
                variant={isDragMode ? "default" : "outline"} 
                size="sm"
                onClick={() => setIsDragMode(!isDragMode)}
                className="hidden lg:flex"
              >
                <Move3D className="w-4 h-4 mr-2" />
                {isDragMode ? "Exit Arrange" : "Arrange"}
              </Button>
              
              <div id="export-controls">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleExportPNG}>
                      <FileImage className="w-4 h-4 mr-2" />
                      Export as PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportPDF}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://dtrh.net', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                dtrh.net
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div id="guitar-controls">
              <GuitarControls
                guitarType={guitarType}
                setGuitarType={setGuitarType}
                tuning={tuning}
                setTuning={setTuning}
                onCustomSelected={() => setForceCustomTuning(true)}
                onPresetSelected={() => setForceCustomTuning(false)}
              />
            </div>
            
            <div id="scale-controls">
              <ScaleControls
                rootNote={rootNote}
                setRootNote={setRootNote}
                scaleType={scaleType}
                setScaleType={setScaleType}
              />
            </div>
            
            <div id="display-controls">
              <DisplayControls
                displayMode={displayMode}
                setDisplayMode={setDisplayMode}
                fretRange={fretRange}
                setFretRange={setFretRange}
                showOptions={showOptions}
                setShowOptions={setShowOptions}
              />
            </div>
            
            <div id="tuning-controls">
              {isCustomTuning ? (
                <CustomTuning
                  guitarType={guitarType}
                  tuning={tuning}
                  setTuning={setTuning}
                />
              ) : (
                <TuningHelper
                  guitarType={guitarType}
                  tuning={tuning}
                />
              )}
            </div>
          </div>

          <div id="fretboard-container">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChordShapes
              rootNote={rootNote}
              scaleType={scaleType}
              guitarType={guitarType}
              currentScale={currentScale}
            />

            <ChordProgressionGenerator
              rootNote={rootNote}
              scaleType={scaleType}
              onChordSelect={(chordNotes) => {
                console.log('Selected chord notes:', chordNotes);
                // TODO: Highlight chord notes on fretboard
              }}
            />

            <AudioControls
              rootNote={rootNote}
              scaleType={scaleType}
              currentScale={currentScale}
            />

            <ShareControls
              rootNote={rootNote}
              scaleType={scaleType}
              guitarType={guitarType}
              tuning={tuning}
              showNotes={showOptions.rootNotes}
              showIntervals={showOptions.scaleNotes}
              showFretNumbers={showOptions.fretNumbers}
              fretRange={fretRange}
              displayMode={displayMode}
              currentScale={currentScale}
            />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-6">
          
          {/* Left Controls Column */}
          <div className="lg:col-span-1 space-y-6" id="left-column">
            <div 
              id="guitar-controls"
              className={`draggable-component ${isDragMode ? 'drag-mode' : ''} ${draggedElement === 'guitar-controls' ? 'dragging' : ''}`}
              draggable={isDragMode}
              onDragStart={(e) => handleDragStart(e, 'guitar-controls')}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'guitar-controls')}
            >
              <GuitarControls
                guitarType={guitarType}
                setGuitarType={setGuitarType}
                tuning={tuning}
                setTuning={setTuning}
                onCustomSelected={() => setForceCustomTuning(true)}
                onPresetSelected={() => setForceCustomTuning(false)}
              />
            </div>
            
            <div id="scale-controls">
              <ScaleControls
                rootNote={rootNote}
                setRootNote={setRootNote}
                scaleType={scaleType}
                setScaleType={setScaleType}
              />
            </div>
            
            <div id="display-controls">
              <DisplayControls
                displayMode={displayMode}
                setDisplayMode={setDisplayMode}
                fretRange={fretRange}
                setFretRange={setFretRange}
                showOptions={showOptions}
                setShowOptions={setShowOptions}
              />
            </div>
            
            <div id="tuning-controls">
              {isCustomTuning ? (
                <CustomTuning
                  guitarType={guitarType}
                  tuning={tuning}
                  setTuning={setTuning}
                />
              ) : (
                <TuningHelper
                  guitarType={guitarType}
                  tuning={tuning}
                />
              )}
            </div>
          </div>
          
          {/* Right Content Area */}
          <div className="lg:col-span-5 space-y-6">
            {/* Fretboard */}
            <div id="fretboard-container">
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

            {/* Advanced Tools Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ChordShapes
                rootNote={rootNote}
                scaleType={scaleType}
                guitarType={guitarType}
                currentScale={currentScale}
              />

              <ChordProgressionGenerator
                rootNote={rootNote}
                scaleType={scaleType}
                onChordSelect={(chordNotes) => {
                  console.log('Selected chord notes:', chordNotes);
                  // TODO: Highlight chord notes on fretboard
                }}
              />

              <AudioControls
                rootNote={rootNote}
                scaleType={scaleType}
                currentScale={currentScale}
              />

              <ShareControls
                rootNote={rootNote}
                scaleType={scaleType}
                guitarType={guitarType}
                tuning={tuning}
                showNotes={showOptions.rootNotes}
                showIntervals={showOptions.scaleNotes}
                showFretNumbers={showOptions.fretNumbers}
                fretRange={fretRange}
                displayMode={displayMode}
                currentScale={currentScale}
              />
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl rounded-xl p-6 border border-blue-800">
            <div className="text-center">
              <div className="text-white font-semibold text-base tracking-wide">
                KBS &lt; admin [at] dtrh [dot] net &gt;
              </div>
              <div className="text-blue-100 text-xs mt-1 opacity-90">
                2025 • DTRH.NET PROJECT
              </div>
            </div>
          </div>
        </div>
        <div className="pb-6"></div>
      </footer>
    </div>
  );
}
