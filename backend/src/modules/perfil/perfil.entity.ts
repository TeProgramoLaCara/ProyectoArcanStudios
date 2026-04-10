import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Capacitacion } from 'src/modules/capacitacion/capacitacion.entity';

@Entity('perfil')
export class Perfil {
  @PrimaryGeneratedColumn({ name: 'id_perfil' })
  id_perfil: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ManyToMany(() => Capacitacion, capacitacion => capacitacion.perfiles)
  @JoinTable({
    name: 'perfil_capacitacion',
    joinColumn: { name: 'perfil_id' },
    inverseJoinColumn: { name: 'capacitacion_id' }
  })
  capacitaciones: Capacitacion[]; 
}
