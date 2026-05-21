import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type DestinatarioTipo = 'usuario' | 'profesor';

@Entity('notificacion')
export class Notificacion {
  @PrimaryGeneratedColumn({ name: 'id_notificacion' })
  id_notificacion: number;

  @Column({ type: 'enum', enum: ['usuario', 'profesor'] })
  destinatario_tipo: DestinatarioTipo;

  @Column()
  destinatario_id: number;

  @Column({ length: 50 })
  tipo: string;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ length: 50, nullable: true })
  ref_tipo: string | null;

  @Column({ nullable: true })
  ref_id: number | null;

  @Column({ type: 'tinyint', default: 0 })
  leida: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
