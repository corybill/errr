const util = require("util");

class JsonReplacer {
  static replace(key) {
    let replacedValue = this[key];

    replacedValue = util.isDate(replacedValue) ? `Date { ${replacedValue.toISOString()} }` : replacedValue;
    replacedValue = util.isUndefined(replacedValue) ? "undefined" : replacedValue;

    return replacedValue;
  }
}

module.exports = JsonReplacer;
