"use client";

interface FilterBarProps {
  filters: string[];
  active: string;
  onChange: (filter: string) => void;
}

export default function FilterBar({
  filters,
  active,
  onChange,
}: FilterBarProps) {
  return (
    <div className="flex gap-2 mb-8 flex-wrap border-b border-black/5 dark:border-white/5 pb-4">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          aria-pressed={active === filter}
          className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider font-mono border rounded-lg transition-all hover:scale-105 active:scale-95 ${
            active === filter
              ? "bg-blue/20 text-blue border-blue/30 dark:border-blue/50"
              : "bg-card-bg/40 text-foreground/60 border-black/10 dark:border-white/10 hover:text-foreground hover:border-black/20 dark:hover:border-white/20"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
