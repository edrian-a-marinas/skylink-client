import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { colors, typography } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { CiSearch, CiClock2 } from "react-icons/ci";
import { HiChevronRight } from "react-icons/hi2";
import { getPromotions } from "@/api/promotions.api";
import { getPublicAirports } from "@/api/destinations.api";
import { searchFlights } from "@/api/flights.api";
import type { Promotion } from "@/types/promotion.types";
import { Compass, MapPin, Tag } from "lucide-react";

// ─── Derived types ────────────────────────────────────────────────────────────

type Destination = {
  id: string;
  code: string;
  name: string;
  location: string;
  duration: string;
  price: string;
  bgClass: string;
  image: string;
};

type Deal = {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  badge: string;
  badgeClass: string;
  validUntil: string;
  image: string;
};

// ─── Cards ────────────────────────────────────────────────────────────────────

function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <Link
      to={`/explore/destination/${dest.code}`}
      className="relative h-55 rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.06)] w-full text-left hover:shadow-md transition-shadow cursor-pointer"
    >
      {dest.image ? (
        <img
          src={dest.image}
          alt={dest.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 ${dest.bgClass}`} />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-primary-100/75 to-transparent" />
      <div className="absolute bottom-3 left-3">
        <p className={`${typography.label.md.bold} text-white`}>{dest.name}</p>
        <p className={`${typography.paragraph.xs.medium} text-white/75 mt-0.5`}>
          {dest.location} · {dest.duration}
        </p>
        <p className={`${typography.label.sm.semiBold} text-white/90 mt-1`}>
          {dest.price}
        </p>
      </div>
    </Link>
  );
}

function DealCard({ deal, promo }: { deal: Deal; promo: Promotion }) {
  return (
    <Link
      to={ROUTES.EXPLORE_PROMO_DETAIL.replace(":id", deal.id)}
      state={{ deal: promo }}
      className="bg-bg-page border border-tertiary-30 rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.04)] text-left w-full hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="relative h-32.5 bg-tertiary-20">
        {deal.image && (
          <img
            src={deal.image}
            alt={deal.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <span
          className={`absolute top-2 left-2 bg-danger-60 text-white ${typography.label.xs.bold} px-2 py-0.5 rounded-full`}
        >
          {deal.discount}
        </span>
        <span
          className={`absolute top-2 right-2 ${deal.badgeClass} text-white ${typography.label.xs.semiBold} px-2 py-0.5 rounded-full`}
        >
          {deal.badge}
        </span>
      </div>
      <div className="p-4">
        <p className={`${typography.label.md.bold} ${colors.text.primary}`}>
          {deal.title}
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span
            className={`${typography.heading.h3.bold} font-extrabold text-primary-60`}
          >
            {deal.price}
          </span>
          <span
            className={`${typography.paragraph.sm.medium} ${colors.text.secondary} line-through`}
          >
            {deal.originalPrice}
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 mt-2 ${colors.text.secondary}`}
        >
          <CiClock2 size={11} className="shrink-0" />
          <span className={typography.paragraph.xs.medium}>
            {deal.validUntil}
          </span>
        </div>
      </div>
    </Link>
  );
}

function DestinationCardSkeleton() {
  return (
    <div className="relative h-55 rounded-[14px] bg-slate-200 animate-pulse w-full" />
  );
}

