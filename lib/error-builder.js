"use strict";

var util = require("util");

var constants = require("./constants");

class ErrorBuilder {
  constructor(message, templateParams) {
    this._message_ = (templateParams === undefined) ? message : util.format.apply(this, [message].concat(templateParams));
  }

  debug(params, shouldDebug) {
    this._debugParams_ = (shouldDebug === undefined || shouldDebug === true) ? params : "";
    return this;
  }

  appendTo(err) {
    this._appendTo_ = err;
    return this;
  }

  get() {
    return this._build_();
  }

  throw() {
    throw this._build_();
  }

  _build_() {
    var error = new Error(this._message_);

    error.stack = (!this._debugParams_) ? error.stack : util.format(constants.templates.StackDebugParamsTemplate, error.stack, constants.DebugPrefix, JSON.stringify(this._debugParams_, null, 2));

    if (this._appendTo_) {
      this._appendTo_.stack = util.format(constants.templates.AppendToTemplate, this._appendTo_.stack, constants.StackTraceDelimiter, error.stack);
      error = this._appendTo_;
    }

    return error;
  }
}

module.exports = ErrorBuilder;
