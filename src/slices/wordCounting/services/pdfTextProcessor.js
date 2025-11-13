import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';

// Init worker location
GlobalWorkerOptions.workerSrc = `.${APP_ENV_APP_PUBLIC_PATH}${APP_ENV_WORKER_NAME}`;

function getDocumentInitParameters(pdfData, verbose = false) {
  // Default options, set to fasten the decoding process
  // avoid steps we do not need (especially image/font processing)
  const options = {
    verbosity: verbose ? 1 : -1,
    useSystemFonts: true,
    maxImageSize: 1,
    isEvalSupported: true,
    isOffscreenCanvasSupported: false,
    isImageDecoderSupported: false,
    disableFontFace: false,
  };
  // considering we have the data of the pdf files
  options.data = new Uint8Array(pdfData);

  return options;
}

export default async function processFileData(fileData, textProcessController, verbose = false) {
  const log = verbose
    ? function () { console.log(...arguments); } // eslint-disable-line no-console
    : function () {};

  const options = getDocumentInitParameters(fileData, verbose);
  // Open document
  log('Open PDF document...');
  const document = await getDocument(options).promise;
  textProcessController.onDocumentOpened(document.numPages);
  // Process all pages sequentially
  for (let i = 1; i <= document.numPages; i += 1) {
    log(`Open page ${i}...`);
    textProcessController.onPageProcessing(i);
    const page = await document.getPage(i);
    log(`Load content from page ${i}...`);
    const content = await page.getTextContent();
    for (const item of content.items) {
      textProcessController.onText(item.str);
    }
  }
  textProcessController.onDocumentProcessed();
  return true;
}
