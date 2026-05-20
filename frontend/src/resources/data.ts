/**
 * Datos mock centralizados de Arcan Studios.
 *
 * Todos los arrays de datos y tipos de dominio que antes estaban dispersos
 * en los archivos de página y componente se consolidan aquí.
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type Capacitacion = {
  id: string;
  title: string;
  description: string;
  category: string;
};

export type Curso = {
  id: string;
  title: string;
  description: string;
  category: string;
  capacitaciones: string[];
};

export type PerfilAlumnos = {
  id: string;
  title: string;
  area: string;
  description: string;
  recommendedCourseId: string;
  typicalStudents: number;
  tags: string[];
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  aula: "aula1" | "aula2" | "aula3";
  turno: "manana" | "tarde";
  color: string;
  professorId: string;
  professorName: string;
  companyId: string;
  companyName: string;
  capacitaciones: string[];
};

export const PROFESSOR_COLORS: Record<string, string> = {
  p1: "#4fc3f7", // azul claro
  p2: "#ffb86b", // naranja suave
  p3: "#a78bfa", // violeta
  p4: "#34d399", // verde menta
};

export type ReservaStatus =
  | "Pendiente"
  | "Confirmada"
  | "En curso"
  | "Completada"
  | "Cancelada";

export type Reserva = {
  id: string;
  clientName: string;
  company: string;
  companyId?: string;
  curso: string;
  cursoId?: string;
  alumnos?: number;
  capacitaciones: string[];
  status: ReservaStatus;
  fecha: string;
  requestedStart?: string;
  requestedEnd?: string;
  turno?: "manana" | "tarde";
  aula?: "aula1" | "aula2" | "aula3";
  assignments?: ReservationAssignment[];
  communications?: ReservationCommunication[];
  reviewNotes?: string;
  confirmedAt?: string;
};

export type ProfesorCatalogo = {
  id: string;
  name: string;
  email: string;
  color: string;
  capacitaciones: string[];
};

export type ReservationAssignment = {
  id: string;
  capacitacionId?: string;
  capacitacionTitle: string;
  professorId: string;
  professorName: string;
  professorColor: string;
  start: string;
  end: string;
  turno: "manana" | "tarde";
  aula: "aula1" | "aula2" | "aula3";
};

export type ReservationCommunication = {
  id: string;
  createdAt: string;
  author: "admin" | "cliente" | "sistema";
  channel: "email" | "panel" | "telefono";
  message: string;
  visibleToClient: boolean;
};

// ─── Capacitaciones ───────────────────────────────────────────────────────────

export const capacitaciones: Capacitacion[] = [
  {
    id: "c1",
    title: "Modelado 3D en Blender",
    description:
      "Aprende a crear objetos tridimensionales desde cero usando las herramientas de modelado de Blender. Cubre desde primitivas hasta técnicas de sculpting básico.",
    category: "Blender",
  },
  {
    id: "c2",
    title: "Texturizado y UV Mapping",
    description:
      "Domina el proceso de UV unwrapping y aprende a aplicar materiales PBR realistas a tus modelos para uso en motores de videojuegos.",
    category: "Blender",
  },
  {
    id: "c3",
    title: "Introducción a Unity",
    description:
      "Configuración del entorno, navegación por el editor e importación de assets. Fundamentos del ciclo de desarrollo en Unity.",
    category: "Unity",
  },
  {
    id: "c4",
    title: "Scripting con C# en Unity",
    description:
      "Fundamentos de programación orientada a objetos aplicados al desarrollo de videojuegos. Movimiento, colisiones y lógica de juego.",
    category: "Unity",
  },
  {
    id: "c5",
    title: "Rigging y Animación",
    description:
      "Creación de armaduras y skinning de personajes en Blender. Exportación de animaciones optimizadas para Unity.",
    category: "Blender",
  },
  {
    id: "c6",
    title: "Diseño de Niveles",
    description:
      "Principios de level design aplicados en Unity. Uso de ProBuilder y técnicas de composición espacial para crear entornos jugables.",
    category: "Unity",
  },
];

// ─── Cursos ───────────────────────────────────────────────────────────────────

export const cursos: Curso[] = [
  {
    id: "k1",
    title: "Creación de Assets para Videojuegos",
    description:
      "Flujo de trabajo completo para crear y exportar assets 3D listos para producción, desde el concepto en Blender hasta su implementación en Unity.",
    capacitaciones: ["c1", "c2"],
    category: "Blender",
  },
  {
    id: "k2",
    title: "Desarrollo de Videojuegos con Unity",
    description:
      "Introducción práctica al desarrollo de videojuegos. Aprenderás a construir escenas interactivas y programar mecánicas básicas con C#.",
    capacitaciones: ["c3", "c4"],
    category: "Unity",
  },
  {
    id: "k3",
    title: "Personajes Animados para Unity",
    description:
      "Pipeline completo de personaje: modelado, rigging, animación en Blender e integración con el Animator Controller de Unity.",
    capacitaciones: ["c5", "c4"],
    category: "Blender",
  },
  {
    id: "k4",
    title: "Entornos y Niveles Interactivos",
    description:
      "Diseña entornos 3D completos con Blender y constrúyelos como niveles jugables en Unity utilizando técnicas profesionales de level design.",
    capacitaciones: ["c2", "c6"],
    category: "Unity",
  },
];

export const profesoresCatalogo: ProfesorCatalogo[] = [
  {
    id: "p1",
    name: "Carlos Martínez",
    email: "carlos@arcanstudios.com",
    color: "#4fc3f7",
    capacitaciones: ["c1", "c2"],
  },
  {
    id: "p2",
    name: "Laura Sánchez",
    email: "laura@arcanstudios.com",
    color: "#ffb86b",
    capacitaciones: ["c3", "c4", "c6"],
  },
  {
    id: "p3",
    name: "Diego Romero",
    email: "diego@arcanstudios.com",
    color: "#a78bfa",
    capacitaciones: ["c5", "c4"],
  },
  {
    id: "p4",
    name: "Inés Delgado",
    email: "ines@arcanstudios.com",
    color: "#34d399",
    capacitaciones: ["c2", "c6"],
  },
];

export const perfilesAlumnos: PerfilAlumnos[] = [
  {
    id: "pa1",
    title: "Alumnado de jardinería y entornos",
    area: "Oficios creativos",
    description:
      "Grupo orientado a diseño de espacios, composición visual y creación de entornos interactivos.",
    recommendedCourseId: "k4",
    typicalStudents: 14,
    tags: ["Entornos", "Nivel inicial", "Práctico"],
  },
  {
    id: "pa2",
    title: "Alumnado de arte digital",
    area: "Arte 3D",
    description:
      "Perfil pensado para estudiantes que necesitan crear objetos, materiales y recursos visuales para proyectos.",
    recommendedCourseId: "k1",
    typicalStudents: 12,
    tags: ["Blender", "Assets", "Producción"],
  },
  {
    id: "pa3",
    title: "Alumnado de programación básica",
    area: "Desarrollo",
    description:
      "Grupo que empieza con lógica de videojuegos y necesita una ruta guiada dentro del motor Unity.",
    recommendedCourseId: "k2",
    typicalStudents: 16,
    tags: ["Unity", "C#", "Primer prototipo"],
  },
  {
    id: "pa4",
    title: "Alumnado de animación",
    area: "Personajes",
    description:
      "Perfil para grupos centrados en personajes, rigging y preparación de animaciones para Unity.",
    recommendedCourseId: "k3",
    typicalStudents: 10,
    tags: ["Rigging", "Animación", "Personajes"],
  },
];

// ─── Eventos de calendario ────────────────────────────────────────────────────

const baseEvents: Omit<CalendarEvent, "color">[] = [
  {
    id: "1",
    title: "React Course - Nova",
    start: "2026-03-02",
    end: "2026-03-17",
    aula: "aula1",
    turno: "manana",
    professorId: "p1",
    professorName: "Carlos Martínez",
    companyId: "e1",
    companyName: "Nova",
    capacitaciones: ["Fundamentos de React", "Hooks y Context API"],
  },
  {
    id: "2",
    title: "UX Design - Acme",
    start: "2026-03-09",
    end: "2026-03-24",
    aula: "aula2",
    turno: "manana",
    professorId: "p2",
    professorName: "Laura Sánchez",
    companyId: "e2",
    companyName: "Acme",
    capacitaciones: ["Investigación de usuarios", "Prototipado en Figma"],
  },
  {
    id: "3",
    title: "Figma Course - Nova",
    start: "2026-03-12",
    end: "2026-03-27",
    aula: "aula3",
    turno: "manana",
    professorId: "p3",
    professorName: "Diego Romero",
    companyId: "e1",
    companyName: "Nova",
    capacitaciones: ["Componentes y Auto Layout", "Design Systems"],
  },
  {
    id: "4",
    title: "Marketing Basics - Acme",
    start: "2026-03-17",
    end: "2026-04-01",
    aula: "aula1",
    turno: "tarde",
    professorId: "p2",
    professorName: "Laura Sánchez",
    companyId: "e2",
    companyName: "Acme",
    capacitaciones: ["Estrategia de marca", "Marketing digital"],
  },
  {
    id: "5",
    title: "Advanced Excel - Nova",
    start: "2026-03-20",
    end: "2026-04-04",
    aula: "aula2",
    turno: "tarde",
    professorId: "p1",
    professorName: "Carlos Martínez",
    companyId: "e1",
    companyName: "Nova",
    capacitaciones: ["Tablas dinámicas", "Macros y VBA"],
  },
  {
    id: "6",
    title: "Brand Strategy - Nova",
    start: "2026-03-11",
    end: "2026-03-26",
    aula: "aula3",
    turno: "tarde",
    professorId: "p4",
    professorName: "Inés Delgado",
    companyId: "e1",
    companyName: "Nova",
    capacitaciones: ["Identidad corporativa", "Posicionamiento de marca"],
  },
  {
    id: "7",
    title: "Python Basics - Acme",
    start: "2026-03-02",
    end: "2026-03-17",
    aula: "aula1",
    turno: "tarde",
    professorId: "p2",
    professorName: "Laura Sánchez",
    companyId: "e2",
    companyName: "Acme",
    capacitaciones: ["Introducción a Python", "POO"],
  },
];

function addDaysToIsoDate(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMondayFromIsoDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  const day = date.getDay(); // 0 domingo, 1 lunes, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${dayOfMonth}`;
}

export const allEvents: CalendarEvent[] = baseEvents.map((event) => {
  const mondayStart = getMondayFromIsoDate(event.start);
  const weeksByCapacitaciones = Math.max(2, event.capacitaciones.length);
  const durationDays = weeksByCapacitaciones * 7;
  return {
    ...event,
    start: mondayStart,
    end: addDaysToIsoDate(mondayStart, durationDays),
    color: PROFESSOR_COLORS[event.professorId] ?? "#9ca3af",
  };
});

// ─── Clientes (empresas) ─────────────────────────────────────────────────────

export type Usuario = {
  id: string;
  username: string;
};

export type Empresa = {
  id: string;
  name: string;
  phone: string;
  usuarios: Usuario[];
};

export const empresas: Empresa[] = [
  {
    id: "e1",
    name: "Nova",
    phone: "+34 912 345 678",
    usuarios: [
      { id: "u1", username: "alejandro_vega" },
      { id: "u2", username: "carlos_ruiz" },
      { id: "u3", username: "pablo_guerrero" },
    ],
  },
  {
    id: "e2",
    name: "Acme",
    phone: "+34 913 456 789",
    usuarios: [
      { id: "u4", username: "maria_torres" },
      { id: "u5", username: "javier_ibañez" },
      { id: "u6", username: "elena_castillo" },
      { id: "u7", username: "roberto_silva" },
      { id: "u8", username: "ana_morales" },
    ],
  },
  {
    id: "e3",
    name: "Pixel Corp",
    phone: "+34 914 567 890",
    usuarios: [
      { id: "u9", username: "laura_mendez" },
      { id: "u10", username: "sofia_navarro" },
      { id: "u11", username: "david_herrero" },
      { id: "u12", username: "irene_castro" },
    ],
  },
  {
    id: "e4",
    name: "GameForge",
    phone: "+34 915 678 901",
    usuarios: [
      { id: "u13", username: "marcos_diaz" },
      { id: "u14", username: "lucia_fernandez" },
    ],
  },
];

// ─── Reservas ─────────────────────────────────────────────────────────────────

export const allReservas: Reserva[] = [
  {
    id: "r1",
    clientName: "Alejandro Vega",
    company: "Nova",
    curso: "Creación de Assets para Videojuegos",
    capacitaciones: ["Modelado 3D en Blender", "Texturizado y UV Mapping"],
    status: "Confirmada",
    fecha: "02 abr 2026",
  },
  {
    id: "r2",
    clientName: "María Torres",
    company: "Acme",
    curso: "Desarrollo de Videojuegos con Unity",
    capacitaciones: ["Introducción a Unity", "Scripting con C# en Unity"],
    status: "Pendiente",
    fecha: "03 abr 2026",
  },
  {
    id: "r3",
    clientName: "Carlos Ruiz",
    company: "Nova",
    curso: "Personajes Animados para Unity",
    capacitaciones: ["Rigging y Animación", "Scripting con C# en Unity"],
    status: "En curso",
    fecha: "28 mar 2026",
  },
  {
    id: "r4",
    clientName: "Laura Méndez",
    company: "Pixel Corp",
    curso: "Entornos y Niveles Interactivos",
    capacitaciones: ["Texturizado y UV Mapping", "Diseño de Niveles"],
    status: "Completada",
    fecha: "15 mar 2026",
  },
  {
    id: "r5",
    clientName: "Javier Ibáñez",
    company: "Acme",
    curso: "Creación de Assets para Videojuegos",
    capacitaciones: ["Modelado 3D en Blender", "Texturizado y UV Mapping"],
    status: "Cancelada",
    fecha: "10 mar 2026",
  },
  {
    id: "r6",
    clientName: "Sofía Navarro",
    company: "Pixel Corp",
    curso: "Desarrollo de Videojuegos con Unity",
    capacitaciones: ["Introducción a Unity", "Scripting con C# en Unity"],
    status: "Confirmada",
    fecha: "05 abr 2026",
  },
  {
    id: "r7",
    clientName: "Pablo Guerrero",
    company: "Nova",
    curso: "Entornos y Niveles Interactivos",
    capacitaciones: ["Texturizado y UV Mapping", "Diseño de Niveles"],
    status: "Pendiente",
    fecha: "07 abr 2026",
  },
  {
    id: "r8",
    clientName: "Elena Castillo",
    company: "Acme",
    curso: "Personajes Animados para Unity",
    capacitaciones: ["Rigging y Animación", "Scripting con C# en Unity"],
    status: "En curso",
    fecha: "01 abr 2026",
  },
];
