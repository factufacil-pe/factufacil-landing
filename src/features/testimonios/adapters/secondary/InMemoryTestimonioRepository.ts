import { Result } from '../../../../shared/domain/Result';
import { Testimonio } from '../../domain/entities/Testimonio';
import { ITestimonioRepository } from '../../domain/ports/ITestimonioRepository';

/**
 * InMemoryTestimonioRepository — secondary adapter with real testimonial data.
 */
export class InMemoryTestimonioRepository implements ITestimonioRepository {
  private readonly testimonios: Testimonio[] = [
    Testimonio.create('t1', {
      rating:  5,
      title:   'Excelente',
      quote:   'Sistema de facturación Fácil e intuitivo.',
      author:  'Fredy Canchanya',
      role:    'Jefe',
      company: 'Plásticos Ucayali',
    }),
    Testimonio.create('t2', {
      rating:  5,
      title:   'Increíble',
      quote:   'Me adapté rápido al sistema, y puedo ver mis reportes en múltiples dispositivos.',
      author:  'Eduardo Anay',
      role:    'Gerente Comercial',
      company: 'Anay',
    }),
    Testimonio.create('t3', {
      rating:  5,
      title:   'Perfecto',
      quote:   'Me ayuda bastante en el PDV, ya que con el lector código de barras despacho a mis clientes más rápido.',
      author:  'Maria Mariñoz',
      role:    'Administradora',
      company: 'Comercial Gomez',
    }),
    Testimonio.create('t4', {
      rating:  5,
      title:   'Brillante',
      quote:   'Me ayuda en lo que necesito: Vender Rápido.',
      author:  'Maribel Huaman',
      role:    'Administradora',
      company: 'Comercial Virginia',
    }),
  ];

  async findAll(): Promise<Result<Testimonio[], string>> {
    return Result.ok([...this.testimonios]);
  }
}
