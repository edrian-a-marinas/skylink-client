import { Link } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Plane } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const HIGHLIGHTS = [
  "Magellan's Cross",
  "Oslo's Whale Sharks",
  "Kawasan Falls",
  "Sinulog Festival",
];

const FLIGHTS = [
  {
    id: "SK 2191",
    time: "06:00 - 07:20",
    duration: "1h 20m",
    price: "PHP 1,890",
    cabin: "Economy",
  },
  {
    id: "SK 2193",
    time: "09:15 - 10:35",
    duration: "1h 20m",
    price: "PHP 2,350",
    cabin: "Economy",
  },
  {
    id: "SK 2201",
    time: "14:30 - 15:55",
    duration: "1h 25m",
    price: "PHP 3,150",
    cabin: "Business",
  },
];

const DestinationPage = () => {
  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      <section className="relative overflow-hidden bg-[#29384C]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />

        <div className="relative mx-auto flex h-[220px] max-w-6xl flex-col justify-end px-6 pb-6 text-white">
          <Link
            to={ROUTES.EXPLORE}
            className="absolute left-6 top-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 transition hover:bg-white/25"
          >
            <ArrowLeft size={14} />
            Back
          </Link>

          <div className="flex items-center gap-2 text-xs text-white/70">
            <MapPin size={14} />
            Philippines
          </div>
          <h1 className="mt-1 text-3xl font-semibold">Cebu</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-white/70">
            <span className="flex items-center gap-2">
              <Plane size={14} />
              1h 20m from Manila
            </span>
            <span>From PHP 1,890</span>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 pt-6">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                About Cebu
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Known as the "Queen City of the South," Cebu is a vibrant island
                paradise with pristine white-sand beaches, world-class diving,
                and rich cultural heritage.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Top Highlights
              </h2>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                {HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5D7FA7]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Next Available Flights
                </h2>
                <Link
                  to={ROUTES.SEARCH_RESULTS}
                  className="text-xs font-semibold text-[#5D7FA7] hover:text-[#4E6B8D]"
                >
                  See all flights
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {FLIGHTS.map((flight) => (
                  <div
                    key={flight.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5D7FA7] text-xs font-semibold text-white">
                        SK
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {flight.id}
                        </p>
                        <p className="text-xs text-slate-500">
                          {flight.time} - {flight.duration}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#5D7FA7]">
                        {flight.price}
                      </p>
                      <p className="text-xs text-slate-500">{flight.cabin}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Trip Info
              </h3>
              <div className="mt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <Clock size={14} className="text-[#5D7FA7]" />
                  <div>
                    <p className="font-semibold text-slate-700">
                      Flight Duration
                    </p>
                    <p>1h 20m from Manila</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-[#5D7FA7]" />
                  <div>
                    <p className="font-semibold text-slate-700">
                      Best Time to Visit
                    </p>
                    <p>November to May</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Plane size={14} className="text-[#5D7FA7]" />
                  <div>
                    <p className="font-semibold text-slate-700">Airport</p>
                    <p>CEB - Cebu</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#F9F4EE] p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Lowest fare from Manila
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#5D7FA7]">
                PHP 1,890
              </p>
              <p className="mt-1 text-xs text-slate-500">One-way - Economy</p>
              <Link
                to={ROUTES.BOOK}
                className="mt-4 block w-full rounded-lg bg-[#5D7FA7] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#4E6B8D]"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DestinationPage;
