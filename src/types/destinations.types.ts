export interface Airport {
  id: number;
  iata_code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  about?: string | null;
  highlights?: string[] | null;
  best_time?: string | null;
  image_url?: string | null;
}

export interface Aircraft {
  id: number;
  model: string;
  total_seats: number;
  registration: string;
  seats?: Seat[];
}

export interface SeatClass {
  id: number;
  name: string;
}

export interface Seat {
  id: number;
  aircraft_id: number;
  seat_number: string;
  seat_class_id: number;
  seat_class?: SeatClass;
}

export interface SeatConfiguration {
  seat_class_id: number;
  quantity: number;
}

export interface CreateSeatPayload {
  seat_number: string;
  seat_class_id: number;
}

export interface CreateAirportPayload {
  iata_code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  about?: string | null;
  highlights?: string[] | null;
  best_time?: string | null;
  image_url?: string | null;
}
export interface UpdateAirportPayload {
  name?: string;
  city?: string;
  country?: string;
  timezone?: string;
  about?: string | null;
  highlights?: string[] | null;
  best_time?: string | null;
  image_url?: string | null;
}

export interface UpdateAirportPayload {
  name?: string;
  city?: string;
  country?: string;
  timezone?: string;
}

export interface CreateAircraftPayload {
  model: string;
  registration: string;
  seat_configurations: SeatConfiguration[];
}

export interface UpdateAircraftPayload {
  model?: string;
  registration?: string;
}

export interface CreateSeatClassPayload {
  name: string;
}

export interface UpdateSeatClassPayload {
  name?: string;
}