import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateTareaDto } from './update-tarea.dto';

describe('UpdateTareaDto', () => {
  it('es valido vacio, porque todos los campos son opcionales', async () => {
    const dto = plainToInstance(UpdateTareaDto, {});
    const errores = await validate(dto);
    expect(errores).toHaveLength(0);
  });

  it('rechaza un titulo vacio si se manda', async () => {
    const dto = plainToInstance(UpdateTareaDto, { titulo: '' });
    const errores = await validate(dto);
    expect(errores.some((e) => e.property === 'titulo')).toBe(true);
  });

  it('rechaza un estado invalido si se manda', async () => {
    const dto = plainToInstance(UpdateTareaDto, { estado: 'FOO' });
    const errores = await validate(dto);
    expect(errores.some((e) => e.property === 'estado')).toBe(true);
  });
});
