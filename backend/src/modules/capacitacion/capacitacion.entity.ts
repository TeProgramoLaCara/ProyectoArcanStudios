import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Perfil } from 'src/modules/perfil/perfil.entity';
import { Profesor } from 'src/modules/profesor/profesor.entity';
import { Curso } from 'src/modules/curso/curso.entity';
import { Sesion } from 'src/modules/sesion/sesion.entity';

@Entity('capacitacion')
export class Capacitacion {
  @PrimaryGeneratedColumn({ name: 'id_capacitacion' })
  id_capacitacion: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ nullable: true })
  duracion: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ManyToMany(() => Perfil, perfil => perfil.capacitaciones)
  perfiles: Perfil[];


  @ManyToMany(() => Profesor, profesor => profesor.capacitaciones)
  @JoinTable({
    name: 'capacitacion_profesor',
    joinColumn: { name: 'capacitacion_id' },
    inverseJoinColumn: { name: 'profesor_id' },
  })
  profesores: Profesor[];

  @ManyToMany(() => Curso, curso => curso.capacitaciones)
  @JoinTable({
    name: 'capacitacion_curso',
    joinColumn: { name: 'capacitacion_id' },
    inverseJoinColumn: { name: 'curso_id' },
  })
  cursos: Curso[];

  @OneToMany(() => Sesion, sesion => sesion.capacitacion)
  sesiones: Sesion[];
}
