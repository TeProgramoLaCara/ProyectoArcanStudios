const CATEGORY_STYLES: Record<string, string> = {
  Blender: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  Unity: "border-sky-500/30 bg-sky-500/10 text-sky-400",
};

export default function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        CATEGORY_STYLES[category] ?? "border-white bg-white/5 text-white"
      }`}
    >
      {category}
    </span>
  );
}