import type { DashboardApiData } from '@/services/dashboard.service';
import {
  getArrayLengthFromItem,
  pickId,
  pickText,
} from './dashboard.utils';

export const METRIC_TONES = [
  '#267F6B',
  '#f59e0b',
  '#8b5cf6',
  '#3b82f6',
  '#ec4899',
  '#2fa58a',
];

export const EMPTY_DASHBOARD_DATA: DashboardApiData = {
  reservas: [],
  cursos: [],
  profesores: [],
  empresas: [],
  capacitaciones: [],
  aulas: [],
  sesiones: [],
  usuarios: [],
  perfiles: [],
};

export function buildDashboardViewModel(data: DashboardApiData) {
  const {
    reservas,
    cursos,
    profesores,
    empresas,
    capacitaciones,
    aulas,
    sesiones,
    usuarios,
    perfiles,
  } = data;

  const totalReservas = reservas.length;
  const totalCursos = cursos.length;
  const totalProfesores = profesores.length;
  const totalEmpresas = empresas.length;
  const totalCapacitaciones = capacitaciones.length;
  const totalAulas = aulas.length;
  const totalSesiones = sesiones.length;
  const totalUsuarios = usuarios.length;
  const totalPerfiles = perfiles.length;

  const pendientes = reservas.filter(
    (reserva) =>
      pickText(reserva, ['status', 'estado'], '').toLowerCase() === 'pendiente'
  ).length;

  const confirmadas = reservas.filter(
    (reserva) =>
      pickText(reserva, ['status', 'estado'], '').toLowerCase() ===
      'confirmada'
  ).length;

  const enCurso = reservas.filter(
    (reserva) =>
      pickText(reserva, ['status', 'estado'], '').toLowerCase() === 'en curso'
  ).length;

  const completadas = reservas.filter(
    (reserva) =>
      pickText(reserva, ['status', 'estado'], '').toLowerCase() ===
      'completada'
  ).length;

  const canceladas = reservas.filter(
    (reserva) =>
      pickText(reserva, ['status', 'estado'], '').toLowerCase() === 'cancelada'
  ).length;

  const reservasAbiertas =
    pendientes + confirmadas + enCurso > 0
      ? pendientes + confirmadas + enCurso
      : totalReservas;

  const tasaGestion =
    totalReservas > 0
      ? Math.round(
          ((confirmadas + enCurso + completadas) / totalReservas) * 100
        )
      : 0;

  const tasaCierre =
    totalReservas > 0 ? Math.round((completadas / totalReservas) * 100) : 0;

  const promedioUsuariosPorEmpresa =
    totalEmpresas > 0 ? (totalUsuarios / totalEmpresas).toFixed(1) : '0.0';

  const recentReservas = [...reservas].slice(-8).reverse();

  const courseDemand = cursos.slice(0, 8).map((curso, index) => ({
    id: pickId(curso, index),
    title: pickText(curso, ['title', 'titulo', 'nombre'], `Curso ${index + 1}`),
    category: pickText(curso, ['category', 'categoria', 'tipo'], 'Curso'),
    reservas: getArrayLengthFromItem(curso, ['reservas', 'sesiones']),
    modulos: getArrayLengthFromItem(curso, ['capacitaciones', 'modulos']),
  }));

  const companySummary = empresas.slice(0, 8).map((empresa, index) => ({
    id: pickId(empresa, index),
    name: pickText(empresa, ['name', 'nombre'], `Empresa ${index + 1}`),
    usuarios: getArrayLengthFromItem(empresa, ['usuarios']),
    reservas: getArrayLengthFromItem(empresa, ['reservas']),
    agenda: getArrayLengthFromItem(empresa, ['sesiones']),
  }));

  const professorLoad = profesores.slice(0, 8).map((profesor, index) => ({
    name: pickText(
      profesor,
      ['name', 'nombre', 'nombre_completo', 'email'],
      `Profesor ${index + 1}`
    ),
    bloques: getArrayLengthFromItem(profesor, ['sesiones', 'capacitaciones']),
  }));

  const turnoLoad = [
    {
      label: 'Mañana',
      value: sesiones.filter(
        (sesion) => pickText(sesion, ['turno'], '').toLowerCase() === 'manana'
      ).length,
      icon: '☀️',
      color: '#f59e0b',
    },
    {
      label: 'Tarde',
      value: sesiones.filter(
        (sesion) => pickText(sesion, ['turno'], '').toLowerCase() === 'tarde'
      ).length,
      icon: '🌙',
      color: '#267F6B',
    },
  ];

  const aulaLoad =
    aulas.length > 0
      ? aulas.slice(0, 3).map((aula, index) => ({
          label: pickText(aula, ['nombre', 'name'], `Aula ${index + 1}`),
          value: getArrayLengthFromItem(aula, ['sesiones']),
          color: ['#267F6B', '#2fa58a', '#8b5cf6'][index] ?? '#267F6B',
        }))
      : [
          { label: 'Aula 1', value: 0, color: '#267F6B' },
          { label: 'Aula 2', value: 0, color: '#2fa58a' },
          { label: 'Aula 3', value: 0, color: '#8b5cf6' },
        ];

  const maxAulaLoad = Math.max(...aulaLoad.map((item) => item.value), 1);

  const metrics = [
    {
      label: 'Total reservas',
      value: totalReservas,
      helper: 'Reservas registradas en la API',
      icon: '📋',
      tone: METRIC_TONES[0],
      accent: true,
    },
    {
      label: 'Sesiones',
      value: totalSesiones,
      helper: 'Sesiones programadas',
      icon: '📆',
      tone: METRIC_TONES[1],
    },
    {
      label: 'Cursos publicados',
      value: totalCursos,
      helper: `${totalCapacitaciones} capacitaciones asociadas`,
      icon: '🎓',
      tone: METRIC_TONES[2],
    },
    {
      label: 'Empresas',
      value: totalEmpresas,
      helper: 'Empresas registradas',
      icon: '🏢',
      tone: METRIC_TONES[3],
    },
    {
      label: 'Usuarios',
      value: totalUsuarios,
      helper: `${totalPerfiles} perfiles registrados`,
      icon: '👥',
      tone: METRIC_TONES[4],
    },
    {
      label: 'Profesores',
      value: totalProfesores,
      helper: 'Docentes registrados',
      icon: '🧑‍🏫',
      tone: METRIC_TONES[5],
    },
  ];

  return {
    totals: {
      totalReservas,
      totalCursos,
      totalProfesores,
      totalEmpresas,
      totalCapacitaciones,
      totalAulas,
      totalUsuarios,
      pendientes,
      confirmadas,
      enCurso,
      completadas,
      canceladas,
      reservasAbiertas,
      tasaGestion,
      tasaCierre,
      promedioUsuariosPorEmpresa,
    },
    metrics,
    recentReservas,
    courseDemand,
    companySummary,
    professorLoad,
    turnoLoad,
    aulaLoad,
    maxAulaLoad,
  };
}

export type DashboardViewModel = ReturnType<typeof buildDashboardViewModel>;