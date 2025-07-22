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
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }

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
    metadataDiv.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; font-size: 14px; color: #64748b;">
        <div><strong>Guitar:</strong> ${metadata.guitarType}-string</div>
        <div><strong>Scale:</strong> ${metadata.scaleName}</div>
        <div><strong>Root Note:</strong> ${metadata.rootNote}</div>
        <div><strong>Tuning:</strong> ${metadata.tuning.join(' - ')}</div>
      </div>
    `;

    // Clone the fretboard element
    const fretboardClone = element.cloneNode(true) as HTMLElement;
    
    // Assemble the export container
    container.appendChild(title);
    container.appendChild(metadataDiv);
    container.appendChild(fretboardClone);
    
    // Temporarily add to document
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    // Generate canvas
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    });

    // Remove temporary element
    document.body.removeChild(container);

    // Download
    const link = document.createElement('a');
    link.download = filename || `fretmagic-${metadata.scaleType}-${metadata.rootNote}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
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
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }

    // Create PDF
    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add title
    pdf.setFontSize(20);
    pdf.setTextColor(30, 41, 59); // slate-800
    pdf.text('FretMagic - Guitar Scale Explorer', 20, 25);

    // Add metadata
    pdf.setFontSize(12);
    pdf.setTextColor(100, 116, 139); // slate-500
    
    const metadataLines = [
      `Guitar: ${metadata.guitarType}-string`,
      `Scale: ${metadata.scaleName}`,
      `Root Note: ${metadata.rootNote}`,
      `Tuning: ${metadata.tuning.join(' - ')}`,
      `Generated: ${metadata.timestamp}`
    ];

    metadataLines.forEach((line, index) => {
      pdf.text(line, 20, 40 + (index * 7));
    });

    // Capture fretboard as image
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth - 40; // 20mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add fretboard image
    const yPosition = Math.max(85, pageHeight - imgHeight - 20);
    pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);

    // Save PDF
    const pdfFilename = filename || `fretmagic-${metadata.scaleType}-${metadata.rootNote}-${Date.now()}.pdf`;
    pdf.save(pdfFilename);
    
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