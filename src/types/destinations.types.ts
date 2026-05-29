export interface Airport {
  id: number;
  iata_code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export interface Aircraft {
  id: number;
  model: string;
  total_seats: number;
  registration: string;
}

export interface SeatClass {
  id: number;
  name: string;
}

export interface CreateAirportPayload {
  iata_code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export interface UpdateAirportPayload {
  name?: string;
  city?: string;
  country?: string;
  timezone?: string;
}

export interface CreateAircraftPayload {
  model: string;
  total_seats: number;
  registration: string;
}

export interface UpdateAircraftPayload {
  model?: string;
  total_seats?: number;
  registration?: string;
}

export interface CreateSeatClassPayload {
  name: string;
}

export interface UpdateSeatClassPayload {
  name?: string;
}