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