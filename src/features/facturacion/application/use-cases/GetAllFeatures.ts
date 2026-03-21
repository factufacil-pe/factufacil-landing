import { Result } from '../../../../shared/domain/Result';
import { Feature } from '../../domain/entities/Feature';
import { IFeatureRepository } from '../../domain/ports/IFeatureRepository';

/**
 * GetAllFeatures — application use case.
 *
 * Retrieves all product features to display in the Features section.
 * Depends only on the IFeatureRepository port — never on a concrete adapter.
 */
export class GetAllFeatures {
  constructor(private readonly repository: IFeatureRepository) {}

  async execute(): Promise<Result<{ features: Feature[] }, string>> {
    const result = await this.repository.findAll();
    if (result.isErr) return Result.err(result.error);
    return Result.ok({ features: result.value });
  }
}
