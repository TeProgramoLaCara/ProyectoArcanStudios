import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateNotificacionDto {
  @IsEnum(['usuario', 'profesor'])
  destinatario_tipo: 'usuario' | 'profesor';

  @IsInt()
  destinatario_id: number;

  @IsString()
  @MaxLength(50)
  tipo: string;

  @IsString()
  @MaxLength(200)
  titulo: string;

  @IsString()
  mensaje: string;

  @IsOptional()
  @IsString()
  ref_tipo?: string;

  @IsOptional()
  @IsInt()
  ref_id?: number;
}
