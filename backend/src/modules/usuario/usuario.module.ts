import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Empresa } from 'src/modules/empresa/empresa.entity';
import { Reserva } from 'src/modules/reserva/reserva.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Empresa, Reserva])
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
