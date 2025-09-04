import { Music } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FretboardNote } from "@/lib/music-theory";
import { audioEngine } from "@/lib/audio";

interface FretboardProps {
  guitarType: number;
  tuning: string[];
  rootNote: string;
  scaleType: string;
  displayMode: "notes" | "intervals";
  fretRange: number;
  showOptions: {
    rootNotes: boolean;
    scaleNotes: boolean;
    fretNumbers: boolean;
  };
  currentScale: {
    name: string;
    notes: string[];
    pattern: string;
  };
  fretboardNotes: FretboardNote[][];
}

export default function Fretboard({
  guitarType,
  tuning,
  rootNote,
  scaleType,
  displayMode,
  fretRange,
  showOptions,
  currentScale,
  fretboardNotes
}: FretboardProps) {
  const fretWidth = 70;
  const stringSpacing = 35;
  const nutX = 50;
  const startX = nutX + fretWidth; // This ensures first fret has same width as others
  const startY = 40;
  
  const svgWidth = startX + (fretRange + 1) * fretWidth + 50;
  const svgHeight = startY + (guitarType - 1) * stringSpacing + 80;

  const handleNoteClick = async (stringIndex: number, fretIndex: number) => {
    try {
      const openStringNote = tuning[stringIndex];
      if (openStringNote) {
        await audioEngine.playFretboardNote(openStringNote, stringIndex, fretIndex, guitarType);
      }
    } catch (error) {
      console.error('Failed to play note:', error);
    }
  };

  const renderNote = (note: FretboardNote, stringIndex: number, fretIndex: number) => {
    // Show all notes by default, but allow filtering by options
    // If both rootNotes and scaleNotes are disabled, show all notes
    if (!showOptions.rootNotes && !showOptions.scaleNotes) {
      return true; // Show all notes
    }
    
    // If only rootNotes is enabled, show only root notes
    if (showOptions.rootNotes && !showOptions.scaleNotes) {
      return note.isRoot;
    }
    
    // If only scaleNotes is enabled, show only scale notes
    if (!showOptions.rootNotes && showOptions.scaleNotes) {
      return note.isInScale;
    }
    
    // If both are enabled, show both root and scale notes
    if (showOptions.rootNotes && showOptions.scaleNotes) {
      return note.isRoot || note.isInScale;
    }

    const x = fretIndex === 0
      ? nutX + fretWidth / 2
      : startX + (fretIndex - 1) * fretWidth + fretWidth / 2;
    const y = startY + (guitarType - 1 - stringIndex) * stringSpacing;
    
    const displayText = displayMode === "notes" ? note.note : note.interval;
    
    return (
      <g 
        key={`${stringIndex}-${fretIndex}`} 
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => handleNoteClick(stringIndex, fretIndex)}
      >
        <circle
          cx={x}
          cy={y}
          r={12}
          fill={
            note.isRoot 
              ? "hsl(0, 84%, 60%)" 
              : note.isInScale 
                ? "hsl(221, 91%, 60%)" 
                : "hsl(0, 0%, 70%)" // Gray for non-scale notes
          }
          stroke={
            note.isRoot 
              ? "hsl(0, 84%, 50%)" 
              : note.isInScale 
                ? "hsl(221, 91%, 53%)" 
                : "hsl(0, 0%, 60%)" // Darker gray for non-scale notes
          }
          strokeWidth={2}
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white text-xs font-semibold pointer-events-none"
        >
          {displayText}
        </text>
      </g>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center">
            <Music className="w-5 h-5 mr-2 text-primary" />
            Fretboard Visualization
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600">
              <span className="font-medium">{currentScale.name}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(0, 84%, 60%)" }}></div>
                <span className="text-slate-600">Root Note</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(221, 91%, 60%)" }}></div>
                <span className="text-slate-600">Scale Note</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(0, 0%, 70%)" }}></div>
                <span className="text-slate-600">Other Note</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[800px]"
            style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}
          >
            {/* Nut */}
            <line
              x1={nutX}
              y1={startY - 10}
              x2={nutX}
              y2={startY + (guitarType - 1) * stringSpacing + 10}
              stroke="#1e293b"
              strokeWidth={4}
            />
            
            {/* Fret Lines */}
            {Array.from({ length: fretRange }, (_, i) => (
              <line
                key={i}
                x1={startX + i * fretWidth}
                y1={startY - 10}
                x2={startX + i * fretWidth}
                y2={startY + (guitarType - 1) * stringSpacing + 10}
                stroke="#94a3b8"
                strokeWidth={1}
              />
            ))}
            
            {/* String Lines */}
            {tuning.slice(0, guitarType).map((_, i) => (
              <line
                key={i}
                x1={nutX}
                y1={startY + (guitarType - 1 - i) * stringSpacing}
                x2={startX + fretRange * fretWidth - fretWidth + 20}
                y2={startY + (guitarType - 1 - i) * stringSpacing}
                stroke="#64748b"
                strokeWidth={1}
              />
            ))}
            
            {/* Fret Markers */}
            {[3, 5, 7, 9, 12].map((fret) => {
              if (fret > fretRange) return null;
              const x = startX + (fret - 1) * fretWidth + fretWidth / 2;
              const centerY = startY + ((guitarType - 1) * stringSpacing) / 2;
              
              if (fret === 12) {
                // Double marker for 12th fret
                return (
                  <g key={fret}>
                    <circle
                      cx={x}
                      cy={centerY - 15}
                      r={4}
                      fill="#cbd5e1"
                    />
                    <circle
                      cx={x}
                      cy={centerY + 15}
                      r={4}
                      fill="#cbd5e1"
                    />
                  </g>
                );
              }
              
              return (
                <circle
                  key={fret}
                  cx={x}
                  cy={centerY}
                  r={4}
                  fill="#cbd5e1"
                />
              );
            })}
            
            {/* Fret Numbers */}
            {showOptions.fretNumbers && Array.from({ length: fretRange }, (_, i) => {
              const x = i === 0
                ? nutX + fretWidth / 2
                : startX + i * fretWidth - fretWidth / 2;
              return (
                <text
                  key={i}
                  x={x}
                  y={svgHeight - 20}
                  textAnchor="middle"
                  className="fill-slate-400 text-xs font-medium"
                >
                  {i + 1}
                </text>
              );
            })}
            
            {/* String Labels */}
            {tuning.slice(0, guitarType).map((note, i) => (
              <text
                key={i}
                x={25}
                y={startY + (guitarType - 1 - i) * stringSpacing + 5}
                className="fill-slate-600 text-sm font-medium"
              >
                {note}
              </text>
            ))}
            
            {/* Notes */}
            {fretboardNotes.map((stringNotes, stringIndex) =>
              stringNotes.slice(0, fretRange + 1).map((note, fretIndex) =>
                renderNote(note, stringIndex, fretIndex)
              )
            )}
          </svg>
        </div>
        
        {/* Scale Info Panel */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-700">Scale:</span>
              <span className="ml-2 text-slate-600">{currentScale.name}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Notes:</span>
              <span className="ml-2 text-slate-600">{currentScale.notes.join(", ")}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Pattern:</span>
              <span className="ml-2 text-slate-600">{currentScale.pattern}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
