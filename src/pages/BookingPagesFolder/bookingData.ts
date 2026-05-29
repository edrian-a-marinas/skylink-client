export const BOOKING_DATA = {
  flightCode: "",
  fromCode: "",
  toCode: "",
  departTime: "",
  arriveTime: "",
  duration: "",
  cabin: "",
  baggage: "",
  meal: "",
  passengerName: "",
  passengerNationality: "",
  passengerId: "",
  seat: "",
  pnr: "",
  baseFare: 0,
  taxes: 0,
  total: 0,
};

export type BookingData = typeof BOOKING_DATA;

export const loadBookingData = async (): Promise<BookingData> => BOOKING_DATA;

export const formatCurrency = (value: number) =>
  `PHP ${value.toLocaleString("en-US")}`;
