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
import { useBookingDetail } from "@/hooks/useBookings";
import logo1 from "@/assets/logos/Logo 1.png";

type ManageBookingDetailsLayoutProps = {
  booking: ManageBooking;
  actionsDisabled?: boolean;
};

const ManageBookingDetailsLayout = ({
  booking,
  actionsDisabled = false,
}: ManageBookingDetailsLayoutProps) => {
  const { data: bookingDetail } = useBookingDetail(booking.id);

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

  const formatDateSafe = (dateStr?: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

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

  const handlePrint = () => {
    window.print();
  };

  const detail = bookingDetail as any;
  const passenger = detail?.passengers?.[0];

  const rawCabin = detail?.seat_class?.name || detail?.flight?.cabinClass || booking.cabin || "Economy";
  const cabinFormatted = rawCabin.charAt(0).toUpperCase() + rawCabin.slice(1).toLowerCase();

  const depTimeRaw = detail?.flight?.departure_time || detail?.flight?.departureTime;
  const arrTimeRaw = detail?.flight?.arrival_time || detail?.flight?.arrivalTime;
  const depDateRaw = depTimeRaw;
  const arrDateRaw = arrTimeRaw;

  const dateOfIssue = detail?.booked_at 
    ? new Date(detail.booked_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : (booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));

  const paymentMethod = (detail?.payment?.payment_method_type || detail?.payment?.method || "gcash").toUpperCase();
  const totalPrice = detail?.total_price || detail?.totalPrice || booking.total || 0;
  const baseFare = detail?.base_fare || detail?.baseFare || Math.round(totalPrice * 0.88);
  const taxes = detail?.tax || detail?.taxes || Math.round(totalPrice * 0.12);

  const displayStatus = (booking.status || "upcoming").toUpperCase() === "CANCELLED" ? "CANCELLED" : "CONFIRMED";
  const statusColorClass = displayStatus === "CANCELLED" ? "text-rose-600" : "text-emerald-600";

  const printBooking = {
    pnr: detail?.pnr || booking.pnr || "—",
    fromCode: detail?.flight?.origin_airport?.iata_code || detail?.flight?.origin || booking.fromCode || "—",
    toCode: detail?.flight?.destination_airport?.iata_code || detail?.flight?.destination || booking.toCode || "—",
    departTime: depTimeRaw ? formatTimeSafe(depTimeRaw) : booking.departTime,
    arriveTime: arrTimeRaw ? formatTimeSafe(arrTimeRaw) : booking.arriveTime,
    duration: depTimeRaw && arrTimeRaw ? getDuration(depTimeRaw, arrTimeRaw) : booking.duration,
    flightCode: detail?.flight?.flight_number || detail?.flight?.flightNumber || booking.flightCode || "—",
    cabin: cabinFormatted,
    seat: detail?.seat_number || passenger?.seatNumber || booking.seat || "Auto-assigned",
    meal: passenger?.mealPreference 
      ? (passenger.mealPreference.charAt(0).toUpperCase() + passenger.mealPreference.slice(1)) 
      : (booking.meal || "Standard Meal"),
    passengerName: passenger 
      ? `${passenger.first_name || passenger.firstName || ""} ${passenger.last_name || passenger.lastName || ""}`.trim() 
      : "Guest Passenger",
  };

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
      <aside className="space-y-4 print:hidden">
        {/* ACTIONS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-800">Manage Booking</p>

          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className={`${actionBaseClass} border-2 border-[#5D7FA7] bg-[#5D7FA7] text-white hover:bg-[#4E6B8D] ${actionDisabledClass} cursor-pointer`}
            >
              <Download className="h-4 w-4" />
              Download E-ticket
            </button>

            <Link
              to={ROUTES.RESCHEDULE_PICK.replace(":id", booking.id)}
              aria-disabled={actionsDisabled || !isUpcoming}
              className={`${actionBaseClass} border-2 border-[#AFC2DD] bg-white text-[#5D7FA7] hover:border-[#8EA7CB] ${modifyDisabledClass}`}
            >
              <RotateCw className="h-4 w-4" />
              Reschedule Flight
            </Link>

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
              <span className="font-bold text-slate-800 uppercase text-xs">{printBooking.passengerName}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-semibold uppercase block">Booking Reference (PNR)</span>
              <span className="font-bold text-[#1E3A8A] uppercase tracking-wider text-xs">{printBooking.pnr}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-semibold uppercase block">Ticket Number</span>
              <span className="font-medium text-slate-600">SK-{printBooking.pnr}-ET</span>
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
                  <div>{detail?.flight?.origin_airport?.city || booking.fromCity || "MANILA"}</div>
                  <div className="text-[8px] font-normal text-slate-500 mt-0.5">{detail?.flight?.origin_airport?.name || "Ninoy Aquino Intl"}</div>
                </td>
                <td className="p-2 border border-slate-200 font-semibold text-slate-800">
                  <div>{detail?.flight?.destination_airport?.city || booking.toCity || "CEBU"}</div>
                  <div className="text-[8px] font-normal text-slate-500 mt-0.5">{detail?.flight?.destination_airport?.name || "Mactan-Cebu Intl"}</div>
                </td>
                <td className="p-2 border border-slate-200 font-semibold text-slate-800">
                  {printBooking.flightCode}
                </td>
                <td className="p-2 border border-slate-200">
                  <div className="font-semibold text-slate-800">{printBooking.departTime}</div>
                  <div className="text-[8px] font-medium text-slate-500 mt-0.5">
                    {depDateRaw ? formatDateSafe(depDateRaw) : formatDateSafe(booking.date)}
                  </div>
                </td>
                <td className="p-2 border border-slate-200">
                  <div className="font-semibold text-slate-800">{printBooking.arriveTime}</div>
                  <div className="text-[8px] font-medium text-slate-500 mt-0.5">
                    {arrDateRaw ? formatDateSafe(arrDateRaw) : formatDateSafe(booking.date)}
                  </div>
                </td>
                <td className={`p-2 border border-slate-200 text-center font-bold ${statusColorClass} uppercase`}>
                  {displayStatus}
                </td>
              </tr>
              <tr className="text-[9px] text-slate-600 bg-white">
                <td colSpan={6} className="p-2 border border-slate-200">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <span className="text-[8px] text-slate-400 font-semibold uppercase block">Class</span>
                      <span className="font-semibold text-slate-700">{printBooking.cabin}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-semibold uppercase block">Seat Selection</span>
                      <span className="font-semibold text-slate-700">{printBooking.seat}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-semibold uppercase block">Baggage Allowance</span>
                      <span className="font-semibold text-slate-700">20 KG (Standard)</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-semibold uppercase block">Meal Preference</span>
                      <span className="font-semibold text-slate-700">{printBooking.meal}</span>
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
                  <td className="py-1.5 text-right text-slate-700 uppercase font-mono">{printBooking.fromCode} SK {printBooking.toCode} PHP {totalPrice}END</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Form of Payment:</td>
                  <td className="py-1.5 text-right text-slate-700 uppercase">{paymentMethod}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Transaction ID:</td>
                  <td className="py-1.5 text-right text-slate-700 font-mono text-[8px]">{detail?.payment?.id || `SK-${printBooking.pnr}-TX`}</td>
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
                    {printBooking.passengerName}
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
    </div>
  );
};

export default ManageBookingDetailsLayout;
