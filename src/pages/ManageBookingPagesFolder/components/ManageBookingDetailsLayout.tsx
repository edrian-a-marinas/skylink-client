import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Armchair,
  Utensils,
  Download,
  RotateCw,
  Plane,
  Info,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

import {
  formatPeso,
  getStatusBadgeClass,
  getStatusLabel,
  type ManageBooking,
} from "@/pages/ManageBookingPagesFolder/manageBookingData";

type ManageBookingDetailsLayoutProps = {
  booking: ManageBooking;
  actionsDisabled?: boolean;
};

const ManageBookingDetailsLayout = ({
  booking,
  actionsDisabled = false,
}: ManageBookingDetailsLayoutProps) => {
  const cancelHref = ROUTES.MANAGE_BOOKING_CANCEL.replace(":id", booking.id);

  const badgeClass = getStatusBadgeClass(booking.status);
  const statusLabel = getStatusLabel(booking.status);
  const isUpcoming = booking.status === "upcoming";

  const actionBaseClass =
    "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-bold transition";

  const actionDisabledClass = actionsDisabled
    ? "pointer-events-none opacity-60"
    : "";
  const modifyDisabledClass =
    actionsDisabled || !isUpcoming ? "pointer-events-none opacity-60" : "";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_320px]">
      {/* LEFT CONTENT */}
      <div className="w-full space-y-4">
        {/* FLIGHT CARD */}
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* TOP */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${badgeClass}`}
              >
                {statusLabel}
              </span>

              <span className="text-xs font-bold text-slate-400">
                {booking.flightCode}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Booking Reference:{" "}
              <span className="font-bold text-[#5D7FA7]">{booking.pnr}</span>
            </p>
          </div>

          {/* SEPARATOR */}
          <div className="mt-4 border-t border-slate-100 pt-5">
            {/* FLIGHT ROUTE */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* FROM */}
              <div>
                <p className="text-3xl font-bold text-slate-800">
                  {booking.fromCode}
                </p>

                <p className="text-sm font-bold text-[#5D7FA7]">
                  {booking.departTime}
                </p>

                <p className="text-xs text-slate-400">{booking.fromCity}</p>
              </div>

              {/* CENTER */}
              <div className="flex flex-col items-center text-center text-xs text-slate-400">
                <p className="font-semibold">{booking.duration}</p>

                <div className="mt-2 flex items-center gap-2">
                  <Plane className="h-4 w-4 text-[#5D7FA7]" />
                </div>
              </div>

              {/* TO */}
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-800">
                  {booking.toCode}
                </p>

                <p className="text-sm font-bold text-[#5D7FA7]">
                  {booking.arriveTime}
                </p>

                <p className="text-xs text-slate-400">{booking.toCity}</p>
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 text-xs text-slate-500 sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />

              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Date
                </p>

                <p className="font-bold text-slate-700">{booking.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />

              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Passengers
                </p>

                <p className="font-bold text-slate-700">{booking.passengers}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Armchair className="h-4 w-4 text-slate-400" />

              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Seat
                </p>

                <p className="font-bold text-slate-700">{booking.seat}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-slate-400" />

              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Meal
                </p>

                <p className="font-bold text-slate-700">{booking.meal}</p>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500">Payment Summary</p>

          <div className="mt-3 flex items-center justify-between pt-1 text-xs text-slate-500">
            <span>Total paid</span>

            <span className="text-sm font-bold text-[#5D7FA7]">
              {formatPeso(booking.total)}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Booked on {booking.bookingDate}
          </p>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <aside className="space-y-4">
        {/* ACTIONS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-800">Manage Booking</p>

          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              className={`${actionBaseClass} border-2 border-[#5D7FA7] bg-[#5D7FA7] text-white hover:bg-[#4E6B8D] ${actionDisabledClass}`}
            >
              <Download className="h-4 w-4" />
              Download E-ticket
            </button>

            <button
              type="button"
              className={`${actionBaseClass} border-2 border-[#AFC2DD] bg-white text-[#5D7FA7] hover:border-[#8EA7CB] ${modifyDisabledClass}`}
            >
              <RotateCw className="h-4 w-4" />
              Reschedule Flight
            </button>

            <Link
              to={cancelHref}
              aria-disabled={actionsDisabled || !isUpcoming}
              className={`${actionBaseClass} border-2 border-rose-300 bg-rose-50 text-rose-600 hover:border-rose-400 ${modifyDisabledClass}`}
            >
              Cancel Booking
            </Link>
          </div>
        </div>

        {/* SUPPORT */}
        <div className="rounded-xl border border-slate-200 bg-[#FFF8EE] p-3 text-xs text-slate-500">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 text-[#5D7FA7]" />

            <p>
              For further assistance, contact us at{" "}
              <span className="font-bold text-[#5D7FA7]">
                support@skylink.ph
              </span>
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ManageBookingDetailsLayout;
