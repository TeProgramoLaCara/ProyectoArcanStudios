"# ProyectoArcanStudios" 

ORGANIZACION DE CARPETAS:
Como una mini explicacion de las carpetas pa que estemos organizados :p
La explicacion esta, muchas cosas son necesarias pero no se tocan, las cosas importantes las pongo () antes
    
    /FRONTEND:                                              () → PUES EL FRONTEND
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
    

-----------------------------------------------------------------------------------------------------------------------------------------------------
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
