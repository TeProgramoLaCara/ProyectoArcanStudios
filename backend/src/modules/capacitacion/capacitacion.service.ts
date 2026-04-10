import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Capacitacion } from './capacitacion.entity';
import { CreateCapacitacionDto } from './dto/create-capacitacion.dto';
import { UpdateCapacitacionDto } from './dto/update-capacitacion.dto';

@Injectable()
export class CapacitacionService {
  constructor(
    @InjectRepository(Capacitacion)
    private repo: Repository<Capacitacion>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id_capacitacion: id } });
    if (!item) throw new NotFoundException('Capacitación no encontrada');
    return item;
  }

  create(dto: CreateCapacitacionDto) {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateCapacitacionDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.repo.remove(item);
  }

  // RELACIONES
  async findPerfiles(id: number) {
  const item = await this.repo.findOne({
    where: { id_capacitacion: id },
    relations: ['perfiles'],
  });

  if (!item) throw new NotFoundException('Capacitación no encontrada');
  return item.perfiles;
}

async findCursos(id: number) {
  const item = await this.repo.findOne({
    where: { id_capacitacion: id },
    relations: ['cursos'],
  });

  if (!item) throw new NotFoundException('Capacitación no encontrada');
  return item.cursos;
}

async findProfesores(id: number) {
  const item = await this.repo.findOne({
    where: { id_capacitacion: id },
    relations: ['profesores'],
  });

  if (!item) throw new NotFoundException('Capacitación no encontrada');
  return item.profesores;
}

async findSesiones(id: number) {
  const item = await this.repo.findOne({
    where: { id_capacitacion: id },
    relations: ['sesiones'],
  });

  if (!item) throw new NotFoundException('Capacitación no encontrada');
  return item.sesiones;
}

}
