"use strict";

const util = require("util");

const constants = require("./constants");

class Private {
  static replacer(key, value) {
    return (util.isUndefined(value)) ? "undefined" : value;
  }
}

/**
 * Error Builder allows you to use optional functions to build an error object.  The error can have appended stack traces and debug params to assist with debugging.
 */
class Error {

  /**
   * Provides an interface to build an error.  Then allows you to get or throw the error.
   * @class
   *
   * @param {String} [message] - Error message that will supplied to Error Object.
   * @param {Array} [template] - Array of parameters.  If given, util.format(message, template) will be applied to the message string.
   */
  constructor(fromError) {
    this._setValues_ = (fromError && fromError._setValues_) ? fromError._setValues_ : {};
    this._allDebugParams_ = (fromError && fromError._allDebugParams_) ? fromError._allDebugParams_ : [];
    this._debugParams_ = (fromError && fromError._debugParams_) ? fromError._debugParams_ : undefined;
    this._overrides_ = (fromError && fromError._overrides_) ? fromError._overrides_ : {};
    this._appendTo_ = [];
  }

  /**
   * Add parameters to the stack trace that will make it easier to debug the problem.  These values will appear in a
   * in an object labeled "Debug Params" in the stack trace.  You may call the 'debug' function as many times as you'd
   * like on an ErrorBuilder instance.  If the same key is passed in many times, the time it is passed in, will be
   * the value that appears in the stack trace.
   *
   * Unlike the 'set' function, which merges 'set' values from different Errr instances with its own instance, the debug
   * params start as an empty object for each Errr instance.  They are attached to the stack trace and then forgotten.
   *
   * @param {Object} params - Object Map of key value parameters that will make it easier to debug the error.
   * @param {Boolean} [shouldDebug] - If shouldDebug === false, then debug params will not print.  Any other value
   * (including undefined), and the debug params will be printed. Useful if you want to only print debugParams given
   * an Environment Variable.
   * @returns {ErrorBuilder} - Returns the instance of errorBuilder to allow chainability.
   */
  debug(params, shouldDebug) {
    this._debugParams_ = this._debugParams_ || {};

    if ((shouldDebug === undefined || shouldDebug === true)) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          this._debugParams_[key] = params[key];
        }
      }
    }
    return this;
  }

  /**
   * Sets a value on the error object using the key as the variable name.  Values added using the 'set' function will
   * be appended to new error objects when using the the .appendTo function. I.e. the values on the appendTo err will be
   * copied to the new error.  These values are immutable though unless you use the 'force' value. As soon as you set
   * a value with a given key, it cannot be reset unless you pass in 'true' for the force variable.
   *
   * The reason for enforcing an immutable paradigm, is to allow for values to be set on the error object at the level
   * where the error was originally thrown (seemingly where the most important info will come from).  This allows the user
   * to set a value such as 'reason' on the error object at all level of your code, but only the most important reason will
   * value will persist on the error object.
   *
   * @param {String} key - The key that will be used to set the value on the error object.
   * @param {Object} value - The value that will be set on the object.
   * @param {Boolean} [force] - If force equals true, then this value will override a value with the same key from an errr
   * passed in using the 'appendTo' function.
   * @returns {ErrorBuilder}
   */
  set(key, value, force) {
    this._setValues_[key] = this._setValues_[key] || value;
    this._overrides_[key] = this._overrides_[key] || force || false;
    return this;
  }

  /**
   * Same concept and functionality as the 'set' function.  The difference is that you can set all values in a
   * given object onto the Errr instance.
   *
   * Follows the same immutable paradigm as the 'set' function.  The difference is that you are setting the force override
   * for all value in the given object.
   *
   * See set to understand functionality better.
   *
   * @param {Object} object - Many key / value pairs to be set on the object.
   * @param {Boolean} [force] - If force equals true, then this value will override a value with the same key from an errr
   * passed in using the 'appendTo' function.
   * @returns {ErrorBuilder}
   */
  setAll(object, force) {
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        this._setValues_[key] = this._setValues_[key] || object[key];
        this._overrides_[key] = this._overrides_[key] || force || false;
      }
    }
    return this;
  }

  /**
   * Append the error being built, to the end of this error's stack trace.
   *
   * @param {Error} err - The stack trace of the error being built, will be appended to this error's stack trace.
   * @returns {ErrorBuilder} - Returns the instance of errorBuilder to allow chainability.
   */
  appendTo(err) {
    if (err) {
      this._appendTo_.push(err);
    }

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

  _build_(error) {
    error.stack = (!this._debugParams_) ? error.stack :
      util.format(constants.templates.StackDebugParamsTemplate, error.stack, constants.DebugPrefix, JSON.stringify(this._debugParams_, Private.replacer, 2));

    for (let currentAppendTo of this._appendTo_) {
      error.stack = util.format(constants.templates.AppendToTemplate, error.stack, constants.StackTraceDelimiter, currentAppendTo.stack);

      // Overwrite _setValues_ with preexisting _setValues_
      if (currentAppendTo && currentAppendTo._setValues_) {
        for (const key in currentAppendTo._setValues_) {
          if (currentAppendTo._setValues_.hasOwnProperty(key)) {
            this._setValues_[key] = (this._overrides_[key] === true) ? this._setValues_[key] : currentAppendTo._setValues_[key];
          }
        }
      }

      if (currentAppendTo._allDebugParams_ !== undefined) {
        error._allDebugParams_ = error._allDebugParams_ || [];
        error._allDebugParams_ = error._allDebugParams_.concat(currentAppendTo._allDebugParams_);
      }
    }

    if (this._debugParams_ !== undefined) {
      let debugParamsFromError = (this._allDebugParams_) ? this._allDebugParams_ : [];

      debugParamsFromError = debugParamsFromError.concat(this._debugParams_);

      error._allDebugParams_ = error._allDebugParams_ || [];
      error._allDebugParams_ = debugParamsFromError.concat(error._allDebugParams_);
    }

    // Add _setValues_ to errr object.
    for (const key in this._setValues_) {
      if (this._setValues_.hasOwnProperty(key)) {
        error[key] = this._setValues_[key];
      }
    }

    // Remember the _setValues_ for next level.
    error._setValues_ = this._setValues_;

    /**
     * Provides the same functionality as the builder set function, but places it on the errr instance.
     * @param {String} key - The key that will be used to set the value on the error object.
     * @param {Object} value - The value that will be set on the object.
     * @param {Boolean} [force] - If force equals true, then this value will override a value with the same key from an errr
     * passed in using the 'appendTo' function.
     */
    error.set = (key, value, force) => {
      error._setValues_[key] = (force || error._setValues_[key] === undefined) ? value : error._setValues_[key];
      error[key] = (force || error[key] === undefined) ? value : error[key];
    };

    /**
     * Allows you to get the value from the errr instance if the value is managed by errr. All unmanaged values will be
     * ignored and will not be returned.  See below for definitions of managed and unmanaged values.  Using unmanaged values
     * will only cause you headaches. It is highly recommended that you ONLY USE MANAGED VALUES. If you attempt to
     * override a managed value with an unmanaged value, the managed value will still overwrite when the errr instance
     * is appended to a new errr. To avoid this confusion, only use managed values.
     *
     * Managed Value - is a value that was placed on errr using the builder set or setAll functions, or the set function
     * on an errr instance (e.g. errr.set("foo", "foo");)
     *
     * Unmanaged Value - is a value placed directly onto an err instance (e.g. errr.foo = "foo";)
     *
     * @param {String} key -
     * @returns {*}
     */
    error.get = (key) => {
      return error._setValues_[key];
    };

    /**
     * Returns debug params from this errr instance and all appended errr instances.
     * @returns {*}
     */
    error.getAllDebugParams = () => {
      return error._allDebugParams_;
    };

    return error;
  }
}

module.exports = Error;
