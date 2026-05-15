import { describe, expect, it, beforeEach, afterEach } from "vitest";
import Errr from "../../lib/errr.js";
import { DebugPrefix } from "../../lib/constants.js";

describe("Error.stackTraceLimit interaction", () => {
  let originalLimit;

  beforeEach(() => {
    // Save the original limit to restore it later
    originalLimit = Error.stackTraceLimit;
  });

  afterEach(() => {
    // Restore the original limit so we don't affect other tests
    Error.stackTraceLimit = originalLimit;
  });

  it("should still include debug params when stackTraceLimit is very small", () => {
    // Set limit to 1 frame
    Error.stackTraceLimit = 1;

    const debugParams = { foo: "bar", test: 123 };
    const err = Errr.newError("Short stack error")
      .debug(debugParams)
      .get();

    // Verify the stack trace is short (Message + 1 frame = ~2 lines)
    const lines = err.stack.split("\n");
    // Note: The stack will contain the message, the frame, the debug prefix, and the JSON.
    // We just want to make sure the debug params are there.

    expect(err.stack).toContain("Short stack error");
    expect(err.stack).toContain(DebugPrefix);
    expect(err.stack).toContain("foo: 'bar'");
    expect(err.stack).toContain("test: 123");

    // Count actual stack frames (lines starting with "    at ")
    const frameCount = lines.filter(line => line.trim().startsWith("at ")).length;

    // It might be 1 or slightly more if errr's internal frames aren't cleaned yet,
    // but it should be significantly less than the default 10.
    expect(frameCount).toBeLessThanOrEqual(1);
  });

  it("should still include debug params when stackTraceLimit is 0", () => {
    // Set limit to 0 (only message, no frames)
    Error.stackTraceLimit = 0;

    const err = Errr.newError("No stack error")
      .debug({ key: "value" })
      .get();

    expect(err.stack).toContain("No stack error");
    expect(err.stack).toContain(DebugPrefix);
    expect(err.stack).toContain("key: 'value'");

    const frameCount = err.stack.split("\n").filter(line => line.trim().startsWith("at ")).length;

    expect(frameCount).toBe(0);
  });
});
