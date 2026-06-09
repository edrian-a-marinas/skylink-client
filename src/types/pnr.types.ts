import type { BookingStatus } from "./booking.types";

export type PNRJourneyStatus =
  | "on_time"
  | "delayed"
  | "cancelled"
  | "boarding"
  | "landed"
  | "scheduled";

export interface PNRPassenger {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  passport_number: string;
  nationality: string;
}

export interface PNRItinerary {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
}

export interface PNRStatusResult {
  pnr: string;
  booking_id: string;
  booking_status: BookingStatus;
  journey_status: PNRJourneyStatus;
  itinerary: PNRItinerary[];
  passengers: PNRPassenger[];
  message?: string | null;
  updated_at: string;
}