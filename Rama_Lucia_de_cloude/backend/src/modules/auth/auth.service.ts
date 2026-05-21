import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Usuario } from 'src/modules/usuario/usuario.entity';
import { Profesor } from 'src/modules/profesor/profesor.entity';
import { AuthUser, Rol, TipoCuenta } from 'src/common/auth/auth-user';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

interface AccountMatch {
  tipo: TipoCuenta;
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  hash: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Profesor) private profesorRepo: Repository<Profesor>,
    private jwt: JwtService,
  ) {}

  /** Busca una cuenta por email en usuario o profesor. */
  private async findAccountByEmail(email: string): Promise<AccountMatch | null> {
    const normalized = email.trim().toLowerCase();

    const prof = await this.profesorRepo
      .createQueryBuilder('p')
      .addSelect('p.contraseña')
      .where('LOWER(p.email) = :email', { email: normalized })
      .getOne();
    if (prof) {
      return {
        tipo: 'profesor',
        id: prof.id_profesor,
        nombre: prof.nombre,
        email: prof.email,
        rol: (prof.rol as Rol) ?? (prof.admin_sn === 1 ? 'admin' : 'profesor'),
        hash: prof.contraseña,
      };
    }

    const user = await this.usuarioRepo
      .createQueryBuilder('u')
      .addSelect('u.contraseña')
      .where('LOWER(u.email) = :email', { email: normalized })
      .getOne();
    if (user) {
      return {
        tipo: 'usuario',
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: (user.rol as Rol) ?? 'cliente',
        hash: user.contraseña,
      };
    }

    return null;
  }

  async login(dto: LoginDto) {
    const account = await this.findAccountByEmail(dto.email);
    if (!account || !account.hash) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const ok = await bcrypt.compare(dto.password, account.hash);
    if (!ok) throw new UnauthorizedException('Credenciales incorrectas');

    const payload: AuthUser = {
      sub: account.id,
      tipo: account.tipo,
      rol: account.rol,
      nombre: account.nombre,
      email: account.email,
    };
    return {
      token: await this.jwt.signAsync(payload),
      user: payload,
    };
  }

  async me(user: AuthUser) {
    if (user.tipo === 'profesor') {
      const p = await this.profesorRepo.findOne({
        where: { id_profesor: user.sub },
      });
      if (!p) throw new UnauthorizedException('Cuenta no encontrada');
      return {
        id: p.id_profesor,
        tipo: 'profesor' as const,
        rol: (p.rol as Rol) ?? (p.admin_sn === 1 ? 'admin' : 'profesor'),
        nombre: p.nombre,
        email: p.email,
        disponibilidad: p.disponibilidad,
      };
    }
    const u = await this.usuarioRepo.findOne({
      where: { id_usuario: user.sub },
      relations: ['empresa'],
    });
    if (!u) throw new UnauthorizedException('Cuenta no encontrada');
    return {
      id: u.id_usuario,
      tipo: 'usuario' as const,
      rol: (u.rol as Rol) ?? 'cliente',
      nombre: u.nombre,
      email: u.email,
      empresa: u.empresa
        ? { id: u.empresa.id_empresa, nombre: u.empresa.nombre }
        : null,
    };
  }

  async changePassword(user: AuthUser, dto: ChangePasswordDto) {
    if (user.tipo === 'profesor') {
      const p = await this.profesorRepo
        .createQueryBuilder('p')
        .addSelect('p.contraseña')
        .where('p.id_profesor = :id', { id: user.sub })
        .getOne();
      if (!p || !p.contraseña) throw new UnauthorizedException();
      const ok = await bcrypt.compare(dto.current, p.contraseña);
      if (!ok) throw new BadRequestException('Contraseña actual incorrecta');
      p.contraseña = await bcrypt.hash(dto.next, 10);
      await this.profesorRepo.save(p);
      return { ok: true };
    }
    const u = await this.usuarioRepo
      .createQueryBuilder('u')
      .addSelect('u.contraseña')
      .where('u.id_usuario = :id', { id: user.sub })
      .getOne();
    if (!u || !u.contraseña) throw new UnauthorizedException();
    const ok = await bcrypt.compare(dto.current, u.contraseña);
    if (!ok) throw new BadRequestException('Contraseña actual incorrecta');
    u.contraseña = await bcrypt.hash(dto.next, 10);
    await this.usuarioRepo.save(u);
    return { ok: true };
  }

  /** Helper usado por usuario/profesor controllers al crear cuentas. */
  static hashPassword(plain: string) {
    return bcrypt.hash(plain, 10);
  }
}
