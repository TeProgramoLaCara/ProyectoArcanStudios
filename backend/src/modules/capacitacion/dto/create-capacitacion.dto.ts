import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateCapacitacionDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  @IsOptional()
  duracion?: number;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
