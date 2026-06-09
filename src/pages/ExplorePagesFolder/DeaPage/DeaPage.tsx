import { useCallback } from "react";
import { ArrowLeft, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { searchFlights } from "@/api/flights.api";
import type { Promotion } from "@/types/promotion.types";
import useAsyncValue from "@/hooks/useAsyncValue";
import { PROMO_TERMS } from "../PromosPage/constants_promotions";

type DealState = {
  deal?: Promotion;
};

const DeaPage = () => {
  const location = useLocation();
  const passedDeal = (location.state as DealState | null)?.deal;

  const { id } = useParams<{ id: string }>();

  const loader = useCallback(async (): Promise<{ deal: Promotion; routes: { from: string; to: string; label: string }[] } | null> => {
    let deal = passedDeal;
    if (!deal && id) {
      const { getPromotionById } = await import("@/api/promotions.api");
      deal = await getPromotionById(id);
    }
    if (!deal) return null;
    const code = deal.destination_code;
    if (!code) return { deal, routes: [] };

    const [toFlights, fromFlights] = await Promise.all([
      searchFlights({ destination: code }),
      searchFlights({ origin: code }),
    ]);

    const seen = new Set<string>();
    const routes: { from: string; to: string; label: string }[] = [];

    for (const f of [...toFlights, ...fromFlights]) {
      const key = `${f.origin}-${f.destination}`;
      if (!seen.has(key)) {
        seen.add(key);
        routes.push({ from: f.origin, to: f.destination, label: `${f.origin} → ${f.destination}` });
      }
    }

    return { deal, routes };
  }, [passedDeal, id]);

  const { data, isLoading } = useAsyncValue(loader);
  const deal = data?.deal;
  const routes = data?.routes ?? [];

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7]">
        <Loader2 className="animate-spin text-[#5D7FA7]" size={32} />
      </main>
    );
  }

  if (!deal) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center gap-4 bg-[#F3F5F7]">
        <p className="text-slate-500">Deal not found.</p>
        <Link to={ROUTES.EXPLORE_PROMOS} className="text-sm font-semibold text-[#5D7FA7] hover:underline">
          Back to Promos
        </Link>
      </main>
    );
  }

  const primaryRoute = routes[0];
  const searchTo = primaryRoute
    ? `${ROUTES.SEARCH_RESULTS}?from=${primaryRoute.from}&to=${primaryRoute.to}`
    : ROUTES.SEARCH_RESULTS;

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#243247]">
        {deal.image_url && (
          <img
            src={deal.image_url}
            alt={deal.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/40 to-transparent" />
        <div className="relative mx-auto flex h-55 max-w-6xl flex-col justify-end px-6 pb-6 text-white">
          <Link
            to={ROUTES.EXPLORE_PROMOS}
            className="absolute left-6 top-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 transition hover:bg-white/25"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
            {deal.discount_text && (
              <span className="rounded-full bg-rose-500 px-2 py-1">{deal.discount_text}</span>
            )}
            {deal.badge_text && (
              <span className="rounded-full bg-emerald-600 px-2 py-1">{deal.badge_text}</span>
            )}
          </div>
          <h1 className="mt-3 text-2xl font-semibold md:text-3xl">{deal.title}</h1>
        </div>
      </section>

      <section className="px-6 pb-16 pt-6">
        <div className="mx-auto grid w-full max-w-6xl gap-6">
          {/* About */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">About This Deal</h2>
            <p className="mt-2 text-sm text-slate-600">
              {deal.destination_city
                ? `Explore ${deal.destination_city} at unbeatable prices. Book now and save big on your next getaway!`
                : "Limited seats at unbeatable prices. Book now and save!"}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-600">
              <Calendar size={14} />
              Valid until {new Date(deal.valid_until).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>

          {/* Routes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Available Routes</h2>
            {routes.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">No routes available for this deal.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {routes.map((entry) => (
                  <div
                    key={entry.label}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{entry.label}</p>
                      <p className="text-xs text-slate-500">
                        Valid until {new Date(deal.valid_until).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#5D7FA7]">
                          PHP {Number(deal.sale_price).toLocaleString("en-US")}
                        </p>
                        <p className="text-[10px] uppercase text-slate-400">One way</p>
                      </div>
                      <Link
                        to={`${ROUTES.SEARCH_RESULTS}?from=${entry.from}&to=${entry.to}`}
                        className="rounded-lg bg-[#5D7FA7] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#4E6B8D]"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Terms & Conditions</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {PROMO_TERMS.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-slate-200 bg-[#F9F4EE] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Lowest fare from Manila
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#5D7FA7]">
              ₱{Number(deal.sale_price).toLocaleString("en-US")}
            </p>
            <p className="mt-1 text-xs text-slate-500">One-way - Economy</p>
            <Link
              to={searchTo}
              className="mt-4 block w-full rounded-lg bg-[#5D7FA7] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#4E6B8D]"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DeaPage;