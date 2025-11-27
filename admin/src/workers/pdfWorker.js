importScripts('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

self.onmessage = async (e) => {
  const { id, htmlContent } = e.data;

  try {
    const { jsPDF } = jspdf;

    // Create A4 PDF automatically
    const pdf = new jsPDF({
      unit:'pt',
      format: [1312.5, 1860.75],
    });

    // Get the exact A4 page size in px from jsPDF
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add your image scaled to full A4
    pdf.addImage(htmlContent, 'PNG', 0, 0, pageWidth, pageHeight);

    const pdfBlob = pdf.output('blob');
    self.postMessage({ id, pdfBlob });

  } catch (err) {
    self.postMessage({ id, error: err.message });
  }
};