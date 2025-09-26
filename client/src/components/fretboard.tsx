import { Music } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FretboardNote, formatNoteForDisplay, NoteSpellingPolicy, SCALES } from "@/lib/music-theory";
import { audioEngine } from "@/lib/audio";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FretboardProps {
  guitarType: number;
  tuning: string[];
  rootNote: string;
  scaleType: string;
  displayMode: "notes" | "intervals" | "degrees";
  noteSpelling?: NoteSpellingPolicy;
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
  overlays?: { string: number; fret: number }[];
}

export default function Fretboard({
  guitarType,
  tuning,
  rootNote,
  scaleType,
  displayMode,
  noteSpelling = 'auto',
  fretRange,
  showOptions,
  currentScale,
  fretboardNotes,
  overlays = []
}: FretboardProps) {
  const [chordTableType, setChordTableType] = useState<"triads" | "sevenths">("triads");
  const fretWidth = 70;
  const stringSpacing = 35;
  const nutX = 50;
  const startX = nutX + fretWidth; // This ensures first fret has same width as others
  const startY = 40;
  
  const svgWidth = startX + (fretRange + 1) * fretWidth + 50;
  const svgHeight = startY + (guitarType - 1) * stringSpacing + 80;

  // Build diatonic triads table (degree, chord name, notes, quality)
  const diatonicTable = (() => {
    const scale = SCALES[scaleType as keyof typeof SCALES];
    if (!scale) return [] as { degree: string; chordName: string; notes: string[]; quality: string }[];
    const intervals = scale.intervals;
    const degreeCount = intervals.length;
    if (degreeCount < 3 || !currentScale?.notes?.length) return [] as { degree: string; chordName: string; notes: string[]; quality: string }[];

    const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII"]; // fallback up to 7

    const items: { degree: string; chordName: string; notes: string[]; quality: string }[] = [];

    for (let i = 0; i < Math.min(degreeCount, 7); i++) {
      const j0 = i;
      const j1 = (i + 2) % degreeCount;
      const j2 = (i + 4) % degreeCount;

      const n0 = currentScale.notes[j0];
      const n1 = currentScale.notes[j1];
      const n2 = currentScale.notes[j2];

      const t3 = (intervals[j1] - intervals[j0] + 12) % 12;
      const t5 = (intervals[j2] - intervals[j0] + 12) % 12;

      let quality = "Other";
      if (t3 === 4 && t5 === 7) quality = "Major";
      else if (t3 === 3 && t5 === 7) quality = "Minor";
      else if (t3 === 3 && t5 === 6) quality = "Diminished";
      else if (t3 === 4 && t5 === 8) quality = "Augmented";

      const degreeRoman = quality === "Minor" || quality === "Diminished"
        ? romanNumerals[i].toLowerCase()
        : romanNumerals[i];
      const degree = quality === "Diminished" ? `${degreeRoman}°` : degreeRoman;

      const rootDisp = formatNoteForDisplay(n0, noteSpelling, rootNote);
      const chordName = `${rootDisp} ${quality.toLowerCase()}`;
      const notes = [n0, n1, n2].map(x => formatNoteForDisplay(x, noteSpelling, rootNote));

      items.push({ degree, chordName, notes, quality });
    }
    return items;
  })();

  const diatonicSevenths = (() => {
    const scale = SCALES[scaleType as keyof typeof SCALES];
    if (!scale) return [] as { degree: string; chordName: string; notes: string[]; quality: string }[];
    const intervals = scale.intervals;
    const degreeCount = intervals.length;
    if (degreeCount < 4 || !currentScale?.notes?.length) return [] as { degree: string; chordName: string; notes: string[]; quality: string }[];

    const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII"]; // fallback up to 7
    const items: { degree: string; chordName: string; notes: string[]; quality: string }[] = [];

    for (let i = 0; i < Math.min(degreeCount, 7); i++) {
      const j0 = i;
      const j1 = (i + 2) % degreeCount;
      const j2 = (i + 4) % degreeCount;
      const j3 = (i + 6) % degreeCount;

      const n0 = currentScale.notes[j0];
      const n1 = currentScale.notes[j1];
      const n2 = currentScale.notes[j2];
      const n3 = currentScale.notes[j3];

      const t3 = (intervals[j1] - intervals[j0] + 12) % 12;
      const t5 = (intervals[j2] - intervals[j0] + 12) % 12;
      const t7 = (intervals[j3] - intervals[j0] + 12) % 12;

      // Determine 7th chord quality
      let quality = "Other";
      let suffix = "";
      if (t3 === 4 && t5 === 7 && t7 === 11) { quality = "Major 7"; suffix = "maj7"; }
      else if (t3 === 4 && t5 === 7 && t7 === 10) { quality = "Dominant 7"; suffix = "7"; }
      else if (t3 === 3 && t5 === 7 && t7 === 10) { quality = "Minor 7"; suffix = "m7"; }
      else if (t3 === 3 && t5 === 6 && t7 === 10) { quality = "Half-diminished"; suffix = "m7♭5"; }
      else if (t3 === 3 && t5 === 6 && t7 === 9) { quality = "Diminished 7"; suffix = "dim7"; }

      const romanBase = (quality.includes("Minor") || quality.includes("diminished"))
        ? romanNumerals[i].toLowerCase()
        : romanNumerals[i];
      const degree = quality.includes("diminished") ? `${romanBase}°` : romanBase;

      const rootDisp = formatNoteForDisplay(n0, noteSpelling, rootNote);
      const chordName = suffix ? `${rootDisp} ${suffix}` : `${rootDisp}`;
      const notes = [n0, n1, n2, n3].map(x => formatNoteForDisplay(x, noteSpelling, rootNote));

      items.push({ degree, chordName, notes, quality });
    }
    return items;
  })();

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
    // Skip rendering open-string note markers; the left labels already show tuning
    if (fretIndex === 0) return null;
    // Show all notes by default, but allow filtering by options
    if (!showOptions.rootNotes && !showOptions.scaleNotes) {
      // Show all notes - continue to render
    } else if (showOptions.rootNotes && !showOptions.scaleNotes) {
      // If only rootNotes is enabled, show only root notes
      if (!note.isRoot) return null;
    } else if (!showOptions.rootNotes && showOptions.scaleNotes) {
      // If only scaleNotes is enabled, show only scale notes
      if (!note.isInScale) return null;
    } else if (showOptions.rootNotes && showOptions.scaleNotes) {
      // If both are enabled, show both root and scale notes
      if (!note.isRoot && !note.isInScale) return null;
    } else {
      // Fallback: show all notes if no specific case matches
    }

    const x = fretIndex === 1
      ? nutX + fretWidth / 2
      : startX + (fretIndex - 2) * fretWidth + fretWidth / 2;
    const y = startY + (guitarType - 1 - stringIndex) * stringSpacing;
    
    const displayText = displayMode === "notes"
      ? formatNoteForDisplay(note.note, noteSpelling, rootNote)
      : displayMode === "intervals"
        ? note.interval
        : note.isRoot
          ? "1"
          : note.interval === "2" ? "2" :
            note.interval === "b2" ? "b2" :
            note.interval === "b3" ? "b3" :
            note.interval === "3" ? "3" :
            note.interval === "4" ? "4" :
            note.interval === "b5" ? "b5" :
            note.interval === "5" ? "5" :
            note.interval === "b6" ? "b6" :
            note.interval === "6" ? "6" :
            note.interval === "b7" ? "b7" :
            note.interval === "7" ? "7" : "";
    
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
        
        <div className="overflow-x-auto overflow-y-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[800px] max-w-full"
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
            {[3, 5, 7, 9, 12, 15, 17, 19, 21, 24].map((fret) => {
              if (fret > fretRange) return null;
              const x = fret === 1
                ? nutX + fretWidth / 2
                : startX + (fret - 2) * fretWidth + fretWidth / 2;
              const centerY = startY + ((guitarType - 1) * stringSpacing) / 2;
              
              if (fret === 12 || fret === 24) {
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
                : startX + (i - 1) * fretWidth + fretWidth / 2;
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

          {/* Arpeggio/Overlay Highlights */}
          {overlays.map((ov, idx) => {
            const stringIndex = Math.max(0, Math.min(guitarType - 1, guitarType - ov.string));
            const fretIndex = ov.fret;
            const x = fretIndex === 0
              ? nutX - 12
              : fretIndex === 1
                ? nutX + fretWidth / 2
                : startX + (fretIndex - 2) * fretWidth + fretWidth / 2;
            const y = startY + (guitarType - 1 - stringIndex) * stringSpacing;
            return (
              <g key={`ov-${idx}`}>
                <circle cx={x} cy={y} r={14} fill="none" stroke="#22c55e" strokeWidth={3} />
              </g>
            );
          })}
          </svg>
        </div>
        
        {/* Scale Info Panel */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
            <div>
              <span className="font-medium text-slate-700">Scale:</span>
              <span className="ml-2 text-slate-600">{currentScale.name}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Notes:</span>
              <span className="ml-2 text-slate-600">{currentScale.notes.map(n => formatNoteForDisplay(n, noteSpelling, rootNote)).join(", ")}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Pattern:</span>
              <span className="ml-2 text-slate-600">{currentScale.pattern}</span>
            </div>
          </div>

          {/* Diatonic Triads Table */}
          {(diatonicTable.length > 0 || diatonicSevenths.length > 0) && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-slate-700">Diatonic Chords</div>
                <div className="w-40">
                  <Select value={chordTableType} onValueChange={(v: string) => setChordTableType(v as "triads" | "sevenths")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="triads">Triads</SelectItem>
                      <SelectItem value="sevenths">Sevenths</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Scale Degree</TableHead>
                    <TableHead>Chord Name</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Quality</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(chordTableType === "triads" ? diatonicTable : diatonicSevenths).map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{row.degree}</TableCell>
                      <TableCell>{row.chordName}</TableCell>
                      <TableCell>{row.notes.join(" – ")}</TableCell>
                      <TableCell>{row.quality}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
