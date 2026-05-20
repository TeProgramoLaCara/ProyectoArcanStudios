import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AulaModule } from './modules/aula/aula.module';
import { CapacitacionModule } from './modules/capacitacion/capacitacion.module';
import { CursoModule } from './modules/curso/curso.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { PerfilModule } from './modules/perfil/perfil.module';
import { ProfesorModule } from './modules/profesor/profesor.module';
import { ReservaModule } from './modules/reserva/reserva.module';
import { SesionModule } from './modules/sesion/sesion.module';
import { UsuarioModule } from './modules/usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'admin',
      password: '******',
      database: 'BD_ARCAN',
      autoLoadEntities: true,
      synchronize: false,
    }),

    AulaModule,
    CapacitacionModule,
    CursoModule,
    EmpresaModule,
    PerfilModule,
    ProfesorModule,
    ReservaModule,
    SesionModule,
    UsuarioModule,
  ],
})
export class AppModule {}
