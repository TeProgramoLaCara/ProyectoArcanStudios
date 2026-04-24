'use client';

const CATEGORY_VARS: Record<string, { color: string; bg: string; border: string }> = {
  Blender: {
    color:  'var(--category-blender-color)',
    bg:     'var(--category-blender-bg)',
    border: 'var(--category-blender-border)',
  },
  Unity: {
    color:  'var(--category-unity-color)',
    bg:     'var(--category-unity-bg)',
    border: 'var(--category-unity-border)',
  },
};

const FALLBACK = {
  color:  'var(--text-secondary)',
  bg:     'var(--border-subtle)',
  border: 'var(--border)',
};

export default function CategoryBadge({ category }: { category: string }) {
  const s = CATEGORY_VARS[category] ?? FALLBACK;
  return (
    <span
      className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{ color: s.color, backgroundColor: s.bg, borderColor: s.border }}
    >
      {category}
    </span>
  );
}
