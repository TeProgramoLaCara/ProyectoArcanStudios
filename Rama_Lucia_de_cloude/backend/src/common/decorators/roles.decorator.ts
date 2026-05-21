import { SetMetadata } from '@nestjs/common';
import { Rol } from '../auth/auth-user';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_KEY, roles);
