"use client";

import { useEffect, useMemo, useState } from "react";
import MetricCard from "@/components/reservations/MetriCard";
import ClientesFilters from "@/components/clientes/ClientesFilters";
import {
  createEmpresa,
  createUsuario,
  deleteEmpresa,
  deleteUsuario,
  listEmpresas,
  listUsuarios,
  updateEmpresa,
  type ApiEmpresa,
  type ApiUsuario,
} from "@/services/clientes.service";

interface EmpresaConUsuarios extends ApiEmpresa {
  usuarios: ApiUsuario[];
}

type EmpresaModalState =
  | { mode: "create-empresa" }
  | { mode: "edit-empresa"; empresa: EmpresaConUsuarios }
  | { mode: "create-usuario"; empresaId: number }
  | null;

export default function ClientesPage() {
  const [empresas, setEmpresas] = useState<ApiEmpresa[]>([]);
  const [usuarios, setUsuarios] = useState<ApiUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [modal, setModal] = useState<EmpresaModalState>(null);
  const [working, setWorking] = useState(false);

  async function refresh() {
    setError(null);
    try {
      const [e, u] = await Promise.all([listEmpresas(), listUsuarios()]);
      setEmpresas(e);
      setUsuarios(u);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando clientes");
    }
  }

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, []);

  const grouped: EmpresaConUsuarios[] = useMemo(() => {
    return empresas.map((e) => ({
      ...e,
      usuarios: usuarios.filter((u) => u.empresa?.id_empresa === e.id_empresa),
    }));
  }, [empresas, usuarios]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return grouped;
    return grouped.filter((e) => e.nombre.toLowerCase().includes(q));
  }, [grouped, search]);

  const totalEmpresas = grouped.length;
  const totalUsuarios = usuarios.length;
  const conAlumnos = grouped.filter((e) => e.usuarios.length > 0).length;
  const sinAlumnos = grouped.filter((e) => e.usuarios.length === 0).length;

  async function handleDeleteEmpresa(id: number) {
    if (!confirm("¿Eliminar esta empresa? Esto no eliminará sus usuarios.")) return;
    setWorking(true);
    try {
      await deleteEmpresa(id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setWorking(false);
    }
  }

  async function handleDeleteUsuario(id: number) {
    if (!confirm("¿Eliminar este usuario?")) return;
    setWorking(true);
    try {
      await deleteUsuario(id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setWorking(false);
    }
  }

  return (
    <section className="bg-background">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8">
        <div className="relative overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-linear-to-l from-[#267F6B]/10 to-transparent" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-(--text-primary)">
                Clientes
              </h1>
              <p className="mt-1 text-sm text-(--text-secondary)">
                Gestión de empresas cliente y sus usuarios.
              </p>
            </div>
            <button
              onClick={() => setModal({ mode: "create-empresa" })}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-[#267F6B]/50 bg-[#267F6B]/10 px-4 py-2 text-sm font-semibold text-[#267F6B] transition hover:border-[#267F6B]/70 hover:bg-[#267F6B]/20"
            >
              <span className="text-base leading-none">+</span>
              Nueva empresa
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard label="Empresas" value={totalEmpresas} icon="🏢" accent />
          <MetricCard label="Usuarios" value={totalUsuarios} icon="👥" />
          <MetricCard label="Con alumnos" value={conAlumnos} icon="✅" />
          <MetricCard label="Sin alumnos" value={sinAlumnos} icon="📭" />
        </div>

        <div className="flex flex-col gap-5 rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-(--text-primary)">
                Lista de empresas
              </h2>
              <p className="mt-0.5 text-sm text-(--text-muted)">
                {filtered.length} empresa{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <ClientesFilters
              search={search}
              onSearchChange={setSearch}
              onReset={() => setSearch("")}
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {loading ? (
            <p className="py-12 text-center text-sm text-(--text-muted)">
              Cargando…
            </p>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-(--text-muted)">
              No hay empresas que mostrar.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((e) => {
                const expanded = expandedId === e.id_empresa;
                return (
                  <div
                    key={e.id_empresa}
                    className={`rounded-[18px] border bg-surface transition-colors ${
                      expanded
                        ? "border-[#267F6B]/40"
                        : "border-(--border) hover:border-[#267F6B]/25"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(expanded ? null : e.id_empresa)
                      }
                      className="flex w-full items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="text-base font-semibold text-(--text-primary)">
                          {e.nombre}
                        </span>
                        <span className="text-xs text-(--text-muted)">
                          {e.usuarios.length} usuario
                          {e.usuarios.length !== 1 ? "s" : ""}
                          {e.e_mail ? ` · ${e.e_mail}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setModal({ mode: "edit-empresa", empresa: e });
                          }}
                          className="rounded-md border border-(--border) bg-surface-elevated px-2 py-1 text-xs text-(--text-secondary) transition hover:text-(--text-primary)"
                        >
                          Editar
                        </span>
                        <span
                          onClick={(ev) => {
                            ev.stopPropagation();
                            void handleDeleteEmpresa(e.id_empresa);
                          }}
                          className="rounded-md border border-red-400/40 px-2 py-1 text-xs text-red-600 transition hover:bg-red-500/10"
                        >
                          Borrar
                        </span>
                      </div>
                    </button>

                    {expanded && (
                      <div className="border-t border-(--border) px-5 py-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-(--text-primary)">
                            Usuarios de {e.nombre}
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              setModal({
                                mode: "create-usuario",
                                empresaId: e.id_empresa,
                              })
                            }
                            className="rounded-md border border-[#267F6B]/50 bg-[#267F6B]/10 px-3 py-1.5 text-xs font-semibold text-[#267F6B]"
                          >
                            + Añadir usuario
                          </button>
                        </div>
                        {e.usuarios.length === 0 ? (
                          <p className="text-xs text-(--text-muted)">
                            Esta empresa aún no tiene usuarios.
                          </p>
                        ) : (
                          <ul className="flex flex-col gap-2">
                            {e.usuarios.map((u) => (
                              <li
                                key={u.id_usuario}
                                className="flex items-center justify-between rounded-lg border border-(--border-subtle) bg-surface-elevated px-3 py-2"
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-(--text-primary)">
                                    {u.nombre}
                                  </span>
                                  <span className="text-xs text-(--text-muted)">
                                    {u.email}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  disabled={working}
                                  onClick={() =>
                                    void handleDeleteUsuario(u.id_usuario)
                                  }
                                  className="rounded-md border border-red-400/40 px-2 py-1 text-xs text-red-600 transition hover:bg-red-500/10 disabled:opacity-40"
                                >
                                  Borrar
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ClienteModal
          state={modal}
          onClose={() => setModal(null)}
          onSaved={async () => {
            setModal(null);
            await refresh();
          }}
        />
      )}
    </section>
  );
}

// ─── Modal embebido ──────────────────────────────────────────────────────────

interface ModalProps {
  state: Exclude<EmpresaModalState, null>;
  onClose: () => void;
  onSaved: () => void;
}

function ClienteModal({ state, onClose, onSaved }: ModalProps) {
  const [nombre, setNombre] = useState(
    state.mode === "edit-empresa" ? state.empresa.nombre : "",
  );
  const [email, setEmail] = useState(
    state.mode === "edit-empresa" ? state.empresa.e_mail ?? "" : "",
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      if (state.mode === "create-empresa") {
        await createEmpresa({ nombre, e_mail: email || undefined });
      } else if (state.mode === "edit-empresa") {
        await updateEmpresa(state.empresa.id_empresa, {
          nombre,
          e_mail: email || undefined,
        });
      } else {
        await createUsuario({
          nombre,
          email,
          password,
          empresa_id: state.empresaId,
        });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSubmitting(false);
    }
  }

  const isUserMode = state.mode === "create-usuario";
  const title =
    state.mode === "create-empresa"
      ? "Nueva empresa"
      : state.mode === "edit-empresa"
        ? "Editar empresa"
        : "Nuevo usuario";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-(--border) bg-surface p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-(--text-primary)">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-(--border) px-2 py-1 text-xs text-(--text-secondary)"
          >
            Cerrar
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs uppercase tracking-wider text-(--text-muted)">
              Nombre
            </span>
            <input
              type="text"
              required
              value={nombre}
              onChange={(ev) => setNombre(ev.target.value)}
              className="rounded-lg border border-(--border) bg-surface-elevated px-3 py-2 text-(--text-primary) outline-none focus:border-[#267F6B]/50"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs uppercase tracking-wider text-(--text-muted)">
              Email
            </span>
            <input
              type="email"
              required={isUserMode}
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="rounded-lg border border-(--border) bg-surface-elevated px-3 py-2 text-(--text-primary) outline-none focus:border-[#267F6B]/50"
            />
          </label>
          {isUserMode && (
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-xs uppercase tracking-wider text-(--text-muted)">
                Contraseña inicial
              </span>
              <input
                type="text"
                required
                minLength={6}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="rounded-lg border border-(--border) bg-surface-elevated px-3 py-2 text-(--text-primary) outline-none focus:border-[#267F6B]/50"
              />
              <span className="text-[11px] text-(--text-muted)">
                El usuario podrá cambiarla desde Ajustes tras el primer login.
              </span>
            </label>
          )}
        </div>

        {error && (
          <p className="mt-3 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-(--border) px-4 py-2 text-sm text-(--text-secondary)"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-[#267F6B] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
