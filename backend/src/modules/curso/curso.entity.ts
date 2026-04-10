import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Capacitacion } from 'src/modules/capacitacion/capacitacion.entity';
import { Reserva } from 'src/modules/reserva/reserva.entity';

@Entity('curso')
export class Curso {
  @PrimaryGeneratedColumn({ name: 'id_curso' })
  id_curso: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  duracion: number;

  @ManyToMany(() => Capacitacion, capacitacion => capacitacion.cursos)
  capacitaciones: Capacitacion[];

  @OneToMany(() => Reserva, reserva => reserva.curso)
  reservas: Reserva[];
}
