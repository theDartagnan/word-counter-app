export default class ProcessingStats {
  processing = false;
  fileOpened = false;
  numPages = '?';
  currentProcessingPage = 0;
  fileProcessed = false;
  processingError = null;
  rawWordCount = 0;
  alphaNumWordCount = 0;

  constructor() {

  }

  copy() {
    return Object.assign(new ProcessingStats(), this);
  }
}
