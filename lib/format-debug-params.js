import util from "node:util";

import { DebugPrefix } from "./constants.js";

/** @type {util.InspectOptions} */
export const defaultDebugInspectOptions = { depth: 5, compact: false };

/**
 * Returns the same `util.inspect` output errr embeds in stack traces after {@link DebugPrefix}.
 *
 * @param {Object} params - Debug params object (same shape as {@link ErrrorrrBuilder.debug}).
 * @param {util.InspectOptions} [inspectOptions] - Overrides merged onto {@link defaultDebugInspectOptions}.
 * @returns {string}
 */
export function inspectDebugParams(params, inspectOptions) {
  const options = inspectOptions ?
    { ...defaultDebugInspectOptions, ...inspectOptions } :
    defaultDebugInspectOptions;

  return util.inspect(params, options);
}

/**
 * Returns the debug-params fragment errr appends to `error.stack` after `.debug(params)` (prefix + inspected params).
 * Use in tests or tools that assert on stack contents without duplicating errr's formatting.
 *
 * @param {Object} params - Debug params object (same shape as {@link ErrrorrrBuilder.debug}).
 * @param {util.InspectOptions} [inspectOptions] - Overrides merged onto {@link defaultDebugInspectOptions}.
 * @returns {string}
 */
export function formatDebugParams(params, inspectOptions) {
  return DebugPrefix + inspectDebugParams(params, inspectOptions);
}
