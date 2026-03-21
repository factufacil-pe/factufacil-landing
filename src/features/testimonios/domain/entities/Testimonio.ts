import { Entity } from '../../../../shared/domain/Entity';

/**
 * Testimonio — customer testimonial entity.
 *
 * rating: 1-5 integer representing star rating.
 */
export interface TestimonioProps {
  readonly rating:  number;
  readonly title:   string;
  readonly quote:   string;
  readonly author:  string;
  readonly role:    string;
  readonly company: string;
}

export class Testimonio extends Entity<string> {
  readonly rating:  number;
  readonly title:   string;
  readonly quote:   string;
  readonly author:  string;
  readonly role:    string;
  readonly company: string;

  private constructor(id: string, props: TestimonioProps) {
    super(id);
    this.rating  = props.rating;
    this.title   = props.title;
    this.quote   = props.quote;
    this.author  = props.author;
    this.role    = props.role;
    this.company = props.company;
  }

  static create(id: string, props: TestimonioProps): Testimonio {
    if (!id.trim())           throw new Error('Testimonio id must not be blank');
    if (!props.author.trim()) throw new Error('Testimonio author must not be blank');
    if (props.rating < 1 || props.rating > 5) {
      throw new Error('Testimonio rating must be between 1 and 5');
    }
    return new Testimonio(id, props);
  }
}
