import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from './profesor.entity';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(Profesor)
    private repo: Repository<Profesor>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id_profesor: id } });
    if (!item) throw new NotFoundException('Profesor no encontrado');
    return item;
  }

  create(dto: CreateProfesorDto) {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateProfesorDto) {
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
      where: { id_profesor: id },
      relations: ['capacitaciones'],
    });

    if (!item) throw new NotFoundException('Profesor no encontrado');
    return item.capacitaciones;
  }

  async findSesiones(id: number) {
    const item = await this.repo.findOne({
      where: { id_profesor: id },
      relations: ['sesiones'],
    });

    if (!item) throw new NotFoundException('Profesor no encontrado');
    return item.sesiones;
  }
}
