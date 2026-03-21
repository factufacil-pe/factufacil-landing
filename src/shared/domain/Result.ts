/**
 * Railway-oriented Result<T, E> type.
 *
 * Eliminates thrown exceptions from the domain and application layers.
 * Every operation that can fail returns a Result; callers must explicitly
 * branch on `result.isOk` before accessing the wrapped value.
 *
 * Usage:
 *   const result = await repository.findBySlug(slug);
 *   if (result.isErr) {
 *     // handle result.error
 *   }
 *   const post = result.value; // safe — guaranteed to be Post here
 */
export class Result<T, E = string> {
  private readonly _isOk: boolean;
  private readonly _value: T | undefined;
  private readonly _error: E | undefined;

  private constructor(isOk: boolean, value?: T, error?: E) {
    this._isOk  = isOk;
    this._value = value;
    this._error = error;
  }

  // -------------------------------------------------------------------------
  // Static constructors
  // -------------------------------------------------------------------------

  /** Wrap a successful value in a Result. */
  static ok<T, E = string>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  /** Wrap a failure reason in a Result. */
  static err<T, E = string>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  // -------------------------------------------------------------------------
  // Accessors
  // -------------------------------------------------------------------------

  get isOk(): boolean {
    return this._isOk;
  }

  get isErr(): boolean {
    return !this._isOk;
  }

  /**
   * Retrieve the success value.
   * Throws if the Result is in an error state — always check `isOk` first.
   */
  get value(): T {
    if (!this._isOk) {
      throw new Error(
        'Cannot access Result.value on a failed result. Check isOk first.'
      );
    }
    return this._value as T;
  }

  /**
   * Retrieve the error value.
   * Throws if the Result is in a success state — always check `isErr` first.
   */
  get error(): E {
    if (this._isOk) {
      throw new Error(
        'Cannot access Result.error on a successful result. Check isErr first.'
      );
    }
    return this._error as E;
  }

  // -------------------------------------------------------------------------
  // Combinators
  // -------------------------------------------------------------------------

  /**
   * Transform the success value while leaving errors untouched.
   * Analogous to `Array.prototype.map`.
   */
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._isOk) {
      return Result.ok<U, E>(fn(this._value as T));
    }
    return Result.err<U, E>(this._error as E);
  }

  /**
   * Chain a fallible operation on the success value.
   * Short-circuits on the first error.
   */
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this._isOk) {
      return fn(this._value as T);
    }
    return Result.err<U, E>(this._error as E);
  }

  /**
   * Provide a fallback value when the result is an error.
   */
  getOrElse(defaultValue: T): T {
    return this._isOk ? (this._value as T) : defaultValue;
  }

  /**
   * Fold both branches into a single value (like a functional match expression).
   */
  fold<U>(onOk: (value: T) => U, onErr: (error: E) => U): U {
    return this._isOk
      ? onOk(this._value as T)
      : onErr(this._error as E);
  }
}
