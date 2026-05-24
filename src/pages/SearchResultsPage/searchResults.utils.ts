import { ROUTES } from "@/constants/routes";
import type { CabinClass, Flight, FlightSearchParams } from "@/types";

// --- Constants ---

export const PRICE_FILTER_MIN = 1_000;
export const PRICE_FILTER_MAX = 50_000;
export const PRICE_FILTER_DEFAULT = PRICE_FILTER_MAX;

export const DEPARTURE_TIME_OPTIONS = [
  { id: "morning", label: "Morning (6AM–12PM)", startHour: 6, endHour: 12 },
  { id: "afternoon", label: "Afternoon (12PM–6PM)", startHour: 12, endHour: 18 },
  { id: "evening", label: "Evening (6PM+)", startHour: 18, endHour: 24 },
] as const;

export type DepartureTimeFilterId =
  (typeof DEPARTURE_TIME_OPTIONS)[number]["id"];

export const DEFAULT_SEARCH_CRITERIA = {
  origin: "Manila",
  originCode: "MNL",
  destination: "Cebu",
  destinationCode: "CEB",
  date: "2026-04-19",
  passengers: 1,
  cabinClass: "economy" as const,
};

/** Demo inventory aligned with the search-results mockup (MNL → CEB). */
export const MOCK_SEARCH_FLIGHTS: Flight[] = [
  {
    id: "pa-2191",
    flightNumber: "PA 2191",
    origin: "MNL",
    destination: "CEB",
    departureTime: "2026-04-19T06:00:00",
    arrivalTime: "2026-04-19T07:20:00",
    price: 1890,
    airline: "Philippine Airlines",
    seatsAvailable: 24,
    status: "on_time",
    cabinClass: "economy",
    baggageAllowanceKg: 20,
    stops: 0,
  },
  {
    id: "cp-1842",
    flightNumber: "CP 1842",
    origin: "MNL",
    destination: "CEB",
    departureTime: "2026-04-19T09:15:00",
    arrivalTime: "2026-04-19T10:40:00",
    price: 1650,
    airline: "Cebu Pacific",
    seatsAvailable: 18,
    status: "on_time",
    cabinClass: "economy",
    baggageAllowanceKg: 20,
    stops: 0,
  },
  {
    id: "ai-504",
    flightNumber: "AI 504",
    origin: "MNL",
    destination: "CEB",
    departureTime: "2026-04-19T15:00:00",
    arrivalTime: "2026-04-19T16:20:00",
    price: 1490,
    airline: "AirAsia",
    seatsAvailable: 4,
    status: "on_time",
    cabinClass: "economy",
    baggageAllowanceKg: 20,
    stops: 0,
  },
];

// --- Types ---

export type SearchCriteria = {
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  date: string;
  passengers: number;
  cabinClass: CabinClass;
};

export type SearchFiltersState = {
  maxPrice: number;
  directOnly: boolean;
  departureTimes: DepartureTimeFilterId[];
};

export type FlightDisplayMeta = {
  airlineName: string;
  airlineInitials: string;
  aircraft: string;
  durationLabel: string;
};

// --- API / display helpers ---

