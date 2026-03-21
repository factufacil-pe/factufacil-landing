import { Result } from '../../../../shared/domain/Result';
import { Plan } from '../../domain/entities/Plan';
import { IPlanRepository } from '../../domain/ports/IPlanRepository';

/**
 * InMemoryPlanRepository — secondary adapter seeding the two FactuFacil pricing plans.
 */
export class InMemoryPlanRepository implements IPlanRepository {
  private readonly plans: Plan[] = [
    Plan.create('basico', {
      name:        'Básico',
      price:       45,
      yearlyPrice: 450,
      isPopular:   false,
      features: [
        'Emite facturas y boletas',
        'Notas de crédito',
        'Conexión a SUNAT',
        'Validación RENIEC',
        'Todos los módulos incluidos',
        'Curso FactuFacil',
        'Soporte por WhatsApp',
      ],
    }),
    Plan.create('pro', {
      name:        'PRO',
      price:       95,
      yearlyPrice: 950,
      isPopular:   true,
      features: [
        'Todo lo del plan Básico',
        'Cursos academia FactuFacil',
        'Landing page personalizada',
        'E-commerce integrado',
        'Múltiples sucursales / series',
        'Reportes avanzados',
        'Soporte prioritario',
      ],
    }),
  ];

  async findAll(): Promise<Result<Plan[], string>> {
    return Result.ok([...this.plans]);
  }
}
