import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aula } from './aula.entity';
import { AulaService } from './aula.service';
import { AulaController } from './aula.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aula])],
  controllers: [AulaController],
  providers: [AulaService],
})
export class AulaModule {}
