import { useCallback, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import FiltersPanel from "./components/FiltersPanel";
import FlightResultCard, {
  type FlightResult,
  FlightResultCardSkeleton,
} from "./components/FlightResultCard";
import { searchFlights } from "@/api/flights.api";
import type { CabinClass, Flight, FlightSearchParams } from "@/types";
import useAsyncValue from "@/hooks/useAsyncValue";

const MIN_PRICE = 1000;
const MAX_PRICE = 50000;

function mapFlightToResult(flight: Flight): FlightResult {
  const departure = new Date(flight.departureTime);
  const arrival = new Date(flight.arrivalTime);
  const totalMinutes =
    Number.isNaN(departure.getTime()) || Number.isNaN(arrival.getTime())
      ? 80
      : Math.max(
          Math.round((arrival.getTime() - departure.getTime()) / 60000),
          60,
        );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    id: flight.id,
    airline: flight.airline ?? "SkyLink",
    airlineCode: (flight.airline ?? "SK").slice(0, 2).toUpperCase(),
    flightNo: flight.flightNumber,
    aircraft: flight.cabinClass === "business" ? "Airbus A321" : "Airbus A320",
    departTime: departure.toISOString().slice(11, 16),
    arriveTime: arrival.toISOString().slice(11, 16),
    duration: `${hours}h ${minutes.toString().padStart(2, "0")}m`,
    fromCode: flight.origin,
    toCode: flight.destination,
    stops:
      flight.stops === 0 || flight.stops === undefined
        ? "Non-stop"
        : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`,
    baggage: `${flight.baggageAllowanceKg ?? 20}kg`,
    status:
      flight.status === "on_time"
        ? "On time"
        : flight.status === "boarding"
          ? "Boarding"
          : flight.status === "delayed"
            ? "Delayed"
            : flight.status === "cancelled"
              ? "Cancelled"
              : "Scheduled",
    price: `PHP ${Math.round(flight.price).toLocaleString("en-US")}`,
    cabin:
      flight.cabinClass === "business"
        ? "Business"
        : flight.cabinClass === "first"
          ? "First"
          : "Economy",
  };
}

function parsePrice(value: string) {
  return Number(value.replace(/[^0-9]/g, ""));
}

function getTimeBucket(time: string) {
  const hour = Number(time.split(":")[0]);
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "evening";
}

function cleanLocation(value: string) {
  return value.replace(/\s*\([A-Z]{3}\)\s*/, "").trim();
}

function getCode(value: string) {
  const match = value.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : "";
}

function toCabinClass(value: string): CabinClass | undefined {
  const normalized = value.toLowerCase();
  if (normalized === "premium economy") return "premium_economy";
  if (
    normalized === "economy" ||
    normalized === "business" ||
    normalized === "first"
  ) {
    return normalized;
  }
  return undefined;
}

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [directOnly, setDirectOnly] = useState(true);
  const [timeFilters, setTimeFilters] = useState<string[]>([]);

  const fromParam = searchParams.get("from") ?? "Manila (MNL)";
  const toParam = searchParams.get("to") ?? "Cebu (CEB)";
  const dateParam = searchParams.get("date") ?? "";
  const paxParam = searchParams.get("pax") ?? "1";
  const cabinParam = searchParams.get("cabin") ?? "Economy";
  const fromLabel = cleanLocation(fromParam) || "Manila";
  const toLabel = cleanLocation(toParam) || "Cebu";
  const dateLabel = dateParam || "Any date";
  const queryString = searchParams.toString();
  const loader = useCallback(async () => {
    const cabinClass = toCabinClass(cabinParam);
    const params = {
      origin: getCode(fromParam) || fromLabel,
      destination: getCode(toParam) || toLabel,
      passengers: Number(paxParam) || 1,
      ...(dateParam ? { date: dateParam } : {}),
      ...(cabinClass ? { cabinClass } : {}),
    } satisfies FlightSearchParams;

    const response = await searchFlights(params);
    return response.map(mapFlightToResult);
  }, [cabinParam, dateParam, fromLabel, fromParam, paxParam, toLabel, toParam]);

  const { data: fetchedFlights, isLoading } = useAsyncValue(loader, [
    "search-results-flights",
    fromParam,
    toParam,
    dateParam,
    cabinParam,
    paxParam,
  ]);
  const baseFlights = fetchedFlights ?? [];

  const filteredFlights = useMemo(() => {
    return baseFlights.filter((flight) => {
      if (parsePrice(flight.price) > maxPrice) {
        return false;
      }
      if (directOnly && flight.stops !== "Non-stop") {
        return false;
      }
      if (timeFilters.length > 0) {
        const bucket = getTimeBucket(flight.departTime);
        if (!timeFilters.includes(bucket)) {
          return false;
        }
      }
      return true;
    });
  }, [baseFlights, directOnly, maxPrice, timeFilters]);

  const toggleTimeFilter = (timeId: string) => {
    setTimeFilters((prev) =>
      prev.includes(timeId)
        ? prev.filter((item) => item !== timeId)
        : [...prev, timeId],
    );
  };

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.HOME}
              className="text-slate-500 hover:text-slate-800"
            >
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">
              {fromLabel} to {toLabel}
            </span>
            <span className="text-xs text-slate-400">
              {dateLabel} | {paxParam} pax - {cabinParam}
            </span>
          </div>
          <Link
            to={ROUTES.BOOK}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300"
          >
            Edit Search
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <FiltersPanel
            maxPrice={maxPrice}
            minPrice={MIN_PRICE}
            maxRange={MAX_PRICE}
            directOnly={directOnly}
            timeFilters={timeFilters}
            onMaxPriceChange={setMaxPrice}
            onToggleDirectOnly={() => setDirectOnly((prev) => !prev)}
            onToggleTime={toggleTimeFilter}
          />

          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              {isLoading
                ? "Loading flights..."
                : `${filteredFlights.length} flights found`}
            </p>
            {isLoading ? (
              <>
                <FlightResultCardSkeleton />
                <FlightResultCardSkeleton />
                <FlightResultCardSkeleton />
              </>
            ) : (
              filteredFlights.map((flight) => (
                <FlightResultCard
                  key={flight.id}
                  flight={flight}
                  queryString={queryString}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SearchResultsPage;
