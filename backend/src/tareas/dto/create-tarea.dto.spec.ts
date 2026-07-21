import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EstadoTarea } from '@prisma/client';
import { CreateTareaDto } from './create-tarea.dto';

describe('CreateTareaDto', () => {
  it('es valido con solo el titulo', async () => {
    const dto = plainToInstance(CreateTareaDto, { titulo: 'Comprar pan' });
    const errores = await validate(dto);
    expect(errores).toHaveLength(0);
  });

  it('es valido con todos los campos', async () => {
    const dto = plainToInstance(CreateTareaDto, {
      titulo: 'Comprar pan',
      descripcion: 'Antes de las 20hs',
      estado: EstadoTarea.HECHA,
    });
    const errores = await validate(dto);
    expect(errores).toHaveLength(0);
  });

  it('rechaza un titulo vacio', async () => {
    const dto = plainToInstance(CreateTareaDto, { titulo: '' });
    const errores = await validate(dto);
    expect(errores.some((e) => e.property === 'titulo')).toBe(true);
  });

  it('rechaza si falta el titulo', async () => {
    const dto = plainToInstance(CreateTareaDto, {});
    const errores = await validate(dto);
    expect(errores.some((e) => e.property === 'titulo')).toBe(true);
  });

  it('rechaza un estado que no sea PENDIENTE ni HECHA', async () => {
    const dto = plainToInstance(CreateTareaDto, {
      titulo: 'Comprar pan',
      estado: 'FOO',
    });
    const errores = await validate(dto);
    expect(errores.some((e) => e.property === 'estado')).toBe(true);
  });
});
