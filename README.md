# Arcan Studios — Reservations

Aplicación web para gestionar una academia de cursos:

- **Cliente / alumno**: crea y consulta sus reservas, ve el estado de cada una.
- **Profesor**: ve sus sesiones/clases asignadas, recibe notificaciones cuando una reserva pasa a confirmada.
- **Administrador**: gestiona empresas, usuarios, profesores, cursos, capacitaciones, y aprueba o cancela reservas.

Stack:

- **Backend**: NestJS 11 + TypeORM + MariaDB/MySQL + JWT.
- **Frontend**: Next.js 16 (App Router) + Tailwind 4 + FullCalendar.

---

## 1. Estructura

```
backend/    NestJS API (entidades, autenticación, notificaciones)
frontend/   Next.js (UI + proxy a la API)
BD_ARCAN.sql                                       esquema y datos iniciales
backend/migrations/001_auth_and_notifications.sql  migración para auth
backend/scripts/seed.ts                            rehasheo de contraseñas + creación de admin
```

---

## 2. Puesta en marcha rápida

### 2.1. Base de datos

1. Crea la base de datos `BD_ARCAN` ejecutando `BD_ARCAN.sql` en tu MariaDB/MySQL.
2. Aplica la migración de auth y notificaciones:

```bash
mysql -u <user> -p < backend/migrations/001_auth_and_notifications.sql
```

### 2.2. Backend

```bash
cd backend
cp .env.example .env       # rellena DB_*, JWT_SECRET, CORS_ORIGIN
npm install
npm run seed               # hashea contraseñas y crea el admin por defecto
npm run start:dev          # arranca la API en http://localhost:3001
```

**Admin por defecto** (creado por `npm run seed` si no existe ninguno):

```
email:    admin@arcan.local
password: admin1234
```

Cámbiala desde Ajustes en cuanto entres por primera vez.

### 2.3. Frontend

```bash
cd frontend
cp .env.example .env.local    # ajusta API_URL si tu backend no está en :3001
npm install
npm run dev                   # arranca el front en http://localhost:3000
```

