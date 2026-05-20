import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AulaService } from './aula.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@ApiTags('Aulas')
@Controller('aula')
export class AulaController {
  constructor(private readonly aulaService: AulaService) {}

  @Get()
  findAll() {
    return this.aulaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.aulaService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAulaDto) {
    return this.aulaService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateAulaDto) {
    return this.aulaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.aulaService.remove(id);
  }

  // RELACIÓN: AULA → SESIONES
  @Get(':id/sesiones')
  findSesiones(@Param('id') id: number) {
    return this.aulaService.findSesiones(id);
  }
}
