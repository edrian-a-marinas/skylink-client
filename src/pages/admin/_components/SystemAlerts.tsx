import { cn } from "@/utils/cn";
import { AlertCircle, AlertTriangle, CreditCard, RefreshCcw } from "lucide-react";

const SystemAlerts = () => {
  const alerts = [
    {
      title: "Low Seats",
      description: "3 flights with fewer than 10 seats available",
      icon: AlertTriangle,
      color: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-100",
    },
    {
      title: "Failed Payments",
      description: "2 failed payment transactions pending review",
      icon: CreditCard,
      color: "bg-rose-50",
      iconColor: "text-rose-600",
      borderColor: "border-rose-100",
    },
    {
      title: "Pending Refund",
      description: "1 refund request pending approval",
      icon: RefreshCcw,
      color: "bg-sky-50",
      iconColor: "text-sky-600",
      borderColor: "border-sky-100",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 px-1">System Alerts</h3>
      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className={cn(
              "flex items-start gap-4 rounded-2xl border p-4 transition-all hover:scale-[1.02]",
              alert.color,
              alert.borderColor,
            )}
          >
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm",
                alert.iconColor,
              )}
            >
              <alert.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
              <p className="mt-0.5 text-xs font-medium text-slate-600">{alert.description}</p>
              <button className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-900 hover:underline">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAlerts;
