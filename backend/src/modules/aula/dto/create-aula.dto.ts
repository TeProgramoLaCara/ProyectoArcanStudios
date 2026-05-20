import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateAulaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  capacidad: number;
}
