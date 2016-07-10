"use strict";

const Base = require("./base");

/**
 * Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.
 */
class FromError extends Base {

  /**
   * Provides an interface to build an error from an error.  Then allows you to get or throw the error.
   * @class
   *
   * @param {String} error - Will be used for the top level error and stack trace.
   */
  constructor(error) {
    super(error);

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
