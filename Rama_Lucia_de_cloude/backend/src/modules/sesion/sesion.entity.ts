import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Reserva } from 'src/modules/reserva/reserva.entity';
import { Profesor } from 'src/modules/profesor/profesor.entity';
import { Aula } from 'src/modules/aula/aula.entity';
import { Capacitacion } from 'src/modules/capacitacion/capacitacion.entity';

@Entity('sesion')
export class Sesion {
  @PrimaryGeneratedColumn({ name: 'id_sesion' })
  id_sesion: number;

  @ManyToOne(() => Reserva, reserva => reserva.sesiones)
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;

  @ManyToOne(() => Profesor, profesor => profesor.sesiones)
  @JoinColumn({ name: 'profesor_id' })
  profesor: Profesor;

  @ManyToOne(() => Aula, aula => aula.sesiones)
  @JoinColumn({ name: 'aula_id' })
  aula: Aula;

  @ManyToOne(() => Capacitacion, capacitacion => capacitacion.sesiones)
  @JoinColumn({ name: 'capacitacion_id' })
  capacitacion: Capacitacion;

  @Column({ nullable: true })
  duracion: number;

  @Column({ type: 'datetime', nullable: true })
  fecha_ini: Date;

  @Column({ type: 'datetime', nullable: true })
  fecha_fin: Date;

  @Column({ length: 50, nullable: true })
  turno: string;
}
