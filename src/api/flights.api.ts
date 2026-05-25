import axiosClient from "./axiosClient";
import { handleApiError } from "./api.helpers";
import type { Flight, FlightSearchParams } from "@/types";

// Helper to map backend data to frontend Flight type
const mapBackendFlight = (f: any): Flight => ({
  id: f.id,
  flightNumber: f.flight_number,
  origin: f.origin_airport?.iata_code || f.origin,
  destination: f.destination_airport?.iata_code || f.destination,
  departureTime: f.departure_time,
  arrivalTime: f.arrival_time,
  status: f.status,
  price: f.seat_pricing?.find((p: any) => p.seat_class?.name === "economy")?.price / 100 || f.price || 0,
  seatsAvailable: f.seat_pricing?.reduce((acc: number, p: any) => acc + (p.available_seats || 0), 0) || f.seatsAvailable,
  totalSeats: f.seat_pricing?.reduce((acc: number, p: any) => acc + (p.total_seats || 0), 0) || f.totalSeats,
  airline: f.airline || "SkyLink",
  cabinClass: f.cabin_class || "economy",
  imageUrl: f.image_url || "",
});

// Helper to map frontend data to backend payload
const mapFrontendToBackend = (payload: Partial<Flight>) => {
  const AIRPORT_MAP: Record<string, number> = { MNL: 1, CEB: 2, DVO: 3, ILO: 4, BCD: 5 };
  
  const mapped = {
    flight_number: payload.flightNumber,
    origin_airport_id: AIRPORT_MAP[payload.origin?.toUpperCase() || ""] || 1,
    destination_airport_id: AIRPORT_MAP[payload.destination?.toUpperCase() || ""] || 2,
    departure_time: payload.departureTime,
    arrival_time: payload.arrivalTime,
    status: payload.status,
    aircraft_id: 1, // Default aircraft
    image_url: payload.imageUrl, // The field you added to the database
    imageUrl: payload.imageUrl,  // Sending camelCase too just in case
    seat_pricing: [
      { seat_class_id: 1, total_seats: payload.totalSeats || 153, available_seats: payload.seatsAvailable || 153, price: (payload.price || 0) * 100 },
    ]
  };

  console.log("Sending to backend:", mapped);
  return mapped;
};

export async function searchFlights(
  params: FlightSearchParams = {},
): Promise<Flight[]> {
  try {
    const res = await axiosClient.get("/flights", { params });
    const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    return items.map(mapBackendFlight);
  } catch (err) {
    handleApiError(err);
  }
}

export async function getFlightById(id: string): Promise<Flight> {
  try {
    const res = await axiosClient.get(`/flights/${id}`);
    return mapBackendFlight(res.data);
  } catch (err) {
    handleApiError(err);
  }
}

export async function createFlight(payload: Partial<Flight>): Promise<Flight> {
  try {
    const backendPayload = mapFrontendToBackend(payload);
    const res = await axiosClient.post("/flights", backendPayload);
    return mapBackendFlight(res.data);
  } catch (err) {
    handleApiError(err);
  }
}

export async function updateFlight(
  id: string,
  payload: Partial<Flight>,
): Promise<Flight> {
  try {
    const backendPayload = mapFrontendToBackend(payload);
    const res = await axiosClient.put(`/flights/${id}`, backendPayload);
    return mapBackendFlight(res.data);
  } catch (err) {
    handleApiError(err);
  }
}

export async function deleteFlight(id: string): Promise<void> {
  try {
    await axiosClient.delete(`/flights/${id}`);
  } catch (err) {
    handleApiError(err);
  }
}
