import { type ReservationAssignment } from "@/resources/data";
import {
  buildDefaultAssignments,
  getProfessorCandidates,
} from "@/services/reservation-workflow.service";
import type { Reserva } from "@/resources/data";

type AssignmentDraft = Omit<ReservationAssignment, "id" | "professorName" | "professorColor">;

type AssignmentEditorProps = {
  reserva: Reserva;
  assignments: AssignmentDraft[];
  onChange: (assignments: AssignmentDraft[]) => void;
};

const aulas = ["aula1", "aula2", "aula3"] as const;
const turnos = [
  { value: "manana", label: "Mañana" },
  { value: "tarde", label: "Tarde" },
] as const;

export function createAssignmentDrafts(reserva: Reserva): AssignmentDraft[] {
  const source = (reserva.assignments?.length ? reserva.assignments : buildDefaultAssignments(reserva));

  return source.map((assignment) => ({
    capacitacionId: assignment.capacitacionId,
    capacitacionTitle: assignment.capacitacionTitle,
    professorId: assignment.professorId,
    start: assignment.start,
    end: assignment.end,
    turno: assignment.turno,
    aula: assignment.aula,
  }));
}

export function AssignmentEditor({ reserva, assignments, onChange }: AssignmentEditorProps) {
  function update(index: number, patch: Partial<AssignmentDraft>) {
    onChange(assignments.map((assignment, currentIndex) => (
      currentIndex === index ? { ...assignment, ...patch } : assignment
    )));
  }

  return (
    <div className="rounded-2xl border border-(--border) bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-(--text-primary)">Asignación por capacitación</h3>
          <p className="text-sm text-(--text-muted)">
            Si solo hay un profesor capacitado, se selecciona automáticamente.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange(createAssignmentDrafts(reserva))}
          className="rounded-xl border border-(--border) px-3 py-2 text-sm font-semibold text-(--text-secondary) transition hover:text-(--text-primary)"
        >
          Recalcular
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {assignments.map((assignment, index) => {
          const candidates = getProfessorCandidates(assignment.capacitacionId ?? assignment.capacitacionTitle);
          const fallbackOption = {
            id: assignment.professorId || "sin-asignar",
            name: assignment.professorId || "Sin asignar",
            color: "#9ca3af",
          };
          const professorOptions = candidates.length > 0 ? candidates : [fallbackOption];
          const onlyOne = candidates.length === 1;

          return (
            <div key={`${assignment.capacitacionTitle}-${index}`} className="rounded-xl border border-(--border-subtle) bg-surface-elevated p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-(--text-primary)">{assignment.capacitacionTitle}</p>
                  <p className="text-xs text-(--text-muted)">
                    {onlyOne ? "Profesor único disponible" : `${professorOptions.length} profesores disponibles`}
                  </p>
                </div>
                {onlyOne && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-200">
                    Autoasignado
                  </span>
                )}
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.8fr]">
                <select
                  value={assignment.professorId}
                  onChange={(event) => update(index, { professorId: event.target.value })}
                  className="rounded-xl border border-(--border) bg-surface-input px-3 py-2 text-sm outline-none focus:border-[#267F6B]"
                >
                  {professorOptions.map((professor) => (
                    <option key={professor.id} value={professor.id}>
                      {professor.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={assignment.start}
                  onChange={(event) => update(index, { start: event.target.value })}
                  className="rounded-xl border border-(--border) bg-surface-input px-3 py-2 text-sm outline-none focus:border-[#267F6B]"
                />
                <input
                  type="date"
                  value={assignment.end}
                  onChange={(event) => update(index, { end: event.target.value })}
                  className="rounded-xl border border-(--border) bg-surface-input px-3 py-2 text-sm outline-none focus:border-[#267F6B]"
                />
                <select
                  value={assignment.turno}
                  onChange={(event) => update(index, { turno: event.target.value as AssignmentDraft["turno"] })}
                  className="rounded-xl border border-(--border) bg-surface-input px-3 py-2 text-sm outline-none focus:border-[#267F6B]"
                >
                  {turnos.map((turno) => (
                    <option key={turno.value} value={turno.value}>{turno.label}</option>
                  ))}
                </select>
                <select
                  value={assignment.aula}
                  onChange={(event) => update(index, { aula: event.target.value as AssignmentDraft["aula"] })}
                  className="rounded-xl border border-(--border) bg-surface-input px-3 py-2 text-sm outline-none focus:border-[#267F6B]"
                >
                  {aulas.map((aula) => (
                    <option key={aula} value={aula}>{aula.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
