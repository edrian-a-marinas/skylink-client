import { useEffect } from "react";
import { X, Plane, User, CreditCard, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { getCancellationRisk } from "@/api/reports.api";
import StatusBadge from "@/pages/_shared/components/ui/StatusBadge";
import { cn } from "@/utils/cn";

interface Props {
  bookingId: string | null;
  onClose: () => void;
}

const AdminBookingDrawer = ({ bookingId, onClose }: Props) => {
  const isOpen = !!bookingId;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ["admin-booking-detail", bookingId, "admin"],
    queryFn: async () => {
      const res = await axiosClient.get(`/bookings/admin/${bookingId}`);
      return res.data;
    },
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: risk, isLoading: riskLoading } = useQuery({
    queryKey: ["cancellation-risk", bookingId],
    queryFn: () => getCancellationRisk(bookingId!),
    enabled: !!bookingId && !bookingLoading && booking?.status !== "cancelled",
    staleTime: 5 * 60 * 1000,
  });

  const riskColor =
    risk?.risk_level === "high"
      ? "bg-rose-100 text-rose-700 border-rose-200"
      : risk?.risk_level === "medium"
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : risk?.risk_level === "low"
          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
          : "bg-slate-100 text-slate-500 border-slate-200";

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              {booking?.pnr ?? "Booking Detail"}
            </h2>
            {booking && <StatusBadge label={booking.status} />}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {bookingLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full" />
            </div>
          ) : !booking ? (
            <p className="text-center text-slate-400 py-20">Booking not found.</p>
          ) : (
            <>
              {/* Flight Info */}
              <section className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Plane size={13} />
                  Flight
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900">
                    {(booking as any).flight?.origin_airport?.iata_code ?? (booking as any).flight?.origin ?? "—"}
                  </span>
                  <span className="text-slate-400 text-sm">→</span>
                  <span className="text-xl font-bold text-slate-900">
                    {(booking as any).flight?.destination_airport?.iata_code ?? (booking as any).flight?.destination ?? "—"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div>
                    <p className="font-semibold text-slate-700">Flight No</p>
                    <p>{(booking as any).flight?.flight_number ?? "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Departure</p>
                    <p>{(booking as any).flight?.departure_time?.split("T")[0] ?? "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Dep. Time</p>
                    <p>{(booking as any).flight?.departure_time?.slice(11, 16) ?? "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Arr. Time</p>
                    <p>{(booking as any).flight?.arrival_time?.slice(11, 16) ?? "—"}</p>
                  </div>
                </div>
              </section>

              {/* Passenger Info */}
              <section className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <User size={13} />
                  Passenger
                </div>
                {console.log("passengers:", (booking as any).passengers)}
                {(booking as any).passengers?.map((p: any, i: number) => (
                  <div key={i} className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>
                      <p className="font-semibold text-slate-700">Name</p>
                      <p>{p.first_name} {p.last_name}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">Nationality</p>
                      <p>{p.nationality ?? "—"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">Passport</p>
                      <p>{p.passport_number ?? "—"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">Seat</p>
                      <p>{(booking as any).seat_number ?? "—"} · {(booking as any).seat_class?.name ?? "—"}</p>
                    </div>
                  </div>
                ))}
              </section>

              {/* Payment */}
              <section className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <CreditCard size={13} />
                  Payment
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Total</span>
                  <span className="text-lg font-bold text-slate-900">
                    ₱{Number((booking as any).total_price ?? booking.totalPrice ?? 0).toLocaleString("en-US")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Payment Method</span>
                  <span className="font-medium text-slate-700">
                    {(booking as any).payment?.payment_method_type ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Booked At</span>
                  <span className="font-medium text-slate-700">
                    {(booking as any).booked_at?.split("T")[0] ?? booking.createdAt?.split("T")[0] ?? "—"}
                  </span>
                </div>
              </section>

              {/* ML Risk Card — only for non-cancelled bookings */}
              {(booking as any).status !== "cancelled" && (
              <section className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <AlertTriangle size={13} />
                  Cancellation Risk
                  <span className="ml-1 text-[10px] normal-case font-medium text-slate-400">(ML)</span>
                </div>
                {riskLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin size-5 border-2 border-[#496B92] border-t-transparent rounded-full" />
                  </div>
                ) : !risk || risk.risk_level === "unknown" ? (
                  <p className="text-xs text-slate-400">No risk data available.</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs font-bold uppercase px-3 py-1 rounded-full border",
                          riskColor
                        )}
                      >
                        {risk.risk_level} risk
                      </span>
                      {risk.risk_score !== null && (
                        <span className="text-sm font-bold text-slate-700">
                          {risk.risk_score}%
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>
                        <p className="font-semibold text-slate-700">Confidence</p>
                        <p>{risk.confidence ?? "—"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700">Lead Time</p>
                        <p>{risk.lead_time_days != null ? `${risk.lead_time_days} days` : "—"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-semibold text-slate-700">Route</p>
                        <p>{risk.route ?? "—"}</p>
                      </div>
                    </div>
                    {risk.message && (
                      <p className="text-[11px] text-slate-400 italic">{risk.message}</p>
                    )}
                  </div>
                )}
              </section>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminBookingDrawer;