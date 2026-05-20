import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PerfilService } from './perfil.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@ApiTags('Perfiles')
@Controller('perfil')
export class PerfilController {
  constructor(private service: PerfilService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePerfilDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdatePerfilDto) {
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
  @Post(':id/capacitaciones/:capacitacionId')
  addCapacitacion(
    @Param('id') id: number,
    @Param('capacitacionId') capacitacionId: number,
  ) {
    return this.service.addCapacitacion(id, capacitacionId);
  }
  @Delete(':id/capacitaciones/:capacitacionId')
  removeCapacitacion(
    @Param('id') id: number,
    @Param('capacitacionId') capacitacionId: number,
  ) {
    return this.service.removeCapacitacion(id, capacitacionId);
  }
}
