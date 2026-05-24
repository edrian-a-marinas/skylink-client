import { CheckCircle2, Clock, Plane, Wifi, Luggage } from "lucide-react";

export type FlightDetail = {
  id: string;
  airline: string;
  airlineCode: string;
  flightNo: string;
  aircraft: string;
  fromCode: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  status: string;
  baggage: string;
  cabin: string;
};

const FlightDetailCard = ({ flight }: { flight: FlightDetail }) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5D7FA7] text-sm font-semibold text-white">
            {flight.airlineCode}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {flight.airline}
            </p>
            <p className="text-xs text-slate-500">
              {flight.flightNo} | {flight.aircraft}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 size={14} />
          {flight.status}
        </span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div>
          <p className="text-2xl font-semibold text-slate-900">
            {flight.fromCode}
          </p>
          <p className="text-sm font-semibold text-slate-700">
            {flight.departTime}
          </p>
          <p className="text-xs text-slate-500">MNL Airport</p>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs text-slate-500">{flight.duration}</p>
          <Plane size={16} className="text-emerald-600" />
          <p className="text-xs font-semibold text-emerald-600">Non-stop</p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-semibold text-slate-900">
            {flight.toCode}
          </p>
          <p className="text-sm font-semibold text-slate-700">
            {flight.arriveTime}
          </p>
          <p className="text-xs text-slate-500">CEB Airport</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
          <Luggage size={12} /> {flight.baggage} baggage
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
          <Wifi size={12} /> Wi-Fi onboard
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
          <Clock size={12} /> {flight.duration}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF1F8] px-3 py-1 text-[#5D7FA7]">
          {flight.cabin}
        </span>
      </div>
    </section>
  );
};

export default FlightDetailCard;
