import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfesorService } from './profesor.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';

@ApiTags('Profesores')
@Controller('profesor')
export class ProfesorController {
  constructor(private service: ProfesorService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProfesorDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateProfesorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }

  // RELACIONES
  @Get(':id/capacitaciones')
  findCapacitaciones(@Param('id') id: number) {
    return this.service.findCapacitaciones(id);
  }

  @Get(':id/sesiones')
  findSesiones(@Param('id') id: number) {
    return this.service.findSesiones(id);
  }
}
