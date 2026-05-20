import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SesionService } from './sesion.service';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/auth/auth-user';

@Controller('sesion')
export class SesionController {
  constructor(private service: SesionService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    if (user.rol === 'admin') return this.service.findAll();
    if (user.rol === 'profesor') return this.service.findByProfesor(user.sub);
    return this.service.findByCliente(user.sub);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateSesionDto) {
    return this.service.create(dto);
  }

  @Roles('admin')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSesionDto) {
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get(':id/cursos')
  findCurso(@Param('id', ParseIntPipe) id: number) {
    return this.service.findCurso(id);
  }

  @Get(':id/profesores')
  findProfesor(@Param('id', ParseIntPipe) id: number) {
    return this.service.findProfesor(id);
  }

  @Get(':id/aulas')
  findAula(@Param('id', ParseIntPipe) id: number) {
    return this.service.findAula(id);
  }

  @Get(':id/reservas')
  findReserva(@Param('id', ParseIntPipe) id: number) {
    return this.service.findReserva(id);
  }
}
