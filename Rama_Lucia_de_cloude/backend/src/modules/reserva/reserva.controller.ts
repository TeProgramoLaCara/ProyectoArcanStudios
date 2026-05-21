import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ChangeEstadoDto } from './dto/change-estado.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/auth/auth-user';

@UseGuards(JwtAuthGuard)
@Controller('reserva')
export class ReservaController {
  constructor(private service: ReservaService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.service.findAllForUser(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.service.findOne(id, user);
  }

  @Post()
  create(@Body() dto: CreateReservaDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservaDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.update(id, dto, user);
  }

  @Patch(':id/estado')
  changeEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeEstadoDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.changeEstado(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.service.remove(id, user);
  }

  @Get(':id/sesiones')
  findSesiones(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.service.findSesiones(id, user);
  }
}
