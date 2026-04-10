import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  e_mail?: string;

  @IsString()
  @IsOptional()
  contraseña?: string;
}