function DealCardSkeleton() {
  return (
    <div className="bg-bg-page border border-tertiary-30 rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.04)] w-full animate-pulse">
      <div className="h-32.5 bg-slate-200 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="flex items-center gap-2 mt-2">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-1/4" />
        </div>
        <div className="h-3 bg-slate-200 rounded w-1/2 mt-2" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ExplorePage = () => {
  const [search, setSearch] = useState("");
  const { data: promotions = [], isLoading: promosLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => getPromotions().then(r => r || []),
    staleTime: 30 * 60 * 1000,
  });
  const { data: flights = [], isLoading: flightsLoading } = useQuery({
    queryKey: ["flights-search"],
    queryFn: () => searchFlights().then(r => r || []),
    staleTime: 30 * 60 * 1000,
  });
  const { data: airports = [], isLoading: airportsLoading } = useQuery({
    queryKey: ["public-airports"],
    queryFn: () => getPublicAirports().then(r => r || []),
    staleTime: 30 * 60 * 1000,
  });
  const isLoading = promosLoading || flightsLoading || airportsLoading;

  const destinations = useMemo(() => {
    const seen = new Set<string>();
    const dests: Destination[] = [];
    (flights || []).forEach((flight) => {
      if (flight.destination && !seen.has(flight.destination)) {
        seen.add(flight.destination);
        const airport = airports.find((a) => a.iata_code === flight.destination); // <-- use airport image
        dests.push({
          id: flight.id,
          code: flight.destination,
          name: flight.destinationCity || flight.destination,
          location: "Philippines",
          duration: "1h 20m",
          price: `From ₱${(flight.price || 0).toLocaleString()}`,
          bgClass: "bg-primary-60",
          image: airport?.image_url ?? flight.imageUrl ?? "", // <-- airport image first
        });
      }
    });

    const query = search.trim().toLowerCase();
    if (!query) return dests;
    return dests.filter((destination) =>
      `${destination.name} ${destination.location} ${destination.price}`
        .toLowerCase()
        .includes(query),
    );
  }, [flights, search]);

  const deals = useMemo(() => {
    const query = search.trim().toLowerCase();
    const allDeals: Deal[] = (promotions || []).map((promo) => {
      const sale = Number(promo.sale_price) || 0;
      const original = Number(promo.original_price) || 1; // avoid div by zero
      const discount = Math.round(((original - sale) / original) * 100);

      return {
        id: promo.id,
        title: promo.title || "Special Deal",
        description: promo.title || "",
        price: `₱${sale.toLocaleString()}`,
        originalPrice: `₱${original.toLocaleString()}`,
        discount: `${discount}% OFF`,
        badge: (promo.badge_text || promo.badge_type || "PROMO").toUpperCase(),
        badgeClass:
          promo.badge_type === "hot"
            ? "bg-rose-500"
            : promo.badge_type === "limited"
              ? "bg-amber-500"
              : promo.badge_type === "new"
                ? "bg-emerald-600"
                : "bg-[#496B92]",
        validUntil: promo.valid_until || "Limited Time",
        image: promo.image_url ?? "",
      };
    });

    if (!query) return allDeals;
    return allDeals.filter((deal) =>
      `${deal.title} ${deal.price} ${deal.originalPrice} ${deal.badge}`
        .toLowerCase()
        .includes(query),
    );
  }, [promotions, search]);

  return (
    <div className="bg-bg-surface min-h-screen">
      {/* Hero */}
      <section
        className="flex flex-col items-center gap-4 px-4 py-16"
        style={{
          background: "linear-gradient(167deg, #16202c 0%, #3a516d 100%)",
        }}
      >
        <h1
          className={`${typography.heading.h1.bold} md:text-display-3 text-text-static-light text-center`}
        >
          Explore the World with SkyLink
        </h1>
        <p
          className={`${typography.paragraph.md.normal} text-white/70 text-center`}
        >
          Discover popular destinations, exclusive deals, and flexible fare
          options.
        </p>
        <div className="bg-white flex items-center gap-2 px-4 rounded-[14px] h-12 w-full max-w-125 mt-2">
          <CiSearch size={18} className="text-text-tertiary shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations..."
            className={`flex-1 bg-transparent ${typography.paragraph.md.normal} ${colors.text.primary} outline-none placeholder:text-text-tertiary`}
          />
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto flex max-w-282.75 flex-col gap-12 px-6 py-10">
        {isLoading ? (
          <>
            {/* Popular Destinations Skeleton */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={20} className="shrink-0 text-primary-60" />
                <h2 className={`${typography.heading.h3.bold} ${colors.text.primary}`}>
                  Popular Destinations
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <DestinationCardSkeleton />
                <DestinationCardSkeleton />
                <DestinationCardSkeleton />
                <DestinationCardSkeleton />
              </div>
            </section>

            {/* Best Deals Skeleton */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Tag size={20} className="shrink-0 text-primary-60" />
                  <h2 className={`${typography.heading.h3.bold} ${colors.text.primary}`}>
                    Best Deals
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DealCardSkeleton />
                <DealCardSkeleton />
                <DealCardSkeleton />
              </div>
            </section>
          </>
        ) : destinations.length === 0 && deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm animate-fade-in my-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-6">
              <Compass className="h-10 w-10 text-[#496B92] animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Destinations or Deals Found</h3>
            <p className="text-sm text-slate-500 max-w-md mb-8 leading-relaxed">
              We couldn't find any results matching "<span className="font-semibold text-slate-700">{search}</span>". Please check your spelling or try searching for another city, country, or promo category.
            </p>
            <button
              onClick={() => setSearch("")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#496B92] hover:bg-[#16202c] text-white px-6 py-3 font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              Clear Search Query
            </button>
          </div>
        ) : (
          <>
            {/* Popular Destinations */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <MapPin
                  size={20}
                  className="shrink-0 text-primary-60"
                />
                <h2
                  className={`${typography.heading.h3.bold} ${colors.text.primary}`}
                >
                  Popular Destinations
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {destinations.length > 0 ? (
                  destinations.map((dest) => (
                    <DestinationCard key={dest.id} dest={dest} />
                  ))
                ) : (
                  <div className="col-span-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center animate-fade-in">
                    <MapPin className="h-8 w-8 text-slate-300 mb-3" />
                    <p className="text-sm font-semibold text-slate-700">No Destinations Found</p>
                    <p className="text-xs text-slate-400 mt-1">There are no popular travel destinations matching your query.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Best Deals */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Tag
                    size={20}
                    className="shrink-0 text-primary-60"
                  />
                  <h2
                    className={`${typography.heading.h3.bold} ${colors.text.primary}`}
                  >
                    Best Deals
                  </h2>
                </div>
                <Link
                  to={ROUTES.EXPLORE_PROMOS}
                  className={`${typography.label.sm.semiBold} ${colors.text.link} flex items-center gap-1 cursor-pointer`}
                >
                  See all{" "}
                  <HiChevronRight
                    size={16}
                    strokeWidth={1}
                    className="shrink-0 text-primary-60"
                  />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deals.length > 0 ? (
                  deals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      promo={promotions.find((p) => p.id === deal.id)!}
                    />
                  ))
                ) : (
                  <div className="col-span-3 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center animate-fade-in">
                    <Tag className="h-8 w-8 text-slate-300 mb-3" />
                    <p className="text-sm font-semibold text-slate-700">No Active Deals Found</p>
                    <p className="text-xs text-slate-400 mt-1">There are no active flight promotions or discount deals matching your query.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
