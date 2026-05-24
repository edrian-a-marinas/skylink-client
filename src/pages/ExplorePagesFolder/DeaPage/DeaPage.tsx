import { ArrowLeft, Calendar, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const ROUTES_DATA = [
  {
    id: "MNL-DPS",
    route: "MNL - DPS",
    window: "August-September 2026",
    price: "PHP 6,200",
  },
  {
    id: "DPS-MNL",
    route: "DPS - MNL",
    window: "August-September 2026",
    price: "PHP 6,400",
  },
];

const TERMS = [
  "25kg baggage included.",
  "Meal included.",
  "Refundable with fee.",
];

const DeaPage = () => {
  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      <section className="relative overflow-hidden bg-[#243247]">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
          alt="Bali promo"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent" />

        <div className="relative mx-auto flex h-[220px] max-w-6xl flex-col justify-end px-6 pb-6 text-white">
          <Link
            to={ROUTES.EXPLORE_PROMOS}
            className="absolute left-6 top-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 transition hover:bg-white/25"
          >
            <ArrowLeft size={14} />
            Back
          </Link>

          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
            <span className="rounded-full bg-rose-500 px-2 py-1">-37% OFF</span>
            <span className="rounded-full bg-emerald-600 px-2 py-1">
              International Deal
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold md:text-3xl">
            Discover Bali from PHP 6,200
          </h1>
        </div>
      </section>

      <section className="px-6 pb-16 pt-6">
        <div className="mx-auto grid w-full max-w-6xl gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              About This Deal
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              The Island of the Gods awaits - book early and save!
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-600">
              <Calendar size={14} />
              Valid until July 15, 2026
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Available Routes
            </h2>
            <div className="mt-4 space-y-3">
              {ROUTES_DATA.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {entry.route}
                    </p>
                    <p className="text-xs text-slate-500">{entry.window}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#5D7FA7]">
                        {entry.price}
                      </p>
                      <p className="text-[10px] uppercase text-slate-400">
                        One way
                      </p>
                    </div>
                    <Link
                      to={ROUTES.BOOK}
                      className="rounded-lg bg-[#5D7FA7] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#4E6B8D]"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Terms & Conditions
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {TERMS.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DeaPage;
