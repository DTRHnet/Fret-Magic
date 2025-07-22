import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export class FretboardExporter {
  static async exportToPNG(elementId: string, filename: string = "fretboard.png") {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error("Element not found");
      }

      const canvas = await html2canvas(element, {
        scale: 2, // High quality
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: false
      });

      // Create download link
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      return true;
    } catch (error) {
      console.error("Failed to export PNG:", error);
      return false;
    }
  }

  static async exportToPDF(elementId: string, filename: string = "fretboard.pdf") {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error("Element not found");
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: false
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "mm",
        format: "a4"
      });

      // Calculate dimensions to fit PDF page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;
      
      // Center the image
      const x = (pdfWidth - width) / 2;
      const y = (pdfHeight - height) / 2;

      pdf.addImage(imgData, "PNG", x, y, width, height);
      pdf.save(filename);
      
      return true;
    } catch (error) {
      console.error("Failed to export PDF:", error);
      return false;
    }
  }

  static async exportFretboardData(
    tuning: string[],
    rootNote: string,
    scaleType: string,
    displayMode: "notes" | "intervals",
    filename: string = "fretboard-data.json"
  ) {
    try {
      const data = {
        exportDate: new Date().toISOString(),
        tuning,
        rootNote,
        scaleType,
        displayMode,
        metadata: {
          application: "FretMagic",
          version: "1.0.0"
        }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
      });

      const link = document.createElement("a");
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      link.click();
      
      URL.revokeObjectURL(link.href);
      return true;
    } catch (error) {
      console.error("Failed to export data:", error);
      return false;
    }
  }
}