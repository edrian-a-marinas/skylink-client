type FiltersPanelProps = {
  maxPrice: number;
  minPrice: number;
  maxRange: number;
  directOnly: boolean;
  timeFilters: string[];
  onMaxPriceChange: (value: number) => void;
  onToggleDirectOnly: () => void;
  onToggleTime: (timeId: string) => void;
};

const TIME_OPTIONS = [
  { id: "morning", label: "Morning (6AM-12PM)" },
  { id: "afternoon", label: "Afternoon (12PM-6PM)" },
  { id: "evening", label: "Evening (6PM+)" },
];

function formatCurrency(value: number) {
  return `PHP ${value.toLocaleString("en-US")}`;
}

const FiltersPanel = ({
  maxPrice,
  minPrice,
  maxRange,
  directOnly,
  timeFilters,
  onMaxPriceChange,
  onToggleDirectOnly,
  onToggleTime,
}: FiltersPanelProps) => {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Filters</h2>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Max Price
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatCurrency(maxPrice)}
          </p>
          <input
            type="range"
            min={minPrice}
            max={maxRange}
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(Number(event.target.value))}
            className="mt-2 w-full accent-[#5D7FA7]"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>{formatCurrency(minPrice)}</span>
            <span>{formatCurrency(maxRange)}</span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Stops
          </p>
          <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={directOnly}
              onChange={onToggleDirectOnly}
              className="h-4 w-4 rounded border-slate-300 text-[#5D7FA7]"
            />
            Direct flights only
          </label>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Departure Time
          </p>
          <div className="mt-2 space-y-2">
            {TIME_OPTIONS.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={timeFilters.includes(option.id)}
                  onChange={() => onToggleTime(option.id)}
                  className="h-4 w-4 rounded border-slate-300 text-[#5D7FA7]"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FiltersPanel;
