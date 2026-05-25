import { cn } from "@/utils/cn";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

type KPICardProps = {
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const KPICard = ({
  label,
  value,
  change,
  trend,
  icon: Icon,
  iconBg,
  iconColor,
}: KPICardProps) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          <Icon className={cn("size-6", iconColor)} />
        </div>
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold",
            trend === "up"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600",
          )}
        >
          {trend === "up" ? (
            <ArrowUpRight size={14} strokeWidth={3} />
          ) : (
            <ArrowDownRight size={14} strokeWidth={3} />
          )}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <h3 className="mt-1 text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </div>
  );
};

export default KPICard;
