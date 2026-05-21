import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';
import { Usuario } from 'src/modules/usuario/usuario.entity';
import { Curso } from 'src/modules/curso/curso.entity';
import { Profesor } from 'src/modules/profesor/profesor.entity';
import { Sesion } from 'src/modules/sesion/sesion.entity';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { NotificacionModule } from 'src/modules/notificacion/notificacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva, Usuario, Curso, Profesor, Sesion]),
    NotificacionModule,
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
