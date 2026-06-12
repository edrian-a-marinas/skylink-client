import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2, Copy, Download, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useBookingDetail } from "@/hooks/useBookings";

const BookingConfirmationPage = () => {
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const bookingId = query.get("booking_id");

  const { data: bookingDetail, isLoading } = useBookingDetail(bookingId || undefined);

  const formatTimeSafe = (timeStr?: string) => {
    if (!timeStr) return "—";
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return "—";
    try {
      return d.toISOString().slice(11, 16);
    } catch {
      return "—";
    }
  };

  const getDuration = (depStr?: string, arrStr?: string) => {
    if (!depStr || !arrStr) return "—";
    const dep = new Date(depStr);
    const arr = new Date(arrStr);
    if (isNaN(dep.getTime()) || isNaN(arr.getTime())) return "—";
    const diffMs = arr.getTime() - dep.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.round((diffMs % 3600000) / 60000);
    return `${diffHrs}h ${diffMins}m`;
  };

  const detail = bookingDetail as any;
  const passenger = detail?.passengers?.[0];

  const rawCabin = detail?.seat_class?.name || detail?.flight?.cabinClass || "Economy";
  const cabinFormatted = rawCabin.charAt(0).toUpperCase() + rawCabin.slice(1).toLowerCase();

  const depTimeRaw = detail?.flight?.departure_time || detail?.flight?.departureTime;
  const arrTimeRaw = detail?.flight?.arrival_time || detail?.flight?.arrivalTime;

  const booking = {
    pnr: detail?.pnr || "—",
    fromCode: detail?.flight?.origin_airport?.iata_code || detail?.flight?.origin || "—",
    toCode: detail?.flight?.destination_airport?.iata_code || detail?.flight?.destination || "—",
    departTime: formatTimeSafe(depTimeRaw),
    arriveTime: formatTimeSafe(arrTimeRaw),
    duration: getDuration(depTimeRaw, arrTimeRaw),
    flightCode: detail?.flight?.flight_number || detail?.flight?.flightNumber || "—",
    cabin: cabinFormatted,
    seat: detail?.seat_number || passenger?.seatNumber || "Auto-assigned",
    meal: passenger?.mealPreference 
      ? (passenger.mealPreference.charAt(0).toUpperCase() + passenger.mealPreference.slice(1)) 
      : "Standard Meal",
    passengerName: passenger 
      ? `${passenger.first_name || passenger.firstName || ""} ${passenger.last_name || passenger.lastName || ""}`.trim() 
      : "—",
  };

  const meal = booking.meal;

  const handleCopy = async () => {
    if (!navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(booking.pnr);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7]">
        <Loader2 className="h-8 w-8 animate-spin text-[#496B92]" />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7] px-4 py-12 sm:px-6">
      <section className="mx-auto w-full max-w-3xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 print:hidden">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-slate-800 print:hidden">
          Booking Confirmed!
        </h2>
        <p className="mt-2 text-sm text-slate-500 print:hidden">
          Your booking is confirmed. A confirmation email has been sent to your
          inbox.
        </p>
        <p className="mt-3 text-xs font-semibold text-rose-500 print:hidden">
          Fully refundable if canceled within 24 hours of booking;
          non-refundable thereafter.
        </p>

        <div className="printable-ticket mt-6 space-y-4">
          {/* Print-only Header */}
          <div className="hidden print:flex flex-col items-center border-b border-slate-200 pb-5 mb-5 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">SkyLink E-Ticket</h1>
            <p className="text-sm text-slate-500 mt-1 font-semibold">Thank you for flying with SkyLink</p>
          </div>

          <div className="mx-auto w-full rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Booking Reference (PNR)
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[0.2em] text-[#5D7FA7] sm:text-3xl sm:tracking-[0.3em]">
              {booking.pnr}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#EDF2F8] px-3 py-1 text-xs font-semibold text-[#5D7FA7] hover:bg-[#E1E8F2] print:hidden"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Copied" : "Copy PNR"}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
            <p className="text-sm font-semibold text-slate-700">
              Flight Details
            </p>
            <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
              <div>
                <p className="text-2xl font-semibold text-slate-800">
                  {booking.fromCode}
                </p>
                <p className="text-sm font-semibold text-[#5D7FA7]">
                  {booking.departTime}
                </p>
              </div>
              <div className="text-center text-xs text-slate-400">
                <p>{booking.duration}</p>
                <div className="mx-auto mt-1 h-0.5 w-12 rounded-full bg-slate-200" />
                <p className="mt-1 text-[11px] text-emerald-600">Non-stop</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl font-semibold text-slate-800">
                  {booking.toCode}
                </p>
                <p className="text-sm font-semibold text-[#5D7FA7]">
                  {booking.arriveTime}
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:grid-cols-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Flight
                </p>
                <p className="mt-1 font-semibold text-slate-700">
                  {booking.flightCode}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Class
                </p>
                <p className="mt-1 font-semibold text-slate-700">
                  {booking.cabin}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Seat
                </p>
                <p className="mt-1 font-semibold text-slate-700">
                  {booking.seat}
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
              {booking.passengerName}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-row gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#5D7FA7] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4E6B8D] cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download E-ticket
          </button>
          <Link
            to={ROUTES.MANAGE}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#AFC2DD] px-6 py-2.5 text-sm font-semibold text-[#5D7FA7] hover:border-[#8EA7CB]"
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
