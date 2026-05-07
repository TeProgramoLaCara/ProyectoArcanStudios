import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from 'src/modules/usuario/usuario.entity';

@Entity('empresa')
export class Empresa {
  @PrimaryGeneratedColumn({ name: 'id_empresa' })
  id_empresa: number;

  @Column({ length: 200 })
  nombre: string;

  @Column({ length: 200, nullable: true })
  e_mail: string;

  @Column({ length: 255, nullable: true })
  contraseña: string;

  @OneToMany(() => Usuario, usuario => usuario.empresa)
  usuarios: Usuario[];
}
