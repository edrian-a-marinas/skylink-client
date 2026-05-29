import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { colors, typography } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { CiSearch, CiClock2 } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { RiPriceTagLine } from "react-icons/ri";
import { HiChevronRight } from "react-icons/hi2";
import { getPromotions } from "@/api/promotions.api";
import { searchFlights } from "@/api/flights.api";
import type { Flight } from "@/types";
import type { Promotion } from "@/types/promotion.types";

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
      to={ROUTES.EXPLORE_DESTINATION}
      state={{ destination: dest }}
      className="relative h-55 rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.06)] w-full text-left hover:shadow-md transition-shadow"
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

function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link
      to={ROUTES.EXPLORE_PROMO_DETAIL}
      state={{ deal }}
      className="bg-bg-page border border-tertiary-30 rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.04)] text-left w-full hover:shadow-md transition-shadow"
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

// ─── Page ─────────────────────────────────────────────────────────────────────

const ExplorePage = () => {
  const [search, setSearch] = useState("");
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promosData, flightsData] = await Promise.all([
          getPromotions(),
          searchFlights(),
        ]);
        setPromotions(promosData || []);
        setFlights(flightsData || []);
      } catch (err) {
        console.error("Failed to fetch explore page data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const destinations = useMemo(() => {
    const seen = new Set<string>();
    const dests: Destination[] = [];
    (flights || []).forEach((flight) => {
      if (flight.destination && !seen.has(flight.destination)) {
        seen.add(flight.destination);
        dests.push({
          id: flight.id,
          code: flight.destination,
          name: flight.destinationCity || flight.destination,
          location: "Philippines",
          duration: "1h 20m",
          price: `From ₱${(flight.price || 0).toLocaleString()}`,
          bgClass: "bg-primary-60",
          image: flight.imageUrl ?? "",
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
      const sale = promo.sale_price || 0;
      const original = promo.original_price || 1; // avoid div by zero
      const discount = Math.round(((original - sale) / original) * 100);

      return {
        id: promo.id,
        title: promo.title || "Special Deal",
        description: promo.title || "",
        price: `₱${sale.toLocaleString()}`,
        originalPrice: `₱${original.toLocaleString()}`,
        discount: `${discount}% OFF`,
        badge: (promo.category || "PROMO").toUpperCase(),
        badgeClass:
          promo.category === "flash"
            ? "bg-warning-60"
            : promo.category === "weekend"
              ? "bg-success-60"
              : "bg-primary-60",
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
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#496B92] border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Popular Destinations */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <FiMapPin
                  size={20}
                  strokeWidth={2}
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
                  <p
                    className={`col-span-4 ${typography.paragraph.md.normal} ${colors.text.secondary}`}
                  >
                    No destinations found.
                  </p>
                )}
              </div>
            </section>

            {/* Best Deals */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <RiPriceTagLine
                    size={20}
                    strokeWidth={0.5}
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
                  className={`${typography.label.sm.semiBold} ${colors.text.link} flex items-center gap-1`}
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
                  deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
                ) : (
                  <p
                    className={`col-span-3 ${typography.paragraph.md.normal} ${colors.text.secondary}`}
                  >
                    No deals available.
                  </p>
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
