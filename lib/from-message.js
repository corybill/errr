"use strict";

const util = require("util");

const Base = require("./base");

/**
 * Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.
 */
class FromMessage extends Base {

  /**
   * Provides an interface to build an error.  Then allows you to get or throw the error.
   * @class
   *
   * @param {String} [message] - Error message that will supplied to Error Object.
   * @param {Array} [template] - Array of parameters.  If given, util.format(message, template) will be applied to the message string.
   */
  constructor(message, templateParams) {
    super();

    this._message_ = (templateParams === undefined) ? message : util.format.apply(this, [message].concat(templateParams));
    this._message_ = this._message_ || "";
  }

  /**
   * @private
   */
  _build_() {
    let error = new Error(this._message_);

    return super._build_(error);
  }
}

module.exports = FromMessage;
