import { InMemoryFeatureRepository } from '../../features/facturacion/adapters/secondary/InMemoryFeatureRepository';
import { GetAllFeatures } from '../../features/facturacion/application/use-cases/GetAllFeatures';
import { IFeatureRepository } from '../../features/facturacion/domain/ports/IFeatureRepository';

import { InMemoryPlanRepository } from '../../features/planes/adapters/secondary/InMemoryPlanRepository';
import { GetAllPlanes } from '../../features/planes/application/use-cases/GetAllPlanes';
import { IPlanRepository } from '../../features/planes/domain/ports/IPlanRepository';

import { InMemoryTestimonioRepository } from '../../features/testimonios/adapters/secondary/InMemoryTestimonioRepository';
import { GetAllTestimonios } from '../../features/testimonios/application/use-cases/GetAllTestimonios';
import { ITestimonioRepository } from '../../features/testimonios/domain/ports/ITestimonioRepository';

// ---------------------------------------------------------------------------
// Container
// ---------------------------------------------------------------------------

/**
 * Lightweight dependency-injection container for FactuFacil.
 *
 * Wires secondary adapters (infrastructure) to application use cases.
 * Astro pages import only this singleton — they never reference adapters directly.
 *
 * Swapping InMemory* for real persistence is a one-line change per domain.
 */
class Container {
  // ---- Secondary adapters --------------------------------------------------
  private readonly featureRepository:   IFeatureRepository;
  private readonly planRepository:      IPlanRepository;
  private readonly testimonioRepository: ITestimonioRepository;

  // ---- Application use cases -----------------------------------------------
  readonly getAllFeatures:   GetAllFeatures;
  readonly getAllPlanes:     GetAllPlanes;
  readonly getAllTestimonios: GetAllTestimonios;

  constructor() {
    // Instantiate adapters first — they have no cross-domain dependencies.
    this.featureRepository    = new InMemoryFeatureRepository();
    this.planRepository       = new InMemoryPlanRepository();
    this.testimonioRepository = new InMemoryTestimonioRepository();

    // Wire use cases to their required ports.
    this.getAllFeatures    = new GetAllFeatures(this.featureRepository);
    this.getAllPlanes      = new GetAllPlanes(this.planRepository);
    this.getAllTestimonios = new GetAllTestimonios(this.testimonioRepository);
  }
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------

/**
 * The single Container instance for the entire application.
 *
 * Usage in Astro pages:
 *   import { container } from '../../infrastructure/container/Container';
 *   const result = await container.getAllPlanes.execute();
 */
export const container = new Container();
