import axiosClient from "./axiosClient";
import { handleApiError } from "./api.helpers";
import type { Flight, FlightSearchParams } from "@/types";

// Helper to map backend data to frontend Flight type
const mapBackendFlight = (f: any): Flight => {
  // Extract price from seat_pricing if available, looking for economy or just taking the first available price
  let extractedPrice = 0;
  if (f.seat_pricing && f.seat_pricing.length > 0) {
    const economyPricing = f.seat_pricing.find((p: any) => 
      p.seat_class?.name?.toLowerCase() === "economy" || p.seat_class_id === 1
    );
    // Use price from economyPricing if found, otherwise take from the first element
    extractedPrice = (economyPricing?.price || f.seat_pricing[0].price) / 100;
  }

  return {
    id: f.id,
    flightNumber: f.flight_number,
    origin: f.origin_airport?.iata_code || f.origin,
    destination: f.destination_airport?.iata_code || f.destination,
    originCity: f.origin_airport?.city || f.origin_airport?.name || null,       
    originCountry: f.origin_airport?.country || null,                           
    destinationCity: f.destination_airport?.city || f.destination_airport?.name || null,  
    destinationCountry: f.destination_airport?.country || null,                  
    departureTime: f.departure_time,
    arrivalTime: f.arrival_time,
    status: f.status,
    price: extractedPrice || f.price || f.base_price || 0,
    seatsAvailable: f.seat_pricing?.reduce((acc: number, p: any) => acc + (p.available_seats || 0), 0) || f.seatsAvailable,
    hasLowSeats: f.seat_pricing?.some((p: any) => p.available_seats < 10) ?? false,
    totalSeats: f.seat_pricing?.reduce((acc: number, p: any) => acc + (p.total_seats || 0), 0) || f.totalSeats,
    airline: f.airline || "SkyLink",
    cabinClass: f.cabin_class || "economy",
    imageUrl: f.image_url || "",
  };
};

// Helper to map frontend data to backend payload
// Cache airports to avoid repeated fetches
let _airportCache: Record<string, number> | null = null;
async function getAirportMap(): Promise<Record<string, number>> {
  if (_airportCache) return _airportCache;
  try {
    const res = await axiosClient.get("/admin/airports/public");
    _airportCache = Object.fromEntries(
      res.data.map((a: any) => [a.iata_code, a.id])
    );
    return _airportCache!;
  } catch {
    return {};
  }
}

// Helper to map frontend data to backend payload
const mapFrontendToBackend = async (payload: any) => {
  const AIRPORT_MAP = await getAirportMap();
  
  const mapped = {
    flight_number: payload.flightNumber,
    origin_airport_id: AIRPORT_MAP[payload.origin?.toUpperCase() || ""],
    destination_airport_id: AIRPORT_MAP[payload.destination?.toUpperCase() || ""],
    departure_time: payload.departureTime,
    arrival_time: payload.arrivalTime,
    status: payload.status,
    airline: payload.airline,
    aircraft_id: payload.aircraftId,
    image_url: payload.imageUrl,
    seat_pricing: payload.seat_pricing.map((p: any) => ({
      seat_class_id: p.seat_class_id,
      price: Math.round(Number(p.price) * 100) // Price is in cents in backend
    }))
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
    return []; 
  }
}

export async function getFlightById(id: string): Promise<Flight | null> { 
  try {
    const res = await axiosClient.get(`/flights/${id}`);
    return mapBackendFlight(res.data);
  } catch (err) {
    handleApiError(err);
    return null;
  }
}

export async function createFlight(payload: Partial<Flight>): Promise<Flight | null> { 
  try {
    const backendPayload = await mapFrontendToBackend(payload);
    const res = await axiosClient.post("/flights", backendPayload);
    return mapBackendFlight(res.data);
  } catch (err) {
    handleApiError(err);
    return null;
  }
}

export async function updateFlight(
  id: string,
  payload: Partial<Flight>,
): Promise<Flight | null> { 
  try {
    const backendPayload = await mapFrontendToBackend(payload);
    const res = await axiosClient.put(`/flights/${id}`, backendPayload);
    return mapBackendFlight(res.data);
  } catch (err) {
    handleApiError(err);
    return null;
  }
}

export async function deleteFlight(id: string): Promise<void> {
  try {
    await axiosClient.delete(`/flights/${id}`);
  } catch (err) { 
    handleApiError(err);
  }
}
