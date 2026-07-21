import { NotFoundException } from '@nestjs/common';
import { EstadoTarea } from '@prisma/client';
import { TareasService } from './tareas.service';

describe('TareasService', () => {
  let service: TareasService;
  let prisma: {
    tarea: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const tareaEjemplo = {
    id: 1,
    titulo: 'Aprender NestJS',
    descripcion: null,
    estado: EstadoTarea.PENDIENTE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    prisma = {
      tarea: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new TareasService(prisma as never);
  });

  describe('create', () => {
    it('crea una tarea con los datos recibidos', async () => {
      prisma.tarea.create.mockResolvedValue(tareaEjemplo);

      const resultado = await service.create({ titulo: 'Aprender NestJS' });

      expect(prisma.tarea.create).toHaveBeenCalledWith({
        data: { titulo: 'Aprender NestJS' },
      });
      expect(resultado).toEqual(tareaEjemplo);
    });
  });

  describe('findAll', () => {
    it('lista las tareas ordenadas por mas reciente', async () => {
      prisma.tarea.findMany.mockResolvedValue([tareaEjemplo]);

      const resultado = await service.findAll();

      expect(prisma.tarea.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(resultado).toEqual([tareaEjemplo]);
    });
  });

  describe('findOne', () => {
    it('devuelve la tarea si existe', async () => {
      prisma.tarea.findUnique.mockResolvedValue(tareaEjemplo);

      const resultado = await service.findOne(1);

      expect(prisma.tarea.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(resultado).toEqual(tareaEjemplo);
    });

    it('tira NotFoundException si no existe', async () => {
      prisma.tarea.findUnique.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('verifica que exista antes de actualizar', async () => {
      prisma.tarea.findUnique.mockResolvedValue(tareaEjemplo);
      prisma.tarea.update.mockResolvedValue({
        ...tareaEjemplo,
        estado: EstadoTarea.HECHA,
      });

      const resultado = await service.update(1, { estado: EstadoTarea.HECHA });

      expect(prisma.tarea.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.tarea.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { estado: EstadoTarea.HECHA },
      });
      expect(resultado.estado).toBe(EstadoTarea.HECHA);
    });

    it('tira NotFoundException si la tarea no existe, y no llega a actualizar', async () => {
      prisma.tarea.findUnique.mockResolvedValue(null);

      await expect(
        service.update(99, { estado: EstadoTarea.HECHA }),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.tarea.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('verifica que exista antes de borrar', async () => {
      prisma.tarea.findUnique.mockResolvedValue(tareaEjemplo);
      prisma.tarea.delete.mockResolvedValue(tareaEjemplo);

      const resultado = await service.remove(1);

      expect(prisma.tarea.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(resultado).toEqual(tareaEjemplo);
    });

    it('tira NotFoundException si la tarea no existe, y no llega a borrar', async () => {
      prisma.tarea.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(prisma.tarea.delete).not.toHaveBeenCalled();
    });
  });
});
