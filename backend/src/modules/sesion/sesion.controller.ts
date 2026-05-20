import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';

@Controller('sesion')
export class SesionController {
  constructor(private service: SesionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSesionDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateSesionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }

// RELACIONES
@Get(':id/cursos')
findCurso(@Param('id') id: number) {
  return this.service.findCurso(id);
}

@Get(':id/profesores')
findProfesor(@Param('id') id: number) {
  return this.service.findProfesor(id);
}

@Get(':id/aulas')
findAula(@Param('id') id: number) {
  return this.service.findAula(id);
}

@Get(':id/reservas')
findReserva(@Param('id') id: number) {
  return this.service.findReserva(id);
}

}
