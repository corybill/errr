import FromMessage from "./from-message.js";
import FromError from "./from-error.js";
import { formatDebugParams, inspectDebugParams, defaultDebugInspectOptions } from "./format-debug-params.js";
import { DebugPrefix } from "./constants.js";

/**
 * Static class that contains the 'newError' factory function.  Use the 'newError' factory function to return an ErrrorrrBuilder instance.
 */
class Errr {

  /**
   * Gets a new ErrrorrrBuilder instance.
   * @static
   * @param {String} [message] - Error message that will supplied to Error Object.
   * @param {Array} [template] - Array of parameters.  If given, util.format(message, template) will be applied to the message string.
   * @returns {FromMessage} Gets an ErrrorrrBuilder to get or throw an Error.
   */
  static newError(message, template) {
    return new FromMessage(message, template);
  }

  /**
   * @deprecated - This function will be turned off in version 3 of Errr. You can now call the appendTo function many times
   * on the same errr instance allowing you to append many errors at once. This functionality replaces the need for this
   * section of the interface.
   *
   * @static
   * @param {String} err - Will be used for the top level error and stack trace.
   * @returns {FromError} Gets an ErrrorrrBuilder to get or throw an Error.
   */
  static fromError(err) {
    return new FromError(err);
  }

  /**
   * Returns the debug-params fragment errr embeds in `error.stack` after `.debug(params)`.
   * Same prefix and `util.inspect` options as production stack formatting.
   *
   * @param {Object} params - Debug params object (same shape as builder `.debug(params)`).
   * @param {import("node:util").InspectOptions} [inspectOptions] - Merged onto errr's defaults (`depth: 5`, `compact: false`).
   * @returns {string}
   */
  static formatDebugParams(params, inspectOptions) {
    return formatDebugParams(params, inspectOptions);
  }

}

export default Errr;
export { formatDebugParams, inspectDebugParams, defaultDebugInspectOptions, DebugPrefix };
