"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import CourseCard from "@/components/courses/CourseCard";
import CapacitacionCard from "@/components/courses/CapacitacionCard";
import type { Capacitacion, CourseId, Curso } from "@/components/courses/types";
import {
  createCapacitacion,
  createCurso,
  deleteCapacitacion,
  deleteCurso,
  getCoursesApiData,
  updateCapacitacion,
  updateCurso,
} from "@/services/course.service";
import { mapCoursesApiData } from "@/components/courses/course.mapper";

const inputClass =
  "w-full rounded-xl border border-(--border) bg-surface-input px-4 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30";

const selectClass =
  "w-full rounded-xl border border-(--border) bg-surface-input px-4 py-2.5 text-sm text-(--text-primary) outline-none transition focus:border-[#267F6B]/60";

const labelClass =
  "text-xs font-medium uppercase tracking-wider text-(--text-muted)";

type CursoFormState = {
  title: string;
  description: string;
  category: string;
  capacitaciones: CourseId[];
};

type CapacitacionFormState = {
  title: string;
  description: string;
  category: string;
};

const EMPTY_CURSO_FORM: CursoFormState = {
  title: "",
  description: "",
  category: "",
  capacitaciones: [],
};

const EMPTY_CAP_FORM: CapacitacionFormState = {
  title: "",
  description: "",
  category: "",
};

function buildCursoPayload(form: CursoFormState) {
  return {
    nombre: form.title,
    descripcion: form.description,
    categoria: form.category,
  };
}

function buildCapacitacionPayload(form: CapacitacionFormState) {
  return {
    nombre: form.title,
    descripcion: form.description,
    categoria: form.category,
  };
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-(--overlay-bg)"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-(--border) bg-surface shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
        <div className="h-0.75 w-full bg-linear-to-r from-[#267F6B]/0 via-[#267F6B] to-[#267F6B]/0" />

        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h3 className="text-base font-semibold text-(--text-primary)">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-(--border) bg-surface-elevated text-xs text-(--text-muted) transition hover:text-(--text-primary)"
          >
            ✕
          </button>
        </div>

        <div className="h-px bg-(--border-subtle)" />

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}

