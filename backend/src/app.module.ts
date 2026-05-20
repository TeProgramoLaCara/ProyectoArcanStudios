import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
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
export class AppModule { }
