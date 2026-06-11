import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Plane } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { getPublicAirports } from "@/api/destinations.api";
import { searchFlights } from "@/api/flights.api";
import type { Airport } from "@/types/destinations.types";
import useAsyncValue from "@/hooks/useAsyncValue";

type FlightCard = {
  id: string;
  flightId: string;
  time: string;
  duration: string;
  price: string;
  cabin: string;
};

const DestinationPage = () => {
  const { iata_code } = useParams<{ iata_code: string }>();

  const airportLoader = useCallback(async (): Promise<Airport | null> => {
    if (!iata_code) return null;
    const airports = await getPublicAirports();
    return airports.find((a) => a.iata_code === iata_code.toUpperCase()) ?? null;
  }, [iata_code]);

  const flightLoader = useCallback(async (): Promise<FlightCard[]> => {
    if (!iata_code) return [];
    const flights = await searchFlights({ destination: iata_code.toUpperCase() });
    return flights.map((flight) => {
      const dep = new Date(flight.departureTime);
      const arr = new Date(flight.arrivalTime);
      const diffMs = arr.getTime() - dep.getTime();
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.round((diffMs % 3600000) / 60000);
      return {
        id: flight.flightNumber,
        flightId: flight.id,
        time: `${dep.toUTCString().slice(17, 22)} - ${arr.toUTCString().slice(17, 22)}`,
        duration: `${diffHrs}h ${diffMins}m`,
        price: `₱${Math.round(flight.price).toLocaleString("en-US")}`,
        cabin: "Economy",
      };
    });
  }, [iata_code]);

  const { data: airport, isLoading: airportLoading } = useAsyncValue(airportLoader);
  const { data: flightData, isLoading: flightsLoading } = useAsyncValue(flightLoader);
  const availableFlights = flightData ?? [];

  if (airportLoading) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#496B92] border-t-transparent" />
      </main>
    );
  }

  if (!airport) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7]">
        <div className="text-center">
          <p className="text-slate-500 text-sm">Destination not found.</p>
          <Link to={ROUTES.EXPLORE} className="mt-4 inline-block text-sm font-semibold text-[#5D7FA7] hover:underline">
            Back to Explore
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#29384C]">
        {airport.image_url && (
          <img
            src={airport.image_url}
            alt={airport.city}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto flex h-56 max-w-6xl flex-col justify-end px-6 pb-6 text-white">
          <Link
            to={ROUTES.EXPLORE}
            className="absolute left-6 top-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 transition hover:bg-white/25"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <MapPin size={14} />
            {airport.country}
          </div>
          <h1 className="mt-1 text-3xl font-semibold">{airport.city}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-white/70">
            <span className="flex items-center gap-2">
              <Plane size={14} />
              {airport.iata_code}
            </span>
            {availableFlights[0] && (
              <span>from {availableFlights[0].price}</span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-16 pt-6">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            {/* About */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">About {airport.city}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {airport.about ?? "No description available."}
              </p>
            </div>

            {/* Highlights */}
            {airport.highlights && airport.highlights.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">Top Highlights</h2>
                <ul className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  {airport.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#5D7FA7]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Flights */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Next Available Flights</h2>
                <Link to={`${ROUTES.SEARCH_RESULTS}?from=MNL&to=${airport.iata_code}`} className="text-xs font-semibold text-[#5D7FA7] hover:text-[#4E6B8D]">
                  See all flights
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {flightsLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#496B92] border-t-transparent" />
                  </div>
                ) : availableFlights.length > 0 ? (
                  availableFlights.slice(0, 5).map((flight) => (
                    <Link
                      key={flight.id}
                      to={`/flights/${flight.flightId}`}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:border-[#496B92]/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5D7FA7] text-xs font-semibold text-white">
                          SK
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{flight.id}</p>
                          <p className="text-xs text-slate-500">{flight.time} · {flight.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#5D7FA7]">{flight.price}</p>
                        <p className="text-xs text-slate-500">{flight.cabin}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-slate-500 italic">
                    No scheduled flights available for this destination.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Trip Info</h3>
              <div className="mt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-[#5D7FA7] mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700">Best Time to Visit</p>
                    <p>{airport.best_time ?? "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Plane size={14} className="text-[#5D7FA7] mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700">Airport</p>
                    <p>{airport.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={14} className="text-[#5D7FA7] mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700">Timezone</p>
                    <p>{airport.timezone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#F9F4EE] p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Lowest fare to {airport.city}
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#5D7FA7]">
                {availableFlights[0]?.price ?? "—"}
              </p>
              <p className="mt-1 text-xs text-slate-500">One-way · Economy</p>
              <Link
                to={`${ROUTES.SEARCH_RESULTS}?from=MNL&to=${airport.iata_code}`}
                className="mt-4 block w-full rounded-lg bg-[#5D7FA7] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#4E6B8D]"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DestinationPage;