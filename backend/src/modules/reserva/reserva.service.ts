import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Usuario } from 'src/modules/usuario/usuario.entity';
import { Curso } from 'src/modules/curso/curso.entity';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private repo: Repository<Reserva>,
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Curso)
    private cursoRepo: Repository<Curso>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id_reserva: id } });
    if (!item) throw new NotFoundException('Reserva no encontrada');
    return item;
  }

  async create(dto: CreateReservaDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: dto.usuario_id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const curso = await this.cursoRepo.findOne({ where: { id_curso: dto.curso_id } });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    const item = this.repo.create({
      ...dto,
      usuario,
      curso,
    });

    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateReservaDto) {
    const item = await this.findOne(id);

    if (dto.usuario_id) {
      const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: dto.usuario_id } });
      if (!usuario) throw new NotFoundException('Usuario no encontrado');
      item.usuario = usuario;
    }

    if (dto.curso_id) {
      const curso = await this.cursoRepo.findOne({ where: { id_curso: dto.curso_id } });
      if (!curso) throw new NotFoundException('Curso no encontrado');
      item.curso = curso;
    }

    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.repo.remove(item);
  }

  // RELACIONES
  async findSesiones(id: number) {
    const item = await this.repo.findOne({
      where: { id_reserva: id },
      relations: ['sesiones'],
    });

    if (!item) throw new NotFoundException('Reserva no encontrada');
    return item.sesiones;
  }
}
