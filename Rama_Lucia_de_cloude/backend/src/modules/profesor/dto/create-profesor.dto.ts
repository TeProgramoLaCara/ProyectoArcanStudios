import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProfesorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @IsOptional()
  disponibilidad?: string;

  @IsOptional()
  @IsIn(['admin', 'profesor'])
  rol?: 'admin' | 'profesor';

  @IsInt()
  @IsOptional()
  admin_sn?: number;
}
