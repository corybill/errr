import {StackTraceDelimiter} from "./constants.js";

/**
 * Optional stack trace cleanup for built errors. When `ERRR_CLEAN_STACK` is set to `1`, `true`,
 * or `yes` (case-insensitive), `error.stack` is rewritten to drop leading frames under this
 * package inside `node_modules`, and to drop `node_modules` frames after the first frame whose
 * path does not contain `node_modules`. Each appended stack (after the `FROM` delimiter) is
 * processed separately. Default is off; path detection is heuristic.
 *
 * @module stack-clean
 */

/** Name of the env var that enables cleanup. Set to `1`, `true`, or `yes` (case-insensitive). */
export const cleanStackEnvVar = "ERRR_CLEAN_STACK";

const ERRR_PKG_PATH = /node_modules[/\\]errr(?:[/\\]|$)/;

const FRAME_LINE = /^\s+at\s/;

function envEnablesClean() {
  const raw = process.env[cleanStackEnvVar];

  if (!raw) {
    return false;
  }

  const normalized = String(raw).trim().toLowerCase();

  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function isFrameLine(line) {
  return FRAME_LINE.test(line);
}

function isNodeModulesLine(line) {
  return line.includes("node_modules");
}

function isErrrPackageLine(line) {
  return ERRR_PKG_PATH.test(line);
}

function isDelimiterLine(line) {
  return line.trim() === StackTraceDelimiter.trim();
}

/**
 * Opt-in stack cleanup: drop leading frames from the errr package, then drop node_modules
 * frames after the first non-node_modules frame. Resets at each append delimiter.
 *
 * @param {string} stack
 * @returns {string}
 */
export function cleanErrrStack(stack) {
  const lines = stack.split("\n");
  const out = [];
  let stripLeadingErrr = true;
  let seenNonNodeModules = false;

  function resetSegment() {
    stripLeadingErrr = true;
    seenNonNodeModules = false;
  }

  resetSegment();

  for (const line of lines) {
    if (isDelimiterLine(line)) {
      out.push(line);
      resetSegment();
    } else if (!isFrameLine(line)) {
      out.push(line);
    } else {
      const dropLeadingErrr = stripLeadingErrr && isErrrPackageLine(line);

      if (!dropLeadingErrr) {
        if (stripLeadingErrr) {
          stripLeadingErrr = false;
        }

        if (isNodeModulesLine(line)) {
          if (!seenNonNodeModules) {
            out.push(line);
          }
        } else {
          seenNonNodeModules = true;
          out.push(line);
        }
      }
    }
  }

  return out.join("\n");
}

/**
 * Applies {@link cleanErrrStack} when {@link cleanStackEnvVar} is enabled; otherwise returns `stack` unchanged.
 *
 * @param {string} stack
 * @returns {string}
 */
export function maybeCleanErrrStack(stack) {
  if (!envEnablesClean()) {
    return stack;
  }

  return cleanErrrStack(stack);
}
