import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface ExportMetadata {
  guitarType: number;
  tuning: string[];
  scaleType: string;
  scaleName: string;
  rootNote: string;
  timestamp: string;
}

export async function exportToPNG(
  elementId: string, 
  metadata: ExportMetadata,
  filename?: string
): Promise<void> {
  try {
    console.log('Attempting to export PNG for element:', elementId);
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id '${elementId}' not found`);
      throw new Error(`Element with id '${elementId}' not found`);
    }
    
    console.log('Element found:', element);

    // Create a container with metadata
    const container = document.createElement('div');
    container.style.background = 'white';
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial, sans-serif';

    // Add title and metadata
    const title = document.createElement('h2');
    title.textContent = 'FretMagic - Guitar Scale Explorer';
    title.style.margin = '0 0 15px 0';
    title.style.color = '#1e293b';
    
    const metadataDiv = document.createElement('div');
    const gridDiv = document.createElement('div');
    gridDiv.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; font-size: 14px; color: #64748b;';
    
    const createMetadataItem = (label: string, value: string) => {
      const div = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = `${label}: `;
      div.appendChild(strong);
      div.appendChild(document.createTextNode(value));
      return div;
    };
    
    gridDiv.appendChild(createMetadataItem('Guitar', `${metadata.guitarType}-string`));
    gridDiv.appendChild(createMetadataItem('Scale', metadata.scaleName));
    gridDiv.appendChild(createMetadataItem('Root Note', metadata.rootNote));
    gridDiv.appendChild(createMetadataItem('Tuning', metadata.tuning.join(' - ')));
    
    metadataDiv.appendChild(gridDiv);

    // Clone the fretboard element
    const fretboardClone = element.cloneNode(true) as HTMLElement;
    
    // Assemble the export container
    container.appendChild(title);
    container.appendChild(metadataDiv);
    container.appendChild(fretboardClone);
    
    // Temporarily add to document
    container.style.position = 'absolute';
    container.style.top = '-10000px';
    container.style.left = '0';
    document.body.appendChild(container);

    // Generate the canvas
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // Remove the temporary container
    document.body.removeChild(container);

    // Create download link
    const link = document.createElement('a');
    link.download = filename || `fretmagic-${metadata.guitarType}string-${metadata.rootNote}-${metadata.scaleType}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('PNG export completed successfully');
  } catch (error) {
    console.error('PNG export failed:', error);
    throw error;
  }
}

