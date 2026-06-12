import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { cancelBooking } from "@/api/bookings.api";

import { ROUTES } from "@/constants/routes";

import ManageBookingDetailsLayout from "@/pages/ManageBookingPagesFolder/components/ManageBookingDetailsLayout";

import {
  formatPeso,
  loadManageBookingById,
} from "@/pages/ManageBookingPagesFolder/manageBookingData";
import useAsyncValue from "@/hooks/useAsyncValue";

const ManageBookingCancelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const { data: booking, isLoading } = useAsyncValue(
    () => loadManageBookingById(id),
    ["manage-booking-detail", id],
  );

  if (isLoading && !booking) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#496B92] border-t-transparent" />
      </main>
    );
  }

  if (!booking) {
    return <Navigate to={ROUTES.MANAGE} replace />;
  }

  if (booking.status !== "upcoming") {
    return (
      <Navigate
        to={ROUTES.MANAGE_BOOKING_DETAIL.replace(":id", booking.id)}
        replace
      />
    );
  }

  const refundAmount = Math.max(booking.total - booking.cancellationFee, 0);

  const detailHref = ROUTES.MANAGE_BOOKING_DETAIL.replace(":id", booking.id);

  const canceledHref = ROUTES.MANAGE_BOOKING_CANCELED.replace(
    ":id",
    booking.id,
  );

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7] px-6 py-8">
      {/* BACKGROUND CONTENT */}
      <section className="mx-auto w-full max-w-7xl">
        <div className="pointer-events-none opacity-80">
          <ManageBookingDetailsLayout booking={booking} actionsDisabled />
        </div>
      </section>

      {/* OVERLAY */}
      <div className="fixed inset-0 z-40 bg-slate-900/40" />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
        <div
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          role="dialog"
          aria-modal="true"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4">
            {/* LEFT */}
            <div>
              {/* ICON + TITLE */}
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  <AlertTriangle className="h-5 w-5" />
                </span>

                <h2 className="text-base font-bold text-slate-800">
                  Cancel Booking?
                </h2>
              </div>

              {/* DESCRIPTION */}
              <p className="mt-3 text-xs text-slate-500">
                Are you sure you want to cancel flight{" "}
                <span className="font-semibold text-slate-700">
                  {booking.flightCode}
                </span>{" "}
                ({booking.fromCode} {"->"} {booking.toCode})?
              </p>
            </div>

            {/* CLOSE BUTTON */}
            <Link
              to={detailHref}
              className="rounded-full p-1 text-slate-400 transition hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Link>
          </div>

          {/* REFUND BOX */}
          <div className="mt-4 rounded-xl bg-[#FBF6EF] p-4 text-xs text-slate-600">
            <p className="font-bold text-amber-700">Refund Estimate</p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span>Total paid</span>

                <span>{formatPeso(booking.total)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Cancellation fee</span>

                <span>-{formatPeso(booking.cancellationFee)}</span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-amber-100 pt-3">
                <span className="font-bold text-black">Refund amount</span>

                <span className="font-bold text-emerald-600">
                  {formatPeso(refundAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {cancelError && (
            <p className="mt-3 text-xs font-semibold text-rose-500">{cancelError}</p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to={detailHref}
              className="flex-1 rounded-lg bg-[#5D7FA7] px-4 py-2 text-center text-xs font-bold text-white transition hover:bg-[#4E6B8D]"
            >
              Keep Booking
            </Link>
            <button
              onClick={async () => {
                if (!id) return;
                setIsCancelling(true);
                setCancelError(null);
                try {
                  await cancelBooking(id);
                  navigate(canceledHref);
                } catch {
                  setCancelError("Failed to cancel booking. Please try again.");
                } finally {
                  setIsCancelling(false);
                }
              }}
              disabled={isCancelling}
              className="flex-1 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-center text-xs font-bold text-rose-600 transition hover:border-rose-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCancelling && <Loader2 size={12} className="animate-spin" />}
              {isCancelling ? "Cancelling..." : "Yes, Cancel"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManageBookingCancelPage;
