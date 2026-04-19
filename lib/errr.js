import FromMessage from "./from-message.js";
import FromError from "./from-error.js";

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

}

export default Errr;
