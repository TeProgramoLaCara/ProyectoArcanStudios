"use client";

type CalendarFiltersProps = {
  professor: string;
  company: string;
  onProfessorChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onReset: () => void;
};

export default function CalendarFilters({
  professor,
  company,
  onProfessorChange,
  onCompanyChange,
  onReset,
}: CalendarFiltersProps) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#0d0d0d] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calendar</h1>
          <p className="mt-1 text-sm text-white/55">
            View classroom activity and filter courses by professor or company.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="professor-filter"
              className="text-sm font-medium text-white/75"
            >
              Professor
            </label>
            <select
              id="professor-filter"
              value={professor}
              onChange={(e) => onProfessorChange(e.target.value)}
              className="min-w-[220px] rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
            >
              <option value="all">All professors</option>
              <option value="p1">Professor 1</option>
              <option value="p2">Professor 2</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="company-filter"
              className="text-sm font-medium text-white/75"
            >
              Company
            </label>
            <select
              id="company-filter"
              value={company}
              onChange={(e) => onCompanyChange(e.target.value)}
              className="min-w-[220px] rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
            >
              <option value="all">All companies</option>
              <option value="e1">Nova</option>
              <option value="e2">Acme</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Reset filters
          </button>
        </div>
      </div>
    </div>
  );
}