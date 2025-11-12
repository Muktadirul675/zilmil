importScripts('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

self.onmessage = async (e) => {
  const { id, htmlContent } = e.data;

  try {
    // Fixed PDF size (A4 @ ~1750x2480 px)
    const pdfWidth = 1750;
    const pdfHeight = 2480;

    const { jsPDF } = jspdf;
    const pdf = new jsPDF({
      unit: 'px',
      format: [pdfWidth, pdfHeight],
    });

    // Add the image and scale it to fit the fixed page
    pdf.addImage(htmlContent, 'PNG', 0, 0, pdfWidth, pdfHeight);

    const pdfBlob = pdf.output('blob');
    self.postMessage({ id, pdfBlob });
  } catch (err) {
    self.postMessage({ id, error: err.message });
  }
};