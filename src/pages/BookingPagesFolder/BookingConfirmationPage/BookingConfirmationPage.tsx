import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Copy, Download } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  BOOKING_DATA,
  formatCurrency,
} from "@/pages/BookingPagesFolder/bookingData";

const BookingConfirmationPage = () => {
  const [copied, setCopied] = useState(false);
  const total = formatCurrency(BOOKING_DATA.total);

  const handleCopy = async () => {
    if (!navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(BOOKING_DATA.pnr);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7] px-6 py-14">
      <section className="mx-auto w-full max-w-3xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-slate-800">
          Booking Confirmed!
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Your booking is confirmed. A confirmation email has been sent to your
          inbox.
        </p>

        <div className="mx-auto mt-6 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Booking Reference (PNR)
          </p>
          <p className="mt-2 text-2xl font-semibold text-[#5D7FA7]">
            {BOOKING_DATA.pnr}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy PNR"}
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
            <p className="text-xs font-semibold text-slate-400">
              Flight Details
            </p>
            <div className="mt-2 flex items-center justify-between text-sm font-semibold text-slate-800">
              <span>{BOOKING_DATA.fromCode}</span>
              <span className="text-xs font-medium text-slate-400">
                {BOOKING_DATA.duration}
              </span>
              <span>{BOOKING_DATA.toCode}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>{BOOKING_DATA.departTime}</span>
              <span>Non-stop</span>
              <span>{BOOKING_DATA.arriveTime}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Flight
                </p>
                <p className="font-semibold text-slate-700">
                  {BOOKING_DATA.flightCode}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Class
                </p>
                <p className="font-semibold text-slate-700">
                  {BOOKING_DATA.cabin}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Seat
                </p>
                <p className="font-semibold text-slate-700">
                  {BOOKING_DATA.seat}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Total Paid
                </p>
                <p className="font-semibold text-slate-700">{total}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
            <p className="text-xs font-semibold text-slate-400">Passenger</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {BOOKING_DATA.passengerName}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#5D7FA7] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#4E6B8D]"
          >
            <Download className="h-4 w-4" />
            Download E-ticket
          </button>
          <Link
            to={ROUTES.MY_BOOKINGS}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
          >
            View My Booking
          </Link>
        </div>

        <Link
          to={ROUTES.HOME}
          className="mt-4 inline-flex text-xs font-semibold text-slate-500 hover:text-slate-700"
        >
          Go to Homepage
        </Link>
      </section>
    </main>
  );
};

export default BookingConfirmationPage;
