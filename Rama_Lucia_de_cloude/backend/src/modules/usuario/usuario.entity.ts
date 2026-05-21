import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Empresa } from 'src/modules/empresa/empresa.entity';
import { Reserva } from 'src/modules/reserva/reserva.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 190, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true, select: false })
  contraseña: string;

  @Column({ length: 20, default: 'cliente' })
  rol: string;

  @Column({ type: 'tinyint', default: 0 })
  jefe_sn: number;

  @ManyToOne(() => Empresa, empresa => empresa.usuarios)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @OneToMany(() => Reserva, reserva => reserva.usuario)
  reservas: Reserva[];
}
