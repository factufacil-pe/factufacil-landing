import { Result } from '../../../../shared/domain/Result';
import { Feature } from '../../domain/entities/Feature';
import { IFeatureRepository } from '../../domain/ports/IFeatureRepository';

/**
 * InMemoryFeatureRepository — secondary adapter that seeds hard-coded product
 * features for FactuFacil.
 *
 * Swap this out for an HTTP or DB adapter without touching domain or application code.
 */
export class InMemoryFeatureRepository implements IFeatureRepository {
  private readonly features: Feature[] = [
    Feature.create('mobile', {
      title:       '100% Mobile',
      description: 'Designed to be mobile-first. Accede a tu sistema desde cualquier dispositivo sin instalar nada.',
      icon:        'mobile',
    }),
    Feature.create('inventario', {
      title:       'Gestión de Inventario',
      description: 'Controla el inventario para que tengas el stock justo y nunca te quedes sin productos.',
      icon:        'inventory',
    }),
    Feature.create('compras-pdv', {
      title:       'Gestión de Compras y PDV',
      description: 'Ten un historial de compras por producto. Diseño amigable para el punto de ventas.',
      icon:        'cart',
    }),
    Feature.create('reportes', {
      title:       'Reportes',
      description: 'Genera reportes de compras, ventas para el pago de impuestos, kardex y cuadre de caja.',
      icon:        'chart',
    }),
  ];

  async findAll(): Promise<Result<Feature[], string>> {
    return Result.ok([...this.features]);
  }
}
