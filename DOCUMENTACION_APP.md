# Arcan Studios Reservations - Documentación de Continuidad (Handover)

## 1) Objetivo de este documento

Este documento está pensado para una persona nueva en el proyecto.  
Su objetivo es que pueda:

- Levantar el proyecto en local.
- Entender cómo fluye la información (UI -> API -> DB).
- Saber dónde tocar para añadir o corregir funcionalidades.
- Identificar deuda técnica y puntos frágiles.

---

## 2) Resumen ejecutivo

La aplicación gestiona reservas de formación para empresas y tiene 3 áreas funcionales:

- **Administrador**: visión global (dashboard, calendario, cursos, profes, clientes, reservas).
- **Profesor**: calendario, cursos y ajustes.
- **Cliente**: dashboard, catálogo, reservas y ajustes.

Stack técnico:

- **Frontend**: Next.js + React + TypeScript + Tailwind.
- **Backend**: NestJS + TypeORM.
- **BD**: MySQL (`BD_ARCAN`).

---

## 3) Estructura del repositorio

## 3.1 Raíz

- `frontend/` -> aplicación web.
- `backend/` -> API REST.
- `BD_ARCAN.sql` -> dump de estructura y datos de base de datos.
- `ER_ARCAN.*` -> diagrama entidad-relación (apoyo visual).

## 3.2 Frontend (Next.js)

Carpetas clave:

- `frontend/src/app` -> páginas por rutas.
- `frontend/src/components` -> componentes UI y de dominio.
- `frontend/src/services` -> consumo y normalización de datos de API.
- `frontend/src/lib/api.ts` -> cliente HTTP (`apiFetch`) y errores (`ApiError`).
- `frontend/src/app/api/backend/[...path]/route.ts` -> proxy al backend real.
- `frontend/src/resources` -> datos mock y tipos legacy (todavía usados en algunos flujos).

Rutas de interfaz por rol:

- Público: `/(public)` (pantalla de acceso)
- Admin: `/admin/*`
- Profesor: `/profesor/*`
- Cliente: `/cliente/*`

Layouts por rol:

- `frontend/src/app/admin/layout.tsx`
- `frontend/src/app/profesor/layout.tsx`
- `frontend/src/app/cliente/layout.tsx`

## 3.3 Backend (NestJS)

Carpetas clave:

- `backend/src/app.module.ts` -> composición de módulos + conexión TypeORM.
- `backend/src/modules/*` -> módulos de dominio.

Módulos actuales:

- `aula`
- `capacitacion`
- `curso`
- `empresa`
- `perfil`
- `profesor`
- `reserva`
- `sesion`
- `usuario`

Patrón por módulo:

- `*.entity.ts` (modelo DB)
- `*.controller.ts` (endpoints)
- `*.service.ts` (lógica/consultas)
- `dto/*` (entrada de datos)

---

## 4) Cómo arrancar el proyecto

## 4.1 Requisitos

- Node.js
- npm
- MySQL 8+ (o compatible)

## 4.2 Base de datos

1. Crear base `BD_ARCAN`.
2. Importar `BD_ARCAN.sql`.

## 4.3 Backend

```bash
cd backend
npm install
npm run start:dev
```

El backend arranca por defecto en `http://localhost:4000` (según configuración local).

## 4.4 Frontend

```bash
cd frontend
npm install
npm run dev
```

Crear `frontend/.env.local`:

