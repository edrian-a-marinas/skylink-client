import { getBookingDetail, getBookingsForUser } from "@/api/bookings.api";
import { BOOKING_DATA } from "@/pages/BookingPagesFolder/bookingData";
import type { Booking, BookingDetail } from "@/types";

export type ManageBookingStatus = "upcoming" | "past" | "cancelled";

export type ManageBooking = {
  id: string;
  status: ManageBookingStatus;
  pnr: string;
  flightCode: string;
  fromCode: string;
  toCode: string;
  fromCity: string;
  toCity: string;
  departTime: string;
  arriveTime: string;
  date: string;
  duration: string;
  cabin: string;
  seat: string;
  passengers: string;
  meal: string;
  bookingDate: string;
  total: number;
  cancellationFee: number;
};

const bookingFromConfirmationId = BOOKING_DATA.pnr.toLowerCase();

const bookingFromConfirmation: ManageBooking = {
  id: bookingFromConfirmationId,
  status: "upcoming",
  pnr: BOOKING_DATA.pnr,
  flightCode: BOOKING_DATA.flightCode,
  fromCode: BOOKING_DATA.fromCode,
  toCode: BOOKING_DATA.toCode,
  fromCity: "Manila",
  toCity: "Cebu",
  departTime: BOOKING_DATA.departTime,
  arriveTime: BOOKING_DATA.arriveTime,
  date: "2026-05-15",
  duration: BOOKING_DATA.duration,
  cabin: BOOKING_DATA.cabin,
  seat: BOOKING_DATA.seat,
  passengers: "1 Adult",
  meal: "Standard",
  bookingDate: "2026-04-10",
  total: BOOKING_DATA.total,
  cancellationFee: 403,
};

export const MANAGE_BOOKINGS: ManageBooking[] = [
  bookingFromConfirmation,
  {
    id: "sk4421",
    status: "upcoming",
    pnr: "SK4421",
    flightCode: "SK 4421",
    fromCode: "MNL",
    toCode: "SIN",
    fromCity: "Manila",
    toCity: "Singapore",
    departTime: "08:00",
    arriveTime: "12:45",
    date: "2026-06-20",
    duration: "4h 45m",
    cabin: "Economy",
    seat: "12A",
    passengers: "1 Adult",
    meal: "Standard",
    bookingDate: "2026-05-01",
    total: 18780,
    cancellationFee: 1200,
  },
  {
    id: "sk1190",
    status: "past",
    pnr: "SK1190",
    flightCode: "SK 1190",
    fromCode: "MNL",
    toCode: "DVO",
    fromCity: "Manila",
    toCity: "Davao",
    departTime: "19:40",
    arriveTime: "21:10",
    date: "2026-03-12",
    duration: "1h 30m",
    cabin: "Economy",
    seat: "10C",
    passengers: "1 Adult",
    meal: "Standard",
    bookingDate: "2026-02-25",
    total: 2690,
    cancellationFee: 0,
  },
  {
    id: "sk9902",
    status: "cancelled",
    pnr: "SK9902",
    flightCode: "SK 9902",
    fromCode: "MNL",
    toCode: "CEB",
    fromCity: "Manila",
    toCity: "Cebu",
    departTime: "05:50",
    arriveTime: "07:15",
    date: "2026-01-05",
    duration: "1h 25m",
    cabin: "Economy",
    seat: "18F",
    passengers: "1 Adult",
    meal: "Standard",
    bookingDate: "2025-12-20",
    total: 1890,
    cancellationFee: 403,
  },
];

export const formatPeso = (value: number) =>
  `P${value.toLocaleString("en-US")}`;

export const getStatusLabel = (status: ManageBookingStatus) => {
  if (status === "past") {
    return "Past";
  }
  if (status === "cancelled") {
    return "Cancelled";
  }
  return "Upcoming";
};

export const getStatusBadgeClass = (status: ManageBookingStatus) => {
  if (status === "past") {
    return "bg-slate-100 text-slate-500";
  }
  if (status === "cancelled") {
    return "bg-rose-100 text-rose-600";
  }
  return "bg-[#EAF0F7] text-[#5D7FA7]";
};

