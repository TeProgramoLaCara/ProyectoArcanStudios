import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Capacitacion } from './capacitacion.entity';
import { CreateCapacitacionDto } from './dto/create-capacitacion.dto';
import { UpdateCapacitacionDto } from './dto/update-capacitacion.dto';
import { Profesor } from '../profesor/profesor.entity';
import { Curso } from '../curso/curso.entity';

@Injectable()
export class CapacitacionService {
  constructor(
    @InjectRepository(Capacitacion)
    private repo: Repository<Capacitacion>,
    @InjectRepository(Profesor)
    private profesorRepo: Repository<Profesor>,
    @InjectRepository(Curso)
    private cursoRepo: Repository<Curso>,
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

  // ASOCIAR Y DESASOCIAR PROFESORES
  async addProfesor(capacitacionId: number, profesorId: number) {
    const capacitacion = await this.repo.findOne({
      where: { id_capacitacion: capacitacionId },
      relations: ['profesores'],
    });
    if (!capacitacion) throw new NotFoundException('Capacitación no encontrada');

    const profesor = await this.profesorRepo.findOne({
      where: { id_profesor: profesorId },
    });
    if (!profesor) throw new NotFoundException('Profesor no encontrado');

    const yaExiste = capacitacion.profesores.some(p => p.id_profesor === profesorId);
    if (!yaExiste) {
      capacitacion.profesores.push(profesor);
      return this.repo.save(capacitacion);
    }
    return capacitacion;
  }

  async removeProfesor(capacitacionId: number, profesorId: number) {
    const capacitacion = await this.repo.findOne({
      where: { id_capacitacion: capacitacionId },
      relations: ['profesores'],
    });
    if (!capacitacion) throw new NotFoundException('Capacitación no encontrada');

    capacitacion.profesores = capacitacion.profesores.filter(p => p.id_profesor !== profesorId);
    return this.repo.save(capacitacion);
  }

  // ASOCIAR Y DESASOCIAR CURSOS
  async addCurso(capacitacionId: number, cursoId: number) {
    const capacitacion = await this.repo.findOne({
      where: { id_capacitacion: capacitacionId },
      relations: ['cursos'],
    });
    if (!capacitacion) throw new NotFoundException('Capacitación no encontrada');

    const curso = await this.cursoRepo.findOne({
      where: { id_curso: cursoId },
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    const yaExiste = capacitacion.cursos.some(c => c.id_curso === cursoId);
    if (!yaExiste) {
      capacitacion.cursos.push(curso);
      return this.repo.save(capacitacion);
    }
    return capacitacion;
  }

  async removeCurso(capacitacionId: number, cursoId: number) {
    const capacitacion = await this.repo.findOne({
      where: { id_capacitacion: capacitacionId },
      relations: ['cursos'],
    });
    if (!capacitacion) throw new NotFoundException('Capacitación no encontrada');

    capacitacion.cursos = capacitacion.cursos.filter(c => c.id_curso !== cursoId);
    return this.repo.save(capacitacion);
  }

}
