import { IsEnum, IsOptional, IsString } from 'class-validator';
import type { ReservaEstado } from '../reserva.entity';

export class ChangeEstadoDto {
  @IsEnum(['pendiente', 'confirmada', 'completada', 'cancelada'])
  estado: ReservaEstado;

  @IsOptional()
  @IsString()
  motivo?: string;
}
