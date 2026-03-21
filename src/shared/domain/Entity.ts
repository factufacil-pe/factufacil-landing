/**
 * Base class for all domain entities.
 *
 * An entity has a stable identity (id) that persists across mutations.
 * Two entities are considered equal if and only if they share the same id,
 * regardless of any other property values.
 *
 * All concrete entity properties must be declared `readonly` to enforce
 * immutability at the TypeScript type level. Use the `reconstitute` factory
 * pattern (or a domain-specific static `create` method) to produce updated
 * versions of an entity instead of mutating in place.
 */
export abstract class Entity<TId> {
  /**
   * The unique identifier for this entity.
   * Typed generically so each aggregate can use its own strongly-typed id
   * value object (e.g. PostId) rather than a raw string or number.
   */
  readonly id: TId;

  protected constructor(id: TId) {
    this.id = id;
  }

  /**
   * Identity-based equality.
   * Returns `true` when `other` is an Entity of the same runtime class and
   * carries the same id value.
   */
  equals(other: Entity<TId>): boolean {
    if (other === null || other === undefined) return false;
    if (this === other) return true;
    if (this.constructor !== other.constructor) return false;
    return JSON.stringify(this.id) === JSON.stringify(other.id);
  }
}