export const getManageBookingsByStatus = (status: ManageBookingStatus) =>
  MANAGE_BOOKINGS.filter((booking) => booking.status === status);

export const getManageBookingById = (id?: string) =>
  MANAGE_BOOKINGS.find((booking) => booking.id === id);

const toManageBookingStatus = (
  status?: Booking["status"],
  departureTime?: string,
): ManageBookingStatus => {
  if (status === "cancelled" || status === "refunded") {
    return "cancelled";
  }

  if (departureTime) {
    const departureDate = new Date(departureTime);
    if (!Number.isNaN(departureDate.getTime()) && departureDate < new Date()) {
      return "past";
    }
  }

  return "upcoming";
};

const toTimeLabel = (isoValue?: string) => {
  if (!isoValue) {
    return "--:--";
  }

  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return isoValue.slice(11, 16) || isoValue;
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toDuration = (departureTime?: string, arrivalTime?: string) => {
  if (!departureTime || !arrivalTime) {
    return "--";
  }

  const departure = new Date(departureTime).getTime();
  const arrival = new Date(arrivalTime).getTime();
  if (
    Number.isNaN(departure) ||
    Number.isNaN(arrival) ||
    arrival <= departure
  ) {
    return "--";
  }

  const totalMinutes = Math.round((arrival - departure) / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
};

const passengerLabel = (booking: Booking | BookingDetail) => {
  const count = booking.passengers.length;
  if (count <= 0) {
    return "1 Adult";
  }

  return `${count} Adult${count === 1 ? "" : "s"}`;
};

const mealLabel = (booking: Booking | BookingDetail) =>
  booking.passengers[0]?.mealPreference
    ? booking.passengers[0].mealPreference.charAt(0).toUpperCase() +
      booking.passengers[0].mealPreference.slice(1)
    : "Standard";

const toManageBooking = (booking: Booking | BookingDetail): ManageBooking => {
  const flight = booking.flight;
  const origin = flight?.origin ?? BOOKING_DATA.fromCode;
  const destination = flight?.destination ?? BOOKING_DATA.toCode;
  const departureTime = flight?.departureTime ?? booking.createdAt;
  const arrivalTime =
    flight?.arrivalTime ?? booking.updatedAt ?? booking.createdAt;
  const bookingDate = booking.createdAt?.split("T")[0] ?? "2026-04-10";
  const tripDate = departureTime?.split("T")[0] ?? bookingDate;
  const total = booking.totalPrice || BOOKING_DATA.total;

  return {
    id: booking.id,
    status: toManageBookingStatus(booking.status, flight?.departureTime),
    pnr: booking.pnr ?? booking.id.toUpperCase(),
    flightCode: flight?.flightNumber ?? BOOKING_DATA.flightCode,
    fromCode: origin,
    toCode: destination,
    fromCity: origin,
    toCity: destination,
    departTime: toTimeLabel(departureTime),
    arriveTime: toTimeLabel(arrivalTime),
    date: tripDate,
    duration: toDuration(departureTime, arrivalTime),
    cabin: flight?.airline ? "Economy" : BOOKING_DATA.cabin,
    seat: booking.passengers[0]?.seatNumber ?? BOOKING_DATA.seat,
    passengers: passengerLabel(booking),
    meal: mealLabel(booking),
    bookingDate,
    total,
    cancellationFee: Math.round(total * 0.18),
  };
};

export const loadManageBookings = async (): Promise<ManageBooking[]> => {
  try {
    const bookings = await getBookingsForUser();
    if (bookings.length > 0) {
      return bookings.map(toManageBooking);
    }
  } catch {
    // Fall back to the bundled demo bookings below.
  }

  return MANAGE_BOOKINGS;
};

export const loadManageBookingById = async (
  id?: string,
): Promise<ManageBooking | null> => {
  if (!id) {
    return null;
  }

  try {
    const booking = await getBookingDetail(id);
    return booking
      ? toManageBooking(booking)
      : (getManageBookingById(id) ?? null);
  } catch {
    return getManageBookingById(id) ?? null;
  }
};
