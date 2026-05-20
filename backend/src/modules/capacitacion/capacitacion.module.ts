import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Capacitacion } from './capacitacion.entity';
import { CapacitacionService } from './capacitacion.service';
import { CapacitacionController } from './capacitacion.controller';
import { Profesor } from '../profesor/profesor.entity';
import { Curso } from '../curso/curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Capacitacion, Profesor, Curso])],
  controllers: [CapacitacionController],
  providers: [CapacitacionService],
})
export class CapacitacionModule {}
