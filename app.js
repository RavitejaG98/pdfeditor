// Initialize Fabric.js Canvas
const fabricCanvas = new fabric.Canvas('pdf-canvas');
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');

// Load PDF using PDF.js
async function loadPdf(url) {
    const loadingTask = pdfjsLib.getDocument('http://10.244.3.132:3001/pdf');
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.5 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render PDF page to canvas
    const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Create Fabric.js Image from Canvas
    const fabricImage = new fabric.Image(canvas, {
        left: 0,
        top: 0,
        selectable: false,
    });

    // Set as background image
    fabricCanvas.setBackgroundImage(fabricImage, fabricCanvas.renderAll.bind(fabricCanvas));
}

// Add Text to the Fabric Canvas
document.getElementById('add-text-button').addEventListener('click', () => {
    const text = new fabric.Text('Hello, PDF!', {
        left: 100,
        top: 100,
        fill: 'red',
        fontSize: 30,
    });
    fabricCanvas.add(text);
});

// Convert Fabric Canvas to PDF and Download
document.getElementById('download-pdf').addEventListener('click', async () => {
    const pdfDoc = await PDFLib.PDFDocument.load(await fetch('http://10.244.3.132:3001/pdf').then(res => res.arrayBuffer()));
    const page = pdfDoc.getPage(0);

    // Convert Fabric canvas to PNG image
    const canvasDataUrl = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
    });

    const pngImage = await pdfDoc.embedPng(canvasDataUrl);
    const { width, height } = page.getSize();

    // Draw the image on the PDF page
    page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: width,
        height: height,
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Trigger the download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.pdf';
    a.click();
    URL.revokeObjectURL(url);
});

// Load the PDF initially
loadPdf('your-pdf-file.pdf');
