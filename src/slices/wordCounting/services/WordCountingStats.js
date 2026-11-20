export default class WordCountingStats {
  processing = false;
  fileOpened = false;
  numPages = '?';
  currentProcessingPage = 0;
  fileProcessed = false;
  processingError = null;

  referencesFound = false;
  alphaNumWordCount = 0; // number of unicode alpha-num words, before references
  rawWordCount = 0; // raw word count, before references
  glyphCount = 0; // number of glyph, spaces counted
  totalAlphaNumWordCount = 0;
  totalRawWordCount = 0;
  totalGlyphCount = 0;

  constructor() {

  }

  markReferenceFound() {
    // In case we have several occurences of references, we update counters with total counter
    this.alphaNumWordCount = this.totalAlphaNumWordCount;
    this.rawWordCount = this.totalRawWordCount;
    this.referencesFound = true;
  }

  incRawWordCount(count) {
    this.totalRawWordCount += count;
    if (!this.referencesFound) {
      this.rawWordCount += count;
    }
  }

  incAlphaNumWordCount(count) {
    this.totalAlphaNumWordCount += count;
    if (!this.referencesFound) {
      this.alphaNumWordCount += count;
    }
  }

  incGlyphCount(count) {
    this.totalGlyphCount += count;
    if (!this.referencesFound) {
      this.glyphCount += count;
    }
  }

  copy() {
    return Object.assign(new WordCountingStats(), this);
  }

  static fromObject(obj) {
    return Object.assign(new WordCountingStats(), obj);
  }
}
