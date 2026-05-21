import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CapacitacionService } from './capacitacion.service';
import { CreateCapacitacionDto } from './dto/create-capacitacion.dto';
import { UpdateCapacitacionDto } from './dto/update-capacitacion.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('capacitacion')
export class CapacitacionController {
  constructor(private service: CapacitacionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateCapacitacionDto) {
    return this.service.create(dto);
  }

  @Roles('admin')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCapacitacionDto) {
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // RELACIONES
  @Get(':id/perfiles')
  findPerfiles(@Param('id') id: number) {
    return this.service.findPerfiles(id);
  }

  @Get(':id/cursos')
  findCursos(@Param('id') id: number) {
    return this.service.findCursos(id);
  }

  @Get(':id/profesores')
  findProfesores(@Param('id') id: number) {
    return this.service.findProfesores(id);
  }

  @Get(':id/sesiones')
  findSesiones(@Param('id') id: number) {
    return this.service.findSesiones(id);
  }
}
