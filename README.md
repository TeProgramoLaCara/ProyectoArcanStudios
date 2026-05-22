"# ProyectoArcanStudios" 
(Se ve muy mal en preview, es mejor abrirlo en modo codigo o en un editor de texto/codigo)
MINI EXPLICACION:
El proyecto esta dividido en backend y frontend.
El front se esta trabajando con next.js, y el back con NestJS.
El front seria toda la parte visual(claramente) y la llamada a la api ; el back seria la creacion de la API, la logica para hacer en crud en la BBDD, 
la logica de las reservas(crud BD) y creo que ya.
--------------------------------------------------------------------------------------------------------------------------------------------------------------
COMO EMPEZAR:
-Asegurarse que se tiene node.js
    -hacer en cmd node -v
-Hacer el clone de este repo
-meterse en la carpeta repo/frontend y hacer npm install
-meterse en la carpeta repo/backend y hacer npm install
-Por si no tienen la BD y quieren trabajar en local, aqui esta el comando para instalarla en el wsl, 
    -sudo docker run --name LAMP --restart=always -p "80:80" -p "3306:3306" -v /home/usuario/app:/app mattrayner/lamp:latest-1804
-Hay que cambiar la contraseña en app.module.ts para acceder a las BBDD y eso
--------------------------------------------------------------------------------------------------------------------------------------------------------------
COMANDOS IMPORTANTES:
-npm install                             → En ambas carpetas, mas que todo para actualizar/instalar las dependencias, cuando alguien instale una más.
-npm run dev                             → Solo para frontend, pone en marcha el frontend(lo visual claro, y la llamada a la api).
-npm run start:dev                       → Solo para backend, cuando se esta desarrollando, pone en marcha el backend(la api).
-npm run lint                            → Solo para backend, ESLINT es como un debbuger; formatea, busca bugs etc, antes de un commit por ejm

-npm update                              → En ambas carpetas, para actualizar las dependencias, solo se usa cuando quieras la version mas nueva.
-npm run build                           → En ambas carpetas, para hacer la build(para subir a Ionos, casi siempre).
-npm run start                           → Solo para backend, despues de hacer la build usa lo que hay en .next. Pone en marcha el backend(la api).
-npm cache clean --force                 → En ambas carpetas, para limpiar la cache por si hay problemas no se :p.
--------------------------------------------------------------------------------------------------------------------------------------------------------------
ENDPOINTS DE LA API:
En https://reservas.arcanstudios.com/api/docs tambien se tienen todos los endpoints.
1. Aula
CRUD
GET /aula  Devuelve una lista con todas las aulas.
GET /aula/:id  Devuelve un aula específica.
POST /aula  Crea un aula nueva.
PUT /aula/:id  Actualiza un aula existente.
DELETE /aula/:id  Elimina un aula.

Relaciones
GET /aula/:id/sesiones  Devuelve todas las sesiones que se dictan en un aula.

2. Capacitacion
CRUD
GET /capacitacion  Devuelve una lista con todas las capacitaciones.
GET /capacitacion/:id  Devuelve una capacitación específica.
POST /capacitacion  Crea una nueva capacitación y devuelve el objeto creado.
PUT /capacitacion/:id  Actualiza una capacitación existente.
DELETE /capacitacion/:id  Elimina una capacitación.

Relaciones
GET /capacitacion/:id/perfiles  Devuelve los perfiles asociados a una capacitación.
GET /capacitacion/:id/sesiones  Devuelve las sesiones asignadas a una capacitación.
GET /capacitacion/:id/cursos  Devuelve los cursos pertenecientes a una capacitación.
GET /capacitacion/:id/profesores  Devuelve los profesores asignados a una capacitación.

Relaciones N:M (asociar / desasociar)
POST /capacitacion/:id/profesores/:profesorId  Asocia un profesor a una capacitación.
DELETE /capacitacion/:id/profesores/:profesorId  Elimina la asociación entre un profesor y una capacitación.
POST /capacitacion/:id/cursos/:cursoId  Asocia un curso a una capacitación.
DELETE /capacitacion/:id/cursos/:cursoId  Elimina la asociación entre un curso y una capacitación.

3. Curso
CRUD
GET /curso  Devuelve una lista con todos los cursos.
GET /curso/:id  Devuelve un curso específico.
POST /curso  Crea un nuevo curso.
PUT /curso/:id  Actualiza un curso existente.
DELETE /curso/:id  Elimina un curso.

Relaciones
GET /curso/:id/capacitaciones  Devuelve la capacitación a la que pertenece un curso.
GET /curso/:id/reservas  Devuelve todas las reservas asociadas a un curso.

