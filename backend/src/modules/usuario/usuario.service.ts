import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.repo.find();
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id_usuario: id } });
    if (!item) throw new NotFoundException('Usuario no encontrado');
    return item;
  }

  async create(dto: CreateUsuarioDto) {
    const empresa = await this.empresaRepo.findOne({ where: { id_empresa: dto.empresa_id } });
    if (!empresa) throw new NotFoundException('Empresa no encontrada');

    const item = this.repo.create({
      ...dto,
      empresa,
    });

    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const item = await this.findOne(id);

    if (dto.empresa_id) {
      const empresa = await this.empresaRepo.findOne({ where: { id_empresa: dto.empresa_id } });
      if (!empresa) throw new NotFoundException('Empresa no encontrada');
      item.empresa = empresa;
    }

    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.repo.remove(item);
  }

  // RELACIONES
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
      relations: ['reservas'],
    });

    if (!item) throw new NotFoundException('Usuario no encontrado');
    return item.reservas;
  }
}
