# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.2.0] - 2026-05-15

### Changed

- `package-lock.json` version metadata aligned with `package.json` (was still reporting 4.x after the 5.x release).

## [5.1.0] - 2026-05-15

### Added

- **`CHANGELOG.md`** — release notes for 5.x and later.
- **`formatDebugParams(params, inspectOptions?)`** — returns the same debug-params fragment errr embeds in `error.stack` after `.debug(params)` (`Debug Params: ` prefix + `util.inspect` with `depth: 5`, `compact: false`). Available as a named export and as **`Errr.formatDebugParams`**.
- **`inspectDebugParams`**, **`DebugPrefix`**, and **`defaultDebugInspectOptions`** — for callers that need the prefix or inspect options separately.
- README section **Testing stack debug params** and TypeScript declarations for the new exports.
- Unit tests ensuring `formatDebugParams` matches output from `.debug().get()` / `.throw()`.

### Changed

- Stack debug formatting in `_build_` now goes through `lib/format-debug-params.js` (single code path with the public formatter).

## [5.0.0] - 2026-05-15

### Added

- **`appendTo` accepts `unknown`** — caught values from `try/catch` work under TypeScript `useUnknownInCatchVariables` without a `toError` shim; `null` and `undefined` are still skipped.
- **Non-`Error` `appendTo` values** are normalized safely: strings become `new Error(string)`; other values become `new Error(util.inspect(...))` so appended stacks stay readable.
- **Debug params in stacks use `util.inspect`** (`depth: 5`, `compact: false`) instead of `JSON.stringify`, so more JavaScript types print reliably.
- README notes for **`Error.stackTraceLimit`** and tests that debug params still appear when the limit is `0` or `1`.
- Vitest coverage for `appendTo` with unknown/non-Error values and stack-trace-limit behavior.

### Changed

- **Minimum Node.js version is 20** (was 18).
- Errr-owned properties on built errors (`_setValues_`, `set`, `get`, etc.) are **non-enumerable** so `util.inspect` / `console.log` on errors stay readable.
- CI runs on **Node 24**; Maddox dev dependency updated to **4.x**; Maddox specs live under `spec/maddox/`.

### Breaking

- **Debug param appearance in stack traces** changed from JSON to `util.inspect`. Tests or log parsers that matched the old JSON shape must be updated.
- **Node versions below 20** are no longer supported.

## [4.0.3] and earlier

See [git history](https://github.com/corybill/errr/commits/master) for prior releases.

[5.2.0]: https://github.com/corybill/errr/compare/v5.1.0...v5.2.0
[5.1.0]: https://github.com/corybill/errr/compare/v5.0.0...v5.1.0
[5.0.0]: https://github.com/corybill/errr/compare/v4.0.3...v5.0.0
