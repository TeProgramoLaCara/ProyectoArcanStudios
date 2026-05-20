import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CapacitacionService } from './capacitacion.service';
import { CreateCapacitacionDto } from './dto/create-capacitacion.dto';
import { UpdateCapacitacionDto } from './dto/update-capacitacion.dto';

@Controller('capacitacion')
export class CapacitacionController {
  constructor(private service: CapacitacionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCapacitacionDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCapacitacionDto) {
    return this.service.update(id, dto);
    
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
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
