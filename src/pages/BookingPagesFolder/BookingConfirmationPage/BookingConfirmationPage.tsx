import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Copy, Download } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { BOOKING_DATA } from "@/pages/BookingPagesFolder/bookingData";

const BookingConfirmationPage = () => {
  const [copied, setCopied] = useState(false);
  const meal = BOOKING_DATA.meal ?? "Standard Meal";

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
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7] px-4 py-12 sm:px-6">
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
        <p className="mt-3 text-xs font-semibold text-rose-500">
          Fully refundable if canceled within 24 hours of booking;
          non-refundable thereafter.
        </p>

        <div className="mx-auto mt-6 w-full rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Booking Reference (PNR)
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-[0.2em] text-[#5D7FA7] sm:text-3xl sm:tracking-[0.3em]">
            {BOOKING_DATA.pnr}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#EDF2F8] px-3 py-1 text-xs font-semibold text-[#5D7FA7] hover:bg-[#E1E8F2]"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy PNR"}
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
            <p className="text-sm font-semibold text-slate-700">
              Flight Details
            </p>
            <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
              <div>
                <p className="text-2xl font-semibold text-slate-800">
                  {BOOKING_DATA.fromCode}
                </p>
                <p className="text-sm font-semibold text-[#5D7FA7]">
                  {BOOKING_DATA.departTime}
                </p>
              </div>
              <div className="text-center text-xs text-slate-400">
                <p>{BOOKING_DATA.duration}</p>
                <div className="mx-auto mt-1 h-0.5 w-12 rounded-full bg-slate-200" />
                <p className="mt-1 text-[11px] text-emerald-600">Non-stop</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl font-semibold text-slate-800">
                  {BOOKING_DATA.toCode}
                </p>
                <p className="text-sm font-semibold text-[#5D7FA7]">
                  {BOOKING_DATA.arriveTime}
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:grid-cols-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Flight
                </p>
                <p className="mt-1 font-semibold text-slate-700">
                  {BOOKING_DATA.flightCode}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Class
                </p>
                <p className="mt-1 font-semibold text-slate-700">
                  {BOOKING_DATA.cabin}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Seat
                </p>
                <p className="mt-1 font-semibold text-slate-700">
                  {BOOKING_DATA.seat}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Meal
                </p>
                <p className="mt-1 font-semibold text-slate-700">{meal}</p>
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

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#5D7FA7] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4E6B8D] sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Download E-ticket
          </button>
          <Link
            to={ROUTES.MANAGE}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#AFC2DD] px-6 py-2.5 text-sm font-semibold text-[#5D7FA7] hover:border-[#8EA7CB] sm:w-auto"
          >
            View My Booking
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default BookingConfirmationPage;