```env
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Si backend usa prefijo (`/api` o `/api/v1`), incluirlo en `API_URL`.

---

## 5) Flujo técnico de datos (clave para continuar)

## 5.1 Flujo estándar

1. Componente/página llama a un servicio (`frontend/src/services/*`).
2. El servicio usa `apiFetch(endpoint)`.
3. `apiFetch` llama a `/api/backend/...` (proxy Next).
4. El proxy reenvía al backend real (`API_URL + endpoint`).
5. El backend (Nest) consulta MySQL vía TypeORM.
6. El dato vuelve y el servicio lo normaliza.
7. UI renderiza.

## 5.2 Dónde mirar cuando algo falla

- **Error en navegador** -> revisar `apiFetch` y servicio que lo usa.
- **Error en terminal Next** -> revisar proxy `[...path]/route.ts`.
- **500 en backend** -> revisar controller/service del módulo en Nest.
- **UI sin datos pero sin error** -> revisar normalización del servicio.

---

## 6) API real: contratos y decisiones actuales

## 6.1 Endpoints backend (reales)

Controladores en singular:

- `/aula`
- `/capacitacion`
- `/curso`
- `/empresa`
- `/perfil`
- `/profesor`
- `/reserva`
- `/sesion`
- `/usuario`

Cada recurso tiene CRUD + rutas relacionales (ver controllers).

## 6.2 Compatibilidad singular/plural en frontend

Los servicios del frontend manejan alias (ej. `/sesiones` -> `/sesion`) para tolerar diferencias.
Actualmente está en:

- `frontend/src/services/calendar.service.ts`
- `frontend/src/services/dashboard.service.ts`
- `frontend/src/services/profesor.service.ts`

## 6.3 Normalización de payload

Se aceptan respuestas:

- array directo `[]`
- `{ data: [] }`
- `{ items: [] }`

Esto permite convivir con backend real y respuestas heterogéneas.

---

## 7) Base de datos: modelo funcional

## 7.1 Tablas principales

- `aula`
- `capacitacion`
- `curso`
- `empresa`
- `perfil`
- `profesor`
- `usuario`
- `reserva`
- `sesion`

## 7.2 Tablas puente

- `capacitacion_curso`
- `capacitacion_profesor`
- `perfil_capacitacion`

## 7.3 Relaciones de negocio

- Empresa 1..N Usuario
- Usuario 1..N Reserva
- Curso 1..N Reserva
- Reserva 1..N Sesion
- Aula 1..N Sesion
- Profesor 1..N Sesion
- Capacitacion 1..N Sesion
- Capacitacion N..M Curso
- Capacitacion N..M Profesor
- Perfil N..M Capacitacion

---

## 8) Guía por área funcional (manual operativo)

## 8.1 Administrador

Menú principal:

- Dashboard
- Calendario
- Cursos
- Perfiles alumnos
- Reservas
- Profes
- Clientes
- Ajustes

Uso típico:

1. Revisar KPI y carga en Dashboard.
2. Planificar sesiones por aula en Calendario.
3. Gestionar maestros (profes, cursos, clientes, reservas).

## 8.2 Profesor

Menú:

- Calendario
- Cursos
- Ajustes

Notas:

- En calendario hay modo **personal** y modo **global** (switch).
- Cursos/ajustes dependen parcialmente de datos API y parcialmente de estado local mock.

## 8.3 Cliente

Menú:

- Dashboard
- Cursos
- Reservas
- Ajustes

Flujo importante:

- En Reservas se permite solicitud por rango de fechas y turno, con validación de disponibilidad.

---

## 9) Estado actual del proyecto (importante para quien continúe)

## 9.1 Qué está ya orientado a API real

- Proxy backend de Next (`/api/backend`).
- `apiFetch` con `ApiError`.
- Servicios de dashboard/calendario/profesor con fallback de endpoint.
- Parte de pantallas cliente y profesor ya conectadas a servicios.

## 9.2 Qué sigue siendo híbrido (API + mock)

- Persisten referencias a `frontend/src/resources/data.ts` y `calendarData.ts`.
- Algunas vistas usan fallback mock para no romper UI cuando la API no devuelve estructura esperada.

## 9.3 Riesgos conocidos

- Nombres de endpoint (singular/plural) no unificados entre entornos.
- Formatos de respuesta no totalmente consistentes.
- Login actual es de navegación de UI, no autenticación completa.

---

## 10) Cómo añadir una funcionalidad nueva (procedimiento recomendado)

1. **Definir endpoint backend** (controller/service/dto/entity si aplica).
2. **Probar endpoint** con datos reales (Postman/curl).
3. **Crear o ajustar servicio frontend** en `src/services`.
4. **Normalizar respuesta** (evitar mapear JSON crudo en componentes).
5. **Conectar pantalla** y manejar estados:
   - loading
   - empty
   - error
6. **Validar lints** y prueba manual end-to-end.

---

## 11) Checklist de onboarding técnico (30-60 min)

- [ ] Levantar MySQL y cargar `BD_ARCAN.sql`.
- [ ] Arrancar backend y comprobar `GET /sesion`.
- [ ] Configurar `frontend/.env.local`.
- [ ] Arrancar frontend y comprobar `/api/backend/sesion`.
- [ ] Navegar por `/admin/dashboard`, `/profesor/calendario`, `/cliente/reservas`.
- [ ] Revisar `src/services/*` para entender normalización.
- [ ] Revisar `backend/src/modules/*` para ubicar cada dominio.

---

## 12) Recomendaciones de continuidad (prioridad)

1. **Autenticación real** (JWT o sesión server-side).
2. **Contrato API unificado** (nombres y payload).
3. **Eliminar fallback mock progresivamente** por pantalla.
4. **Swagger/OpenAPI** en backend.
5. **Variables sensibles en entorno** (no hardcode).
6. **Tests e2e** para reservas/calendario.

---

## 13) Referencias internas rápidas

- Backend módulo raíz: `backend/src/app.module.ts`
- Proxy frontend-backend: `frontend/src/app/api/backend/[...path]/route.ts`
- Cliente HTTP: `frontend/src/lib/api.ts`
- Servicios principales:
  - `frontend/src/services/dashboard.service.ts`
  - `frontend/src/services/calendar.service.ts`
  - `frontend/src/services/client.service.ts`
  - `frontend/src/services/profesor.service.ts`
- SQL de referencia: `BD_ARCAN.sql`


