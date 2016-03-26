"use strict";

const util = require("util");

const constants = require("./constants");

/**
 * Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.
 */
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
    this._setValues_ = {};
    this._overrides_ = {};
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
   * Sets a value on the error object using the key as the variable name.  Values added using the 'set' function will
   * be appended to new error objects when using the the .appendTo function. I.e. the values on the appendTo err will be
   * copied to the new error.  These values are immutable though unless you use the 'force' value. As soon as you set
   * a value with a given key, it cannot be reset unless you pass in 'true' for the force variable.
   *
   * @param {String} key - The key that will be used to set the value on the error object.
   * @param {Object} value - The value that will be set on the object.
   * @param {Boolean} [force] - If force equals true, then this value will override a value with the same key from an errr
   * passed in using the 'appendTo' function.
   * @returns {ErrorBuilder}
   */
  set(key, value, force) {
    this._setValues_[key] = value;
    this._overrides_[key] = force || false;
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

    error.stack = (!this._debugParams_) ? error.stack :
      util.format(constants.templates.StackDebugParamsTemplate, error.stack, constants.DebugPrefix, JSON.stringify(this._debugParams_, null, 2));

    if (this._appendTo_) {
      error.stack = util.format(constants.templates.AppendToTemplate, error.stack, constants.StackTraceDelimiter, this._appendTo_.stack);
    }

    let key;

    // Overwrite _setValues_ with preexisting _setValues_
    if (this._appendTo_ && this._appendTo_._setValues_) {
      for (key in this._appendTo_._setValues_) {
        if (this._appendTo_._setValues_.hasOwnProperty(key)) {
          this._setValues_[key] = (this._overrides_[key] === true) ? this._setValues_[key] : this._appendTo_._setValues_[key];
        }
      }
    }

    // Add _setValues_ to errr object.
    for (key in this._setValues_) {
      if (this._setValues_.hasOwnProperty(key)) {
        error[key] = this._setValues_[key];
      }
    }

    // Remember the _setValues_ for next level.
    error._setValues_ = this._setValues_;
    return error;
  }
}

module.exports = ErrorBuilder;
