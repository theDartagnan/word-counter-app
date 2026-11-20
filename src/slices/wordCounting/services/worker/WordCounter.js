import WordCountingStats from '../WordCountingStats';

// This regex matches any sequence of non whitespace characters
export const COUNT_RAW_WORD_REGEX = /\S+/gu;

// Matches any sequence of non whitespace characters that contains at least one unicode alphanumeric character
// (avoid counting isolated punctuation for instance)
export const COUNT_ALPHANUM_WORD_REGEX = /(?=\S*[\p{L}\p{N}])\S+/gu;

// Marqueur de référence : espaces, (optionnel: crochetPonctu* [lettre ou chiffre]+ crochetPonctu* espaces*)references?
// espaces: \p{Z}
// crochet, ponctu : \p{P}
// lettre ou chiffre : [\p{L}\p{N}]
// groupe présent optionnel (?:)?
// accent : (?:\p{Mn}|[`´^¨~])*
// references : utilise la normalisation NFD pour toujours avoir le marquage des accent avant/apres la lettre
//            r${ACCENT_REGEX}e${ACCENT_REGEX}f${ACCENT_REGEX}e${ACCENT_REGEX}rences?
// Marqueur : u (unicode) i (caseless) m (multiline)
const SPACES_REGEX = '\\p{Z}*';
const REF_PREFIX_REGEX = `(?:[\\p{L}\\p{P}\\p{N}]+${SPACES_REGEX})?`;
const REF_SUFFIX_REGEX = `(?:\\p{Z}*\\p{P}+)?`;
const ACCENT_REGEX = '(?:\\p{Mn}|[`´^¨~])*';
const REF_WORD_REGEX = `r${ACCENT_REGEX}e${ACCENT_REGEX}f${ACCENT_REGEX}e${ACCENT_REGEX}rences?`;
export const REFERENCE_TOKEN_REGEX = new RegExp(`^${SPACES_REGEX}${REF_PREFIX_REGEX}${REF_WORD_REGEX}${REF_SUFFIX_REGEX}${SPACES_REGEX}$`, 'mui');

export function countWords(text, regex) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

export function isTextReferencesToken(text) {
  const textToTest = text.normalize('NFD');
  const hasRef = REFERENCE_TOKEN_REGEX.test(textToTest);
  return hasRef;
}

export default class WordCounter {
  #texts; // array of pending texts to process
  #currentStats; // current stats structure
  #statsSender; // Stats consumer
  #countDetails = false;

  constructor(statsSender, countDetails = false) {
    this.#statsSender = statsSender;
    this.#countDetails = countDetails;
  }

  startDocument(numPages) {
    // Clear text and prepare en stats structure
    this.#texts = null;
    this.#currentStats = new WordCountingStats();
    this.#currentStats.fileOpened = true;
    this.#currentStats.numPages = numPages;
    this.#currentStats.currentProcessingPage = 0;
    this.#statsSender(this.#currentStats);
  }

  changePage(numPage) {
    this.#currentStats.currentProcessingPage = numPage;
    this.#statsSender(this.#currentStats);
  }

  endDocument() {
    // if we still have pending texts, handle them without notification
    if (this.#texts) {
      this.#handlePendingTexts(false);
    }
    this.#currentStats.fileProcessed = true;
    this.#statsSender(this.#currentStats);
  }

  /**
   * Handler a PDF item
   * @param {Object} item
   */
  handleItem(item) {
    // We consider item according their str value:
    // no or 0 length: text separator
    // length > 1 : text to concat with predecessor
    if (item.str?.length) {
      // store text
      this.#storeText(item.str);
    }
    else {
      // generate text
      this.#handlePendingTexts();
    }
  }

  #storeText(text) {
    if (!this.#texts) {
      this.#texts = [text];
    }
    else {
      this.#texts.push(text);
    }
  }

  #handlePendingTexts(notifyIfRequired = true) {
    if (this.#texts) {
      // joind texts with space
      const fullText = this.#texts.join('');
      // Attempt to find the reference token : must be alone in the fullText
      if (isTextReferencesToken(fullText)) {
        // Set references found flag in stats
        this.#currentStats.markReferenceFound(fullText);
      }
      // Count text words, including the ref token if any (for total counting)
      this.#countTextWords(fullText);
      // Reset texts
      this.#texts = null;// notify
      if (notifyIfRequired) {
        this.#statsSender(this.#currentStats);
      }
    }
  }

  #countTextWords(text) {
    let count = countWords(text, COUNT_ALPHANUM_WORD_REGEX);
    this.#currentStats.incGlyphCount(text.length);
    this.#currentStats.incAlphaNumWordCount(count);
    if (this.#countDetails) {
      count = countWords(text, COUNT_RAW_WORD_REGEX);
      this.#currentStats.incRawWordCount(count);
    }
  }
}
