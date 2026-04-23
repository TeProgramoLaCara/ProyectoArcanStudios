'use client';

type Props = {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
};

export default function MonthNavigator({ currentDate, onPrev, onNext }: Props) {
  const raw = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const label = raw.charAt(0).toUpperCase() + raw.slice(1);

  const btnClass =
    'px-4 py-2 rounded-xl border border-(--border) bg-surface-elevated text-(--text-primary) transition hover:bg-(--border)';

  return (
    <div className="flex items-center justify-center gap-6">
      <button onClick={onPrev} className={btnClass} aria-label="Mes anterior">←</button>
      <span className="min-w-50 text-center text-lg font-semibold text-(--text-primary)">
        {label}
      </span>
      <button onClick={onNext} className={btnClass} aria-label="Mes siguiente">→</button>
    </div>
  );
}
