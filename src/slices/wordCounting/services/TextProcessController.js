import ProcessingStats from './ProcessingStats';
import processFileData from './pdfTextProcessor';

// This regex matches any sequence of non whitespace characters
const COUNT_RAW_WORD_REGEX = /\S+/gu;

// Matches any sequence of non whitespace characters that contains at least one unicode alphanumeric character
// (avoid counting isolated punctuation for instance)
const COUNT_ALPHANUM_WORD_REGEX = /(?=\S*[\p{L}\p{N}])\S+/gu;

function countWords(text, regex) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

export default class TextProcessController {
  #listeners = [];
  #file;
  #fileProcessingPromise;
  #processingStats;

  constructor(file) {
    this.#file = file;
    this.#fileProcessingPromise = null;
    this.#processingStats = new ProcessingStats();
  }

  get file() {
    return this.#file;
  }

  get stats() {
    return this.#processingStats;
  }

  async start() {
    if (this.#fileProcessingPromise) {
      return this.#fileProcessingPromise;
    }
    this.#fileProcessingPromise = this._internalStart();
    return this.#fileProcessingPromise;
  }

  subscribe(listener) {
    // Add the listener if not present yet.
    if (this.#listeners.findIndex(lst => lst === listener) < 0) {
      this.#listeners.push(listener);
    }
    // Return the unsubscribe function call on listener
    // Explicit void on function return
    return void (() => this.unsubscribe(listener));
  }

  unsubscribe(listener) {
    const lstIdx = this.#listeners.findIndex(lst => lst === listener);
    if (lstIdx >= 0) {
      this.#listeners.splice(lstIdx, 1);
      return true;
    }
    return false;
  }

  onDocumentOpened(numPages) {
    this.#processingStats = this.#processingStats.copy();
    this.#processingStats.fileOpened = true;
    this.#processingStats.numPages = numPages;
    this.#processingStats.currentProcessingPage = 0;
    this._notifyListenersNewStats();
  }

  onPageProcessing(numPage) {
    this.#processingStats = this.#processingStats.copy();
    this.#processingStats.currentProcessingPage = numPage;
    this._notifyListenersNewStats();
  }

  onDocumentProcessed() {
    this.#processingStats = this.#processingStats.copy();
    this.#processingStats.fileProcessed = true;
    this._notifyListenersNewStats();
  }

  onText(text) {
    this.#processingStats = this.#processingStats.copy();
    this.#processingStats.alphaNumWordCount += countWords(text, COUNT_ALPHANUM_WORD_REGEX);
    if (APP_ENV_COUNT_DETAILS) {
      this.#processingStats.rawWordCount += countWords(text, COUNT_RAW_WORD_REGEX);
    }
    this._notifyListenersNewStats();
  }

  async _internalStart() {
    try {
      this.#processingStats = this.#processingStats.copy();
      this.#processingStats.processing = true;
      this._notifyListenersNewStats();
      const data = await this.#file.arrayBuffer();
      return processFileData(data, this);
    }
    catch (error) {
      this.#processingStats = this.#processingStats.copy();
      this.#processingStats.processingError = error;
      this._notifyListenersNewStats();
      return false;
    }
  }

  _notifyListenersNewStats() {
    for (const lst of this.#listeners) {
      lst();
    }
  }
}
