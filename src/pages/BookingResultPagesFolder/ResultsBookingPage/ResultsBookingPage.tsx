import { useCallback, useMemo, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import useBookingFlowStore from "@/store/useBookingFlowStore";
import FlightDetailCard, {
  type FlightDetail,
} from "./components/FlightDetailCard";
import PriceSummaryCard from "./components/PriceSummaryCard";
import FareRulesCard, { type FareRule } from "./components/FareRulesCard";
import AuthGateModal from "./components/AuthGateModal";
import { getFlightById } from "@/api/flights.api";
import type { Flight } from "@/types";
import useAsyncValue from "@/hooks/useAsyncValue";

type FlightSummary = FlightDetail & {
  price: string;
  seatsLeft?: number;
};

const FARE_RULES: FareRule[] = [
  {
    label: "Cancellation",
    value:
      "Fully refundable if canceled within 24 hours of booking; non-refundable thereafter.",
  },
  {
    label: "Date Change",
    value: "PHP 750 fee + fare difference",
  },
  {
    label: "Name Change",
    value: "Not permitted",
  },
  {
    label: "Baggage",
    value: "20kg checked baggage included",
  },
  {
    label: "Seat Selection",
    value: "Free standard seat; premium seat with fee",
  },
  {
    label: "Meal",
    value: "Standard meal included on flights over 2 hours",
  },
];

type LocationState = {
  flight?: FlightSummary;
};

function mapFlightToSummary(flight: Flight): FlightSummary {
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

  const summary: FlightSummary = {
    id: flight.id,
    airline: flight.airline ?? "SkyLink",
    airlineCode: (flight.airline ?? "SK").slice(0, 2).toUpperCase(),
    flightNo: flight.flightNumber,
    aircraft: flight.cabinClass === "business" ? "Airbus A321" : "Airbus A320",
    fromCode: flight.origin,
    toCode: flight.destination,
    departTime: departure.toISOString().slice(11, 16),
    arriveTime: arrival.toISOString().slice(11, 16),
    duration: `${hours}h ${minutes.toString().padStart(2, "0")}m`,
    status:
      flight.status === "on_time"
        ? "On Time"
        : flight.status === "boarding"
          ? "Boarding"
          : flight.status === "delayed"
            ? "Delayed"
            : flight.status === "cancelled"
              ? "Cancelled"
              : "Scheduled",
    baggage: `${flight.baggageAllowanceKg ?? 20}kg`,
    cabin:
      flight.cabinClass === "business"
        ? "Business"
        : flight.cabinClass === "first"
          ? "First"
          : "Economy",
    price: `PHP ${Math.round(flight.price).toLocaleString("en-US")}`,
  };

  if (typeof flight.seatsAvailable === "number") {
    summary.seatsLeft = flight.seatsAvailable;
  }

  return summary;
}

function parsePrice(value: string) {
  return Number(value.replace(/[^0-9]/g, ""));
}

function formatCurrency(value: number) {
  return `PHP ${value.toLocaleString("en-US")}`;
}

const ResultsBookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { startFlow, setPricing } = useBookingFlowStore();
  const searchSuffix = location.search ?? "";
  const searchResultsLink = `${ROUTES.SEARCH_RESULTS}${searchSuffix}`;
  const locationState = location.state as LocationState | null;
  const selectedFlight = locationState?.flight;

  const loader = useCallback(async () => {
    if (!id) return [];
    const flight = await getFlightById(id);
    if (!flight) return [];
    return [mapFlightToSummary(flight)];
  }, [id]);

  const { data: loadedFlights, isLoading } = useAsyncValue(loader, ["flight-detail-pool", id]);
  const flightPool = loadedFlights ?? [];

  const flight = useMemo(() => {
    if (selectedFlight) {
      return selectedFlight;
    }
    return flightPool.find((item) => item.id === id) ?? flightPool[0];
  }, [flightPool, id, selectedFlight]);

  if (isLoading && !selectedFlight) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#496B92] border-t-transparent" />
      </main>
    );
  }

  if (!flight) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">Flight Not Found</h2>
          <p className="mt-2 text-slate-500">The requested flight detail is not available.</p>
          <Link to={ROUTES.HOME} className="mt-4 inline-block text-blue-600 font-bold hover:underline">
            Go back to search
          </Link>
        </div>
      </main>
    );
  }

  const totalValue = parsePrice(flight.price || "0");
  const baseValue = Math.round(totalValue * 0.78);
  const taxesValue = totalValue - baseValue;
  const totalLabel = formatCurrency(totalValue);
  const baseLabel = formatCurrency(baseValue);
  const taxesLabel = formatCurrency(taxesValue);

  const handleBook = () => {
    if (!flight) return;
    const nextPath = `${ROUTES.BOOKING_PASSENGER_DETAILS}${searchSuffix}`;
    if (isAuthenticated) {
      startFlow(flight.id);
      setPricing({
        baseFare: baseValue,
        taxes: taxesValue,
        fees: 0,
        addOns: [],
        total: totalValue,
      });
      navigate(nextPath);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      <section className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
          <Link to={searchResultsLink} className="hover:text-slate-700">
            Search Results
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">Flight Detail</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <FlightDetailCard flight={flight} />
            <FareRulesCard rules={FARE_RULES} />
          </div>
          <PriceSummaryCard
            cabin={flight.cabin}
            baseFare={baseLabel}
            taxes={taxesLabel}
            total={totalLabel}
            onBook={handleBook}
          />
        </div>
      </section>

      <AuthGateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        continueTo={`${ROUTES.BOOKING_PASSENGER_DETAILS}${searchSuffix}`}
      />
    </main>
  );
};

export default ResultsBookingPage;
