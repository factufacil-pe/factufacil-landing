import { Result } from '../../../../shared/domain/Result';
import { Feature } from '../entities/Feature';

/**
 * IFeatureRepository — port (interface) for the facturacion feature aggregate.
 *
 * The application layer depends only on this abstraction; concrete adapters
 * (InMemory, REST, etc.) implement it without touching domain code.
 */
export interface IFeatureRepository {
  findAll(): Promise<Result<Feature[], string>>;
}
