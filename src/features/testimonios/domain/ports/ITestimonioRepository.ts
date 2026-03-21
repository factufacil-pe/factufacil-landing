import { Result } from '../../../../shared/domain/Result';
import { Testimonio } from '../entities/Testimonio';

/**
 * ITestimonioRepository — port for the testimonios aggregate.
 */
export interface ITestimonioRepository {
  findAll(): Promise<Result<Testimonio[], string>>;
}
