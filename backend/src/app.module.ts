import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

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
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: toNumber(process.env.DB_PORT, 3306),
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_DATABASE ?? 'BD_ARCAN',
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
