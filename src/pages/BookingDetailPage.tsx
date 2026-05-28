import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, CreditCard, Plane, Ticket } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  BOOKING_DATA,
  formatCurrency,
} from "@/pages/BookingPagesFolder/bookingData";
import { useBookingDetail } from "@/hooks/useBookings";
import type { BookingDetail } from "@/types";

const FALLBACK_BOOKING_DETAIL: BookingDetail = {
  id: BOOKING_DATA.pnr.toLowerCase(),
  userId: "1",
  flightId: BOOKING_DATA.flightCode,
  pnr: BOOKING_DATA.pnr,
  passengers: [
    {
      firstName: BOOKING_DATA.passengerName.split(" ")[0],
      lastName:
        BOOKING_DATA.passengerName.split(" ").slice(1).join(" ") || "Gonzales",
      nationality: BOOKING_DATA.passengerNationality,
      passport: BOOKING_DATA.passengerId,
      seatNumber: BOOKING_DATA.seat,
      mealPreference: "standard",
    },
  ],
  status: "confirmed",
  paymentStatus: "captured",
  totalPrice: BOOKING_DATA.total,
  createdAt: "2026-04-10T00:00:00Z",
  updatedAt: "2026-04-10T00:00:00Z",
  flight: {
    flightNumber: BOOKING_DATA.flightCode,
    origin: BOOKING_DATA.fromCode,
    destination: BOOKING_DATA.toCode,
    departureTime: "2026-05-15T06:00:00Z",
    arrivalTime: "2026-05-15T07:20:00Z",
    airline: "SkyLink",
  },
  itinerary: [
    {
      id: "1",
      flightNumber: BOOKING_DATA.flightCode,
      origin: BOOKING_DATA.fromCode,
      destination: BOOKING_DATA.toCode,
      departureTime: "2026-05-15T06:00:00Z",
      arrivalTime: "2026-05-15T07:20:00Z",
      status: "scheduled",
      airline: "SkyLink",
      cabinClass: "economy",
    },
  ],
  contactEmail: "marco.gonzales@skylink.ph",
  contactPhone: "+63 917 000 0000",
  baseFare: BOOKING_DATA.baseFare,
  taxes: BOOKING_DATA.taxes,
  fees: 0,
  addOns: [],
  payment: null,
  modificationHistory: [],
};

const BookingDetailPage = () => {
  const { id } = useParams<{ id?: string }>();
  const { data, isLoading } = useBookingDetail(id);
  const booking = data ?? FALLBACK_BOOKING_DETAIL;

  if (isLoading && !data) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#496B92] border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7] px-6 py-8">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link
            to={ROUTES.MY_BOOKINGS}
            className="inline-flex items-center gap-1 text-[#5D7FA7] hover:text-[#4E6B8D]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Bookings
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">{booking.pnr}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_320px]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Booking Reference
                  </p>
                  <h1 className="mt-2 text-2xl font-bold text-slate-900">
                    {booking.pnr}
                  </h1>
                </div>
                <span className="rounded-full bg-[#EAF0F7] px-3 py-1 text-xs font-semibold text-[#5D7FA7]">
                  {booking.status}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Flight
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {booking.flight?.flightNumber}
                  </p>
                  <p className="text-xs text-slate-500">
                    {booking.flight?.origin} → {booking.flight?.destination}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Travel Date
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {booking.flight?.departureTime.split("T")[0]}
                  </p>
                  <p className="text-xs text-slate-500">
                    {booking.flight?.departureTime.slice(11, 16)} -{" "}
                    {booking.flight?.arrivalTime.slice(11, 16)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Passengers
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {booking.passengers.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    Seat {booking.passengers[0]?.seatNumber ?? "Auto"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-[#5D7FA7]" />
                <h2 className="text-lg font-bold text-slate-900">Itinerary</h2>
              </div>
              <div className="mt-4 space-y-3">
                {booking.itinerary.map((segment) => (
                  <div
                    key={segment.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {segment.origin} → {segment.destination}
                        </p>
                        <p className="text-xs text-slate-500">
                          {segment.flightNumber}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                        {segment.status ?? "scheduled"}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{segment.departureTime}</span>
                      <span>{segment.arrivalTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-[#5D7FA7]" />
                <h2 className="text-sm font-bold text-slate-900">Passenger</h2>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">
                  {booking.passengers[0]?.firstName}{" "}
                  {booking.passengers[0]?.lastName}
                </p>
                <p>{booking.passengers[0]?.nationality ?? "—"}</p>
                <p>Seat {booking.passengers[0]?.seatNumber ?? "Auto"}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#5D7FA7]" />
                <h2 className="text-sm font-bold text-slate-900">
                  Payment Summary
                </h2>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Base fare</span>
                  <span>{formatCurrency(booking.baseFare ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Taxes</span>
                  <span>{formatCurrency(booking.taxes ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-semibold text-[#5D7FA7]">
                    {formatCurrency(booking.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#5D7FA7]" />
                <h2 className="text-sm font-bold text-slate-900">Contact</h2>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>{booking.contactEmail ?? "—"}</p>
                <p>{booking.contactPhone ?? "—"}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default BookingDetailPage;
