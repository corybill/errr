/**
 * Error instance returned by {@link ErrrorrrBuilder.get} or thrown by {@link ErrrorrrBuilder.throw}.
 * Values set via {@link ErrrorrrBuilder.set} / {@link ErrrorrrBuilder.setAll} are copied onto this object.
 */
export interface Errrorrr extends Error {
  _setValues_: Record<string, unknown>;
  _allDebugParams_?: unknown;
  set(key: string, value: unknown, force?: boolean): void;
  get(key: string): unknown;
  getAllDebugParams(): unknown;
}

/**
 * Fluent builder from {@link Errr.newError} or {@link Errr.fromError}.
 */
export interface ErrrorrrBuilder {
  debug(params: Record<string, unknown>, shouldDebug?: boolean): this;
  set(key: string, value: unknown, force?: boolean): this;
  setAll(object: Record<string, unknown>, force?: boolean): this;
  /**
   * Append an error to this error's stack trace.
   *
   * Accepts any value so a caught `unknown` (under TypeScript's `useUnknownInCatchVariables`)
   * can be passed in directly without a `toError` helper. `null` and `undefined` are skipped;
   * non-`Error` values are normalized to `new Error(...)` internally.
   */
  appendTo(err: unknown): this;
  get(): Errrorrr;
  throw(): never;
}

declare class Errr {
  /**
   * Creates a builder from a message. When `template` is provided, `message` is formatted with Node’s
   * `util.format` (e.g. `%s`, `%d`).
   */
  static newError(message?: string, template?: unknown[]): ErrrorrrBuilder;

  /**
   * @deprecated Prefer building from a message and using {@link ErrrorrrBuilder.appendTo} for prior errors.
   */
  static fromError(error: Error): ErrrorrrBuilder;
}

export default Errr;
