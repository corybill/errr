/**
 * Error instance returned by {@link ErrorBuilder.get} or thrown by {@link ErrorBuilder.throw}.
 * Values set via {@link ErrorBuilder.set} / {@link ErrorBuilder.setAll} are copied onto this object.
 */
export interface ErrrBuiltError extends Error {
  _setValues_: Record<string, unknown>;
  _allDebugParams_?: unknown;
  set(key: string, value: unknown, force?: boolean): void;
  get(key: string): unknown;
  getAllDebugParams(): unknown;
}

/**
 * Fluent builder from {@link Errr.newError} or {@link Errr.fromError}.
 */
export interface ErrorBuilder {
  debug(params: Record<string, unknown>, shouldDebug?: boolean): this;
  set(key: string, value: unknown, force?: boolean): this;
  setAll(object: Record<string, unknown>, force?: boolean): this;
  appendTo(err: Error | ErrrBuiltError | null | undefined): this;
  get(): ErrrBuiltError;
  throw(): never;
}

declare class Errr {
  /**
   * Creates a builder from a message. When `template` is provided, `message` is formatted with Node’s
   * `util.format` (e.g. `%s`, `%d`).
   */
  static newError(message?: string, template?: unknown[]): ErrorBuilder;

  /**
   * @deprecated Prefer building from a message and using {@link ErrorBuilder.appendTo} for prior errors.
   */
  static fromError(error: Error): ErrorBuilder;
}

export default Errr;
