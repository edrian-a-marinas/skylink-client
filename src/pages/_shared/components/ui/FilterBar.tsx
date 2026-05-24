import type { ReactNode } from "react";

type FilterBarProps = {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const FilterBar = ({ title, actions, children }: FilterBarProps) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {title || actions ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          ) : (
            <span />
          )}
          {actions}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-3">{children}</div>
    </section>
  );
};

export default FilterBar;
