import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2, Copy, Download, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useBookingDetail } from "@/hooks/useBookings";
import logo1 from "@/assets/logos/Logo 1.png";

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

  const dateOfIssue = detail?.booked_at 
    ? new Date(detail.booked_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  const paymentMethod = (detail?.payment?.payment_method_type || detail?.payment?.method || "gcash").toUpperCase();
  const totalPrice = detail?.total_price || detail?.totalPrice || 0;
  const baseFare = detail?.base_fare || detail?.baseFare || Math.round(totalPrice * 0.88);
  const taxes = detail?.tax || detail?.taxes || Math.round(totalPrice * 0.12);

  const depDateRaw = detail?.flight?.departure_time || detail?.flight?.departureTime;
  const arrDateRaw = detail?.flight?.arrival_time || detail?.flight?.arrivalTime;

  return (
    <>
      {/* Screen View (Interactive UI, hidden when printing) */}
      <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7] px-4 py-12 sm:px-6 print:hidden">
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

          <div className="mt-6 space-y-4">
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
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#EDF2F8] px-3 py-1 text-xs font-semibold text-[#5D7FA7] hover:bg-[#E1E8F2]"
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

          <div className="mt-6 flex flex-row gap-3">
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

      {/* Print-Only View (Professional E-Ticket Receipt) */}
      <div className="printable-ticket print-only bg-white text-slate-800 font-sans p-6 w-full max-w-[800px] mx-auto text-left leading-normal text-[10px]">
        {/* Header Branding */}
        <div className="flex justify-between items-center border-b-2 border-[#1E3A8A] pb-3">
          <div className="flex items-center gap-2">
            <img src={logo1} alt="SkyLink Logo" className="h-10 object-contain" />
          </div>
          <div className="text-right">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Electronic Ticket Receipt</h2>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="mt-4 grid grid-cols-2 gap-6 items-start">
          <div className="space-y-2">
            <div>
              <span className="text-[9px] text-slate-400 font-semibold uppercase block">Passenger Name</span>
              <span className="font-bold text-slate-800 uppercase text-xs">{booking.passengerName}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-semibold uppercase block">Booking Reference (PNR)</span>
              <span className="font-bold text-[#1E3A8A] uppercase tracking-wider text-xs">{booking.pnr}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-semibold uppercase block">Ticket Number</span>
              <span className="font-medium text-slate-600">SK-{booking.pnr}-ET</span>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center h-8 gap-[1.5px] pr-2">
              {[1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 2, 1, 4, 1, 3, 2, 4, 1, 2].map((w, idx) => (
                <div key={idx} className="bg-black h-full" style={{ width: `${w}px` }} />
              ))}
            </div>
            <div className="text-right text-[9px] text-slate-500 leading-tight space-y-0.5">
              <p><span className="font-semibold text-slate-700">Issuing Office:</span> SkyLink Manila Ticket Office</p>
              <p>NAIA Terminal 1, Pasay City, Metro Manila</p>
              <p><span className="font-semibold text-slate-700">Telephone:</span> +63 (2) 8888-8888</p>
              <p><span className="font-semibold text-slate-700">Date of Issue:</span> {dateOfIssue}</p>
            </div>
          </div>
        </div>

        {/* Banner Bar */}
        <div className="mt-4 bg-[#1E3A8A] text-white py-1 px-3 font-semibold uppercase tracking-wider text-[10px] rounded-sm">
          ELECTRONIC TICKET RECEIPT
        </div>

        {/* Notice */}
        <p className="mt-2 text-[8px] text-slate-500 italic leading-relaxed">
          At check-in you must show a: (i) government-issued I.D. and the document you gave for reference at reservation time; (ii) documentary proof entitling you to exemptions or discounts (e.g. Senior Citizen, PWD, etc.) you availed at time of purchase, if any.
        </p>

        {/* Itinerary Table */}
        <div className="mt-4">
          <table className="w-full border-collapse border border-slate-200">
            <thead>
              <tr className="bg-[#1E3A8A] text-white text-[9px] uppercase font-bold text-left">
                <th className="p-2 border border-slate-200">From</th>
                <th className="p-2 border border-slate-200">To</th>
                <th className="p-2 border border-slate-200">Flight</th>
                <th className="p-2 border border-slate-200">Departure</th>
                <th className="p-2 border border-slate-200">Arrival</th>
                <th className="p-2 border border-slate-200 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-[10px]">
              <tr className="bg-slate-50">
                <td className="p-2 border border-slate-200 font-semibold text-slate-800">
                  <div>{detail?.flight?.origin_airport?.city || "MANILA"}</div>
                  <div className="text-[8px] font-normal text-slate-500 mt-0.5">{detail?.flight?.origin_airport?.name || "Ninoy Aquino Intl"}</div>
                </td>
                <td className="p-2 border border-slate-200 font-semibold text-slate-800">
                  <div>{detail?.flight?.destination_airport?.city || "CEBU"}</div>
                  <div className="text-[8px] font-normal text-slate-500 mt-0.5">{detail?.flight?.destination_airport?.name || "Mactan-Cebu Intl"}</div>
                </td>
                <td className="p-2 border border-slate-200 font-semibold text-slate-800">
                  {booking.flightCode}
                </td>
                <td className="p-2 border border-slate-200">
                  <div className="font-semibold text-slate-800">{booking.departTime}</div>
                  <div className="text-[8px] font-medium text-slate-500 mt-0.5">
                    {depDateRaw ? new Date(depDateRaw).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                  </div>
                </td>
                <td className="p-2 border border-slate-200">
                  <div className="font-semibold text-slate-800">{booking.arriveTime}</div>
                  <div className="text-[8px] font-medium text-slate-500 mt-0.5">
                    {arrDateRaw ? new Date(arrDateRaw).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                  </div>
                </td>
                <td className="p-2 border border-slate-200 text-center font-bold text-emerald-600 uppercase">
                  CONFIRMED
                </td>
              </tr>
              <tr className="text-[9px] text-slate-600 bg-white">
                <td colSpan={6} className="p-2 border border-slate-200">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <span className="text-[8px] text-slate-400 font-semibold uppercase block">Class</span>
                      <span className="font-semibold text-slate-700">{booking.cabin}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-semibold uppercase block">Seat Selection</span>
                      <span className="font-semibold text-slate-700">{booking.seat}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-semibold uppercase block">Baggage Allowance</span>
                      <span className="font-semibold text-slate-700">20 KG (Standard)</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-semibold uppercase block">Meal Preference</span>
                      <span className="font-semibold text-slate-700">{booking.meal}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment & Fare Breakdown */}
        <div className="mt-5 grid grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1.5">Payment Details</h3>
            <table className="w-full mt-2 text-[9px] text-slate-600 border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Fare Calculation:</td>
                  <td className="py-1.5 text-right text-slate-700 uppercase font-mono">{booking.fromCode} SK {booking.toCode} PHP {detail?.total_price || 0}END</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Form of Payment:</td>
                  <td className="py-1.5 text-right text-slate-700 uppercase">{paymentMethod}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Transaction ID:</td>
                  <td className="py-1.5 text-right text-slate-700 font-mono text-[8px]">{detail?.payment?.id || `SK-${booking.pnr}-TX`}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Contact Details:</td>
                  <td className="py-1.5 text-right text-slate-700 text-[8px] truncate max-w-[150px]">{detail?.contactEmail || detail?.contact_email || "customer@skylink.com"}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Endorsements:</td>
                  <td className="py-1.5 text-right text-slate-700">NONREF/FARE RULES APPLY/ECO SUPERSAVER</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1.5">Fare Details</h3>
            <table className="w-full mt-2 text-[9px] text-slate-600 border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-1 font-semibold text-slate-500">Fare:</td>
                  <td className="py-1 text-right text-slate-800 font-semibold">PHP {baseFare.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 font-semibold text-slate-500">Taxes & Fees:</td>
                  <td className="py-1 text-right text-slate-800 font-semibold">PHP {taxes.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1 font-semibold text-slate-500">Carrier Imposed Fees:</td>
                  <td className="py-1 text-right text-slate-800 font-semibold">PHP 0</td>
                </tr>
                <tr className="bg-slate-100 text-[10px] font-bold text-slate-900 border-t border-slate-300">
                  <td className="p-1.5">Total Amount:</td>
                  <td className="p-1.5 text-right text-[#1E3A8A]">PHP {totalPrice.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Passenger Information Table */}
        <div className="mt-5">
          <h3 className="text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1.5">Passenger Information</h3>
          <table className="w-full mt-2 text-[9px] text-slate-600 border-collapse border border-slate-100">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-[8px] uppercase font-bold text-left border-b border-slate-200">
                <th className="p-1.5 border-r border-slate-200">Passenger Name</th>
                <th className="p-1.5 border-r border-slate-200 text-center">Type</th>
                <th className="p-1.5 border-r border-slate-200 text-center">Nationality</th>
                <th className="p-1.5">Passport / Document ID</th>
              </tr>
            </thead>
            <tbody>
              {detail?.passengers?.map((p: any, index: number) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="p-1.5 font-semibold text-slate-800 uppercase border-r border-slate-200">
                    {p.first_name || p.firstName} {p.last_name || p.lastName}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center uppercase">ADT (Adult)</td>
                  <td className="p-1.5 border-r border-slate-200 text-center uppercase">{p.nationality || "—"}</td>
                  <td className="p-1.5 font-mono">{p.passport_number || p.passport || "—"}</td>
                </tr>
              )) || (
                <tr className="border-b border-slate-100">
                  <td className="p-1.5 font-semibold text-slate-800 uppercase border-r border-slate-200">
                    {booking.passengerName}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center uppercase">ADT (Adult)</td>
                  <td className="p-1.5 border-r border-slate-200 text-center uppercase">—</td>
                  <td className="p-1.5 font-mono">—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Important Travel Information */}
        <div className="mt-5 grid grid-cols-2 gap-6 text-[8px] text-slate-500 leading-normal border border-slate-200 rounded-sm p-3 bg-slate-50/50">
          <div>
            <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-1">Check-in and Boarding Guidelines</h4>
            <ul className="list-disc pl-3 space-y-1">
              <li>Check-in counters open three (3) hours prior to scheduled departure and close strictly forty-five (45) minutes before flight time.</li>
              <li>Passengers must present a valid government-issued photo ID matching the reservation name at check-in.</li>
              <li>Boarding gates close fifteen (15) minutes before departure. Late passengers will not be accepted.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-1">Baggage Regulations & Security Notice</h4>
            <ul className="list-disc pl-3 space-y-1">
              <li>Free check-in baggage allowance is 20 kg. Excess weight will be subject to airline fees at the counter.</li>
              <li>One piece of hand baggage is allowed in the cabin up to 7 kg, max dimensions: 56 cm x 36 cm x 23 cm.</li>
              <li>Carriage of hazardous goods (flammables, unregistered batteries, liquid volumes &gt;100ml) in carry-on baggage is prohibited.</li>
            </ul>
          </div>
        </div>

        {/* Carriage Conditions Legal Text */}
        <div className="mt-5 text-[7px] text-slate-400 text-center leading-relaxed font-light">
          Carriage and other services provided by SkyLink are subject to conditions of carriage, which are hereby incorporated by reference. These conditions may be obtained from the issuing carrier. SkyLink reserves the right to adjust flight schedules and routing due to force majeure, safety requirements, or operational constraints.
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-dashed border-slate-200 pt-4 flex justify-between items-center text-[8px] text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} SkyLink Airline Corporation. All rights reserved.</p>
          <p className="uppercase tracking-widest text-[#1E3A8A] font-bold">Fly Smarter, Fly SkyLink</p>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmationPage;
