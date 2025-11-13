export class StorageManager {
  _simulated;

  _storage;

  constructor(storageType = 'sessionStorage') {
    this._init(storageType);
  }

  _init(storageType) {
    try {
      this._storage = window[storageType];
      const testedKey = '__STORAGE_TEST__';
      this._storage.setItem(testedKey, testedKey);
      this._storage.removeItem(testedKey);
      this._simulated = false;
    }
    catch (e) {
      if (e instanceof DOMException
        && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
        && this._storage && this._storage.length !== 0) {
        console.warn(`Max storage reached for ${storageType}. Will simulate storage.`, e);
      }
      else {
        console.warn(`Unavailable storage ${storageType}. Will simulate storage.`, e);
      }
      this._storage = new Map();
      this._simulated = true;
    }
  }

  set(key, value) {
    if (!key) {
      throw new Error('Missing key for storage');
    }
    if (this._simulated) {
      this._storage.set(key, value);
    }
    else {
      this._storage.setItem(key, JSON.stringify(value, null, 0));
    }
    return value;
  }

  get(key) {
    if (!key) {
      throw new Error('Missing key for storage');
    }
    if (this._simulated) {
      return this._storage.get(key) ?? null;
    }
    else {
      return JSON.parse(this._storage.getItem(key));
    }
  }

  delete(key) {
    if (!key) {
      throw new Error('Missing key for storage');
    }
    if (this._simulated) {
      this._storage.delete(key);
    }
    else {
      this._storage.removeItem(key);
    }
  }

  clear() {
    this._storage.clear();
  }

  keys() {
    if (this._simulated) {
      return Array.from(this._storage.keys());
    }
    return Array.from({ length: this._storage.length }, (_, idx) => this._storage.key(idx));
  }
}

const STORAGES = {
  local: null,
  session: null,
};

export function getLocalStorage() {
  if (!STORAGES.local) {
    STORAGES.local = new StorageManager('localStorage');
  }
  return STORAGES.local;
}

export function getSessionStorage() {
  if (!STORAGES.session) {
    STORAGES.session = new StorageManager('sessionStorage');
  }
  return STORAGES.session;
}
