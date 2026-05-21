'use client';

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function SettingsSection({ title, description, children }: Props) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-(--border) bg-surface shadow-sm">
      <div className="px-6 py-5">
        <h2 className="text-base font-semibold text-(--text-primary)">{title}</h2>
        <p className="mt-1 text-sm text-(--text-secondary)">{description}</p>
      </div>
      <div className="h-px bg-(--border-subtle)" />
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
