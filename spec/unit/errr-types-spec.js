import { describe, expect, it, beforeEach } from "vitest";
import Errr from "../../lib/errr.js";
import { StackTraceDelimiter } from "../../lib/constants.js";

describe("Comprehensive type support for appendTo and debug", () => {
  let context;

  beforeEach(() => {
    context = {};
  });

  const types = [
    { type: "string", value: "test-string", expected: "test-string" },
    { type: "number", value: 123, expected: "123" },
    { type: "boolean", value: true, expected: "true" },
    { type: "bigint", value: 123n, expected: "123n" },
    { type: "symbol", value: Symbol("test-symbol"), expected: "Symbol(test-symbol)" },
    { type: "function", value: function testFunc() {}, expected: "[Function: testFunc]" },
    { type: "Buffer", value: Buffer.from("test-buffer"), expected: "Buffer" },
    { type: "Date", value: new Date("2026-05-15T00:00:00.000Z"), expected: "2026-05-15T00:00:00.000Z" },
    { type: "RegExp", value: /test-regexp/g, expected: "/test-regexp/g" },
    { type: "Map", value: new Map([["key", "value"]]), expected: "Map(1)" },
    { type: "Set", value: new Set(["value"]), expected: "Set(1)" },
    { type: "Array", value: [1, 2, 3], expected: "1" }
  ];

  types.forEach(({ type, value, expected }) => {
    describe(`Type: ${type}`, () => {
      beforeEach(() => {
        context.value = value;
        context.expected = expected;
      });

      it(`should handle ${type} in debug params`, () => {
        const err = Errr.newError("Test error")
          .debug({ val: context.value })
          .get();

        expect(err.stack).toContain(context.expected);
      });

      it(`should handle ${type} in appendTo`, () => {
        const err = Errr.newError("top").appendTo(context.value).get();

        expect(err.stack.split(StackTraceDelimiter)).toHaveLength(2);
        expect(err.stack).toContain(context.expected);
      });
    });
  });

  describe("Type: undefined", () => {
    it("should handle undefined in debug params", () => {
      const err = Errr.newError("Test error")
        .debug({ val: undefined })
        .get();

      expect(err.stack).toContain("val: undefined");
    });

    it("should skip undefined in appendTo (library behavior)", () => {
      const err = Errr.newError("top").appendTo(undefined).get();

      expect(err.stack.split(StackTraceDelimiter)).toHaveLength(1);
      expect(err.stack).not.toContain(StackTraceDelimiter);
    });
  });

  describe("Type: null", () => {
    it("should handle null in debug params", () => {
      const err = Errr.newError("Test error")
        .debug({ val: null })
        .get();

      expect(err.stack).toContain("val: null");
    });

    it("should skip null in appendTo (library behavior)", () => {
      const err = Errr.newError("top").appendTo(null).get();

      expect(err.stack.split(StackTraceDelimiter)).toHaveLength(1);
      expect(err.stack).not.toContain(StackTraceDelimiter);
    });
  });
});
