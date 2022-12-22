// MODULES

const fs = require("fs");

// OPTIONS

const defaultOptions = {
  asyncWrite: false,
  syncOnWrite: true,
  jsonSpaces: 4,
  stringify: JSON.stringify,
  parse: JSON.parse,
};

// CLASS

class NativeDB {
  /**
   * Creates a new instance of the NativeDB class.
   * @param {string} filePath The path of the file to use as storage.
   * @param {object} [options] Configuration options.
   * @param {boolean} [options.asyncWrite] Enables asynchronous writes to the storage file.
   * @param {boolean} [options.syncOnWrite] Makes the storage be written to disk after every modification.
   * @param {number} [options.jsonSpaces] How many spaces to use for indentation in the output json file.
   */

  constructor(filePath, options) {
    if (!filePath || !filePath.length) {
      throw new Error("Missing file path argument.");
    }
    this.filePath = filePath;

    this.options = options ? { ...defaultOptions, ...options } : defaultOptions;

    this.storage = {};

    try {
      const stats = fs.statSync(filePath);
      fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
      if (stats.size > 0) {
        const data = fs.readFileSync(filePath);
        this.validateJSON(data);
        this.storage = this.options.parse(data);
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        return;
      } else if (error.code === "EACCES") {
        throw new Error(`Cannot access path "${filePath}".`);
      } else {
        throw new Error(
          `Error while checking for existence of path "${filePath}": ${error}`
        );
      }
    }
  }

  /**
   * Creates or modifies a key in the database.
   * @param {string} key The key to create or alter.
   * @param {object} value Whatever to store in the key. You name it, just keep it JSON-friendly.
   */

  set(key, value) {
    this.storage[key] = value;
    if (this.options.syncOnWrite) this.sync();
  }

  /**
   * Extracts the value of one or more keys from the database.
   * @param {...string} [keys] The keys to search for. If not provided, returns the entire storage object.
   * @returns {object} The values of the keys or the entire storage object
   */

  get(...keys) {
    if (keys.length === 0) return this.storage;

    return keys.reduce((acc, key) => {
      acc[key] = this.storage[key];
      return acc;
    }, {});
  }

  /**
   * Removes one or more keys from the database.
   * @param {...string} keys The keys to remove.
   */

  remove(...keys) {
    keys.forEach((key) => delete this.storage[key]);
    if (this.options.syncOnWrite) this.sync();
  }

  /**
   * Removes all keys from the database.
   */

  clear() {
    this.storage = {};
    if (this.options.syncOnWrite) this.sync();
  }

  /**
   * Writes the current state of the storage object to the storage file.
   */

  sync() {
    if (this.options.asyncWrite) {
      fs.promises.writeFile(
        this.filePath,
        this.options.stringify(this.storage, null, this.options.jsonSpaces)
      );
    } else {
      fs.writeFileSync(
        this.filePath,
        this.options.stringify(this.storage, null, this.options.jsonSpaces)
      );
    }
  }

  /**
   * Validates the contents of a JSON file.
   * @param {string} fileContent
   * @returns {boolean} `true` if content is ok, throws error if not.
   */

  validateJSON(fileContent) {
    try {
      this.options.parse(fileContent);
    } catch (error) {
      console.error(
        "Given filePath is not empty and its content is not valid JSON."
      );
      throw error;
    }
    return true;
  }
}

module.exports = NativeDB;
