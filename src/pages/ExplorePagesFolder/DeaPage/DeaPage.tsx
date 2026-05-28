import { useCallback } from "react";
import { ArrowLeft, Calendar, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import useAsyncValue from "@/hooks/useAsyncValue";

type DealRoute = {
  id: string;
  route: string;
  window: string;
  price: string;
};

type DealCard = {
  id: string;
  title: string;
  description: string;
  price: string;
  oldPrice: string;
  discount: string;
  validUntil: string;
  image: string;
  badge?: string;
};

type DealState = {
  deal?: DealCard;
};

type DealProfile = {
  about: string;
  routes: DealRoute[];
  terms: string[];
};

const DEFAULT_DEAL: DealCard = {
  id: "deal-bali",
  title: "Discover Bali from ₱6,200",
  description: "The Island of the Gods awaits - book early and save!",
  price: "₱6,200",
  oldPrice: "₱9,800",
  discount: "-36% OFF",
  validUntil: "Valid until Jul 15",
  image: "/Images/BookPage/Discover Bali from 6200.png",
  badge: "Weekend",
};

const DEAL_PROFILES: Record<string, DealProfile> = {
  CEBU: {
    about:
      "Limited seats at unbeatable prices. Book now and save big on your next getaway!",
    routes: [
      {
        id: "MNL-CEB",
        route: "MNL - CEB",
        window: "April-May 2026",
        price: "PHP 1,490",
      },
      {
        id: "CEB-MNL",
        route: "CEB - MNL",
        window: "April-May 2026",
        price: "PHP 1,690",
      },
    ],
    terms: ["25kg baggage included.", "Meal included.", "Refundable with fee."],
  },
  PALAWAN: {
    about:
      "Discover Palawan's pristine beaches with our special weekend rates.",
    routes: [
      {
        id: "MNL-PPS",
        route: "MNL - PPS",
        window: "May-June 2026",
        price: "PHP 2,199",
      },
      {
        id: "PPS-MNL",
        route: "PPS - MNL",
        window: "May-June 2026",
        price: "PHP 2,399",
      },
    ],
    terms: ["25kg baggage included.", "Meal included.", "Refundable with fee."],
  },
  SINGAPORE: {
    about:
      "Experience the Lion City at amazing prices. Perfect for a long weekend getaway.",
    routes: [
      {
        id: "MNL-SIN",
        route: "MNL - SIN",
        window: "May-June 2026",
        price: "PHP 7,500",
      },
      {
        id: "SIN-MNL",
        route: "SIN - MNL",
        window: "May-June 2026",
        price: "PHP 7,900",
      },
    ],
    terms: ["25kg baggage included.", "Meal included.", "Refundable with fee."],
  },
  TOKYO: {
    about:
      "Upgrade your Tokyo experience with our premium Business Class deal.",
    routes: [
      {
        id: "MNL-TYO",
        route: "MNL - TYO",
        window: "June-July 2026",
        price: "PHP 28,900",
      },
      {
        id: "TYO-MNL",
        route: "TYO - MNL",
        window: "June-July 2026",
        price: "PHP 29,800",
      },
    ],
    terms: [
      "Priority boarding included.",
      "Meal included.",
      "Refundable with fee.",
    ],
  },
  BORACAY: {
    about: "White beaches, crystal waters - now at summer sale prices.",
    routes: [
      {
        id: "MNL-KLO",
        route: "MNL - KLO",
        window: "April 2026",
        price: "PHP 1,650",
      },
      {
        id: "KLO-MNL",
        route: "KLO - MNL",
        window: "April 2026",
        price: "PHP 1,850",
      },
    ],
    terms: ["25kg baggage included.", "Meal included.", "Refundable with fee."],
  },
  BALI: {
    about: "The Island of the Gods awaits - book early and save!",
    routes: [
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
    ],
    terms: ["25kg baggage included.", "Meal included.", "Refundable with fee."],
  },
};

function getDealProfileKey(title: string) {
  const normalized = title.toLowerCase();
  if (normalized.includes("cebu")) return "CEBU";
  if (normalized.includes("palawan")) return "PALAWAN";
  if (normalized.includes("singapore")) return "SINGAPORE";
  if (normalized.includes("tokyo")) return "TOKYO";
  if (normalized.includes("boracay")) return "BORACAY";
  return "BALI";
}

const DeaPage = () => {
  const location = useLocation();
  const selectedDeal =
    (location.state as DealState | null)?.deal ?? DEFAULT_DEAL;
  const dealProfile = DEAL_PROFILES[getDealProfileKey(selectedDeal.title)];

  const loader = useCallback(
    async () => dealProfile.routes,
    [dealProfile.routes],
  );
  const { data: routesData } = useAsyncValue(loader);
  const availableRoutes = routesData ?? dealProfile.routes;

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      <section className="relative overflow-hidden bg-[#243247]">
        <img
          src={selectedDeal.image}
          alt={selectedDeal.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
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
            <span className="rounded-full bg-rose-500 px-2 py-1">
              {selectedDeal.discount}
            </span>
            <span className="rounded-full bg-emerald-600 px-2 py-1">
              {selectedDeal.badge ?? "Deal"}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold md:text-3xl">
            {selectedDeal.title}
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
              {selectedDeal.description || dealProfile.about}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-600">
              <Calendar size={14} />
              {selectedDeal.validUntil}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Available Routes
            </h2>
            <div className="mt-4 space-y-3">
              {availableRoutes.map((entry) => (
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
              {dealProfile.terms.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#F9F4EE] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Lowest fare from Manila
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#5D7FA7]">
              {selectedDeal.price}
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
      </section>
    </main>
  );
};

export default DeaPage;
