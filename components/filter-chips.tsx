type FilterChipsProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

export function FilterChips<T extends string>({ label, options, value, onChange }: FilterChipsProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap justify-center gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`rounded-full border border-paper px-3 py-2 transition-colors duration-200 ${
              active ? "bg-paper text-ink" : "text-paper hover:bg-paper/10"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
