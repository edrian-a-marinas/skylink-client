import { Link, Navigate, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  formatPeso,
  getManageBookingById,
} from "@/pages/ManageBookingPagesFolder/manageBookingData";

const ManageBookingCanceledPage = () => {
  const { id } = useParams();
  const booking = getManageBookingById(id);

  if (!booking) {
    return <Navigate to={ROUTES.MANAGE} replace />;
  }
  const refundAmount = Math.max(booking.total - booking.cancellationFee, 0);

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7] px-6 py-12">
      <section className="mx-auto w-full max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-800">
          Cancellation Confirmed
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Your booking has been successfully cancelled. A refund notification
          has been sent to your email.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
          <p className="text-lg font-bold text-slate-800">Refund Summary</p>
          <div className="mt-3 space-y-2 text-xs text-slate-500">
            <div className="flex items-center justify-between">
              <span>Original amount</span>
              <span className="font-bold text-slate-700">
                {formatPeso(booking.total)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cancellation fee</span>
              <span className="font-bold text-rose-500">
                -{formatPeso(booking.cancellationFee)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2">
              <span className="font-bold text-slate-800 text-lg">
                Refund amount
              </span>
              <span className="font-bold text-emerald-600 text-lg">
                {formatPeso(refundAmount)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Refund will be processed within 7-14 business days to your
              original payment method.
            </p>
          </div>
        </div>

        <Link
          to={ROUTES.MANAGE}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#5D7FA7] px-5 py-2 text-sm font-medium text-white hover:bg-[#4E6B8D]"
        >
          Back to My Bookings
        </Link>
      </section>
    </main>
  );
};

export default ManageBookingCanceledPage;
