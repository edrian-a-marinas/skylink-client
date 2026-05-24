export type FareRule = {
  label: string;
  value: string;
};

const FareRulesCard = ({ rules }: { rules: FareRule[] }) => {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Fare Rules</h3>
        <span className="text-xs text-slate-400">Updated</span>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {rules.map((rule) => (
          <div key={rule.label} className="flex gap-6 py-3 text-sm">
            <span className="w-28 text-slate-500">{rule.label}</span>
            <span className="text-slate-700">{rule.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FareRulesCard;
