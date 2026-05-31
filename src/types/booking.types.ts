import type { FlightSegment } from "./flight.types";
import type { Payment, PaymentStatus } from "./payment.types";

export type BookingStatus =
  | "created"
  | "pending"
  | "payment_pending"
  | "confirmed"
  | "issued"
  | "pending_reschedule"
  | "rescheduled"
  | "pending_cancellation"
  | "cancelled"
  | "refunded"
  | "expired"
  | "boarded"
  | "completed";

export type MealPreference =
  | "standard"
  | "vegetarian"
  | "vegan"
  | "halal"
  | "kosher"
  | "child";

export interface Passenger {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  passport?: string;
  nationality?: string;
  seatNumber?: string;
  mealPreference?: MealPreference;
}

export interface AddOn {
  code: string;
  label: string;
  amount: number;
  quantity?: number;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  pnr?: string;
  passengers: Passenger[];
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt?: string;
  // Nested flight object for UI display
  flight?: {
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    airline?: string;
  };
}

export interface BookingModification {
  id: string;
  type: "reschedule" | "passenger_update" | "cancellation" | "addon_change";
  reason?: string;
  status: "pending" | "completed" | "rejected";
  createdAt: string;
}

export interface RefundDetail {
  amount: number;
  status: "queued" | "processing" | "completed" | "failed";
  estimatedDays?: string;
}

export interface BookingDetail extends Booking {
  itinerary: FlightSegment[];
  contactEmail?: string;
  contactPhone?: string;
  baseFare?: number;
  taxes?: number;
  fees?: number;
  addOns?: AddOn[];
  payment?: Payment | null;
  modificationHistory?: BookingModification[];
  refund?: RefundDetail;
}

export interface CancellationRequest {
  reason: string;
  refundMethod?: "original" | "bank_transfer" | "wallet";
}

export interface RescheduleRequest {
  newFlightId: string;
  reason: string;
}
