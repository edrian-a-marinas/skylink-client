import { useEffect, useRef, useState } from "react";
import { colors, typography } from "@/constants/theme";
import { RxPeople } from "react-icons/rx";


export type CabinClass = "Economy" | "Business" | "First";

export type PassengerCounts = {
  adults: number;
  children: number;
  infants: number;
};

type PassengerSelectorProps = {
  defaultPassengers?: PassengerCounts;
  defaultCabinClass?: CabinClass;
  onChange?: (passengers: PassengerCounts, cabinClass: CabinClass) => void;
};

const CABIN_CLASSES: CabinClass[] = ["Economy", "Business", "First"];

function CounterRow({
  label,
  sublabel,
  count,
  min,
  onDecrement,
  onIncrement,
}: {
  label: string;
  sublabel: string;
  count: number;
  min: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  const canDecrement = count > min;
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col gap-0.5">
        <span className={`${typography.paragraph.sm.medium} ${colors.text.primary}`}>{label}</span>
        <span className={`${typography.paragraph.xs.normal} ${colors.text.secondary}`}>{sublabel}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={!canDecrement}
          className={`size-[30px] shrink-0 rounded-full border flex items-center justify-center transition-colors ${
            canDecrement
              ? "bg-bg-page border-primary-60 text-primary-60"
              : "bg-bg-input border-tertiary-30 text-tertiary-30"
          }`}
        >
          <span className="text-[18px] font-bold leading-none mb-px">−</span>
        </button>
        <span className={`w-5 text-center ${typography.label.sm.semiBold} ${colors.text.primary}`}>{count}</span>
        <button
          type="button"
          onClick={onIncrement}
          className="size-[30px] shrink-0 rounded-full border border-primary-60 bg-bg-page text-primary-60 flex items-center justify-center transition-colors hover:bg-primary-10"
        >
          <span className="text-[18px] font-bold leading-none mb-px">+</span>
        </button>
      </div>
    </div>
  );
}

function totalPassengers(counts: PassengerCounts) {
  return counts.adults + counts.children + counts.infants;
}

const PassengerSelector: React.FC<PassengerSelectorProps> = ({
  defaultPassengers = { adults: 1, children: 0, infants: 0 },
  defaultCabinClass = "Economy",
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<PassengerCounts>(defaultPassengers);
  const [cabinClass, setCabinClass] = useState<CabinClass>(defaultCabinClass);
  const [committed, setCommitted] = useState({ counts, cabinClass });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const adjust = (field: keyof PassengerCounts, delta: number, min: number) => {
    setCounts(prev => ({ ...prev, [field]: Math.max(min, prev[field] + delta) }));
  };

  const handleDone = () => {
    setCommitted({ counts, cabinClass });
    onChange?.(counts, cabinClass);
    setOpen(false);
  };

  const total = totalPassengers(committed.counts);
  const label = `${total} ${total === 1 ? "Passenger" : "Passengers"}, ${committed.cabinClass}`;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center justify-between gap-2 ${colors.surface.input} border border-tertiary-30 rounded-[10px] px-4 h-14 text-left`}
      >
        <div className="flex items-center gap-2">
          <RxPeople size={16} strokeWidth={0.5} className="shrink-0 text-primary-60" />
          <span className={`${typography.paragraph.md.normal} ${colors.text.primary}`}>{label}</span>
        </div>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${colors.text.tertiary} ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-bg-page border border-tertiary-30 rounded-[14px] shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)] p-4">
          <CounterRow label="Adults" sublabel="12+ years" count={counts.adults} min={1} onDecrement={() => adjust("adults", -1, 1)} onIncrement={() => adjust("adults", 1, 1)} />
          <CounterRow label="Children" sublabel="2–11 years" count={counts.children} min={0} onDecrement={() => adjust("children", -1, 0)} onIncrement={() => adjust("children", 1, 0)} />
          <CounterRow label="Infants" sublabel="Under 2 years" count={counts.infants} min={0} onDecrement={() => adjust("infants", -1, 0)} onIncrement={() => adjust("infants", 1, 0)} />
          <div className="border-t border-tertiary-30 my-3" />
          <p className={`${typography.label.xs.semiBold} ${colors.text.secondary} uppercase tracking-wide mb-3`}>Cabin Class</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {CABIN_CLASSES.map(cls => (
              <button
                key={cls}
                type="button"
                onClick={() => setCabinClass(cls)}
                className={`h-9 rounded-[10px] ${typography.label.sm.semiBold} transition-colors ${
                  cabinClass === cls
                    ? "bg-primary-60 text-text-on-primary"
                    : `${colors.surface.input} ${colors.text.tertiary} hover:bg-tertiary-20`
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleDone}
            className={`w-full h-9 rounded-[10px] ${colors.action.primary} ${colors.action.primaryHover} ${typography.label.sm.semiBold} transition-colors`}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default PassengerSelector;