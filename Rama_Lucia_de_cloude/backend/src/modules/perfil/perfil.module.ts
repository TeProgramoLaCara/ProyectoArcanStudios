import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perfil } from './perfil.entity';
import { Capacitacion } from '../capacitacion/capacitacion.entity';
import { PerfilService } from './perfil.service';
import { PerfilController } from './perfil.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Perfil, Capacitacion])
  ],
  controllers: [PerfilController],
  providers: [PerfilService],
})
export class PerfilModule {}
