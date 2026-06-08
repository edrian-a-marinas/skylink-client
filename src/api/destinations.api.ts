import axiosClient from "./axiosClient";
import type {
  Airport, Aircraft, SeatClass, Seat,
  CreateAirportPayload, UpdateAirportPayload,
  CreateAircraftPayload, UpdateAircraftPayload,
  CreateSeatClassPayload, UpdateSeatClassPayload,
  CreateSeatPayload,
} from "@/types/destinations.types";

const AIRPORTS = "/admin/airports";
const AIRCRAFT = "/admin/aircraft";
const SEAT_CLASSES = "/admin/seat-classes";

// ── Airports ──────────────────────────────────────────────────────────────────
export const getAirports = async (): Promise<Airport[]> => {
  const response = await axiosClient.get(AIRPORTS);
  return response.data;
};

export const createAirport = async (payload: CreateAirportPayload): Promise<Airport> => {
  const response = await axiosClient.post(AIRPORTS, payload);
  return response.data;
};

export const updateAirport = async (id: number, payload: UpdateAirportPayload): Promise<Airport> => {
  const response = await axiosClient.put(`${AIRPORTS}/${id}`, payload);
  return response.data;
};

export const deleteAirport = async (id: number): Promise<void> => {
  await axiosClient.delete(`${AIRPORTS}/${id}`);
};

// ── Aircraft ──────────────────────────────────────────────────────────────────
export const getAircraft = async (): Promise<Aircraft[]> => {
  const response = await axiosClient.get(AIRCRAFT);
  return response.data;
};

export const createAircraft = async (payload: CreateAircraftPayload): Promise<Aircraft> => {
  const response = await axiosClient.post(AIRCRAFT, payload);
  return response.data;
};

export const updateAircraft = async (id: number, payload: UpdateAircraftPayload): Promise<Aircraft> => {
  const response = await axiosClient.put(`${AIRCRAFT}/${id}`, payload);
  return response.data;
};

export const deleteAircraft = async (id: number): Promise<void> => {
  await axiosClient.delete(`${AIRCRAFT}/${id}`);
};

// ── Seat Management ──────────────────────────────────────────────────────────
export const getAircraftSeats = async (aircraftId: number): Promise<Seat[]> => {
  const response = await axiosClient.get(`${AIRCRAFT}/${aircraftId}/seats`);
  return response.data;
};

export const addAircraftSeats = async (aircraftId: number, payload: CreateSeatPayload[]): Promise<Seat[]> => {
  const response = await axiosClient.post(`${AIRCRAFT}/${aircraftId}/seats`, payload);
  return response.data;
};

export const deleteAircraftSeat = async (seatId: number): Promise<void> => {
  await axiosClient.delete(`${AIRCRAFT}/seats/${seatId}`);
};

// ── Seat Classes ──────────────────────────────────────────────────────────────
export const getSeatClasses = async (): Promise<SeatClass[]> => {
  const response = await axiosClient.get(SEAT_CLASSES);
  return response.data;
};

export const createSeatClass = async (payload: CreateSeatClassPayload): Promise<SeatClass> => {
  const response = await axiosClient.post(SEAT_CLASSES, payload);
  return response.data;
};

export const updateSeatClass = async (id: number, payload: UpdateSeatClassPayload): Promise<SeatClass> => {
  const response = await axiosClient.put(`${SEAT_CLASSES}/${id}`, payload);
  return response.data;
};

export const deleteSeatClass = async (id: number): Promise<void> => {
  await axiosClient.delete(`${SEAT_CLASSES}/${id}`);
};

// ── Public Airports (no auth) ─────────────────────────────────────────────────
export const getPublicAirports = async (): Promise<Airport[]> => {
  const response = await axiosClient.get("/admin/airports/public");
  return response.data;
};