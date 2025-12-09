import WordCountingStats from './WordCountingStats';

export default class TextProcessController {
  #listeners = new Set();
  #worker = null;
  #currentFile = null;
  countingStats = null;

  constructor() {
  }

  get file() {
    return this.#currentFile;
  }

  get stats() {
    return this.countingStats;
  }

  start(file) {
    if (this.countingStats?.processing) {
      console.warn('Cannot start processing a new file, current file still in process');
      return;
    }
    this.#currentFile = file;
    this.#internalStart();
  }

  subscribe(listener) {
    // Add the listener if not present yet.
    this.#listeners.add(listener);
    // Return the unsubscribe function call on listener
    // Explicit void on function return
    return void (() => this.unsubscribe(listener));
  }

  unsubscribe(listener) {
    this.#listeners.delete(listener);
  }

  onNewStats(stats) {
    this.countingStats = stats.copy();
    this.#notifyListenersNewStats();
  }

  async #internalStart() {
    if (!this.#currentFile) {
      console.warn('No file to process');
      return;
    }
    this.countingStats = new WordCountingStats();
    try {
      // Load worker if not loaded yet
      await this.#loadWorkerIfRequired();
      // Prepare new stats and notify listeners
      this.countingStats.processing = true;
      this.#notifyListenersNewStats();
      // Load file data and send them to worker
      const data = await this.#currentFile.arrayBuffer();
      this.#worker.postMessage({ data, countDetails: APP_ENV_COUNT_DETAILS });
    }
    catch (error) {
      // Error happened while loading worker or file data
      // Create new stats on error (copy required for listeners)
      this.countingStats = this.countingStats.copy();
      this.countingStats.processing = false;
      this.countingStats.processingError = error;
      this.#notifyListenersNewStats();
    }
  }

  #notifyListenersNewStats() {
    for (const lst of this.#listeners) {
      lst();
    }
  }

  async #loadWorkerIfRequired() {
    if (this.#worker) {
      return this.#worker;
    }
    this.#worker = new Worker(
      /* webpackChunkName: "WordCounterWK" */ new URL('./worker/PDFProcessingWorker.js', import.meta.url),
      {
        type: 'classic',
        credentials: 'same-origin',
        name: 'Word counting worker',
      },
    );
    this.#worker.onerror = (error) => {
      console.warn('Worker error', error);
      // Error happened from worker side
      // Create new stats on error (copy required for listeners)
      this.countingStats = this.countingStats.copy();
      this.countingStats.processing = false;
      this.countingStats.processingError = error;
      this.#notifyListenersNewStats();
    };
    this.#worker.onmessage = (msg) => {
      // # Rebuild stats frow raw object
      this.countingStats = WordCountingStats.fromObject(msg.data);
      // mise à jour
      this.#notifyListenersNewStats();
    };
    return this.#worker;
  }
}
