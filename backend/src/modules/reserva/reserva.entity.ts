import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from 'src/modules/usuario/usuario.entity';
import { Curso } from 'src/modules/curso/curso.entity';
import { Sesion } from 'src/modules/sesion/sesion.entity';

@Entity('reserva')
export class Reserva {
  @PrimaryGeneratedColumn({ name: 'id_reserva' })
  id_reserva: number;

  @ManyToOne(() => Usuario, usuario => usuario.reservas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Curso, curso => curso.reservas)
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;

  @Column({ nullable: true })
  n_estudiantes: number;

  @Column({ type: 'datetime', nullable: true })
  fecha_ini: Date;

  @Column({ type: 'datetime', nullable: true })
  fecha_fin: Date;

  @Column({ length: 200, nullable: true })
  factura: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @OneToMany(() => Sesion, sesion => sesion.reserva)
  sesiones: Sesion[];
}
