import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateProfesorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  contraseña?: string;

  @IsString()
  @IsOptional()
  disponibilidad?: string;

  @IsInt()
  @IsOptional()
  admin_sn?: number;
}
