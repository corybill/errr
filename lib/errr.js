"use strict";

const Builder = require("./error-builder");

/**
 * Provides an interface to build an error.  Then allows you to get or throw the error.
 * @class
 *
 * @param {String} [message] - Error message that will supplied to Error Object.
 * @param {Array} [template] - Array of parameters.  If given, util.format(message, template) will be applied to the message string.
 */
class Errr {

  /**
   * Gets a new ErrorBuilder instance.
   *
   * @param {String} [message] - Error message that will supplied to Error Object.
   * @param {Array} [template] - Array of parameters.  If given, util.format(message, template) will be applied to the message string.
   * @returns {ErrorBuilder} Gets an ErrorBuilder to get or throw an Error.
   */
  static newError(message, template) {
    return new Builder(message, template);
  }
}

module.exports = Errr;
