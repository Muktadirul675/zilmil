// pdfWorker.js
importScripts('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

self.onmessage = async (e) => {
  const { id, htmlContent, width, height } = e.data;

  try {
    // Create a PDF with given width & height
    const pdf = new jspdf.jsPDF({
      unit: 'px',
      format: [width, height]
    });

    // Since we cannot run html2canvas here, we assume the main thread
    // sends the canvas image as base64 string instead of raw HTML
    pdf.addImage(htmlContent, 'PNG', 0, 0, width, height);

    // Get the blob
    const pdfBlob = pdf.output('blob');

    // Send blob back to main thread
    self.postMessage({ id, pdfBlob });
  } catch (err) {
    self.postMessage({ id, error: err.message });
  }
};