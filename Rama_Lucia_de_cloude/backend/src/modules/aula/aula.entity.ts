import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sesion } from 'src/modules/sesion/sesion.entity';

@Entity('aula')
export class Aula {
  @PrimaryGeneratedColumn({ name: 'id_aula' })
  id_aula: number;

  @Column({ length: 100 })
  nombre: string;

  @Column()
  capacidad: number;

  @OneToMany(() => Sesion, sesion => sesion.aula)
  sesiones: Sesion[];
}
