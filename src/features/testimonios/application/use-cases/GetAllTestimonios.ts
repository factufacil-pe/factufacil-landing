import { Result } from '../../../../shared/domain/Result';
import { Testimonio } from '../../domain/entities/Testimonio';
import { ITestimonioRepository } from '../../domain/ports/ITestimonioRepository';

/**
 * GetAllTestimonios — application use case.
 *
 * Returns all customer testimonials.
 */
export class GetAllTestimonios {
  constructor(private readonly repository: ITestimonioRepository) {}

  async execute(): Promise<Result<{ testimonios: Testimonio[] }, string>> {
    const result = await this.repository.findAll();
    if (result.isErr) return Result.err(result.error);
    return Result.ok({ testimonios: result.value });
  }
}
