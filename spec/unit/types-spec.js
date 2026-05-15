import { describe, expect, it } from "vitest";
import Errr from "../../lib/errr.js";
import { StackTraceDelimiter } from "../../lib/constants.js";

describe("Comprehensive type support for appendTo and debug", () => {

  const testType = (type, value, expectedInStack) => {
    describe(`Type: ${type}`, () => {
      it(`should handle ${type} in debug params`, () => {
        const err = Errr.newError("Test error")
          .debug({ val: value })
          .get();
        if (expectedInStack) {
          expect(err.stack).toContain(expectedInStack);
        }
      });

      it(`should handle ${type} in appendTo`, () => {
        const err = Errr.newError("top").appendTo(value).get();
        expect(err.stack.split(StackTraceDelimiter)).toHaveLength(2);
        if (expectedInStack) {
          expect(err.stack).toContain(expectedInStack);
        }
      });
    });
  };

  testType("string", "test-string", "test-string");
  testType("number", 123, "123");
  testType("boolean", true, "true");
  testType("bigint", 123n, "123");
  testType("symbol", Symbol("test-symbol"), "Symbol(test-symbol)");
  testType("function", function testFunc() {}, "testFunc");
  testType("Buffer", Buffer.from("test-buffer"), "Buffer");
  testType("Date", new Date("2026-05-15T00:00:00.000Z"), "2026-05-15T00:00:00.000Z");
  testType("RegExp", /test-regexp/g, "/test-regexp/g");
  testType("Map", new Map([["key", "value"]]), "key");
  testType("Set", new Set(["value"]), "value");
  testType("Array", [1, 2, 3], "1");

});