export function isBackendConfigured(): boolean {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl || typeof apiUrl !== "string") return false;
  if (apiUrl.includes("xxxx")) return false;
  try {
    const parsed = new URL(apiUrl);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const AIRCRAFT_BY_AIRLINE: Record<string, string> = {
  "Philippine Airlines": "Airbus A320",
  "Cebu Pacific": "Airbus A320",
  AirAsia: "Airbus A320neo",
};

const AIRLINE_INITIALS: Record<string, string> = {
  "Philippine Airlines": "PA",
  "Cebu Pacific": "CP",
  AirAsia: "AI",
};

const AIRPORT_DIRECTORY: Record<string, { city: string; code: string }> = {
  manila: { city: "Manila", code: "MNL" },
  mnl: { city: "Manila", code: "MNL" },
  cebu: { city: "Cebu", code: "CEB" },
  ceb: { city: "Cebu", code: "CEB" },
  davao: { city: "Davao", code: "DVO" },
  dvo: { city: "Davao", code: "DVO" },
  palawan: { city: "Palawan", code: "PPS" },
  pps: { city: "Puerto Princesa", code: "PPS" },
  boracay: { city: "Boracay", code: "KLO" },
  kalibo: { city: "Kalibo (Boracay)", code: "KLO" },
  klo: { city: "Kalibo (Boracay)", code: "KLO" },
  singapore: { city: "Singapore", code: "SIN" },
  sin: { city: "Singapore", code: "SIN" },
  "hong kong": { city: "Hong Kong", code: "HKG" },
  hkg: { city: "Hong Kong", code: "HKG" },
};

export function formatPhp(amount: number): string {
  return `₱${amount.toLocaleString("en-PH")}`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getDurationMinutes(departure: string, arrival: string): number {
  const start = new Date(departure).getTime();
  const end = new Date(arrival).getTime();
  return Math.max(Math.round((end - start) / 60_000), 0);
}

export function formatDuration(departure: string, arrival: string): string {
  const totalMinutes = getDurationMinutes(departure, arrival);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function getAirlineInitials(name?: string): string {
  if (!name) return "SL";
  if (AIRLINE_INITIALS[name]) return AIRLINE_INITIALS[name];
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getFlightDisplayMeta(flight: Flight): FlightDisplayMeta {
  const airlineName = flight.airline ?? "SkyLink";
  return {
    airlineName,
    airlineInitials: getAirlineInitials(airlineName),
    aircraft: AIRCRAFT_BY_AIRLINE[airlineName] ?? "Aircraft",
    durationLabel: formatDuration(flight.departureTime, flight.arrivalTime),
  };
}

export function resolveAirportFromInput(
  input: string,
  fallback: { city: string; code: string },
): { city: string; code: string } {
  const key = input.trim().toLowerCase();
  if (!key) return fallback;
  if (AIRPORT_DIRECTORY[key]) return AIRPORT_DIRECTORY[key];
  if (/^[a-z]{3}$/i.test(key)) {
    const match = Object.values(AIRPORT_DIRECTORY).find(
      (airport) => airport.code.toLowerCase() === key,
    );
    if (match) return match;
    return { city: key.toUpperCase(), code: key.toUpperCase() };
  }
  return { city: input.trim(), code: fallback.code };
}

export function mapUiCabinToApi(cabin: string): CabinClass {
  const normalized = cabin.trim().toLowerCase();
  if (normalized === "business") return "business";
  if (normalized === "first") return "first";
  if (normalized === "premium economy" || normalized === "premium_economy") {
    return "premium_economy";
  }
  return "economy";
}

export function formatCabinLabel(cabin: CabinClass): string {
  const labels: Record<CabinClass, string> = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First",
  };
  return labels[cabin];
}

export function buildSearchResultsPath(criteria: SearchCriteria): string {
  const query = buildResultsQueryString(criteria, {
    maxPrice: PRICE_FILTER_DEFAULT,
    directOnly: false,
    departureTimes: [],
  });
  return `${ROUTES.SEARCH_RESULTS}?${query}`;
}

export function parseSearchCriteriaFromParams(
  params: URLSearchParams,
  defaults: SearchCriteria,
): SearchCriteria {
  const cabin = params.get("cabinClass") as CabinClass | null;
  return {
    origin: params.get("origin") ?? defaults.origin,
    originCode: params.get("originCode") ?? defaults.originCode,
    destination: params.get("destination") ?? defaults.destination,
    destinationCode: params.get("destinationCode") ?? defaults.destinationCode,
    date: params.get("date") ?? defaults.date,
    passengers: Number(params.get("passengers") ?? defaults.passengers) || 1,
    cabinClass:
      cabin === "premium_economy" ||
      cabin === "business" ||
      cabin === "first" ||
      cabin === "economy"
        ? cabin
        : defaults.cabinClass,
  };
}

export function buildFlightSearchParams(
  criteria: SearchCriteria,
  filters: SearchFiltersState,
): FlightSearchParams {
  const params: FlightSearchParams = {
    origin: criteria.originCode,
    destination: criteria.destinationCode,
    date: criteria.date,
    passengers: criteria.passengers,
    cabinClass: criteria.cabinClass,
    maxPrice: filters.maxPrice,
  };
  if (filters.directOnly) params.stops = 0;
  const selectedWindows = DEPARTURE_TIME_OPTIONS.filter((option) =>
    filters.departureTimes.includes(option.id),
  );
  if (selectedWindows.length === 1) {
    const window = selectedWindows[0];
    params.departureWindowStart = `${String(window.startHour).padStart(2, "0")}:00`;
    params.departureWindowEnd = `${String(window.endHour).padStart(2, "0")}:00`;
  }
  return params;
}

function matchesDepartureWindow(
  departureTime: string,
  selected: DepartureTimeFilterId[],
): boolean {
  if (selected.length === 0) return true;
  const hour = new Date(departureTime).getHours();
  return selected.some((id) => {
    const option = DEPARTURE_TIME_OPTIONS.find((item) => item.id === id);
    if (!option) return false;
    return hour >= option.startHour && hour < option.endHour;
  });
}

export function applyClientFilters(
  flights: Flight[],
  filters: SearchFiltersState,
): Flight[] {
  return flights.filter((flight) => {
    if (flight.price > filters.maxPrice) return false;
    if (filters.directOnly && (flight.stops ?? 0) > 0) return false;
    if (!matchesDepartureWindow(flight.departureTime, filters.departureTimes)) {
      return false;
    }
    return true;
  });
}

export function buildResultsQueryString(
  criteria: SearchCriteria,
  filters: SearchFiltersState,
): string {
  const params = new URLSearchParams({
    origin: criteria.origin,
    originCode: criteria.originCode,
    destination: criteria.destination,
    destinationCode: criteria.destinationCode,
    date: criteria.date,
    passengers: String(criteria.passengers),
    cabinClass: criteria.cabinClass,
    maxPrice: String(filters.maxPrice),
    directOnly: String(filters.directOnly),
  });
  if (filters.departureTimes.length > 0) {
    params.set("departureTimes", filters.departureTimes.join(","));
  }
  return params.toString();
}

export function parseFiltersFromParams(
  params: URLSearchParams,
  defaultMaxPrice: number,
): SearchFiltersState {
  const departureRaw = params.get("departureTimes");
  const departureTimes = departureRaw
    ? (departureRaw.split(",").filter(Boolean) as DepartureTimeFilterId[])
    : [];
  return {
    maxPrice: Number(params.get("maxPrice") ?? defaultMaxPrice) || defaultMaxPrice,
    directOnly: params.get("directOnly") === "true",
    departureTimes,
  };
}
