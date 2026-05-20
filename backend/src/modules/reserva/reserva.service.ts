import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reserva, ReservaEstado } from './reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ChangeEstadoDto } from './dto/change-estado.dto';
import { Usuario } from 'src/modules/usuario/usuario.entity';
import { Curso } from 'src/modules/curso/curso.entity';
import { Profesor } from 'src/modules/profesor/profesor.entity';
import { Sesion } from 'src/modules/sesion/sesion.entity';
import { NotificacionService } from 'src/modules/notificacion/notificacion.service';
import { AuthUser } from 'src/common/auth/auth-user';

// Reglas de transición entre estados (qué a qué se puede pasar)
const TRANSICIONES: Record<ReservaEstado, ReservaEstado[]> = {
  pendiente: ['confirmada', 'cancelada'],
  confirmada: ['completada', 'cancelada'],
  completada: [],
  cancelada: [],
};

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva) private repo: Repository<Reserva>,
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Curso) private cursoRepo: Repository<Curso>,
    @InjectRepository(Profesor) private profesorRepo: Repository<Profesor>,
    @InjectRepository(Sesion) private sesionRepo: Repository<Sesion>,
    private notificaciones: NotificacionService,
  ) {}

  /** Lista reservas filtradas por el rol del usuario autenticado. */
  async findAllForUser(user: AuthUser) {
    const qb = this.repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.usuario', 'u')
      .leftJoinAndSelect('r.curso', 'c')
      .leftJoinAndSelect('r.sesiones', 's')
      .leftJoinAndSelect('s.profesor', 'sp')
      .leftJoinAndSelect('s.aula', 'sa')
      .leftJoinAndSelect('s.capacitacion', 'sk')
      .orderBy('r.created_at', 'DESC');

    if (user.rol === 'admin') {
      // admin lo ve todo
    } else if (user.rol === 'profesor') {
      // sólo reservas que tienen al menos una sesión con este profesor
      qb.andWhere(
        `r.id_reserva IN (
           SELECT s2.reserva_id FROM sesion s2 WHERE s2.profesor_id = :pid
         )`,
        { pid: user.sub },
      );
    } else {
      // cliente: sólo las suyas
      qb.andWhere('u.id_usuario = :uid', { uid: user.sub });
    }

    return qb.getMany();
  }

  async findOne(id: number, user: AuthUser) {
    const item = await this.repo.findOne({
      where: { id_reserva: id },
      relations: ['sesiones', 'sesiones.profesor', 'sesiones.aula', 'sesiones.capacitacion'],
    });
    if (!item) throw new NotFoundException('Reserva no encontrada');

    if (user.rol === 'cliente' && item.usuario?.id_usuario !== user.sub) {
      throw new ForbiddenException('No puedes ver esta reserva');
    }
    if (user.rol === 'profesor') {
      const involved = item.sesiones?.some((s) => s.profesor?.id_profesor === user.sub);
      if (!involved) throw new ForbiddenException('No puedes ver esta reserva');
    }
    return item;
  }

  async create(dto: CreateReservaDto, user: AuthUser) {
    // Si el creador es cliente, la reserva siempre se crea a su nombre.
    const usuarioId = user.rol === 'cliente' ? user.sub : dto.usuario_id;

    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const curso = await this.cursoRepo.findOne({ where: { id_curso: dto.curso_id } });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    const item = this.repo.create({
      ...dto,
      usuario,
      curso,
      estado: 'pendiente',
    });
    const saved = await this.repo.save(item);

    // Notificar a TODOS los admins
    const admins = await this.profesorRepo.find({ where: { rol: 'admin' } });
    const notifs = admins.map((a) => ({
      destinatario_tipo: 'profesor' as const,
      destinatario_id: a.id_profesor,
      tipo: 'reserva_creada',
      titulo: 'Nueva reserva pendiente',
      mensaje: `${usuario.nombre} ha solicitado una reserva del curso "${curso.nombre}".`,
      ref_tipo: 'reserva',
      ref_id: saved.id_reserva,
    }));
    await this.notificaciones.createMany(notifs);

    return saved;
  }

  async update(id: number, dto: UpdateReservaDto, user: AuthUser) {
    const item = await this.findOne(id, user);

    // Cliente sólo puede editar si está pendiente
    if (user.rol === 'cliente' && item.estado !== 'pendiente') {
      throw new BadRequestException(
        'No puedes modificar una reserva ya gestionada por la academia',
      );
    }

    if (dto.usuario_id && user.rol === 'admin') {
      const usuario = await this.usuarioRepo.findOne({
        where: { id_usuario: dto.usuario_id },
      });
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

  async remove(id: number, user: AuthUser) {
    const item = await this.findOne(id, user);
    if (user.rol === 'cliente' && item.estado !== 'pendiente') {
      throw new BadRequestException('No puedes cancelar una reserva ya gestionada');
    }
    return this.repo.remove(item);
  }

  async changeEstado(id: number, dto: ChangeEstadoDto, user: AuthUser) {
    const item = await this.findOne(id, user);

    // Sólo admin puede confirmar/completar. Cliente puede cancelar las suyas
    // si siguen pendientes.
    if (dto.estado === 'cancelada') {
      if (
        user.rol !== 'admin' &&
        !(user.rol === 'cliente' && item.usuario.id_usuario === user.sub)
      ) {
        throw new ForbiddenException('No puedes cancelar esta reserva');
      }
    } else if (user.rol !== 'admin') {
      throw new ForbiddenException('Sólo el administrador puede cambiar este estado');
    }

    if (!TRANSICIONES[item.estado].includes(dto.estado)) {
      throw new BadRequestException(
        `No se puede pasar de "${item.estado}" a "${dto.estado}"`,
      );
    }

    item.estado = dto.estado;
    if (dto.motivo) {
      item.observaciones = item.observaciones
        ? `${item.observaciones}\n[${dto.estado}] ${dto.motivo}`
        : `[${dto.estado}] ${dto.motivo}`;
    }
    const saved = await this.repo.save(item);

    // Notificar al cliente del cambio
    if (item.usuario) {
      const cursoNombre = item.curso?.nombre ?? 'reserva';
      const titulo =
        dto.estado === 'confirmada'
          ? 'Reserva confirmada'
          : dto.estado === 'cancelada'
            ? 'Reserva cancelada'
            : dto.estado === 'completada'
              ? 'Reserva completada'
              : 'Reserva actualizada';
      await this.notificaciones.create({
        destinatario_tipo: 'usuario',
        destinatario_id: item.usuario.id_usuario,
        tipo: `reserva_${dto.estado}`,
        titulo,
        mensaje: `Tu reserva del curso "${cursoNombre}" pasó a estado "${dto.estado}".`,
        ref_tipo: 'reserva',
        ref_id: item.id_reserva,
      });
    }

    // Notificar a profesores implicados si pasa a confirmada
    if (dto.estado === 'confirmada') {
      const sesiones = await this.sesionRepo
        .createQueryBuilder('s')
        .leftJoinAndSelect('s.profesor', 'p')
        .where('s.reserva_id = :id', { id: item.id_reserva })
        .getMany();
      const profesoresUnicos = new Map<number, string>();
      sesiones.forEach((s) => {
        if (s.profesor) profesoresUnicos.set(s.profesor.id_profesor, s.profesor.nombre);
      });
      if (profesoresUnicos.size > 0) {
        await this.notificaciones.createMany(
          Array.from(profesoresUnicos.keys()).map((pid) => ({
            destinatario_tipo: 'profesor' as const,
            destinatario_id: pid,
            tipo: 'reserva_confirmada',
            titulo: 'Tienes una nueva clase asignada',
            mensaje: `Se ha confirmado una reserva del curso "${item.curso?.nombre ?? ''}" en la que estás asignado.`,
            ref_tipo: 'reserva',
            ref_id: item.id_reserva,
          })),
        );
      }
    }

    return saved;
  }

  async findSesiones(id: number, user: AuthUser) {
    const item = await this.findOne(id, user);
    return item.sesiones;
  }
}
