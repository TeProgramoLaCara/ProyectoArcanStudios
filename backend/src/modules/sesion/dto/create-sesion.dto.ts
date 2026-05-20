import { IsInt, IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateSesionDto {
  @IsInt()
  reserva_id: number;

  @IsInt()
  profesor_id: number;

  @IsInt()
  aula_id: number;

  @IsInt()
  capacitacion_id: number;

  @IsInt()
  @IsOptional()
  duracion?: number;

  @IsDateString()
  @IsOptional()
  fecha_ini?: Date;

  @IsDateString()
  @IsOptional()
  fecha_fin?: Date;

  @IsString()
  @IsOptional()
  turno?: string;
}
