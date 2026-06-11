import { useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { searchFlights } from "@/api/flights.api";
import { getBookingDetail } from "@/api/bookings.api";
import useAsyncValue from "@/hooks/useAsyncValue";
import type { Flight } from "@/types";

type ReschedulePickState = {
  bookingId: string;
  currentFlightId: string;
  newFlight: Flight;
};

const ReschedulePickPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const loader = useCallback(async () => {
    if (!id) return null;
    const booking = await getBookingDetail(id);
    if (!booking) return null;

    const origin = (booking.flight as any)?.origin_airport?.iata_code ?? booking.flight?.origin;
    const destination = (booking.flight as any)?.destination_airport?.iata_code ?? booking.flight?.destination;

    if (!origin || !destination) return null;

    const flights = await searchFlights({ origin, destination });

    // Exclude current flight
    const alternatives = flights.filter(
      (f) => f.id !== (booking.flight as any)?.id
    );

    return { booking, flights: alternatives, origin, destination };
  }, [id]);

  const { data, isLoading } = useAsyncValue(loader);

  const filteredFlights = useMemo(() => {
    if (!data?.flights) return [];
    return data.flights;
  }, [data]);

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7]">
        <Loader2 className="animate-spin text-[#496B92]" size={32} />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center gap-4 bg-[#F3F5F7]">
        <p className="text-slate-500 text-sm">Booking not found.</p>
        <Link to={ROUTES.MANAGE} className="text-sm font-semibold text-[#5D7FA7] hover:underline">
          Back to My Bookings
        </Link>
      </main>
    );
  }

  const { booking, origin, destination } = data;
  const backHref = ROUTES.MANAGE_BOOKING_DETAIL.replace(":id", id ?? "");

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link
              to={backHref}
              className="inline-flex items-center gap-1 font-semibold text-[#5D7FA7] hover:text-[#4E6B8D]"
            >
              <ArrowLeft size={16} />
              Back to Booking
            </Link>
            <span>/</span>
            <span className="font-medium text-slate-400">Reschedule</span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-8 space-y-6">
        {/* Info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-900">Select a New Flight</p>
          <p className="mt-1 text-xs text-slate-500">
            Current route: <span className="font-semibold text-slate-700">{origin} → {destination}</span>.
            Choose a different flight below.
          </p>
        </div>

        {/* Flight list */}
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            {filteredFlights.length} alternative flight{filteredFlights.length !== 1 ? "s" : ""} found
          </p>

          {filteredFlights.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
              No alternative flights available for this route.
            </div>
          ) : (
            filteredFlights.map((flight) => {
              const dep = new Date(flight.departureTime);
              const arr = new Date(flight.arrivalTime);
              const diffMs = arr.getTime() - dep.getTime();
              const hours = Math.floor(diffMs / 3600000);
              const mins = Math.round((diffMs % 3600000) / 60000);

              return (
                <div
                  key={flight.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5D7FA7] text-sm font-bold text-white">
                        SK
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{flight.airline ?? "SkyLink"}</p>
                        <p className="text-xs text-slate-500">{flight.flightNumber}</p>
                      </div>
                    </div>

                    <div className="flex flex-1 items-center justify-between gap-4 md:justify-center">
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">
                          {dep.toISOString().slice(11, 16)}
                        </p>
                        <p className="text-xs text-slate-400">{flight.origin}</p>
                      </div>
                      <div className="flex flex-col items-center text-[11px] text-slate-400">
                        <span>{hours}h {String(mins).padStart(2, "0")}m</span>
                        <span className="text-emerald-600 font-semibold">Non-stop</span>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">
                          {arr.toISOString().slice(11, 16)}
                        </p>
                        <p className="text-xs text-slate-400">{flight.destination}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#5D7FA7]">
                          ₱{Math.round(flight.price).toLocaleString("en-US")}
                        </p>
                        <p className="text-xs text-slate-500">Economy / pax</p>
                      </div>
                      <button
                        onClick={() => {
                          const state: ReschedulePickState = {
                            bookingId: id!,
                            currentFlightId: (booking.flight as any)?.id ?? "",
                            newFlight: flight,
                          };
                          navigate(
                            ROUTES.RESCHEDULE_SUMMARY.replace(":id", id!),
                            { state }
                          );
                        }}
                        className="rounded-lg bg-[#5D7FA7] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#4E6B8D]"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
};

export default ReschedulePickPage;