import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import FlightDetailCard, {
  type FlightDetail,
} from "./components/FlightDetailCard";
import PriceSummaryCard from "./components/PriceSummaryCard";
import FareRulesCard, { type FareRule } from "./components/FareRulesCard";
import AuthGateModal from "./components/AuthGateModal";

type FlightSummary = FlightDetail & {
  price: string;
  seatsLeft?: number;
};

const FLIGHTS: FlightSummary[] = [
  {
    id: "pa-2191",
    airline: "Philippine Airlines",
    airlineCode: "PA",
    flightNo: "SK 2191",
    aircraft: "Airbus A320",
    fromCode: "MNL",
    toCode: "CEB",
    departTime: "06:00",
    arriveTime: "07:20",
    duration: "1h 20m",
    status: "On Time",
    baggage: "20kg",
    cabin: "Economy",
    price: "PHP 1,890",
  },
  {
    id: "cp-2193",
    airline: "Cebu Pacific",
    airlineCode: "CP",
    flightNo: "CP 2193",
    aircraft: "Boeing 737-800",
    fromCode: "MNL",
    toCode: "CEB",
    departTime: "09:15",
    arriveTime: "10:35",
    duration: "1h 20m",
    status: "On Time",
    baggage: "20kg",
    cabin: "Economy",
    price: "PHP 2,350",
  },
  {
    id: "aa-2201",
    airline: "AirAsia",
    airlineCode: "AA",
    flightNo: "AA 2201",
    aircraft: "Airbus A321",
    fromCode: "MNL",
    toCode: "CEB",
    departTime: "14:30",
    arriveTime: "15:55",
    duration: "1h 25m",
    status: "On Time",
    baggage: "30kg",
    cabin: "Business",
    price: "PHP 3,150",
  },
];

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

function parsePrice(value: string) {
  return Number(value.replace(/[^0-9]/g, ""));
}

function formatCurrency(value: number) {
  return `PHP ${value.toLocaleString("en-US")}`;
}

const ResultsBookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchSuffix = location.search ?? "";
  const searchResultsLink = `${ROUTES.SEARCH_RESULTS}${searchSuffix}`;
  const locationState = location.state as LocationState | null;
  const selectedFlight = locationState?.flight;

  const flight = useMemo(() => {
    if (selectedFlight) {
      return selectedFlight;
    }
    return FLIGHTS.find((item) => item.id === id) ?? FLIGHTS[0];
  }, [id, selectedFlight]);

  const totalValue = parsePrice(flight.price || "") || 1890;
  const baseValue = Math.round(totalValue * 0.78);
  const taxesValue = totalValue - baseValue;
  const totalLabel = formatCurrency(totalValue);
  const baseLabel = formatCurrency(baseValue);
  const taxesLabel = formatCurrency(taxesValue);

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
            onBook={() => setIsModalOpen(true)}
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
