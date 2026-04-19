/**
 * Maddox Scenario expects a Mocha-style test context ({ skip, test: { fullTitle } }).
 * Vitest exposes a different shape; this adapter keeps Maddox happy under Vitest.
 *
 * @param {import("vitest").TestContext} vitestCtx
 * @returns {{ skip: Function, test: { fullTitle: Function } } | undefined}
 */
function maddoxVitestContext(vitestCtx) {
  if (!vitestCtx) {
    return undefined;
  }

  function fullTitle() {
    const parts = [];
    let suite = vitestCtx.task?.suite;

    while (suite && suite.name) {
      parts.unshift(suite.name);
      suite = suite.suite;
    }
    if (vitestCtx.task?.name) {
      parts.push(vitestCtx.task.name);
    }
    return parts.join(" ") || vitestCtx.task?.name || "";
  }

  return {
    skip: vitestCtx.skip.bind(vitestCtx),
    test: {fullTitle}
  };
}

export {maddoxVitestContext};
