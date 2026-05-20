import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { AulaService } from './aula.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('aula')
export class AulaController {
  constructor(private readonly aulaService: AulaService) {}

  @Get()
  findAll() {
    return this.aulaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.aulaService.findOne(id);
  }

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateAulaDto) {
    return this.aulaService.create(dto);
  }

  @Roles('admin')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAulaDto) {
    return this.aulaService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.aulaService.remove(id);
  }

  // RELACIÓN: AULA → SESIONES
  @Get(':id/sesiones')
  findSesiones(@Param('id') id: number) {
    return this.aulaService.findSesiones(id);
  }
}