function CursoModal({
  mode,
  initialData,
  capacitaciones,
  saving,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  initialData?: Curso | null;
  capacitaciones: Capacitacion[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (form: CursoFormState) => void;
}) {
  const [form, setForm] = useState<CursoFormState>(() => {
    if (!initialData) return EMPTY_CURSO_FORM;

    return {
      title: initialData.title,
      description: initialData.description,
      category: initialData.category,
      capacitaciones: initialData.capacitaciones,
    };
  });

  function toggleCapacitacion(id: CourseId) {
    setForm((prev) => {
      const exists = prev.capacitaciones.some((capId) => String(capId) === String(id));

      return {
        ...prev,
        capacitaciones: exists
          ? prev.capacitaciones.filter((capId) => String(capId) !== String(id))
          : [...prev.capacitaciones, id],
      };
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <Modal
      title={mode === "create" ? "Nuevo curso" : "Editar curso"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Título</label>
          <input
            required
            className={inputClass}
            placeholder="Ej: Creación de Assets para Videojuegos"
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Descripción</label>
          <textarea
            required
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Describe el objetivo y contenido del curso..."
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Categoría</label>
          <select
            required
            className={selectClass}
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, category: event.target.value }))
            }
          >
            <option value="">Selecciona una categoría</option>
            <option value="Blender">Blender</option>
            <option value="Unity">Unity</option>
            <option value="General">General</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Capacitaciones incluidas</label>

          <div className="max-h-48 space-y-2 overflow-y-auto pr-1 hide-scrollbar">
            {capacitaciones.length === 0 ? (
              <div className="rounded-xl border border-(--border) bg-surface-elevated p-3 text-sm text-(--text-muted)">
                No hay capacitaciones disponibles.
              </div>
            ) : (
              capacitaciones.map((cap) => {
                const selected = form.capacitaciones.some(
                  (id) => String(id) === String(cap.id)
                );

                return (
                  <button
                    key={cap.id}
                    type="button"
                    onClick={() => toggleCapacitacion(cap.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                      selected
                        ? "border-[#267F6B]/50 bg-[#267F6B]/15 text-[#2fa58a]"
                        : "border-(--border) bg-surface-elevated text-(--text-secondary) hover:text-(--text-primary)"
                    }`}
                  >
                    <span>{cap.title}</span>
                    <span>{selected ? "✓" : "+"}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-1 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-(--border) px-4 py-2 text-sm text-(--text-secondary) transition hover:text-(--text-primary) disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#267F6B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a] disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : mode === "create"
                ? "Crear curso"
                : "Guardar cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CapacitacionModal({
  mode,
  initialData,
  saving,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  initialData?: Capacitacion | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (form: CapacitacionFormState) => void;
}) {
  const [form, setForm] = useState<CapacitacionFormState>(() => {
    if (!initialData) return EMPTY_CAP_FORM;

    return {
      title: initialData.title,
      description: initialData.description,
      category: initialData.category,
    };
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <Modal
      title={mode === "create" ? "Nueva capacitación" : "Editar capacitación"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Título</label>
          <input
            required
            className={inputClass}
            placeholder="Ej: Modelado 3D en Blender"
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Descripción</label>
          <textarea
            required
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Describe el contenido de la capacitación..."
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Categoría</label>
          <select
            required
            className={selectClass}
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, category: event.target.value }))
            }
          >
            <option value="">Selecciona una categoría</option>
            <option value="Blender">Blender</option>
            <option value="Unity">Unity</option>
            <option value="General">General</option>
          </select>
        </div>

        <div className="mt-1 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-(--border) px-4 py-2 text-sm text-(--text-secondary) transition hover:text-(--text-primary) disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#267F6B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a] disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : mode === "create"
                ? "Crear capacitación"
                : "Guardar cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function SectionHeader({
  title,
  subtitle,
  count,
  onAdd,
  addLabel,
}: {
  title: string;
  subtitle: string;
  count: number;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-(--text-primary)">{title}</h2>
        <p className="mt-1 text-sm text-(--text-secondary)">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full border border-(--border) bg-surface-elevated px-3 py-1 text-xs font-medium text-(--text-secondary)">
          {count} items
        </span>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl border border-[#267F6B]/50 bg-[#267F6B]/10 px-4 py-2 text-sm font-semibold text-[#267F6B] transition hover:bg-[#267F6B]/20 hover:border-[#267F6B]/70"
        >
          <span className="text-base leading-none">+</span>
          {addLabel}
        </button>
      </div>
    </div>
  );
}

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCursoModal, setShowCursoModal] = useState(false);
  const [showCapModal, setShowCapModal] = useState(false);

  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [editingCapacitacion, setEditingCapacitacion] =
    useState<Capacitacion | null>(null);

  async function loadData() {
    setLoading(true);

    try {
      const data = await getCoursesApiData();
      const mapped = mapCoursesApiData(data);

      setCursos(mapped.cursos);
      setCapacitaciones(mapped.capacitaciones);
      setError(null);
    } catch (error) {
      console.error("Error cargando cursos y capacitaciones:", error);
      setError("No se pudieron cargar los cursos y capacitaciones.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateCurso(form: CursoFormState) {
    setSaving(true);

    try {
      await createCurso(buildCursoPayload(form));
      setShowCursoModal(false);
      await loadData();
    } catch (error) {
      console.error("Error creando curso:", error);
      alert("No se pudo crear el curso. Revisa que el backend acepte los campos nombre, descripcion, categoria y capacitaciones.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateCurso(form: CursoFormState) {
    if (!editingCurso) return;

    setSaving(true);

    try {
      await updateCurso(editingCurso.id, buildCursoPayload(form));
      setEditingCurso(null);
      await loadData();
    } catch (error) {
      console.error("Error actualizando curso:", error);
      alert("No se pudo actualizar el curso.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCurso(curso: Curso) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar el curso "${curso.title}"?`
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      await deleteCurso(curso.id);
      await loadData();
    } catch (error) {
      console.error("Error eliminando curso:", error);
      alert("No se pudo eliminar el curso. Puede estar relacionado con capacitaciones, reservas o sesiones.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateCapacitacion(form: CapacitacionFormState) {
    setSaving(true);

    try {
      await createCapacitacion(buildCapacitacionPayload(form));
      setShowCapModal(false);
      await loadData();
    } catch (error) {
      console.error("Error creando capacitación:", error);
      alert("No se pudo crear la capacitación. Revisa que el backend acepte los campos nombre, descripcion y categoria.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateCapacitacion(form: CapacitacionFormState) {
    if (!editingCapacitacion) return;

    setSaving(true);

    try {
      await updateCapacitacion(
        editingCapacitacion.id,
        buildCapacitacionPayload(form)
      );
      setEditingCapacitacion(null);
      await loadData();
    } catch (error) {
      console.error("Error actualizando capacitación:", error);
      alert("No se pudo actualizar la capacitación.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCapacitacion(cap: Capacitacion) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar la capacitación "${cap.title}"?`
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      await deleteCapacitacion(cap.id);
      await loadData();
    } catch (error) {
      console.error("Error eliminando capacitación:", error);
      alert("No se pudo eliminar la capacitación. Puede estar relacionada con cursos, perfiles o sesiones.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="bg-background p-6">
        <div className="rounded-[26px] border border-(--border) bg-surface p-6 text-(--text-primary)">
          Cargando cursos y capacitaciones...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background p-6">
        <div className="rounded-[26px] border border-red-500/20 bg-red-500/10 p-6 text-red-300">
          {error}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-background p-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-10">
          <div className="relative overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-linear-to-l from-[#267F6B]/10 to-transparent" />

            <h1 className="text-3xl font-bold text-(--text-primary)">
              Cursos y Capacitaciones
            </h1>

            <p className="mt-1 text-sm text-(--text-secondary)">
              Catálogo completo de formaciones disponibles. Cada curso puede
              incluir capacitaciones especializadas.
            </p>

            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-400/70" />
                <span className="text-xs text-(--text-muted)">Blender</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-400/70" />
                <span className="text-xs text-(--text-muted)">Unity</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-400/70" />
                <span className="text-xs text-(--text-muted)">General</span>
              </div>
            </div>

            {saving && (
              <p className="mt-4 text-xs font-medium text-[#2fa58a]">
                Sincronizando cambios con la API...
              </p>
            )}
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-0">
            <div className="flex flex-1 flex-col gap-5 lg:pr-8">
              <SectionHeader
                title="Cursos"
                subtitle="Programas completos formados por capacitaciones."
                count={cursos.length}
                onAdd={() => setShowCursoModal(true)}
                addLabel="Nuevo curso"
              />

              <div className="flex flex-col gap-4">
                {cursos.length === 0 ? (
                  <div className="rounded-[24px] border border-(--border) bg-surface p-6 text-sm text-(--text-secondary)">
                    No hay cursos registrados todavía.
                  </div>
                ) : (
                  cursos.map((curso) => (
                    <CourseCard
                      key={curso.id}
                      course={curso}
                      capacitaciones={capacitaciones}
                      onEdit={() => setEditingCurso(curso)}
                      onRemove={() => handleDeleteCurso(curso)}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="hidden w-px self-stretch bg-(--border-subtle) lg:block" />

            <div className="flex flex-1 flex-col gap-5 lg:pl-8">
              <SectionHeader
                title="Capacitaciones"
                subtitle="Módulos individuales que componen los cursos."
                count={capacitaciones.length}
                onAdd={() => setShowCapModal(true)}
                addLabel="Nueva capacitación"
              />

              <div className="flex flex-col gap-4">
                {capacitaciones.length === 0 ? (
                  <div className="rounded-[24px] border border-(--border) bg-surface p-6 text-sm text-(--text-secondary)">
                    No hay capacitaciones registradas todavía.
                  </div>
                ) : (
                  capacitaciones.map((cap) => (
                    <CapacitacionCard
                      key={cap.id}
                      cap={cap}
                      onEdit={() => setEditingCapacitacion(cap)}
                      onRemove={() => handleDeleteCapacitacion(cap)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {showCursoModal && (
        <CursoModal
          mode="create"
          saving={saving}
          capacitaciones={capacitaciones}
          onClose={() => setShowCursoModal(false)}
          onSubmit={handleCreateCurso}
        />
      )}

      {editingCurso && (
        <CursoModal
          mode="edit"
          initialData={editingCurso}
          saving={saving}
          capacitaciones={capacitaciones}
          onClose={() => setEditingCurso(null)}
          onSubmit={handleUpdateCurso}
        />
      )}

      {showCapModal && (
        <CapacitacionModal
          mode="create"
          saving={saving}
          onClose={() => setShowCapModal(false)}
          onSubmit={handleCreateCapacitacion}
        />
      )}

      {editingCapacitacion && (
        <CapacitacionModal
          mode="edit"
          initialData={editingCapacitacion}
          saving={saving}
          onClose={() => setEditingCapacitacion(null)}
          onSubmit={handleUpdateCapacitacion}
        />
      )}
    </>
  );
}