export type CabinClass = "economy" | "premium_economy" | "business" | "first";

export type FlightStatus =
  | "scheduled"
  | "boarding"
  | "on_time"
  | "delayed"
  | "cancelled"
  | "landed";

export interface FlightSegment {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status?: FlightStatus;
  airline?: string;
  cabinClass?: CabinClass;
}

export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  airline?: string;
  seatsAvailable?: number;
  totalSeats?: number;
  status?: FlightStatus;
  cabinClass?: CabinClass;
  baggageAllowanceKg?: number;
  stops?: number;
  imageUrl?: string;
}

export interface FlightSearchParams {
  origin?: string;
  destination?: string;
  date?: string;
  passengers?: number;
  cabinClass?: CabinClass;
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
  airline?: string;
  stops?: number;
  departureWindowStart?: string;
  departureWindowEnd?: string;
}
