import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/auth/auth-user';

@UseGuards(JwtAuthGuard)
@Controller('profesor')
export class ProfesorController {
  constructor(private service: ProfesorService) {}

  @Get()
  findAll() {
    // Listado de profesores es útil a todos los roles autenticados
    // (cliente, admin, profesor para ver compañeros).
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateProfesorDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfesorDto,
    @CurrentUser() user: AuthUser,
  ) {
    if (user.rol !== 'admin' && !(user.tipo === 'profesor' && user.sub === id)) {
      throw new ForbiddenException();
    }
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get(':id/capacitaciones')
  findCapacitaciones(@Param('id', ParseIntPipe) id: number) {
    return this.service.findCapacitaciones(id);
  }

  @Get(':id/sesiones')
  findSesiones(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    if (user.rol === 'profesor' && user.sub !== id) {
      throw new ForbiddenException();
    }
    return this.service.findSesiones(id);
  }
}
