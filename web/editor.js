// Ensure PDF.js is loaded
// const pdfjsLib = window['pdfjs-dist/build/pdf'];

const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const fabricCanvas = new fabric.Canvas(canvas, { selection: false });

// Load PDF file and render it on canvas
document.getElementById('file-input').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();

    try {
        // Load PDF using PDF.js
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1); // Load the first page

        const viewport = page.getViewport({ scale: 1 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render PDF page to canvas
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        await page.render(renderContext).promise;

        // Initialize Fabric.js canvas for annotations
        fabricCanvas.setWidth(viewport.width);
        fabricCanvas.setHeight(viewport.height);
        fabricCanvas.clear();
    } catch (error) {
        console.error('Error loading or rendering PDF:', error);
    }
});

// Add Annotation
function addAnnotation(text, x, y) {
    const annotation = new fabric.Text(text, { left: x, top: y, fill: 'red' });
    fabricCanvas.add(annotation);
}

// Add Shape
function addShape(type, x, y, width, height) {
    let shape;
    switch (type) {
        case 'rect':
            shape = new fabric.Rect({ left: x, top: y, width: width, height: height, fill: 'blue' });
            break;
        case 'circle':
            shape = new fabric.Circle({ left: x, top: y, radius: width / 2, fill: 'green' });
            break;
        // Add more shapes as needed
    }
    fabricCanvas.add(shape);
}

// Add Signature (Free Drawing)
fabricCanvas.isDrawingMode = true;
fabricCanvas.freeDrawingBrush.color = 'black';
fabricCanvas.freeDrawingBrush.width = 5;

// Download Edited PDF
document.getElementById('download-btn').addEventListener('click', async () => {
    try {
        const pdfDoc = await PDFLib.PDFDocument.create();
        const page = pdfDoc.addPage([canvas.width, canvas.height]);

        // Draw canvas image onto PDF page
        const pngDataUrl = canvas.toDataURL('image/png');
        const pngImage = await pdfDoc.embedPng(pngDataUrl);
        page.drawImage(pngImage, { x: 0, y: 0, width: canvas.width, height: canvas.height });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'edited.pdf';
        link.click();
    } catch (error) {
        console.error('Error generating or downloading PDF:', error);
    }
});
