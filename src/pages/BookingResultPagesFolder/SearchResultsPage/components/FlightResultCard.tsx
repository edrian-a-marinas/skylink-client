import { CheckCircle2, Luggage, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export type FlightResult = {
  id: string;
  airline: string;
  airlineCode: string;
  flightNo: string;
  aircraft: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  fromCode: string;
  toCode: string;
  stops: string;
  baggage: string;
  status: string;
  price: string;
  cabin: string;
  seatsLeft?: number;
};

type FlightResultCardProps = {
  flight: FlightResult;
  queryString?: string;
};

const FlightResultCard = ({ flight, queryString }: FlightResultCardProps) => {
  const detailLink = ROUTES.FLIGHT_DETAIL.replace(":id", flight.id);
  const detailHref = queryString ? `${detailLink}?${queryString}` : detailLink;
  const showSeats =
    typeof flight.seatsLeft === "number" && flight.seatsLeft > 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5D7FA7] text-sm font-semibold text-white">
            {flight.airlineCode}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {flight.airline}
            </p>
            <p className="text-xs text-slate-500">
              {flight.flightNo} - {flight.aircraft}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900">
              {flight.departTime}
            </p>
            <p className="text-xs text-slate-400">{flight.fromCode}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-[11px] text-slate-500">{flight.duration}</p>
            <Plane size={14} className="text-emerald-600" />
            <p className="text-[11px] font-semibold text-emerald-600">
              {flight.stops}
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900">
              {flight.arriveTime}
            </p>
            <p className="text-xs text-slate-400">{flight.toCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <Luggage size={14} className="text-slate-400" />
          {flight.baggage}
          <span className="flex items-center gap-1 text-emerald-600">
            <CheckCircle2 size={14} />
            {flight.status}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
          <div className="text-right">
            <p className="text-lg font-semibold text-[#5D7FA7]">
              {flight.price}
            </p>
            <p className="text-xs text-slate-500">{flight.cabin} / pax</p>
            {showSeats ? (
              <p className="text-[11px] font-semibold text-rose-500">
                {flight.seatsLeft} seats left!
              </p>
            ) : null}
          </div>
          <Link
            to={detailHref}
            className="rounded-lg bg-[#5D7FA7] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#4E6B8D]"
          >
            Select
          </Link>
        </div>
      </div>
    </article>
  );
};

export default FlightResultCard;
