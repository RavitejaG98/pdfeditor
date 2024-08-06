let pdfDoc = null;
let pageNumber = 1;
let action = null;
let annotations = [];
const canvas = document.getElementById('pdf-canvas');
const context = canvas.getContext('2d');

document.getElementById('fileInput').addEventListener('change', handleFileSelect);
canvas.addEventListener('click', handleCanvasClick);

async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const pdfData = new Uint8Array(fileReader.result);
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      pdfDoc = pdf;
      renderPage(pageNumber);
    };
    fileReader.readAsArrayBuffer(file);
  }
}

async function renderPage(num) {
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale: 1.5 });
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };
  await page.render(renderContext).promise;
}

function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  if (action) {
    if (action === 'table') {
      addTable(x, y);
    } else if (action === 'signature') {
      addSignature(x, y);
    } else if (action === 'annotation') {
      addAnnotation(x, y);
    }
  }
}

function addTable(x, y) {
  const tableDiv = document.createElement('div');
  tableDiv.className = 'annotation';
  tableDiv.style.left = `${x}px`;
  tableDiv.style.top = `${y}px`;
  tableDiv.style.width = '200px'; // Example width
  tableDiv.style.height = '100px'; // Example height
  tableDiv.innerText = 'Table';
  document.getElementById('pdf-container').appendChild(tableDiv);
}

function addSignature(x, y) {
  const signatureDiv = document.createElement('div');
  signatureDiv.className = 'annotation';
  signatureDiv.style.left = `${x}px`;
  signatureDiv.style.top = `${y}px`;
  signatureDiv.style.width = '100px'; // Example width
  signatureDiv.style.height = '50px'; // Example height
  signatureDiv.innerText = 'Signature';
  document.getElementById('pdf-container').appendChild(signatureDiv);
}

function addAnnotation(x, y) {
  const annotationDiv = document.createElement('div');
  annotationDiv.className = 'annotation';
  annotationDiv.style.left = `${x}px`;
  annotationDiv.style.top = `${y}px`;
  annotationDiv.style.width = '150px'; // Example width
  annotationDiv.style.height = '30px'; // Example height
  annotationDiv.innerText = 'Annotation';
  document.getElementById('pdf-container').appendChild(annotationDiv);
}

function setAction(newAction) {
  action = newAction;
}
