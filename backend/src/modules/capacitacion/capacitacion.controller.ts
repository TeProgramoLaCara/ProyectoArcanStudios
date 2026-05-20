import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CapacitacionService } from './capacitacion.service';
import { CreateCapacitacionDto } from './dto/create-capacitacion.dto';
import { UpdateCapacitacionDto } from './dto/update-capacitacion.dto';

@ApiTags('Capacitaciones')
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

  // ASOCIAR/DESASOCIAR PROFESORES
  @Post(':id/profesores/:profesorId')
  addProfesor(
    @Param('id') id: number,
    @Param('profesorId') profesorId: number,
  ) {
    return this.service.addProfesor(id, profesorId);
  }

  @Delete(':id/profesores/:profesorId')
  removeProfesor(
    @Param('id') id: number,
    @Param('profesorId') profesorId: number,
  ) {
    return this.service.removeProfesor(id, profesorId);
  }

  // ASOCIAR/DESASOCIAR CURSOS
  @Post(':id/cursos/:cursoId')
  addCurso(
    @Param('id') id: number,
    @Param('cursoId') cursoId: number,
  ) {
    return this.service.addCurso(id, cursoId);
  }

  @Delete(':id/cursos/:cursoId')
  removeCurso(
    @Param('id') id: number,
    @Param('cursoId') cursoId: number,
  ) {
    return this.service.removeCurso(id, cursoId);
  }
}
