import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/utils/cn";

type ToastProps = {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  type?: "success" | "error" | "info";
};

const Toast = ({ message, isOpen, onClose, type = "success" }: ToastProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 transition-all duration-300 transform",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
    >
      <div className={cn(
        "flex size-10 items-center justify-center rounded-xl",
        type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      )}>
        {type === "success" ? <CheckCircle2 size={24} /> : <X size={24} />}
      </div>
      <div className="pr-4 text-left">
        <p className="text-sm font-bold text-slate-900">{message}</p>
        <p className="text-xs font-medium text-slate-500">Action completed successfully.</p>
      </div>
      <button 
        onClick={onClose}
        className="text-slate-300 hover:text-slate-500 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
