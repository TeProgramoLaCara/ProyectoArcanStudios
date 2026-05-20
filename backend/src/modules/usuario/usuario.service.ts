import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Usuario } from './usuario.entity';
import { Empresa } from 'src/modules/empresa/empresa.entity';
import { Reserva } from 'src/modules/reserva/reserva.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private repo: Repository<Usuario>,

    @InjectRepository(Empresa)
    private empresaRepo: Repository<Empresa>,

    @InjectRepository(Reserva)
    private reservaRepo: Repository<Reserva>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['empresa'] });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id_usuario: id },
      relations: ['empresa'],
    });
    if (!item) throw new NotFoundException('Usuario no encontrado');
    return item;
  }

  async create(dto: CreateUsuarioDto) {
    const empresa = await this.empresaRepo.findOne({
      where: { id_empresa: dto.empresa_id },
    });
    if (!empresa) throw new NotFoundException('Empresa no encontrada');

    const email = dto.email.trim().toLowerCase();
    const existing = await this.repo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Ya existe un usuario con ese email');

    const item = this.repo.create({
      nombre: dto.nombre,
      email,
      contraseña: await bcrypt.hash(dto.password, 10),
      rol: 'cliente',
      jefe_sn: dto.jefe_sn ?? 0,
      empresa,
    });

    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const item = await this.findOne(id);

    if (dto.empresa_id) {
      const empresa = await this.empresaRepo.findOne({
        where: { id_empresa: dto.empresa_id },
      });
      if (!empresa) throw new NotFoundException('Empresa no encontrada');
      item.empresa = empresa;
    }

    if (dto.email) {
      const email = dto.email.trim().toLowerCase();
      if (email !== item.email) {
        const dup = await this.repo.findOne({ where: { email } });
        if (dup) throw new BadRequestException('Email ya en uso');
        item.email = email;
      }
    }
    if (dto.nombre !== undefined) item.nombre = dto.nombre;
    if (dto.jefe_sn !== undefined) item.jefe_sn = dto.jefe_sn;
    if (dto.password) item.contraseña = await bcrypt.hash(dto.password, 10);

    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.repo.remove(item);
  }

  async findEmpresa(id: number) {
    const item = await this.repo.findOne({
      where: { id_usuario: id },
      relations: ['empresa'],
    });
    if (!item) throw new NotFoundException('Usuario no encontrado');
    return item.empresa;
  }

  async findReservas(id: number) {
    const item = await this.repo.findOne({
      where: { id_usuario: id },
      relations: ['reservas', 'reservas.curso'],
    });
    if (!item) throw new NotFoundException('Usuario no encontrado');
    return item.reservas;
  }
}
