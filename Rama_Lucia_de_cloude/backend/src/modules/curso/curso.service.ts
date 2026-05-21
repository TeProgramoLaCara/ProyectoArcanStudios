import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private repo: Repository<Curso>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id_curso: id } });
    if (!item) throw new NotFoundException('Curso no encontrado');
    return item;
  }

  create(dto: CreateCursoDto) {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateCursoDto) {
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
      where: { id_curso: id },
      relations: ['capacitaciones'],
    });

    if (!item) throw new NotFoundException('Curso no encontrado');
    return item.capacitaciones;
  }

  async findReservas(id: number) {
    const item = await this.repo.findOne({
      where: { id_curso: id },
      relations: ['reservas'],
    });

    if (!item) throw new NotFoundException('Curso no encontrado');
    return item.reservas;
  }
}
