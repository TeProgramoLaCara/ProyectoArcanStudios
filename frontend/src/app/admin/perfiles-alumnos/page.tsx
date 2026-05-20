"use client";

import { useMemo, useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { cursos, perfilesAlumnos, type Curso, type PerfilAlumnos } from "@/resources/data";

type ManagedCourse = Curso & {
  custom?: boolean;
  customCapNames?: string[];
};

type ProfileForm = {
  title: string;
  area: string;
  description: string;
  recommendedCourseId: string;
  courseMode: "existing" | "custom";
  customCourseTitle: string;
  customCourseDescription: string;
  customCourseCategory: string;
  customCapacitacionesText: string;
  typicalStudents: number;
  tagsText: string;
};

const emptyForm: ProfileForm = {
  title: "",
  area: "",
  description: "",
  recommendedCourseId: cursos[0]?.id ?? "",
  courseMode: "existing",
  customCourseTitle: "",
  customCourseDescription: "",
  customCourseCategory: "General",
  customCapacitacionesText: "",
  typicalStudents: 12,
  tagsText: "",
};

function getCustomCapText(course?: ManagedCourse) {
  return course?.customCapNames?.join("\n") ?? "";
}

function profileToForm(profile: PerfilAlumnos, availableCourses: ManagedCourse[]): ProfileForm {
  const course = availableCourses.find((item) => item.id === profile.recommendedCourseId);
  const isCustom = Boolean(course?.custom);

  return {
    title: profile.title,
    area: profile.area,
    description: profile.description,
    recommendedCourseId: profile.recommendedCourseId,
    courseMode: isCustom ? "custom" : "existing",
    customCourseTitle: isCustom ? course?.title ?? "" : "",
    customCourseDescription: isCustom ? course?.description ?? "" : "",
    customCourseCategory: isCustom ? course?.category ?? "General" : "General",
    customCapacitacionesText: isCustom ? getCustomCapText(course) : "",
    typicalStudents: profile.typicalStudents,
    tagsText: profile.tags.join(", "),
  };
}

function formToProfile(form: ProfileForm, id = `pa-${Date.now()}`): PerfilAlumnos {
  return {
    id,
    title: form.title.trim(),
    area: form.area.trim(),
    description: form.description.trim(),
    recommendedCourseId: form.recommendedCourseId,
    typicalStudents: Math.max(1, Number(form.typicalStudents)),
    tags: form.tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}

function parseCustomCapacitaciones(text: string) {
  return text
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildCustomCourse(form: ProfileForm, id = `curso-perfil-${Date.now()}`): ManagedCourse {
  const capNames = parseCustomCapacitaciones(form.customCapacitacionesText);

  return {
    id,
    title: form.customCourseTitle.trim(),
    description: form.customCourseDescription.trim(),
    category: form.customCourseCategory.trim() || "General",
    capacitaciones: capNames.map((_, index) => `${id}-cap-${index}`),
    custom: true,
    customCapNames: capNames,
  };
}

export default function AdminPerfilesAlumnosPage() {
  const [profiles, setProfiles] = useState<PerfilAlumnos[]>(perfilesAlumnos);
  const [availableCourses, setAvailableCourses] = useState<ManagedCourse[]>(cursos);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyForm);

  const editingProfile = useMemo(
    () => profiles.find((profile) => profile.id === editingId) ?? null,
    [editingId, profiles],
  );

  const selectedCourse = availableCourses.find((course) => course.id === form.recommendedCourseId);
  const customCapCount = parseCustomCapacitaciones(form.customCapacitacionesText).length;

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submitProfile = () => {
    if (!form.title.trim() || !form.area.trim() || !form.description.trim()) {
      return;
    }

    let nextRecommendedCourseId = form.recommendedCourseId;

    if (form.courseMode === "custom") {
      if (!form.customCourseTitle.trim() || !form.customCourseDescription.trim() || customCapCount === 0) {
        return;
      }

      const currentCourse = editingProfile
        ? availableCourses.find((course) => course.id === editingProfile.recommendedCourseId)
        : null;
      const customId = currentCourse?.custom ? currentCourse.id : `curso-perfil-${Date.now()}`;
      const customCourse = buildCustomCourse(form, customId);

      setAvailableCourses((current) => [
        customCourse,
        ...current.filter((course) => course.id !== customCourse.id),
      ]);
      nextRecommendedCourseId = customCourse.id;
    }

    if (form.courseMode === "existing" && !nextRecommendedCourseId) {
      return;
    }

    const profileForm = { ...form, recommendedCourseId: nextRecommendedCourseId };

    if (editingProfile) {
      setProfiles((current) =>
        current.map((profile) =>
          profile.id === editingProfile.id ? formToProfile(profileForm, editingProfile.id) : profile,
        ),
      );
    } else {
      setProfiles((current) => [formToProfile(profileForm), ...current]);
    }

    resetForm();
  };

  return (
    <section className="min-h-full bg-[var(--bg)] p-6 text-[var(--text-primary)]">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6">
        <header className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm font-semibold text-[#2fa58a]">Gestión académica</p>
          <h1 className="mt-1 text-3xl font-bold">Perfiles de alumnos</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Crea perfiles tipo para que las empresas elijan un grupo de alumnos y el sistema proponga automáticamente el curso más adecuado.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{editingProfile ? "Editar perfil" : "Nuevo perfil"}</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Vincula un curso existente o crea uno especifico para este perfil.
                </p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#267F6B]/15 text-[#2fa58a]">
                <HiOutlineUserGroup className="h-5 w-5" />
              </span>
            </div>

            <div className="mt-5 grid gap-4">
              <Field label="Nombre del perfil">
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Ej: Alumnado de jardinería"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-input)] px-3 py-2.5 text-sm outline-none focus:border-[#267F6B]"
                />
              </Field>

              <Field label="Área">
                <input
                  value={form.area}
                  onChange={(event) => setForm((current) => ({ ...current, area: event.target.value }))}
                  placeholder="Ej: Oficios creativos"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-input)] px-3 py-2.5 text-sm outline-none focus:border-[#267F6B]"
                />
              </Field>

              <div className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-[var(--surface)] p-1">
                  <button
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, courseMode: "existing" }))}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      form.courseMode === "existing"
                        ? "bg-[#267F6B] text-white"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    Curso existente
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, courseMode: "custom" }))}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      form.courseMode === "custom"
                        ? "bg-sky-500 text-white"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    Personalizado
                  </button>
                </div>

                {form.courseMode === "existing" ? (
                  <Field label="Curso asociado">
                    <select
                      value={form.recommendedCourseId}
                      onChange={(event) => setForm((current) => ({ ...current, recommendedCourseId: event.target.value }))}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-input)] px-3 py-2.5 text-sm outline-none focus:border-[#267F6B]"
                    >
                      {availableCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}{course.custom ? " (personalizado)" : ""}
                        </option>
                      ))}
                    </select>
                  </Field>
                ) : (
                  <div className="grid gap-3">
                    <Field label="Nombre del curso personalizado">
                      <input
                        value={form.customCourseTitle}
                        onChange={(event) => setForm((current) => ({ ...current, customCourseTitle: event.target.value }))}
                        placeholder="Ej: Blender aplicado a jardineria"
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-input)] px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                      />
                    </Field>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Categoria">
                        <input
                          value={form.customCourseCategory}
                          onChange={(event) => setForm((current) => ({ ...current, customCourseCategory: event.target.value }))}
                          placeholder="Ej: Blender"
                          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-input)] px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                        />
                      </Field>
                      <Field label="Capacitaciones">
                        <div className="rounded-xl border border-sky-400/30 bg-sky-500/10 px-3 py-2.5 text-sm font-semibold text-sky-200">
                          {customCapCount} incluidas
                        </div>
                      </Field>
                    </div>

                    <Field label="Descripcion del curso">
                      <textarea
                        rows={3}
                        value={form.customCourseDescription}
                        onChange={(event) => setForm((current) => ({ ...current, customCourseDescription: event.target.value }))}
                        placeholder="Resume que aprendera este perfil de alumnos..."
                        className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-input)] px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                      />
                    </Field>

                    <Field label="Capacitaciones que se imparten">
                      <textarea
                        rows={4}
                        value={form.customCapacitacionesText}
                        onChange={(event) => setForm((current) => ({ ...current, customCapacitacionesText: event.target.value }))}
                        placeholder={"Una por linea. Ej:\nModelado de herramientas\nTexturizado de materiales\nExportacion para Unity"}
                        className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-input)] px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                      />
                    </Field>
                  </div>
                )}
              </div>

              <Field label="Alumnos habituales">
                <input
                  type="number"
                  min={1}
                  value={form.typicalStudents}
                  onChange={(event) => setForm((current) => ({ ...current, typicalStudents: Number(event.target.value) }))}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-input)] px-3 py-2.5 text-sm outline-none focus:border-[#267F6B]"
                />
              </Field>

              <Field label="Descripción">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Describe el tipo de alumnado y sus necesidades..."
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-input)] px-3 py-2.5 text-sm outline-none focus:border-[#267F6B]"
                />
              </Field>

              <Field label="Etiquetas">
                <input
                  value={form.tagsText}
                  onChange={(event) => setForm((current) => ({ ...current, tagsText: event.target.value }))}
                  placeholder="Ej: Entornos, Inicial, Práctico"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-input)] px-3 py-2.5 text-sm outline-none focus:border-[#267F6B]"
                />
              </Field>

              <div className="rounded-xl border border-[#267F6B]/30 bg-[#267F6B]/10 p-3 text-sm text-[var(--text-secondary)]">
                <p className="font-semibold text-[var(--text-primary)]">Curso que verá el cliente</p>
                <p className="mt-1">
                  {form.courseMode === "custom"
                    ? form.customCourseTitle || "Curso personalizado pendiente"
                    : selectedCourse?.title ?? "Selecciona un curso"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={submitProfile}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#267F6B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2fa58a]"
                >
                  <HiOutlineCheckCircle className="h-5 w-5" />
                  {editingProfile ? "Guardar cambios" : "Crear perfil"}
                </button>
                {editingProfile && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)]"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </aside>

          <main className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Perfiles configurados</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Estos perfiles aparecerán en el flujo de reserva del cliente.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#267F6B]/15 px-3 py-1 text-sm font-semibold text-[#2fa58a]">
                <HiOutlinePlus className="h-4 w-4" />
                {profiles.length}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 2xl:grid-cols-2">
              {profiles.map((profile) => {
                const course = availableCourses.find((item) => item.id === profile.recommendedCourseId);

                return (
                  <article
                    key={profile.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#2fa58a]">{profile.area}</p>
                        <h3 className="mt-1 text-lg font-bold">{profile.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{profile.description}</p>
                      </div>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-500/15 text-sky-300">
                        <HiOutlineAcademicCap className="h-5 w-5" />
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Curso automático</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="mt-1 text-sm font-semibold">{course?.title ?? "Curso no encontrado"}</p>
                        {course?.custom && (
                          <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] font-semibold text-sky-200">
                            Personalizado
                          </span>
                        )}
                      </div>
                      {course?.custom && course.customCapNames && (
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">
                          {course.customCapNames.length} capacitaciones especificas
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                        {profile.typicalStudents} alumnos
                      </span>
                      {profile.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(profile.id);
                          setForm(profileToForm(profile, availableCourses));
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                      >
                        <HiOutlinePencilSquare className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfiles((current) => current.filter((item) => item.id !== profile.id))}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-300/25 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">{label}</span>
      {children}
    </label>
  );
}
