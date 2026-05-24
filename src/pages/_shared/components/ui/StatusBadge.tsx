type StatusTone = "neutral" | "success" | "warning" | "danger" | "info";

const TONE_CLASS: Record<StatusTone, string> = {
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
  success: "border-emerald-200 bg-emerald-100 text-emerald-700",
  warning: "border-amber-200 bg-amber-100 text-amber-700",
  danger: "border-rose-200 bg-rose-100 text-rose-700",
  info: "border-sky-200 bg-sky-100 text-sky-700",
};

function statusToTone(status: string): StatusTone {
  const normalized = status.trim().toLowerCase();

  if (
    ["confirmed", "captured", "on_time", "landed", "active"].includes(
      normalized,
    )
  ) {
    return "success";
  }
  if (
    ["pending", "payment_pending", "otp_required", "boarding"].includes(
      normalized,
    )
  ) {
    return "warning";
  }
  if (["cancelled", "failed", "declined", "suspended"].includes(normalized)) {
    return "danger";
  }
  if (["rescheduled", "refunded", "delayed"].includes(normalized)) {
    return "info";
  }

  return "neutral";
}

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
};

const StatusBadge = ({ label, tone }: StatusBadgeProps) => {
  const resolvedTone = tone ?? statusToTone(label);

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${TONE_CLASS[resolvedTone]}`}
    >
      {label.replace(/_/g, " ")}
    </span>
  );
};

export default StatusBadge;
