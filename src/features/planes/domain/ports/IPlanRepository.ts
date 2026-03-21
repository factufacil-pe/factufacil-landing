import { Result } from '../../../../shared/domain/Result';
import { Plan } from '../entities/Plan';

/**
 * IPlanRepository — port for the planes (pricing) aggregate.
 */
export interface IPlanRepository {
  findAll(): Promise<Result<Plan[], string>>;
}
