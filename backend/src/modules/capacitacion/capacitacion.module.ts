import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Capacitacion } from './capacitacion.entity';
import { CapacitacionService } from './capacitacion.service';
import { CapacitacionController } from './capacitacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Capacitacion])],
  controllers: [CapacitacionController],
  providers: [CapacitacionService],
})
export class CapacitacionModule {}
