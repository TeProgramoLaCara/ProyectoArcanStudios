import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sesion } from './sesion.entity';
import { Reserva } from 'src/modules/reserva/reserva.entity';
import { Profesor } from 'src/modules/profesor/profesor.entity';
import { Aula } from 'src/modules/aula/aula.entity';
import { Capacitacion } from 'src/modules/capacitacion/capacitacion.entity';
import { SesionService } from './sesion.service';
import { SesionController } from './sesion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sesion, Reserva, Profesor, Aula, Capacitacion])
  ],
  controllers: [SesionController],
  providers: [SesionService],
})
export class SesionModule {}
