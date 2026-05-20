import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

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

  async create(dto: CreateProfesorDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.repo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Ya existe un profesor con ese email');

    const rol = dto.rol ?? (dto.admin_sn === 1 ? 'admin' : 'profesor');
    const item = this.repo.create({
      nombre: dto.nombre,
      email,
      contraseña: await bcrypt.hash(dto.password, 10),
      disponibilidad: dto.disponibilidad,
      admin_sn: rol === 'admin' ? 1 : 0,
      rol,
    });

    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateProfesorDto) {
    const item = await this.findOne(id);

    if (dto.email) {
      const email = dto.email.trim().toLowerCase();
      if (email !== item.email) {
        const dup = await this.repo.findOne({ where: { email } });
        if (dup) throw new BadRequestException('Email ya en uso');
        item.email = email;
      }
    }
    if (dto.nombre !== undefined) item.nombre = dto.nombre;
    if (dto.disponibilidad !== undefined) item.disponibilidad = dto.disponibilidad;
    if (dto.password) item.contraseña = await bcrypt.hash(dto.password, 10);
    if (dto.rol) {
      item.rol = dto.rol;
      item.admin_sn = dto.rol === 'admin' ? 1 : 0;
    } else if (dto.admin_sn !== undefined) {
      item.admin_sn = dto.admin_sn;
      item.rol = dto.admin_sn === 1 ? 'admin' : 'profesor';
    }

    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.repo.remove(item);
  }

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
      relations: ['sesiones', 'sesiones.aula', 'sesiones.capacitacion', 'sesiones.reserva'],
    });
    if (!item) throw new NotFoundException('Profesor no encontrado');
    return item.sesiones;
  }
}
