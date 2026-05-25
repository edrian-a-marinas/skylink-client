export const BOOKING_DATA = {
  flightCode: "SK 2191",
  fromCode: "MNL",
  toCode: "CEB",
  departTime: "06:00",
  arriveTime: "07:20",
  duration: "1h 20m",
  cabin: "Economy",
  baggage: "20kg",
  passengerName: "Marco Gonzales",
  passengerNationality: "Filipino",
  passengerId: "1234567890",
  seat: "4B",
  pnr: "SK4950",
  baseFare: 1474,
  taxes: 416,
  total: 1890,
};

export const formatCurrency = (value: number) =>
  `PHP ${value.toLocaleString("en-US")}`;
