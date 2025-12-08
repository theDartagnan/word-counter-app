import ProcessingStats from './ProcessingStats';
import processFileData from './pdfTextProcessor';

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
    this.#fileProcessingPromise = this.#internalStart();
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

  onNewStats(stats) {
    this.#processingStats = stats.copy();
    this.#notifyListenersNewStats();
  }

  async #internalStart() {
    try {
      this.#processingStats = new ProcessingStats();
      this.#processingStats.processing = true;
      this.#notifyListenersNewStats();
      const data = await this.#file.arrayBuffer();
      return processFileData(data, this, APP_ENV_COUNT_DETAILS);
    }
    catch (error) {
      this.#processingStats = this.#processingStats.copy();
      this.#processingStats.processingError = error;
      this.#notifyListenersNewStats();
      return false;
    }
  }

  #notifyListenersNewStats() {
    for (const lst of this.#listeners) {
      lst();
    }
  }
}