4. Empresa
CRUD
GET /empresa  Devuelve una lista con todas las empresas.
GET /empresa/:id  Devuelve una empresa específica.
POST /empresa  Crea una nueva empresa.
PUT /empresa/:id  Actualiza una empresa existente.
DELETE /empresa/:id  Elimina una empresa.
RelacionesGET /empresa/:id/usuarios  Devuelve todos los usuarios pertenecientes a una empresa.

5. Perfil
CRUD
GET /perfil  Devuelve una lista con todos los perfiles registrados.
GET /perfil/:id  Devuelve un perfil específico.
POST /perfil  Crea un nuevo perfil.
PUT /perfil/:id  Actualiza un perfil existente.
DELETE /perfil/:id  Elimina un perfil.

Relaciones
GET /perfil/:id/capacitaciones  Devuelve todas las capacitaciones asociadas a un perfil.
POST /perfil/:id/capacitaciones/:capacitacionId  Asocia una capacitación a un perfil.
DELETE /perfil/:id/capacitaciones/:capacitacionId  Elimina la asociación entre un perfil y una capacitación.

6. Profesor
CRUD
GET /profesor  Devuelve una lista con todos los profesores.
GET /profesor/:id  Devuelve un profesor específico.
POST /profesor  Crea un nuevo profesor.
PUT /profesor/:id  Actualiza un profesor existente.
DELETE /profesor/:id  Elimina un profesor.

Relaciones
GET /profesor/:id/capacitaciones  Devuelve las capacitaciones impartidas por un profesor.
GET /profesor/:id/sesiones  Devuelve las sesiones asignadas a un profesor.

7. Reserva
CRUD
GET /reserva  Devuelve una lista con todas las reservas.
GET /reserva/:id  Devuelve una reserva específica.
POST /reserva  Crea una nueva reserva.
PUT /reserva/:id  Actualiza una reserva existente.
DELETE /reserva/:id  Elimina una reserva.

Relaciones
GET /reserva/:id/sesiones  Devuelve la sesión asociada a una reserva.

8. Sesion
CRUD
GET /sesion  Devuelve una lista con todas las sesiones.
GET /sesion/:id  Devuelve una sesión específica.
POST /sesion  Crea una nueva sesión.
PUT /sesion/:id  Actualiza una sesión existente.
DELETE /sesion/:id  Elimina una sesión.

Relaciones
GET /sesion/:id/cursos  Devuelve el curso al que pertenece la sesión.
GET /sesion/:id/profesores  Devuelve el profesor asignado a la sesión.
GET /sesion/:id/aulas  Devuelve el aula donde se dicta la sesión.
GET /sesion/:id/reservas  Devuelve todas las reservas asociadas a una sesión.

9. Usuario
CRUD
GET /usuario  Devuelve una lista con todos los usuarios.
GET /usuario/:id  Devuelve un usuario específico.
POST /usuario  Crea un nuevo usuario.
PUT /usuario/:id  Actualiza un usuario existente.
DELETE /usuario/:id  Elimina un usuario.

Relaciones
GET /usuario/:id/empresa  Devuelve la empresa a la que pertenece un usuario.
GET /usuario/:id/reservas  Devuelve todas las reservas realizadas por un usuario.
--------------------------------------------------------------------------------------------------------------------------------------------------------------
ORGANIZACION DE CARPETAS:
Como una mini explicacion de las carpetas pa que estemos organizados 
La explicacion esta, muchas cosas son necesarias pero no se tocan, las cosas importantes las pongo () antes
    
   /FRONTEND:                                              
    │
   ├── .next/                                                 → Carpeta generada automáticamente por Next.js (código compilado, NO se toca, NO se sube)
   ├── node_modules/                                          → Dependencias instaladas, NO se toca, NO se sube a GitHub
   ├── eslint.config.mjs                                      → Reglas de ESLint para mantener el código limpio
   ├── next-env.d.ts                                          → Archivo generado por Next.js para TypeScript, no se toca
   ├── next.config.ts                                         → Configuración avanzada de Next.js (normalmente no se modifica)
   ├── package-lock.json                                      → Archivo generado por npm, asegura versiones exactas de dependencias
   ├── tsconfig.json                                          → Configuración de TypeScript (paths, strict mode, etc.)
   │
   ├── package.json                                        () → Scripts, dependencias y metadatos del proyecto (archivo clave)
   ├── postcss.config.mjs                                  () → Configuración de PostCSS (necesario si usas Tailwind)
   │
   ├── public/                                             () → Para los archivos estáticos accesibles desde el navegador (imágenes, logos, íconos, fuentes)
   │
