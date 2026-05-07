import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';
import { Usuario } from 'src/modules/usuario/usuario.entity';
import { Curso } from 'src/modules/curso/curso.entity';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva, Usuario, Curso])
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
