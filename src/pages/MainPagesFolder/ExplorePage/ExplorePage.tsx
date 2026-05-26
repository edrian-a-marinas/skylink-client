import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { colors, typography } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { CiSearch } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { RiPriceTagLine } from "react-icons/ri";
import { HiChevronRight } from "react-icons/hi2";
import { useFlights } from "@/hooks/useFlights";
import type { Flight } from "@/types";

// ─── Derived types ────────────────────────────────────────────────────────────

type Destination = {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: string;
  bgClass: string;
  image?: string;
};

type Deal = {
  id: string;
  title: string;
  price: string;
  originalPrice: string;
  discount: string;
  badge: string;
  badgeClass: string;
  validUntil: string;
  image?: string;
};

// ─── BG fallback palette (used when no imageUrl) ─────────────────────────────

const BG_CLASSES = [
  "bg-primary-60",
  "bg-success-70",
  "bg-info-50",
  "bg-primary-80",
  "bg-primary-70",
  "bg-secondary-60",
  "bg-secondary-70",
  "bg-success-60",
];

// ─── Mappers: Flight → Destination / Deal ────────────────────────────────────

function flightToDestination(flight: Flight, index: number): Destination {
  const duration = (() => {
    try {
      const dep = new Date(flight.departureTime);
      const arr = new Date(flight.arrivalTime);
      const mins = Math.round((arr.getTime() - dep.getTime()) / 60000);
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}h ${String(m).padStart(2, "0")}m`;
    } catch {
      return "—";
    }
  })();

  return {
    id: flight.id,
    name: flight.destinationCity ?? flight.destination,
    location: flight.destinationCountry ?? "Unknown",
    duration,
    price: `From ₱${flight.price.toLocaleString()}`,
    bgClass: BG_CLASSES[index % BG_CLASSES.length],
    ...(flight.imageUrl ? { image: flight.imageUrl } : {}),
  };
}

function flightToDeal(flight: Flight): Deal {
  const hash = flight.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const discountPct = 40 + (hash % 20);
  const originalPrice = Math.round(flight.price / (1 - discountPct / 100));
  const isIntl = flight.originCountry !== flight.destinationCountry;

  const badge = isIntl ? "International" : flight.price < 2000 ? "Flash" : "Weekend";
  const badgeClass = isIntl
    ? "bg-success-60"
    : flight.price < 2000
      ? "bg-warning-60"
      : "bg-success-60";

  const valid = new Date();
  valid.setDate(valid.getDate() + 30);
  const validUntil = `Valid until ${valid.toLocaleDateString("en-PH", { month: "short", day: "numeric" })}`;

  const destName = flight.destinationCity ?? flight.destination;

  return {
    id: flight.id,
    title: `${badge === "Flash" ? "Flash Sale: " : badge === "Weekend" ? "Weekend Escape: " : "Fly to "}${destName}${isIntl ? ` from ₱${flight.price.toLocaleString()}` : ""}`,
    price: `₱${flight.price.toLocaleString()}`,
    originalPrice: `₱${originalPrice.toLocaleString()}`,
    discount: `-${discountPct}% OFF`,
    badge,
    badgeClass,
    validUntil,
    ...(flight.imageUrl ? { image: flight.imageUrl } : {}),
  };
}

// ─── Cards ────────────────────────────────────────────────────────────────────

function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <Link
      to={ROUTES.EXPLORE_DESTINATION}
      className="relative h-[220px] rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.06)] w-full text-left hover:shadow-md transition-shadow"
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
      <div className="absolute inset-0 bg-gradient-to-t from-primary-100/75 to-transparent" />
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

function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link
      to={ROUTES.EXPLORE_PROMO_DETAIL}
      className="bg-bg-page border border-tertiary-30 rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.04)] text-left w-full hover:shadow-md transition-shadow"
    >
      <div className="relative h-[130px] bg-tertiary-20">
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
          <span className={`${typography.heading.h3.bold} font-extrabold text-primary-60`}>
            {deal.price}
          </span>
          <span className={`${typography.paragraph.sm.medium} ${colors.text.secondary} line-through`}>
            {deal.originalPrice}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 mt-2 ${colors.text.secondary}`}>
          <CiClock2 size={11} className="shrink-0" />
          <span className={typography.paragraph.xs.medium}>{deal.validUntil}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton loaders ─────────────────────────────────────────────────────────

function DestinationSkeleton() {
  return <div className="h-[220px] rounded-[14px] bg-tertiary-20 animate-pulse" />;
}

function DealSkeleton() {
  return <div className="rounded-[14px] bg-tertiary-20 animate-pulse h-[230px]" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ExplorePage = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading: loading, error: hookError } = useFlights();
  const flights = data ?? [];
  const error = hookError ? "Couldn't load flights. Please try again." : null;

  const filteredFlights = useMemo(() => {
    if (!search.trim()) return flights;
    const q = search.toLowerCase();
    return flights.filter((f) =>
      f.destination.toLowerCase().includes(q) ||
      f.origin.toLowerCase().includes(q) ||
      f.destinationCity?.toLowerCase().includes(q) ||
      f.destinationCountry?.toLowerCase().includes(q) ||
      f.originCity?.toLowerCase().includes(q)
    );
  }, [flights, search]);

  // One card per destination — keep lowest price per city
 const destinations = useMemo<Destination[]>(() => {
  const seen = new Map<string, Flight>();
  for (const f of filteredFlights) {
    const existing = seen.get(f.destination);
    if (!existing || f.price < existing.price) seen.set(f.destination, f);
  }
  const deduped = Array.from(seen.values()).map((f, i) => flightToDestination(f, i));

  // If deduped gives us 8+, cap at 8. If less, show all
  return deduped.slice(0, 8);
}, [filteredFlights]);
  // Up to 6 deals, sorted cheapest first
  const deals = useMemo<Deal[]>(() => {
    return [...filteredFlights]
      .sort((a, b) => a.price - b.price)
      .slice(0, 6)
      .map(flightToDeal);
  }, [filteredFlights]);

  return (
    <div className="bg-bg-surface min-h-screen">
      {/* Hero */}
      <section
        className="flex flex-col items-center gap-4 px-4 py-16"
        style={{ background: "linear-gradient(167deg, #16202c 0%, #3a516d 100%)" }}
      >
        <h1 className={`${typography.heading.h1.bold} md:text-display-3 text-text-static-light text-center`}>
          Explore the World with SkyLink
        </h1>
        <p className={`${typography.paragraph.md.normal} text-white/70 text-center`}>
          Discover popular destinations, exclusive deals, and flexible fare options.
        </p>
        <div className="bg-white flex items-center gap-2 px-4 rounded-[14px] h-12 w-full max-w-[500px] mt-2">
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
 <div className="max-w-[1131px] mx-auto px-6 py-10 flex flex-col gap-12">
        {error && (
          <div className="rounded-[10px] bg-danger-10 border border-danger-30 px-4 py-3 text-danger-70 text-sm">
            {error}
          </div>
        )}

        {/* Popular Destinations */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <FiMapPin size={20} strokeWidth={2} className="shrink-0 text-primary-60" />
            <h2 className={`${typography.heading.h3.bold} ${colors.text.primary}`}>
              Popular Destinations
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <DestinationSkeleton key={i} />)
              : destinations.length > 0
                ? destinations.map((dest) => <DestinationCard key={dest.id} dest={dest} />)
                : !error && (
                    <p className={`col-span-4 ${typography.paragraph.md.normal} ${colors.text.secondary}`}>
                      No destinations found.
                    </p>
                  )}
          </div>
        </section>

        {/* Best Deals */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <RiPriceTagLine size={20} strokeWidth={0.5} className="shrink-0 text-primary-60" />
              <h2 className={`${typography.heading.h3.bold} ${colors.text.primary}`}>
                Best Deals
              </h2>
            </div>
            <Link
              to={ROUTES.EXPLORE_PROMOS}
              className={`${typography.label.sm.semiBold} ${colors.text.link} flex items-center gap-1`}
            >
              See all{" "}
              <HiChevronRight size={16} strokeWidth={1} className="shrink-0 text-primary-60" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <DealSkeleton key={i} />)
              : deals.length > 0
                ? deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
                : !error && (
                    <p className={`col-span-3 ${typography.paragraph.md.normal} ${colors.text.secondary}`}>
                      No deals available.
                    </p>
                  )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExplorePage;