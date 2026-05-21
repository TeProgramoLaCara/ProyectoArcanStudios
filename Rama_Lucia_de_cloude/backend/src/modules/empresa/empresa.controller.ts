import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('empresa')
export class EmpresaController {
  constructor(private service: EmpresaService) {}

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
  create(@Body() dto: CreateEmpresaDto) {
    return this.service.create(dto);
  }

  @Roles('admin')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmpresaDto) {
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // RELACIONES
  @Get(':id/usuarios')
  findUsuarios(@Param('id') id: number) {
    return this.service.findUsuarios(id);
  }
}
