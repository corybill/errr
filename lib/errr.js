"use strict";

const Builder = require("./error-builder");

/**
 * Static class that contains the 'newError' factory function.  Use the 'newError' factory function to return an ErrorBuilder instance.
 * @static
 */
class Errr {

  /**
   * Gets a new ErrorBuilder instance.
   * @static
   * @param {String} [message] - Error message that will supplied to Error Object.
   * @param {Array} [template] - Array of parameters.  If given, util.format(message, template) will be applied to the message string.
   * @returns {ErrorBuilder} Gets an ErrorBuilder to get or throw an Error.
   */
  static newError(message, template) {
    return new Builder(message, template);
  }
}

module.exports = Errr;
