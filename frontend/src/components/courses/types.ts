export type CourseId = string | number;

export type Capacitacion = {
  id: CourseId;
  title: string;
  description: string;
  category: string;
  raw?: unknown;
};

export type Curso = {
  id: CourseId;
  title: string;
  description: string;
  category: string;
  capacitaciones: CourseId[];
  raw?: unknown;
};