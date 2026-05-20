import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Capacitacion } from 'src/modules/capacitacion/capacitacion.entity';
import { Sesion } from 'src/modules/sesion/sesion.entity';

@Entity('profesor')
export class Profesor {
  @PrimaryGeneratedColumn({ name: 'id_profesor' })
  id_profesor: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 190, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true, select: false })
  contraseña: string;

  @Column({ length: 20, default: 'profesor' })
  rol: string;

  @Column({ type: 'text', nullable: true })
  disponibilidad: string;

  @Column({ type: 'tinyint', default: 0 })
  admin_sn: number;

  @ManyToMany(() => Capacitacion, capacitacion => capacitacion.profesores)
  capacitaciones: Capacitacion[];

  @OneToMany(() => Sesion, sesion => sesion.profesor)
  sesiones: Sesion[];
}
