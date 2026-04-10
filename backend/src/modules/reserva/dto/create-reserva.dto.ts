import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateReservaDto {
  @IsInt()
  usuario_id: number;

  @IsInt()
  curso_id: number;

  @IsInt()
  @IsOptional()
  n_estudiantes?: number;

  @IsDateString()
  @IsOptional()
  fecha_ini?: Date;

  @IsDateString()
  @IsOptional()
  fecha_fin?: Date;

  @IsString()
  @IsOptional()
  factura?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
