import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/auth/auth-user';

@UseGuards(JwtAuthGuard)
@Controller('usuario')
export class UsuarioController {
  constructor(private service: UsuarioService) {}

  @Roles('admin')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    if (user.rol !== 'admin' && !(user.tipo === 'usuario' && user.sub === id)) {
      throw new ForbiddenException();
    }
    return this.service.findOne(id);
  }

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
    @CurrentUser() user: AuthUser,
  ) {
    if (user.rol !== 'admin' && !(user.tipo === 'usuario' && user.sub === id)) {
      throw new ForbiddenException();
    }
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get(':id/empresa')
  findEmpresa(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    if (user.rol !== 'admin' && !(user.tipo === 'usuario' && user.sub === id)) {
      throw new ForbiddenException();
    }
    return this.service.findEmpresa(id);
  }

  @Get(':id/reservas')
  findReservas(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    if (user.rol !== 'admin' && !(user.tipo === 'usuario' && user.sub === id)) {
      throw new ForbiddenException();
    }
    return this.service.findReservas(id);
  }
}
