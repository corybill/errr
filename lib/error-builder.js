"use strict";

const util = require("util");

const constants = require("./constants");

class ErrorBuilder {

  /**
   * Provides an interface to build an error.  Then allows you to get or throw the error.
   * @class
   *
   * @param {String} [message] - Error message that will supplied to Error Object.
   * @param {Array} [template] - Array of parameters.  If given, util.format(message, template) will be applied to the message string.
   */
  constructor(message, templateParams) {
    this._message_ = (templateParams === undefined) ? message : util.format.apply(this, [message].concat(templateParams));
    this._message_ = this._message_ || "";
  }

  /**
   * Add parameters to the stack trace that will make it easier to debug the problem.
   *
   * @param {Object} params - Object Map of key value parameters that will make it easier to debug the error.
   * @param {Boolean} [shouldDebug] - If shouldDebug === false, then debug params will not print.  Any other value (including undefined), and the debug params will be printed. Useful if you want to only print debugParams given an Environment Variable.
   * @returns {ErrorBuilder} - Returns the instance of errorBuilder to allow chainability.
   */
  debug(params, shouldDebug) {
    this._debugParams_ = (shouldDebug === undefined || shouldDebug === true) ? params : "";
    return this;
  }

  /**
   * Append the error being built, to the end of this error's stack trace.
   *
   * @param {Error} err - The stack trace of the error being built, will be appended to this error's stack trace.
   * @returns {ErrorBuilder} - Returns the instance of errorBuilder to allow chainability.
   */
  appendTo(err) {
    this._appendTo_ = err;
    return this;
  }

  /**
   * Returns a new Error object using the given parameters from the builder.
   *
   * @returns {Error} - Returns a new Error object using the given parameters from the builder.
   */
  get() {
    return this._build_();
  }

  /**
   * Throws a new Error object using the given parameters from the builder.
   *
   * @throws {Error} - Throws a new Error object using the given parameters from the builder.
   */
  throw() {
    throw this._build_();
  }

  /**
   * @private
   */
  _build_() {
    let error = new Error(this._message_);

    error.stack = (!this._debugParams_) ? error.stack : util.format(constants.templates.StackDebugParamsTemplate, error.stack, constants.DebugPrefix, JSON.stringify(this._debugParams_, null, 2));

    if (this._appendTo_) {
      this._appendTo_.stack = util.format(constants.templates.AppendToTemplate, this._appendTo_.stack, constants.StackTraceDelimiter, error.stack);
      error = this._appendTo_;
    }

    return error;
  }
}

module.exports = ErrorBuilder;
