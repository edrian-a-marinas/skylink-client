import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import FiltersPanel from "./components/FiltersPanel";
import FlightResultCard, {
  type FlightResult,
} from "./components/FlightResultCard";

const FLIGHTS: FlightResult[] = [
  {
    id: "pa-2191",
    airline: "Philippine Airlines",
    airlineCode: "PA",
    flightNo: "PA 2191",
    aircraft: "Airbus A320",
    departTime: "06:00",
    arriveTime: "07:20",
    duration: "1h 20m",
    fromCode: "MNL",
    toCode: "CEB",
    stops: "Non-stop",
    baggage: "20kg",
    status: "On time",
    price: "PHP 1,890",
    cabin: "Economy",
  },
  {
    id: "cp-2193",
    airline: "Cebu Pacific",
    airlineCode: "CP",
    flightNo: "CP 2193",
    aircraft: "Boeing 737-800",
    departTime: "09:15",
    arriveTime: "10:35",
    duration: "1h 20m",
    fromCode: "MNL",
    toCode: "CEB",
    stops: "Non-stop",
    baggage: "20kg",
    status: "On time",
    price: "PHP 2,350",
    cabin: "Economy",
  },
  {
    id: "aa-2201",
    airline: "AirAsia",
    airlineCode: "AA",
    flightNo: "AA 2201",
    aircraft: "Airbus A321",
    departTime: "14:30",
    arriveTime: "15:55",
    duration: "1h 25m",
    fromCode: "MNL",
    toCode: "CEB",
    stops: "Non-stop",
    baggage: "30kg",
    status: "On time",
    price: "PHP 3,150",
    cabin: "Business",
    seatsLeft: 4,
  },
];

const MIN_PRICE = 1000;
const MAX_PRICE = 50000;

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

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [maxPrice, setMaxPrice] = useState(50000);
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

  const filteredFlights = useMemo(() => {
    return FLIGHTS.filter((flight) => {
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
  }, [directOnly, maxPrice, timeFilters]);

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
              {filteredFlights.length} flights found
            </p>
            {filteredFlights.map((flight) => (
              <FlightResultCard
                key={flight.id}
                flight={flight}
                queryString={queryString}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SearchResultsPage;
