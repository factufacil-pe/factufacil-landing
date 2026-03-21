import { Entity } from '../../../../shared/domain/Entity';

/**
 * Plan — pricing plan entity for FactuFacil subscriptions.
 *
 * Immutable; all properties are readonly.
 * Prices are expressed as numbers in Peruvian soles (S/.).
 */
export interface PlanProps {
  readonly name: string;
  /** Monthly price in soles. */
  readonly price: number;
  /** Yearly price in soles (shown as discount alternative). */
  readonly yearlyPrice: number;
  readonly features: readonly string[];
  readonly isPopular: boolean;
}

export class Plan extends Entity<string> {
  readonly name:        string;
  readonly price:       number;
  readonly yearlyPrice: number;
  readonly features:    readonly string[];
  readonly isPopular:   boolean;

  private constructor(id: string, props: PlanProps) {
    super(id);
    this.name        = props.name;
    this.price       = props.price;
    this.yearlyPrice = props.yearlyPrice;
    this.features    = props.features;
    this.isPopular   = props.isPopular;
  }

  static create(id: string, props: PlanProps): Plan {
    if (!id.trim())          throw new Error('Plan id must not be blank');
    if (!props.name.trim())  throw new Error('Plan name must not be blank');
    if (props.price < 0)     throw new Error('Plan price must be non-negative');
    return new Plan(id, props);
  }
}
