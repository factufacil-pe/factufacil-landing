/**
 * Base class for all domain value objects.
 *
 * Value objects are immutable descriptors with no conceptual identity of their
 * own — two value objects are equal when all of their properties are equal.
 * They should never be mutated; produce a new instance instead.
 *
 * Concrete subclasses must expose their data via a `props` getter that returns
 * a plain object so that the structural equality check implemented here works
 * without any additional ceremony.
 *
 * Example:
 *   class PostSlug extends ValueObject<{ value: string }> {
 *     static create(raw: string): PostSlug { ... }
 *     get value() { return this.props.value; }
 *   }
 */
export abstract class ValueObject<TProps extends Record<string, unknown>> {
  protected readonly props: TProps;

  protected constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  /**
   * Structural equality across all props.
   * Uses JSON serialisation so nested objects and arrays are compared by value.
   */
  equals(other: ValueObject<TProps>): boolean {
    if (other === null || other === undefined) return false;
    if (this.constructor !== other.constructor) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }

  /**
   * Convenience method — returns true when `other` is structurally different.
   */
  notEquals(other: ValueObject<TProps>): boolean {
    return !this.equals(other);
  }
}
