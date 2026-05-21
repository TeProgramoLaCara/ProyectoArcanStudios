import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion, DestinatarioTipo } from './notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';

@Injectable()
export class NotificacionService {
  constructor(
    @InjectRepository(Notificacion)
    private repo: Repository<Notificacion>,
  ) {}

  create(dto: CreateNotificacionDto) {
    const item = this.repo.create({ ...dto, leida: 0 });
    return this.repo.save(item);
  }

  /** Crea muchas en bloque (varios destinatarios). */
  async createMany(items: CreateNotificacionDto[]) {
    if (items.length === 0) return [];
    const entities = items.map((dto) => this.repo.create({ ...dto, leida: 0 }));
    return this.repo.save(entities);
  }

  /** Notificaciones del destinatario actual. */
  findForDestinatario(tipo: DestinatarioTipo, id: number) {
    return this.repo.find({
      where: { destinatario_tipo: tipo, destinatario_id: id },
      order: { created_at: 'DESC' },
      take: 50,
    });
  }

  async countUnread(tipo: DestinatarioTipo, id: number) {
    return this.repo.count({
      where: { destinatario_tipo: tipo, destinatario_id: id, leida: 0 },
    });
  }

  async markAsRead(id: number, tipo: DestinatarioTipo, destinatarioId: number) {
    const item = await this.repo.findOne({ where: { id_notificacion: id } });
    if (!item) throw new NotFoundException('Notificación no encontrada');
    if (item.destinatario_tipo !== tipo || item.destinatario_id !== destinatarioId) {
      throw new NotFoundException('Notificación no encontrada');
    }
    item.leida = 1;
    return this.repo.save(item);
  }

  async markAllAsRead(tipo: DestinatarioTipo, destinatarioId: number) {
    await this.repo.update(
      { destinatario_tipo: tipo, destinatario_id: destinatarioId, leida: 0 },
      { leida: 1 },
    );
    return { ok: true };
  }
}
