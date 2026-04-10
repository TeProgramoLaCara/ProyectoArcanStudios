import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sesion } from './sesion.entity';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { Reserva } from 'src/modules/reserva/reserva.entity';
import { Profesor } from 'src/modules/profesor/profesor.entity';
import { Aula } from 'src/modules/aula/aula.entity';
import { Capacitacion } from 'src/modules/capacitacion/capacitacion.entity';

@Injectable()
export class SesionService {
  constructor(
    @InjectRepository(Sesion)
    private repo: Repository<Sesion>,

    @InjectRepository(Reserva)
    private reservaRepo: Repository<Reserva>,

    @InjectRepository(Profesor)
    private profesorRepo: Repository<Profesor>,

    @InjectRepository(Aula)
    private aulaRepo: Repository<Aula>,

    @InjectRepository(Capacitacion)
    private capacitacionRepo: Repository<Capacitacion>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id_sesion: id } });
    if (!item) throw new NotFoundException('Sesión no encontrada');
    return item;
  }

  async create(dto: CreateSesionDto) {
    const reserva = await this.reservaRepo.findOne({ where: { id_reserva: dto.reserva_id } });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');

    const profesor = await this.profesorRepo.findOne({ where: { id_profesor: dto.profesor_id } });
    if (!profesor) throw new NotFoundException('Profesor no encontrado');

    const aula = await this.aulaRepo.findOne({ where: { id_aula: dto.aula_id } });
    if (!aula) throw new NotFoundException('Aula no encontrada');

    const capacitacion = await this.capacitacionRepo.findOne({ where: { id_capacitacion: dto.capacitacion_id } });
    if (!capacitacion) throw new NotFoundException('Capacitación no encontrada');

    const item = this.repo.create({
      ...dto,
      reserva,
      profesor,
      aula,
      capacitacion,
    });

    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateSesionDto) {
    const item = await this.findOne(id);

    if (dto.reserva_id) {
      const reserva = await this.reservaRepo.findOne({ where: { id_reserva: dto.reserva_id } });
      if (!reserva) throw new NotFoundException('Reserva no encontrada');
      item.reserva = reserva;
    }

    if (dto.profesor_id) {
      const profesor = await this.profesorRepo.findOne({ where: { id_profesor: dto.profesor_id } });
      if (!profesor) throw new NotFoundException('Profesor no encontrado');
      item.profesor = profesor;
    }

    if (dto.aula_id) {
      const aula = await this.aulaRepo.findOne({ where: { id_aula: dto.aula_id } });
      if (!aula) throw new NotFoundException('Aula no encontrada');
      item.aula = aula;
    }

    if (dto.capacitacion_id) {
      const capacitacion = await this.capacitacionRepo.findOne({ where: { id_capacitacion: dto.capacitacion_id } });
      if (!capacitacion) throw new NotFoundException('Capacitación no encontrada');
      item.capacitacion = capacitacion;
    }

    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.repo.remove(item);
  }


// RELACIÓNES
async findCurso(id: number) {
  const sesion = await this.repo.findOne({
    where: { id_sesion: id },
    relations: ['reserva', 'reserva.curso'],
  });

  if (!sesion) throw new NotFoundException('Sesión no encontrada');
  return sesion.reserva?.curso ?? null;
}

async findProfesor(id: number) {
  const sesion = await this.repo.findOne({
    where: { id_sesion: id },
    relations: ['profesor'],
  });

  if (!sesion) throw new NotFoundException('Sesión no encontrada');
  return sesion.profesor;
}

async findAula(id: number) {
  const sesion = await this.repo.findOne({
    where: { id_sesion: id },
    relations: ['aula'],
  });

  if (!sesion) throw new NotFoundException('Sesión no encontrada');
  return sesion.aula;
}

async findReserva(id: number) {
  const sesion = await this.repo.findOne({
    where: { id_sesion: id },
    relations: ['reserva'],
  });

  if (!sesion) throw new NotFoundException('Sesión no encontrada');
  return sesion.reserva;
}

}
