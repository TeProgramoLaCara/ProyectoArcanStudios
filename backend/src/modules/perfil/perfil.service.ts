import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Perfil } from './perfil.entity';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { Capacitacion } from '../capacitacion/capacitacion.entity';

@Injectable()
export class PerfilService {
  constructor(
    @InjectRepository(Perfil)
    private repo: Repository<Perfil>,
    @InjectRepository(Capacitacion)
    private capacitacionRepo: Repository<Capacitacion>,

  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id_perfil: id } });
    if (!item) throw new NotFoundException('Perfil no encontrado');
    return item;
  }

  create(dto: CreatePerfilDto) {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdatePerfilDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.repo.remove(item);
  }

  // RELACIONES
  async findCapacitaciones(id: number) {
    const item = await this.repo.findOne({
      where: { id_perfil: id },
      relations: ['capacitaciones'],
    });

    if (!item) throw new NotFoundException('Perfil no encontrado');
    return item.capacitaciones;
  }
  // ASOCIAR capacitación a perfil
async addCapacitacion(perfilId: number, capacitacionId: number) {
  const perfil = await this.repo.findOne({
    where: { id_perfil: perfilId },
    relations: ['capacitaciones'],
  });

  if (!perfil) throw new NotFoundException('Perfil no encontrado');

  const capacitacion = await this.capacitacionRepo.findOne({
    where: { id_capacitacion: capacitacionId },
  });

  if (!capacitacion) throw new NotFoundException('Capacitación no encontrada');

  // Evitar duplicados
  const yaExiste = perfil.capacitaciones.some(
    c => c.id_capacitacion === capacitacionId,
  );

  if (!yaExiste) {
    perfil.capacitaciones.push(capacitacion);
  }

  return this.repo.save(perfil);
}

// DESASOCIAR capacitación de perfil
async removeCapacitacion(perfilId: number, capacitacionId: number) {
  const perfil = await this.repo.findOne({
    where: { id_perfil: perfilId },
    relations: ['capacitaciones'],
  });

  if (!perfil) throw new NotFoundException('Perfil no encontrado');

  perfil.capacitaciones = perfil.capacitaciones.filter(
    c => c.id_capacitacion !== capacitacionId,
  );

  return this.repo.save(perfil);
}

}
