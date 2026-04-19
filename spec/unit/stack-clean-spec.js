import { afterEach, describe, expect, it } from "vitest";

import { StackTraceDelimiter } from "../../lib/constants.js";
import {
  cleanErrrStack,
  cleanStackEnvVar,
  maybeCleanErrrStack
} from "../../lib/stack-clean.js";

describe("cleanErrrStack", () => {
  it("strips leading errr package frames only", () => {
    const input = [
      "Error: x",
      "    at get (/proj/node_modules/errr/lib/from-message.js:1:1)",
      "    at _build_ (/proj/node_modules/errr/lib/base.js:2:2)",
      "    at run (/proj/node_modules/express/index.js:3:3)",
      "    at app (/proj/src/app.js:4:4)"
    ].join("\n");

    const cleaned = cleanErrrStack(input);

    expect(cleaned).toBe(
      [
        "Error: x",
        "    at run (/proj/node_modules/express/index.js:3:3)",
        "    at app (/proj/src/app.js:4:4)"
      ].join("\n")
    );
  });

  it("drops node_modules frames after the first non-node_modules frame", () => {
    const input = [
      "TypeError: y",
      "    at a (/proj/src/a.js:1:1)",
      "    at b (/proj/node_modules/pkg/b.js:2:2)",
      "    at c (/proj/src/c.js:3:3)"
    ].join("\n");

    expect(cleanErrrStack(input)).toBe(
      [
        "TypeError: y",
        "    at a (/proj/src/a.js:1:1)",
        "    at c (/proj/src/c.js:3:3)"
      ].join("\n")
    );
  });

  it("keeps node_modules before the first project frame", () => {
    const input = [
      "Error: z",
      "    at x (/proj/node_modules/foo/x.js:1:1)",
      "    at y (/proj/src/y.js:2:2)"
    ].join("\n");

    expect(cleanErrrStack(input)).toBe(input);
  });

  it("resets rules after the append delimiter", () => {
    const input = [
      "Error: a",
      "    at e (/proj/node_modules/errr/lib/x.js:1:1)",
      "    at u (/proj/src/u.js:2:2)",
      "",
      StackTraceDelimiter,
      "",
      "Error: b",
      "    at e2 (/proj/node_modules/errr/lib/x.js:3:3)",
      "    at v (/proj/node_modules/pkg/v.js:4:4)",
      "    at w (/proj/src/w.js:5:5)"
    ].join("\n");

    expect(cleanErrrStack(input)).toBe(
      [
        "Error: a",
        "    at u (/proj/src/u.js:2:2)",
        "",
        StackTraceDelimiter,
        "",
        "Error: b",
        "    at v (/proj/node_modules/pkg/v.js:4:4)",
        "    at w (/proj/src/w.js:5:5)"
      ].join("\n")
    );
  });

  it("passes through non-frame lines unchanged", () => {
    const input = ["Error: q", "", "Debug Params: {}", "    at z (/x.js:1:1)"].join("\n");

    expect(cleanErrrStack(input)).toBe(input);
  });
});

describe("maybeCleanErrrStack", () => {
  const previousEnv = process.env[cleanStackEnvVar];

  afterEach(() => {
    if (previousEnv === undefined) {
      delete process.env[cleanStackEnvVar];
    } else {
      process.env[cleanStackEnvVar] = previousEnv;
    }
  });

  it("returns stack unchanged when env is unset", () => {
    delete process.env[cleanStackEnvVar];
    const stack = "Error: x\n    at a (/a.js:1:1)";

    expect(maybeCleanErrrStack(stack)).toBe(stack);
  });

  it("cleans when env is 1", () => {
    process.env[cleanStackEnvVar] = "1";

    const input = [
      "Error: x",
      "    at e (/p/node_modules/errr/lib/x.js:1:1)",
      "    at u (/p/src/u.js:2:2)"
    ].join("\n");

    expect(maybeCleanErrrStack(input)).toBe(
      ["Error: x", "    at u (/p/src/u.js:2:2)"].join("\n")
    );
  });
});
