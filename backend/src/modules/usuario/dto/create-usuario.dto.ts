import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  contraseña?: string;

  @IsInt()
  @IsOptional()
  jefe_sn?: number;

  @IsInt()
  empresa_id: number;
}
