type DashboardStateProps = {
  type: 'loading' | 'error';
  message: string;
};

export default function DashboardState({ type, message }: DashboardStateProps) {
  const isError = type === 'error';

  return (
    <section className="bg-background p-6">
      <div
        className={`rounded-[26px] border p-6 ${
          isError
            ? 'border-red-500/20 bg-red-500/10 text-red-300'
            : 'border-(--border) bg-surface text-(--text-primary)'
        }`}
      >
        {message}
      </div>
    </section>
  );
}