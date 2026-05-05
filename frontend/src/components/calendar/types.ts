export type CalendarTurno = "mañana" | "tarde";

export type CalendarAulaId = "aula1" | "aula2" | "aula3";

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  aula: CalendarAulaId;
  turno: CalendarTurno;
  color: string;
  professorId: string;
  professorName: string;
  professorColor?: string;
  companyId: string;
  companyName: string;
  capacitaciones: string[];
};

export type CalendarProfessorOption = {
  id: string;
  name: string;
  color: string;
};

export type CalendarCompanyOption = {
  id: string;
  name: string;
};