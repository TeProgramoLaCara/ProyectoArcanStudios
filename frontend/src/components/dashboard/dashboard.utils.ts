export function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const fullHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const r = Number.parseInt(fullHex.slice(0, 2), 16);
  const g = Number.parseInt(fullHex.slice(2, 4), 16);
  const b = Number.parseInt(fullHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null;
}

export function pickText(
  item: unknown,
  keys: string[],
  fallback = '—'
): string {
  if (!isRecord(item)) return fallback;

  for (const key of keys) {
    const value = item[key];

    if (typeof value === 'string' && value.trim() !== '') {
      return value;
    }

    if (typeof value === 'number') {
      return String(value);
    }

    if (isRecord(value)) {
      const nested =
        value.nombre ??
        value.name ??
        value.title ??
        value.titulo ??
        value.email ??
        value.id ??
        value.id_usuario ??
        value.id_empresa;

      if (nested !== undefined && nested !== null) {
        return String(nested);
      }
    }
  }

  return fallback;
}

export function pickId(item: unknown, fallback: string | number = 'unknown') {
  if (!isRecord(item)) return fallback;

  return (
    item.id ??
    item.id_reserva ??
    item.id_curso ??
    item.id_profesor ??
    item.id_empresa ??
    item.id_aula ??
    item.id_usuario ??
    item.id_capacitacion ??
    item.id_sesion ??
    item.id_perfil ??
    fallback
  );
}

export function getArrayLengthFromItem(item: unknown, keys: string[]) {
  if (!isRecord(item)) return 0;

  for (const key of keys) {
    const value = item[key];

    if (Array.isArray(value)) {
      return value.length;
    }
  }

  return 0;
}

export function normalizeStatusLabel(status: string) {
  const normalized = status.toLowerCase().trim();

  switch (normalized) {
    case 'pendiente':
      return 'Pendiente';
    case 'confirmada':
    case 'confirmado':
      return 'Confirmada';
    case 'en curso':
      return 'En curso';
    case 'completada':
    case 'completado':
      return 'Completada';
    case 'cancelada':
    case 'cancelado':
      return 'Cancelada';
    default:
      return status || 'Registrada';
  }
}

export function getStatusIcon(status: string) {
  switch (normalizeStatusLabel(status)) {
    case 'Pendiente':
      return '⏳';
    case 'Confirmada':
      return '✅';
    case 'En curso':
      return '▶️';
    case 'Completada':
      return '🏁';
    case 'Cancelada':
      return '✕';
    default:
      return '•';
  }
}

export function getStatusColor(status: string) {
  switch (normalizeStatusLabel(status)) {
    case 'Pendiente':
      return '#f59e0b';
    case 'Confirmada':
      return '#267F6B';
    case 'En curso':
      return '#2fa58a';
    case 'Completada':
      return '#8b5cf6';
    case 'Cancelada':
      return '#ef4444';
    default:
      return '#94a3b8';
  }
}