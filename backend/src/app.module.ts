import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AuthModule } from './modules/auth/auth.module';
import { NotificacionModule } from './modules/notificacion/notificacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '3306'), 10),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'BD_ARCAN'),
        autoLoadEntities: true,
        synchronize: false,
        charset: 'utf8mb4',
      }),
    }),

    AuthModule,
    AulaModule,
    CapacitacionModule,
    CursoModule,
    EmpresaModule,
    NotificacionModule,
    PerfilModule,
    ProfesorModule,
    ReservaModule,
    SesionModule,
    UsuarioModule,
  ],
})
export class AppModule {}
