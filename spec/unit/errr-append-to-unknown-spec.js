import { describe, expect, it } from "vitest";

import Errr from "../../lib/errr.js";
import { StackTraceDelimiter } from "../../lib/constants.js";

describe("appendTo with non-Error values", () => {

  it("skips null silently (preserves prior behavior)", () => {
    const err = Errr.newError("top").appendTo(null).get();

    expect(err.stack.includes(StackTraceDelimiter)).toBe(false);
  });

  it("skips undefined silently (preserves prior behavior)", () => {
    const err = Errr.newError("top").appendTo(undefined).get();

    expect(err.stack.includes(StackTraceDelimiter)).toBe(false);
  });

  it("preserves Error instances unchanged so their stack is included verbatim", () => {
    const inner = new Error("inner stack");
    const err = Errr.newError("top").appendTo(inner).get();

    expect(err.stack.split(StackTraceDelimiter)).toHaveLength(2);
    expect(err.stack).toContain(inner.stack);
  });

  it("wraps a thrown string in an Error and appends it", () => {
    const err = Errr.newError("top").appendTo("boom").get();

    expect(err.stack.split(StackTraceDelimiter)).toHaveLength(2);
    expect(err.stack).toContain("Error: boom");
  });

  it("wraps a thrown plain object using util.inspect", () => {
    const err = Errr.newError("top").appendTo({ code: "EBAD", reason: "x" }).get();

    expect(err.stack.split(StackTraceDelimiter)).toHaveLength(2);
    expect(err.stack).toContain("{ code: 'EBAD', reason: 'x' }");
  });

  it("wraps a thrown number using String(value)", () => {
    const err = Errr.newError("top").appendTo(42).get();

    expect(err.stack.split(StackTraceDelimiter)).toHaveLength(2);
    expect(err.stack).toContain("Error: 42");
  });

  it("wraps a thrown boolean using String(value)", () => {
    const err = Errr.newError("top").appendTo(true).get();

    expect(err.stack.split(StackTraceDelimiter)).toHaveLength(2);
    expect(err.stack).toContain("Error: true");
  });

  it("treats error-like objects (with string .stack and .message) as already normalized", () => {
    const errLike = {
      message: "fake",
      stack: "Error: fake\n    at fake:1:1",
      name: "FakeError"
    };
    const err = Errr.newError("top").appendTo(errLike).get();

    expect(err.stack.split(StackTraceDelimiter)).toHaveLength(2);
    expect(err.stack).toContain("Error: fake\n    at fake:1:1");
  });

  it("handles circular objects using util.inspect", () => {
    const circular = {};

    circular.self = circular;

    const err = Errr.newError("top").appendTo(circular).get();

    expect(err.stack.split(StackTraceDelimiter)).toHaveLength(2);
    expect(err.stack).toContain("<ref *1> { self: [Circular *1] }");
  });

  it("preserves `set` values from a normalized non-Error value's parent chain (none in this case)", () => {
    const err = Errr.newError("top").set("reason", "wrapped")
      .appendTo("string error").get();

    expect(err.reason).toEqual("wrapped");
    expect(err.stack).toContain("Error: string error");
  });

  it("models the strict-TS try/catch case: caught `unknown` flows straight in", () => {
    let caught;

    try {
      Errr.newError("inner").throw();
    } catch (innerErr) {
      caught = innerErr;
    }

    const err = Errr.newError("outer").appendTo(caught).get();

    expect(err.stack.split(StackTraceDelimiter)).toHaveLength(2);
    expect(err.stack).toContain("Error: inner");
  });

});
