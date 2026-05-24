type PriceSummaryCardProps = {
  cabin: string;
  baseFare: string;
  taxes: string;
  total: string;
  onBook: () => void;
};

const PriceSummaryCard = ({
  cabin,
  baseFare,
  taxes,
  total,
  onBook,
}: PriceSummaryCardProps) => {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Price Summary</h3>
      <p className="mt-1 text-xs text-slate-500">Per passenger | {cabin}</p>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Base Fare</span>
          <span>{baseFare}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Taxes & Fees</span>
          <span>{taxes}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-sm font-semibold text-slate-900">Total</span>
        <span className="text-lg font-semibold text-[#5D7FA7]">{total}</span>
      </div>

      <button
        type="button"
        onClick={onBook}
        className="mt-4 w-full rounded-lg bg-[#5D7FA7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4E6B8D]"
      >
        Book This Flight - {total}
      </button>
      <p className="mt-2 text-[11px] text-slate-400">
        No payment yet - review before paying
      </p>
    </aside>
  );
};

export default PriceSummaryCard;
