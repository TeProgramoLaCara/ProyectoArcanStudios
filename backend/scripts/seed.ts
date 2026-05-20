/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Seed: hashea contraseñas en texto plano y crea un admin por defecto.
 *
 *   - Las contraseñas que ya empiezan por "$2" (bcrypt) se dejan tal cual.
 *   - El resto se hashea con bcrypt(10) usando el valor actual como contraseña original.
 *   - Si no existe ningún profesor con rol="admin", crea uno con:
 *       email:    admin@arcan.local
 *       password: admin1234   (cámbiala desde la app tras el primer login)
 *
 * Ejecutar:  npm run seed
 */
import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { join } from 'path';

dotenvConfig({ path: join(process.cwd(), '.env') });

import { Aula } from '../src/modules/aula/aula.entity';
import { Capacitacion } from '../src/modules/capacitacion/capacitacion.entity';
import { Curso } from '../src/modules/curso/curso.entity';
import { Empresa } from '../src/modules/empresa/empresa.entity';
import { Notificacion } from '../src/modules/notificacion/notificacion.entity';
import { Perfil } from '../src/modules/perfil/perfil.entity';
import { Profesor } from '../src/modules/profesor/profesor.entity';
import { Reserva } from '../src/modules/reserva/reserva.entity';
import { Sesion } from '../src/modules/sesion/sesion.entity';
import { Usuario } from '../src/modules/usuario/usuario.entity';

async function main() {
  const ds = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'BD_ARCAN',
    entities: [Aula, Capacitacion, Curso, Empresa, Notificacion, Perfil, Profesor, Reserva, Sesion, Usuario],
    synchronize: false,
    charset: 'utf8mb4',
  });

  await ds.initialize();
  console.log('[seed] Conectado a la BD.');

  // --- 1. Hashear contraseñas en texto plano de USUARIO ---
  const usuarios = await ds
    .getRepository(Usuario)
    .createQueryBuilder('u')
    .addSelect('u.contraseña')
    .getMany();
  let updatedU = 0;
  for (const u of usuarios) {
    if (!u.contraseña) continue;
    if (u.contraseña.startsWith('$2')) continue; // ya hasheada
    const hashed = await bcrypt.hash(u.contraseña, 10);
    await ds.getRepository(Usuario).update({ id_usuario: u.id_usuario }, { contraseña: hashed });
    updatedU++;
  }
  console.log(`[seed] usuario: ${updatedU} contraseñas hasheadas.`);

  // --- 2. Hashear contraseñas en texto plano de PROFESOR ---
  const profesores = await ds
    .getRepository(Profesor)
    .createQueryBuilder('p')
    .addSelect('p.contraseña')
    .getMany();
  let updatedP = 0;
  for (const p of profesores) {
    if (!p.contraseña) continue;
    if (p.contraseña.startsWith('$2')) continue;
    const hashed = await bcrypt.hash(p.contraseña, 10);
    await ds.getRepository(Profesor).update({ id_profesor: p.id_profesor }, { contraseña: hashed });
    updatedP++;
  }
  console.log(`[seed] profesor: ${updatedP} contraseñas hasheadas.`);

  // --- 3. Crear admin por defecto si no existe ninguno ---
  const adminExistente = await ds.getRepository(Profesor).findOne({ where: { rol: 'admin' } });
  if (!adminExistente) {
    const hashed = await bcrypt.hash('admin1234', 10);
    await ds.getRepository(Profesor).save({
      nombre: 'Administrador',
      email: 'admin@arcan.local',
      contraseña: hashed,
      rol: 'admin',
      admin_sn: 1,
      disponibilidad: 'Lunes a Viernes',
    } as any);
    console.log('[seed] Admin por defecto creado:');
    console.log('       email:    admin@arcan.local');
    console.log('       password: admin1234');
    console.log('       (cámbiala desde Ajustes tras el primer login)');
  } else {
    console.log(`[seed] Ya existe un admin: ${adminExistente.email}`);
  }

  await ds.destroy();
  console.log('[seed] Listo.');
}

main().catch((err) => {
  console.error('[seed] Error:', err);
  process.exit(1);
});
