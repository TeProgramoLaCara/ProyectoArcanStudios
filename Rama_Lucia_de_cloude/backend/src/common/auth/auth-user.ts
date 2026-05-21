export type Rol = 'admin' | 'profesor' | 'cliente';
export type TipoCuenta = 'usuario' | 'profesor';

export interface AuthUser {
  sub: number;
  tipo: TipoCuenta;
  rol: Rol;
  nombre: string;
  email: string;
}
