import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { PerfilService } from './perfil.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('perfil')
export class PerfilController {
  constructor(private service: PerfilService) {}

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
  create(@Body() dto: CreatePerfilDto) {
    return this.service.create(dto);
  }

  @Roles('admin')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePerfilDto) {
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

  @Roles('admin')
  @Post(':id/capacitaciones/:capacitacionId')
  addCapacitacion(
    @Param('id', ParseIntPipe) id: number,
    @Param('capacitacionId', ParseIntPipe) capacitacionId: number,
  ) {
    return this.service.addCapacitacion(id, capacitacionId);
  }

  @Roles('admin')
  @Delete(':id/capacitaciones/:capacitacionId')
  removeCapacitacion(
    @Param('id', ParseIntPipe) id: number,
    @Param('capacitacionId', ParseIntPipe) capacitacionId: number,
  ) {
    return this.service.removeCapacitacion(id, capacitacionId);
  }
}
