import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePerfilDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
