import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { EstadoTarea } from '@prisma/client';

export class CreateTareaDto {
  @IsString()
  @MinLength(1)
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(EstadoTarea)
  estado?: EstadoTarea;
}
