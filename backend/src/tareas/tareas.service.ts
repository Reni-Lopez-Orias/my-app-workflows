import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

@Injectable()
export class TareasService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTareaDto) {
    return this.prisma.tarea.create({ data: dto });
  }

  findAll() {
    return this.prisma.tarea.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number) {
    const tarea = await this.prisma.tarea.findUnique({ where: { id } });
    if (!tarea) throw new NotFoundException(`Tarea ${id} no encontrada`);
    return tarea;
  }

  async update(id: number, dto: UpdateTareaDto) {
    await this.findOne(id);
    return this.prisma.tarea.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.tarea.delete({ where: { id } });
  }
}
