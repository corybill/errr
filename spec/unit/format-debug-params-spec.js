import { describe, expect, it } from "vitest";
import util from "node:util";

import Errr, { formatDebugParams, inspectDebugParams, defaultDebugInspectOptions, DebugPrefix } from "../../lib/errr.js";

describe("formatDebugParams", () => {
  it("matches the debug fragment embedded in error.stack by .debug().get()", () => {
    const params = { actual: true, expected: false, nested: { x: 1 } };
    const err = Errr.newError("test").debug(params).get();
    const fragment = formatDebugParams(params);

    expect(err.stack.split(fragment).length).toBe(2);
    expect(err.stack).toContain(fragment);
  });

  it("matches the debug fragment embedded by .debug().throw()", () => {
    const params = { key: "value", count: 42 };
    let err;

    try {
      Errr.newError("throw test").debug(params).throw();
    } catch (caught) {
      err = caught;
    }

    const fragment = formatDebugParams(params);

    expect(err.stack.split(fragment).length).toBe(2);
  });

  it("is equivalent to Errr.formatDebugParams", () => {
    const params = { a: 1 };

    expect(Errr.formatDebugParams(params)).toBe(formatDebugParams(params));
  });

  it("uses DebugPrefix and default inspect options", () => {
    const params = { foo: "bar" };

    expect(formatDebugParams(params)).toBe(
      DebugPrefix + util.inspect(params, defaultDebugInspectOptions)
    );
    expect(inspectDebugParams(params)).toBe(util.inspect(params, defaultDebugInspectOptions));
  });

  it("merges optional inspect overrides onto defaults", () => {
    const params = { deep: { a: { b: { c: 1 } } } };
    const shallow = formatDebugParams(params, { depth: 1 });

    const expected = DebugPrefix + util.inspect(params, { ...defaultDebugInspectOptions, depth: 1 });

    expect(shallow).toBe(expected);
  });
});
