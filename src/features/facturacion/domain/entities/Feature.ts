import { Entity } from '../../../../shared/domain/Entity';

/**
 * Feature — represents a product feature of FactuFacil.
 *
 * Immutable domain entity; all properties are readonly.
 * Use Feature.create() as the sole factory entry-point.
 */
export interface FeatureProps {
  readonly title: string;
  readonly description: string;
  /** Icon identifier — a simple string key mapped to an SVG in the UI layer. */
  readonly icon: string;
}

export class Feature extends Entity<string> {
  readonly title: string;
  readonly description: string;
  readonly icon: string;

  private constructor(id: string, props: FeatureProps) {
    super(id);
    this.title       = props.title;
    this.description = props.description;
    this.icon        = props.icon;
  }

  static create(id: string, props: FeatureProps): Feature {
    if (!id.trim())          throw new Error('Feature id must not be blank');
    if (!props.title.trim()) throw new Error('Feature title must not be blank');
    return new Feature(id, props);
  }
}
