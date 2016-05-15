"use strict";

const FromMessage = require("./from-message"),
  FromError = require("./from-error");

/**
 * Static class that contains the 'newError' factory function.  Use the 'newError' factory function to return an ErrorBuilder instance.
 */
class Errr {

  /**
   * Gets a new ErrorBuilder instance.
   * @static
   * @param {String} [message] - Error message that will supplied to Error Object.
   * @param {Array} [template] - Array of parameters.  If given, util.format(message, template) will be applied to the message string.
   * @returns {FromMessage} Gets an ErrorBuilder to get or throw an Error.
   */
  static newError(message, template) {
    return new FromMessage(message, template);
  }

  /**
   * Gets a new FromError instance.
   * @static
   * @param {String} err - Will be used for the top level error and stack trace.
   * @returns {FromError} Gets an ErrorBuilder to get or throw an Error.
   */
  static fromError(err) {
    return new FromError(err);
  }
}

module.exports = Errr;
