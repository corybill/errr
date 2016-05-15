"use strict";

const Base = require("./base");

/**
 * Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.
 */
class FromError extends Base {

  /**
   * Provides an interface to build an error.  Then allows you to get or throw the error.
   * @class
   *
   * @param {String} [message] - Error message that will supplied to Error Object.
   * @param {Array} [template] - Array of parameters.  If given, util.format(message, template) will be applied to the message string.
   */
  constructor(error) {
    super();

    this._error_ = error;
  }

  /**
   * @private
   */
  _build_() {
    let error = this._error_;

    return super._build_(error);
  }
}

module.exports = FromError;