export async function exportToPDF(
  elementId: string, 
  metadata: ExportMetadata,
  filename?: string
): Promise<void> {
  try {
    console.log('Attempting to export PDF for element:', elementId);
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id '${elementId}' not found`);
      throw new Error(`Element with id '${elementId}' not found`);
    }

    console.log('Element found:', element);

    // Create a container with metadata
    const container = document.createElement('div');
    container.style.background = 'white';
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial, sans-serif';

    // Add title and metadata
    const title = document.createElement('h2');
    title.textContent = 'FretMagic - Guitar Scale Explorer';
    title.style.margin = '0 0 15px 0';
    title.style.color = '#1e293b';
    
    const metadataDiv = document.createElement('div');
    const gridDiv = document.createElement('div');
    gridDiv.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; font-size: 14px; color: #64748b;';
    
    const createMetadataItem = (label: string, value: string) => {
      const div = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = `${label}: `;
      div.appendChild(strong);
      div.appendChild(document.createTextNode(value));
      return div;
    };
    
    gridDiv.appendChild(createMetadataItem('Guitar', `${metadata.guitarType}-string`));
    gridDiv.appendChild(createMetadataItem('Scale', metadata.scaleName));
    gridDiv.appendChild(createMetadataItem('Root Note', metadata.rootNote));
    gridDiv.appendChild(createMetadataItem('Tuning', metadata.tuning.join(' - ')));
    gridDiv.appendChild(createMetadataItem('Exported', metadata.timestamp));
    gridDiv.appendChild(createMetadataItem('Created with', 'FretMagic'));
    
    metadataDiv.appendChild(gridDiv);

    // Clone the fretboard element
    const fretboardClone = element.cloneNode(true) as HTMLElement;
    
    // Assemble the export container
    container.appendChild(title);
    container.appendChild(metadataDiv);
    container.appendChild(fretboardClone);
    
    // Temporarily add to document
    container.style.position = 'absolute';
    container.style.top = '-10000px';
    container.style.left = '0';
    document.body.appendChild(container);

    // Generate the canvas
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // Remove the temporary container
    document.body.removeChild(container);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    
    // Calculate dimensions to fit the page
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add extra pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    pdf.save(filename || `fretmagic-${metadata.guitarType}string-${metadata.rootNote}-${metadata.scaleType}-${Date.now()}.pdf`);
    
    console.log('PDF export completed successfully');
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}

export function createExportMetadata(
  guitarType: number,
  tuning: string[],
  scaleType: string,
  scaleName: string,
  rootNote: string
): ExportMetadata {
  return {
    guitarType,
    tuning: tuning.slice(0, guitarType),
    scaleType,
    scaleName,
    rootNote,
    timestamp: new Date().toLocaleString()
  };
}

// Shareable configuration interface
export interface ShareableConfig {
  rootNote: string;
  scaleType: string;
  guitarType: number;
  tuning: string[];
  showNotes: boolean;
  showIntervals: boolean;
  showFretNumbers: boolean;
  fretRange: number;
  displayMode: 'notes' | 'intervals' | 'degrees';
  noteSpelling?: 'auto' | 'sharps' | 'flats';
}

// Create a shareable URL with configuration
export function createShareableUrl(config: ShareableConfig): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  
  params.set('root', config.rootNote);
  params.set('scale', config.scaleType);
  params.set('guitar', config.guitarType.toString());
  params.set('tuning', config.tuning.join(','));
  params.set('notes', config.showNotes.toString());
  params.set('intervals', config.showIntervals.toString());
  params.set('frets', config.showFretNumbers.toString());
  params.set('range', String(config.fretRange));
  params.set('mode', config.displayMode);
  if (config.noteSpelling) {
    params.set('spelling', config.noteSpelling);
  }
  
  return `${baseUrl}?${params.toString()}`;
}

// Parse configuration from URL parameters
export function parseConfigFromUrl(): Partial<ShareableConfig> | null {
  const params = new URLSearchParams(window.location.search);
  
  if (!params.has('root') || !params.has('scale')) {
    return null;
  }
  
  try {
    const config: Partial<ShareableConfig> = {
      rootNote: params.get('root') || 'C',
      scaleType: params.get('scale') || 'major',
      guitarType: parseInt(params.get('guitar') || '6'),
      tuning: params.get('tuning')?.split(',') || ['E', 'A', 'D', 'G', 'B', 'E'],
      showNotes: params.get('notes') === 'true',
      showIntervals: params.get('intervals') === 'true',
      showFretNumbers: params.get('frets') === 'true',
      displayMode: (params.get('mode') as 'notes' | 'intervals' | 'degrees') || 'notes',
      noteSpelling: (params.get('spelling') as 'auto' | 'sharps' | 'flats') || undefined
    };
    
    const rangeParam = params.get('range');
    if (rangeParam) {
      const value = parseInt(rangeParam);
      if (!isNaN(value)) config.fretRange = value;
    }
    
    return config;
  } catch (error) {
    console.error('Error parsing config from URL:', error);
    return null;
  }
}

// Generate a shareable image with embedded link
export async function createShareableImage(
  elementId: string,
  metadata: ExportMetadata,
  shareUrl: string
): Promise<string> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }

    // Create enhanced container for shareable image
    const container = document.createElement('div');
    container.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    container.style.padding = '30px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.borderRadius = '16px';
    container.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';

    // Add branding header
    const header = document.createElement('div');
    header.style.cssText = 'background: rgba(255,255,255,0.95); padding: 20px; border-radius: 12px; margin-bottom: 20px; backdrop-filter: blur(10px);';
    
    const title = document.createElement('h1');
    title.textContent = 'FretMagic';
    title.style.cssText = 'margin: 0 0 10px 0; color: #1e293b; font-size: 28px; font-weight: bold;';
    
    const subtitle = document.createElement('p');
    subtitle.textContent = `${metadata.scaleName} Scale • ${metadata.rootNote} Root • ${metadata.guitarType}-String Guitar`;
    subtitle.style.cssText = 'margin: 0 0 15px 0; color: #64748b; font-size: 16px;';
    
    const shareInfo = document.createElement('div');
    shareInfo.style.cssText = 'display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;';
    
    const urlDisplay = document.createElement('code');
    urlDisplay.textContent = shareUrl;
    urlDisplay.style.cssText = 'background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-size: 12px; color: #475569; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
    
    const qrPlaceholder = document.createElement('div');
    qrPlaceholder.textContent = 'Scan to view online';
    qrPlaceholder.style.cssText = 'background: #e2e8f0; width: 60px; height: 60px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #64748b; text-align: center; line-height: 1.2;';
    
    shareInfo.appendChild(urlDisplay);
    shareInfo.appendChild(qrPlaceholder);
    
    header.appendChild(title);
    header.appendChild(subtitle);
    header.appendChild(shareInfo);

    // Add fretboard with enhanced styling
    const fretboardWrapper = document.createElement('div');
    fretboardWrapper.style.cssText = 'background: rgba(255,255,255,0.98); padding: 20px; border-radius: 12px; backdrop-filter: blur(10px);';
    
    const fretboardClone = element.cloneNode(true) as HTMLElement;
    fretboardWrapper.appendChild(fretboardClone);
    
    // Add footer
    const footer = document.createElement('div');
    footer.style.cssText = 'margin-top: 20px; text-align: center; color: rgba(255,255,255,0.9); font-size: 14px;';
    footer.textContent = `Generated on ${metadata.timestamp} • Visit the link above to interact with this fretboard`;
    
    container.appendChild(header);
    container.appendChild(fretboardWrapper);
    container.appendChild(footer);
    
    // Temporarily add to document
    container.style.position = 'absolute';
    container.style.top = '-20000px';
    container.style.left = '0';
    container.style.width = '800px';
    document.body.appendChild(container);

    // Generate the canvas
    const canvas = await html2canvas(container, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: 800,
      height: container.offsetHeight
    });

    // Remove the temporary container
    document.body.removeChild(container);

    // Return the data URL
    return canvas.toDataURL('image/png', 0.9);
  } catch (error) {
    console.error('Shareable image creation failed:', error);
    throw error;
  }
}

export function downloadBlankTabSheet(): void {
  // Create a new PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const usableWidth = pageWidth - (2 * margin);
  
  // Header with title
  pdf.setFillColor(245, 245, 245);
  pdf.rect(0, 0, pageWidth, 25, 'F');
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Guitar Tablature & Chord Sheet', pageWidth / 2, 15, { align: 'center' });
  
  // Song info section with better layout
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  let yPos = 32;
  
  // Draw info boxes
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  
  // Title and Artist
  pdf.text('Title:', margin, yPos);
  pdf.rect(margin + 10, yPos - 4, 80, 6);
  pdf.text('Artist:', margin + 100, yPos);
  pdf.rect(margin + 112, yPos - 4, 80, 6);
  
  yPos += 10;
  // Key, Tempo, Time, Capo
  pdf.text('Key:', margin, yPos);
  pdf.rect(margin + 10, yPos - 4, 25, 6);
  pdf.text('Tempo:', margin + 45, yPos);
  pdf.rect(margin + 60, yPos - 4, 25, 6);
  pdf.text('Time:', margin + 95, yPos);
  pdf.rect(margin + 107, yPos - 4, 20, 6);
  pdf.text('Capo:', margin + 137, yPos);
  pdf.rect(margin + 149, yPos - 4, 20, 6);
  
  // Chord diagram section with improved layout
  yPos += 15;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('Chord Diagrams', margin, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  yPos += 10;
  
  // Draw 8 chord diagram boxes (2 rows of 4)
  const chordBoxSize = 28;
  const chordBoxSpacing = 48;
  const chordsPerRow = 4;
  
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < chordsPerRow; col++) {
      const xPos = margin + 10 + (col * chordBoxSpacing);
      const boxYPos = yPos + (row * (chordBoxSize + 20));
      
      // Chord name line above diagram
      pdf.setLineWidth(0.3);
      pdf.line(xPos - 5, boxYPos - 7, xPos + chordBoxSize + 5, boxYPos - 7);
      
      // Draw chord box frame
      pdf.setLineWidth(0.5);
      pdf.rect(xPos, boxYPos, chordBoxSize, chordBoxSize);
      
      // Nut (thicker line at top)
      pdf.setLineWidth(1.5);
      pdf.line(xPos, boxYPos, xPos + chordBoxSize, boxYPos);
      
      // Draw vertical lines (strings) 
      pdf.setLineWidth(0.3);
      for (let s = 1; s < 6; s++) {
        const stringX = xPos + (s * chordBoxSize / 6);
        pdf.line(stringX, boxYPos, stringX, boxYPos + chordBoxSize);
      }
      
      // Draw horizontal lines (frets)
      for (let f = 1; f < 5; f++) {
        const fretY = boxYPos + (f * chordBoxSize / 5);
        pdf.line(xPos, fretY, xPos + chordBoxSize, fretY);
      }
      
      // Add fret position indicator space
      pdf.setFontSize(8);
      pdf.text('fr', xPos - 8, boxYPos + 10);
    }
  }
  
  // Tab section with improved layout
  yPos += chordBoxSize + 50;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('Tablature', margin, yPos);
  pdf.setFont('helvetica', 'normal');
  yPos += 8;
  
  // Create multiple tab staff systems with better spacing
  const tabLineSpacing = 3.5;
  const systemSpacing = 30;
  const numberOfSystems = 5; // Number of tab systems on first page
  
  for (let system = 0; system < numberOfSystems; system++) {
    const systemY = yPos + (system * systemSpacing);
    
    // Check if we need a new page
    if (systemY > pageHeight - 40) {
      pdf.addPage();
      yPos = 20;
      continue;
    }
    
    // Draw TAB indicator
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TAB', margin - 12, systemY + 9);
    
    // Draw tab lines with proper string labels
    pdf.setLineWidth(0.4);
    pdf.setFont('helvetica', 'normal');
    const stringLabels = ['e', 'B', 'G', 'D', 'A', 'E'];
    const stringTuning = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];
    
    for (let line = 0; line < 6; line++) {
      const lineY = systemY + (line * tabLineSpacing);
      
      // String label (standard notation)
      pdf.setFontSize(8);
      pdf.text(stringLabels[line], margin - 3, lineY + 1);
      
      // Tab line
      pdf.setDrawColor(100, 100, 100);
      pdf.line(margin + 5, lineY, pageWidth - margin, lineY);
    }
    
    // Add measure bars with numbers
    const measureWidth = (usableWidth - 5) / 4; // 4 measures per line
    pdf.setLineWidth(0.6);
    pdf.setDrawColor(0, 0, 0);
    
    for (let m = 0; m <= 4; m++) {
      const barX = margin + 5 + (m * measureWidth);
      
      // Draw bar line
      if (m === 0 || m === 4) {
        // Double bar at start and end
        pdf.setLineWidth(0.8);
        pdf.line(barX, systemY, barX, systemY + (5 * tabLineSpacing));
        if (m === 4) {
          pdf.line(barX - 2, systemY, barX - 2, systemY + (5 * tabLineSpacing));
        }
      } else {
        // Single bar
        pdf.setLineWidth(0.4);
        pdf.line(barX, systemY, barX, systemY + (5 * tabLineSpacing));
      }
      
      // Add measure numbers
      if (m < 4) {
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${system * 4 + m + 1}`, barX + 2, systemY - 2);
        pdf.setTextColor(0, 0, 0);
      }
    }
  }
  
  // Add second page with more tab systems
  pdf.addPage();
  yPos = 20;
  
  // Page 2 header
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(128);
  pdf.text('Page 2', pageWidth / 2, 10, { align: 'center' });
  pdf.setTextColor(0);
  
  // More tab systems on page 2
  for (let system = 0; system < 8; system++) {
    const systemY = yPos + (system * systemSpacing);
    
    if (systemY > pageHeight - 30) break;
    
    // Draw TAB indicator
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TAB', margin - 12, systemY + 9);
    
    // Draw tab lines
    pdf.setLineWidth(0.4);
    pdf.setFont('helvetica', 'normal');
    const stringLabels = ['e', 'B', 'G', 'D', 'A', 'E'];
    
    for (let line = 0; line < 6; line++) {
      const lineY = systemY + (line * tabLineSpacing);
      pdf.setFontSize(8);
      pdf.text(stringLabels[line], margin - 3, lineY + 1);
      pdf.setDrawColor(100, 100, 100);
      pdf.line(margin + 5, lineY, pageWidth - margin, lineY);
    }
    
    // Add measure bars
    const measureWidth = (usableWidth - 5) / 4;
    pdf.setDrawColor(0, 0, 0);
    
    for (let m = 0; m <= 4; m++) {
      const barX = margin + 5 + (m * measureWidth);
      
      if (m === 0 || m === 4) {
        pdf.setLineWidth(0.8);
        pdf.line(barX, systemY, barX, systemY + (5 * tabLineSpacing));
        if (m === 4) {
          pdf.line(barX - 2, systemY, barX - 2, systemY + (5 * tabLineSpacing));
        }
      } else {
        pdf.setLineWidth(0.4);
        pdf.line(barX, systemY, barX, systemY + (5 * tabLineSpacing));
      }
      
      // Measure numbers
      if (m < 4) {
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${20 + system * 4 + m + 1}`, barX + 2, systemY - 2);
        pdf.setTextColor(0, 0, 0);
      }
    }
  }
  
  // Footer on both pages
  pdf.setFontSize(8);
  pdf.setTextColor(128);
  pdf.text('Created with FretMagic - Guitar Scale Explorer', pageWidth / 2, pageHeight - 5, { align: 'center' });
  pdf.text('www.fretmagic.app', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save the PDF
  pdf.save('guitar-tab-sheet.pdf');
}