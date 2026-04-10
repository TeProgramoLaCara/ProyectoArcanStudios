import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private repo: Repository<Empresa>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id_empresa: id } });
    if (!item) throw new NotFoundException('Empresa no encontrada');
    return item;
  }

  create(dto: CreateEmpresaDto) {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateEmpresaDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.repo.remove(item);
  }

  // RELACIONES
  async findUsuarios(id: number) {
    const item = await this.repo.findOne({
      where: { id_empresa: id },
      relations: ['usuarios'],
    });

    if (!item) throw new NotFoundException('Empresa no encontrada');
    return item.usuarios;
  }
}
