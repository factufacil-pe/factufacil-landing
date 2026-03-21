import { Result } from '../../../../shared/domain/Result';
import { Plan } from '../../domain/entities/Plan';
import { IPlanRepository } from '../../domain/ports/IPlanRepository';

/**
 * GetAllPlanes — application use case.
 *
 * Returns all subscription plans ordered naturally (Básico first, PRO second).
 */
export class GetAllPlanes {
  constructor(private readonly repository: IPlanRepository) {}

  async execute(): Promise<Result<{ planes: Plan[] }, string>> {
    const result = await this.repository.findAll();
    if (result.isErr) return Result.err(result.error);
    return Result.ok({ planes: result.value });
  }
}
