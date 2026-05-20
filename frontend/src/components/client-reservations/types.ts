export type Turno = "manana" | "tarde";
export type RequestType = "perfil" | "curso" | "dos_capacitaciones";
export type DatePickMode = "start" | "end";

export type DayAvailability = {
  key: string;
  date: Date;
  status: "none" | "partial" | "full";
  availableTurnos: Turno[];
};

export type RangeAvailability = {
  status: "none" | "partial" | "full";
  availableTurnos: Turno[];
  blockedDays: Date[];
};

export const AULA_CAPACITY_PER_TURNO = 3;
export const CURRENT_CLIENT = "Alejandro Vega";
export const CURRENT_COMPANY = "Nova";