Entra a [http://localhost:3000/login](http://localhost:3000/login) e identifícate con el admin.

---

## 3. Flujo end-to-end

1. **Admin** entra a `/admin/clientes` → crea una empresa → añade un usuario (con email y contraseña inicial).
2. **Cliente** entra a `/login` con esas credenciales y aterriza en `/cliente/dashboard`.
3. **Cliente** abre `/cliente/reservas`, pulsa "Nueva reserva", elige curso/fechas/turno, confirma.
4. **Admin** recibe una notificación in-app (campana arriba a la derecha) avisando de la nueva reserva. En `/admin/reservas` puede pulsar "Confirmada" o "Cancelada".
5. **Cliente** recibe a su vez una notificación con el cambio de estado.
6. Si el admin asigna sesiones a un profesor y luego confirma la reserva, el profesor recibe otra notificación.

---

## 4. Decisiones de diseño relevantes

### 4.1. Modelo de cuentas

- Las cuentas de **cliente/alumno** viven en la tabla `usuario` (rol = `cliente`).
- Las cuentas de **profesor** y **admin** viven en la tabla `profesor` (rol = `profesor` | `admin`, también respaldado por `admin_sn`).
- El login es **único** (`POST /auth/login`): el backend busca el email en ambas tablas y devuelve un JWT con `tipo` (`usuario`/`profesor`) y `rol`.
- El registro es **siempre por invitación del admin**: no hay endpoint público de signup.

### 4.2. Autenticación / autorización

- JWT firmado con `JWT_SECRET`, expira en `JWT_EXPIRES_IN` (por defecto 8h).
- El front guarda el token en una cookie `httpOnly` puesta por `/api/auth/login`; el proxy `/api/backend/[...path]` lo reenvía como `Authorization: Bearer …` al backend.
- Todas las rutas del backend exigen JWT salvo `POST /auth/login` (marcadas con `@Public()`).
- `@Roles('admin')` (etc.) en los controllers restringe operaciones de escritura.
- El middleware Next.js (`src/middleware.ts`) decodifica el JWT (sin verificar firma — el backend ya lo hará al llegar la petición) y redirige `/admin/*`, `/profesor/*`, `/cliente/*` según el rol.

### 4.3. Estados de reserva

```
pendiente  →  confirmada  →  completada
   │             │
   ↓             ↓
 cancelada    cancelada
```

- Cliente crea siempre en `pendiente`. Puede cancelar mientras siga pendiente.
- Admin puede pasar a `confirmada`, `completada` o `cancelada` siguiendo las transiciones válidas.

### 4.4. Notificaciones in-app

- Tabla `notificacion` (destinatario_tipo, destinatario_id, tipo, titulo, mensaje, leida, ref_*).
- Disparadas automáticamente desde `ReservaService`:
  - `reserva_creada` → a todos los admins, al crear.
  - `reserva_confirmada` / `_cancelada` / `_completada` → al cliente afectado.
  - `reserva_confirmada` → a los profesores asignados a sesiones de esa reserva.
- El frontend tiene un hook `useNotificaciones` con polling cada 30 s y un componente `NotificacionBell` con badge y bandeja en la barra superior.

---

## 5. Comandos útiles

```bash
# Backend
npm run start:dev    # NestJS con reload
npm run build        # compila a /dist
npm run start:prod   # arranca /dist (producción)
npm run seed         # hashea contraseñas y crea admin si falta
npm run lint         # ESLint

# Frontend
npm run dev          # Next.js con reload
npm run build        # build de producción
npm run start        # arranca el build
npm run lint         # ESLint
```

---

## 6. Variables de entorno

### Backend (`backend/.env`)

| Variable           | Por defecto              | Notas |
|--------------------|--------------------------|-------|
| `PORT`             | `3001`                   | Puerto HTTP del backend. |
| `DB_HOST`          | `localhost`              | |
| `DB_PORT`          | `3306`                   | |
| `DB_USER`          | —                        | Obligatorio. |
| `DB_PASSWORD`      | —                        | Obligatorio. |
| `DB_NAME`          | `BD_ARCAN`               | |
| `JWT_SECRET`       | —                        | Obligatorio; >=32 caracteres. |
| `JWT_EXPIRES_IN`   | `8h`                     | |
| `CORS_ORIGIN`      | `http://localhost:3000`  | Separar con coma para múltiples. |

### Frontend (`frontend/.env.local`)

| Variable    | Por defecto                | Notas |
|-------------|----------------------------|-------|
| `API_URL`   | `http://localhost:3001`    | URL del backend al que apunta el proxy. |

---

## 7. Limitaciones conocidas / próximas mejoras

- **Disponibilidad de aulas en el modal del cliente**: el calendario de huecos del cliente colorea los días en verde/amarillo/rojo usando aún datos mock (`resources/data.ts`). La reserva sí se persiste contra la API, pero la lógica de "este turno ya está lleno" todavía no consulta el backend. Mejora directa: cambiar `getAvailabilityByDay` en `frontend/src/app/cliente/reservas/page.tsx` para que llame a `/sesion` filtrando por fecha y turno.
- **Páginas del profesor** (`/profesor/calendario`, `/profesor/cursos`): la maquetación está completa pero algunas vistas siguen mezclando datos mock con datos reales. El profesor sí puede loguearse, recibir notificaciones y ver sus sesiones vía `/sesion`. Reemplazar el resto de mocks es trabajo mecánico siguiendo el patrón usado en `admin/reservas` y `cliente/dashboard`.
- **CRUD de cursos / profesores en admin**: los endpoints existen (`/curso`, `/capacitacion`, `/profesor`) y `course.service.ts` ya los consume. Algunos botones de la UI de `/admin/cursos` y `/admin/profes` aún quedan por enchufar a esas funciones.

---

## 8. Endpoints más importantes

| Método | Ruta                          | Quién                | Qué hace |
|--------|-------------------------------|----------------------|----------|
| POST   | `/auth/login`                 | Público              | Devuelve JWT + datos del usuario. |
| GET    | `/auth/me`                    | Cualquier autenticado | Datos del usuario actual. |
| PATCH  | `/auth/password`              | Cualquier autenticado | Cambio de contraseña. |
| GET    | `/reserva`                    | Filtrado por rol     | Admin ve todas, profesor las suyas, cliente las suyas. |
| POST   | `/reserva`                    | Cualquier autenticado | Crea reserva en `pendiente` y notifica a admins. |
| PATCH  | `/reserva/:id/estado`         | Admin (o cliente para cancelar) | Cambia estado y notifica. |
| GET    | `/notificacion`               | Cualquier autenticado | Notificaciones del usuario actual. |
| GET    | `/notificacion/unread-count`  | Cualquier autenticado | Contador de no leídas. |
| PATCH  | `/notificacion/:id/leer`      | Cualquier autenticado | Marca una como leída. |
| PATCH  | `/notificacion/leer-todas`    | Cualquier autenticado | Marca todas como leídas. |
| POST   | `/usuario`                    | Solo admin           | Crea un cliente (email + password + empresa). |
| POST   | `/profesor`                   | Solo admin           | Crea un profesor (email + password). |
| POST   | `/empresa`                    | Solo admin           | Crea una empresa. |
