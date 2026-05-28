import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  BOOKING_DATA,
  loadBookingData,
} from "@/pages/BookingPagesFolder/bookingData";
import useAsyncValue from "@/hooks/useAsyncValue";

const PaymentProcessingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchSuffix = location.search ?? "";
  const { data: bookingData } = useAsyncValue(loadBookingData);
  const booking = bookingData ?? BOOKING_DATA;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(`${ROUTES.BOOKING_CONFIRMATION}${searchSuffix}`);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [navigate, searchSuffix]);

  return (
    <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7] px-6 py-16">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-[#5D7FA7] border-t-transparent" />
            <Plane className="absolute inset-0 m-auto h-4 w-4 text-[#5D7FA7]" />
          </div>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-800">
          Processing Your Payment
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Please wait while we securely process your payment.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Do not close or refresh this page.
        </p>

        <div className="mx-auto mt-6 w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Booking
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            {booking.fromCode} {"->"} {booking.toCode}
          </p>
          <p className="text-xs text-slate-500">{booking.flightCode}</p>
        </div>
      </div>
    </main>
  );
};

export default PaymentProcessingPage;
