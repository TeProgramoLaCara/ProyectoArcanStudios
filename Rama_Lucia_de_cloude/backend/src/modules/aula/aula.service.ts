import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aula } from './aula.entity';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Injectable()
export class AulaService {
  constructor(
    @InjectRepository(Aula)
    private aulaRepository: Repository<Aula>,
  ) {}

  findAll() {
    return this.aulaRepository.find();
  }

  async findOne(id: number) {
    const aula = await this.aulaRepository.findOne({ where: { id_aula: id } });
    if (!aula) throw new NotFoundException('Aula no encontrada');
    return aula;
  }

  create(dto: CreateAulaDto) {
    const aula = this.aulaRepository.create(dto);
    return this.aulaRepository.save(aula);
  }

  async update(id: number, dto: UpdateAulaDto) {
    const aula = await this.findOne(id);
    Object.assign(aula, dto);
    return this.aulaRepository.save(aula);
  }

  async remove(id: number) {
    const aula = await this.findOne(id);
    return this.aulaRepository.remove(aula);
  }

  // RELACIÓN: AULA → SESIONES
  async findSesiones(id: number) {
    const aula = await this.aulaRepository.findOne({
      where: { id_aula: id },
      relations: ['sesiones'],
    });

    if (!aula) throw new NotFoundException('Aula no encontrada');
    return aula.sesiones;
  }
}