----------
   └── src/                                                () → CARPETA IMPORTANTE, es donde esta el proyecto simplemente
        ├── app/                                               → Aquí viven TODAS las páginas y rutas
        │   ├── layout.tsx                                     → Layout global (navbar, estilos, providers)
        │   ├── page.tsx                                       → Página principal "/"
        │   │
        │   ├── login/                                         → Ruta "/login"
        │   │   └── page.tsx                                   → Página de login
        │   │
        │   └── dashboard/                                     → Ruta "/dashboard"
        │       └── page.tsx                                   → Página del dashboard
        │
        ├── components/                                        → Componentes reutilizables
        │   ├── ui/                                            → Botones, tarjetas, inputs bonitos
        │   ├── forms/                                         → Inputs, selects, formularios
        │   └── comunes/                                       → Navbar, Footer, Sidebar, etc.
        │
        ├── hooks/                                             → Hooks personalizados
        │   └── useAuth.ts                                     → Manejo de autenticación
        │
        ├── lib/                                               → Funciones auxiliares
        │   ├── api/                                           → Config de fetch, axios, etc.
        │   └── utils/                                         → Helpers (formatos, validaciones)
        │
        ├── services/                                          → Llamadas al backend (NestJS)
        │   ├── usuarios.service.ts                            → Funciones para consumir /usuarios
        │   └── cursos.service.ts                              → Funciones para consumir /cursos
        │
        ├── styles/                                            → Estilos globales
        │   └── globals.css                                    → CSS global (si usas Tailwind, aquí se importa)
        │
        └── types/                                             → Tipos e interfaces TS
            ├── Usuario.ts                                     → Tipo Usuario (id, nombre, email…)
            └── Curso.ts                                       → Tipo Curso
--------------------------------------------------------------------------------------------------------------------------------------------------------------
/BACKEND:                                                  → PS EL BACKEND
   │
   ├── dist                                                   → DONDE SE CREA EL PROYECTO CUANDO LO COMPILAS
   ├── ...                                                    → Lo otro realmente no se toca, es como digamos la configuracion
   │
---------- 
   └── src/                                                () → CARPETA IMPORTANTE, es donde esta el proyecto simplemente    
       ├── main.ts                                             → Como se lanza el proyecto
       ├── app.module.ts                                       → Es como el cerebro donde se guarda
       │ 
       ├── config/
       │   └── database.config.ts                              → Para config de la BD (duhh)
       │
       ├── common/                                             → Cosas que se usan en todo lado
       │   ├── guards/                                         → Autorizacion y Seguridad
       │   ├── pipes/                                          → Validacion de datos y parsing
       │   ├── interceptors/                                   → Modifica respuestas
       │   └── filters/                                        → Manejo de errores
       │ 
       └── modules/                                            → ps los modulos
           ├── usuarios/                                       → Un ejemplo de una tabla
           │   ├── usuarios.module.ts                          → Es como la logica, el cerebro
           │   ├── usuarios.controller.ts                      → Se definen los endpoints
           │   ├── usuarios.service.ts                         → Consulta la BBDD
           │   ├── dto/                                        → Validacion de tipos para la API
           │   └── entities/                                   → Entidades de la BBDD
           │
           ├── cursos/                                       
           │   ├── cursos.module.ts
           │   └── ...
           └── capacitacion/
               └── ...

--------------------------------------------------------------------------------------------------------------------------------------------------------------
Lo que esta en la VPS

Servicios:
mariadb – MariaDB 10.11, mantiene la base BD_ARCAN con usuario arcan_user. Persistencia mediante volumen mariadb_data.
backend – API NestJS (Node / TypeScript). Depende de mariadb.
frontend – Cliente (probablemente Angular/React) que habla con el backend.
nginx – Proxy reverso que expone la aplicación al exterior.
adminer – UI de administración de la base de datos (puerto 8081).
Puertos expuestos:
80 / 443 → Nginx (HTTP/HTTPS).
8081 → Adminer.
Volúmenes: mariadb_data guarda los datos de la base de forma persistente entre reinicios.
Red interna: conecta todos los contenedores; solo Nginx y Adminer están accesibles desde fuera.
Recursos de la VPS (implícitos por Docker):

Configuración de Nginx:
Proxy a /api → backend.
Servir archivos estáticos del frontend.
Certificados TLS montados desde /etc/letsencrypt (HTTPS listo).
