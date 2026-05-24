import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { colors, typography } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import { CiLocationOn } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import DatePicker from "@/pages/_shared/components/ui/DatePicker";
import TripTypePill, { type TripType } from "./components/TripTypePill";
import PassengerSelector, {
  type CabinClass,
  type PassengerCounts,
} from "./components/PassengerSelector";

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

type Route = {
  id: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  price: string;
  duration: string;
};

type Destination = {
  id: string;
  city: string;
  startingFrom: string;
  bgClass: string;
  image?: string;
};

type AirportOption = {
  code: string;
  city: string;
  airport: string;
  country: string;
};

const DEALS: Deal[] = [
  {
    id: "1",
    title: "Flash Sale: Manila–Cebu",
    price: "₱1,490",
    originalPrice: "₱3,500",
    discount: "-57%",
    badge: "Flash",
    badgeClass: "bg-warning-60",
    validUntil: "Until April 30",
  },
  {
    id: "2",
    title: "Weekend Escape: Manila–Palawan",
    price: "₱2,199",
    originalPrice: "₱4,200",
    discount: "-48%",
    badge: "Weekend",
    badgeClass: "bg-success-60",
    validUntil: "Until May 15",
  },
  {
    id: "3",
    title: "Fly to Singapore from ₱7,500",
    price: "₱7,500",
    originalPrice: "₱12,500",
    discount: "-40%",
    badge: "International",
    badgeClass: "bg-success-60",
    validUntil: "Until May 31",
  },
];

const POPULAR_ROUTES: Route[] = [
  {
    id: "1",
    from: "Manila",
    fromCode: "MNL",
    to: "Cebu",
    toCode: "CEB",
    price: "₱1,890",
    duration: "1h 20m",
  },
  {
    id: "2",
    from: "Manila",
    fromCode: "MNL",
    to: "Davao",
    toCode: "DVO",
    price: "₱1,750",
    duration: "1h 45m",
  },
  {
    id: "3",
    from: "Manila",
    fromCode: "MNL",
    to: "Palawan",
    toCode: "PPS",
    price: "₱2,499",
    duration: "1h 20m",
  },
  {
    id: "4",
    from: "Manila",
    fromCode: "MNL",
    to: "Boracay",
    toCode: "KLO",
    price: "₱1,650",
    duration: "1h 10m",
  },
  {
    id: "5",
    from: "Manila",
    fromCode: "MNL",
    to: "Singapore",
    toCode: "SIN",
    price: "₱7,500",
    duration: "4h 00m",
  },
  {
    id: "6",
    from: "Manila",
    fromCode: "MNL",
    to: "Hong Kong",
    toCode: "HKG",
    price: "₱11,200",
    duration: "2h 30m",
  },
];

const DESTINATIONS: Destination[] = [
  {
    id: "1",
    city: "Cebu",
    startingFrom: "From ₱1,890",
    bgClass: "bg-primary-60",
  },
  {
    id: "2",
    city: "Puerto Princesa",
    startingFrom: "From ₱2,499",
    bgClass: "bg-success-70",
  },
  {
    id: "3",
    city: "Kalibo (Boracay)",
    startingFrom: "From ₱1,650",
    bgClass: "bg-info-50",
  },
  {
    id: "4",
    city: "Davao",
    startingFrom: "From ₱1,750",
    bgClass: "bg-primary-80",
  },
];

const AIRPORTS: AirportOption[] = [
  {
    code: "MNL",
    city: "Manila",
    airport: "Ninoy Aquino International Airport",
    country: "Philippines",
  },
  {
    code: "CEB",
    city: "Cebu",
    airport: "Mactan-Cebu International Airport",
    country: "Philippines",
  },
  {
    code: "DVO",
    city: "Davao",
    airport: "Francisco Bangoy International Airport",
    country: "Philippines",
  },
  {
    code: "PPS",
    city: "Palawan",
    airport: "Puerto Princesa International Airport",
    country: "Philippines",
  },
  {
    code: "KLO",
    city: "Kalibo",
    airport: "Kalibo International Airport",
    country: "Philippines",
  },
  {
    code: "SIN",
    city: "Singapore",
    airport: "Changi International Airport",
    country: "Singapore",
  },
  {
    code: "HKG",
    city: "Hong Kong",
    airport: "Hong Kong International Airport",
    country: "Hong Kong",
  },
];

function IconChevronRight() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
      />
    </svg>
  );
}

function filterAirports(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return AIRPORTS;
  }
  return AIRPORTS.filter((airport) =>
    [airport.city, airport.code, airport.airport, airport.country]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}

function getCode(value: string) {
  const match = value.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : "";
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link
      to={ROUTES.EXPLORE_PROMO_DETAIL}
      className="bg-bg-page border border-tertiary-30 rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.04)] text-left w-full hover:shadow-md transition-shadow"
    >
      <div className="relative h-[140px] bg-tertiary-20">
        {deal.image ? (
          <img
            src={deal.image}
            alt={deal.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-tertiary-20" />
        )}
        <span
          className={`absolute top-3 left-3 bg-danger-60 text-text-on-primary ${typography.label.xs.bold} px-2 py-1 rounded-full`}
        >
          {deal.discount}
        </span>
        <span
          className={`absolute bottom-3 right-3 ${deal.badgeClass} text-text-on-primary ${typography.label.xs.semiBold} px-2 py-1 rounded-full`}
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

function RouteCard({ route }: { route: Route }) {
  return (
    <Link
      to={ROUTES.SEARCH_RESULTS}
      className="bg-bg-page border border-tertiary-30 rounded-[14px] p-4 flex items-center justify-between hover:shadow-sm transition-shadow w-full text-left"
    >
      <div className="flex items-center gap-3">
        <div>
          <p
            className={`${typography.label.sm.semiBold} ${colors.text.primary}`}
          >
            {route.from}
          </p>
          <p
            className={`mt-2 ${typography.paragraph.xs.medium} ${colors.text.secondary}`}
          >
            {route.fromCode}
          </p>
        </div>
        <svg
          className={`w-[15px] h-[15px] shrink-0 ${colors.text.tertiary}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <div>
          <p
            className={`${typography.label.sm.semiBold} ${colors.text.primary}`}
          >
            {route.to}
          </p>
          <p
            className={`mt-2 ${typography.paragraph.xs.medium} ${colors.text.secondary}`}
          >
            {route.toCode}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`${typography.label.md.bold} text-primary-60`}>
          {route.price}
        </p>
        <p
          className={`mt-2 ${typography.paragraph.xs.medium} ${colors.text.secondary}`}
        >
          {route.duration}
        </p>
      </div>
    </Link>
  );
}

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      to={ROUTES.EXPLORE_DESTINATION}
      className="relative h-[200px] rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.06)] w-full text-left hover:shadow-md transition-shadow"
    >
      {destination.image ? (
        <img
          src={destination.image}
          alt={destination.city}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 ${destination.bgClass}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-100/75 to-transparent" />
      <div className="absolute bottom-3 left-3">
        <p className={`${typography.label.md.bold} text-text-static-light`}>
          {destination.city}
        </p>
        <p className={`mt-2 ${typography.paragraph.xs.medium} text-white/80`}>
          {destination.startingFrom}
        </p>
      </div>
    </Link>
  );
}

function SectionHeader({
  title,
  linkLabel,
  to,
}: {
  title: string;
  linkLabel: string;
  to?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className={`${typography.heading.h3.bold} ${colors.text.primary}`}>
        {title}
      </h2>
      {to ? (
        <Link
          to={to}
          className={`${typography.label.sm.semiBold} ${colors.text.link} flex items-center gap-1 transition-colors`}
        >
          {linkLabel}
          <IconChevronRight />
        </Link>
      ) : (
        <button
          type="button"
          className={`${typography.label.sm.semiBold} ${colors.text.link} flex items-center gap-1 transition-colors`}
        >
          {linkLabel}
          <IconChevronRight />
        </button>
      )}
    </div>
  );
}

const BookingLandingPage = () => {
  const [tripType, setTripType] = useState<TripType>("one-way");
  const [fromQuery, setFromQuery] = useState("Manila (MNL)");
  const [toQuery, setToQuery] = useState("Cebu (CEB)");
  const [dateValue, setDateValue] = useState("");
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [cabinClass, setCabinClass] = useState<CabinClass>("Economy");
  const [openField, setOpenField] = useState<"from" | "to" | null>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (fromRef.current?.contains(event.target as Node)) {
        return;
      }
      if (toRef.current?.contains(event.target as Node)) {
        return;
      }
      setOpenField(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedFromCode = getCode(fromQuery);
  const selectedToCode = getCode(toQuery);
  const fromOptions = filterAirports(fromQuery).filter(
    (option) => option.code !== selectedToCode,
  );
  const toOptions = filterAirports(toQuery).filter(
    (option) => option.code !== selectedFromCode,
  );

  const selectFrom = (option: AirportOption) => {
    setFromQuery(`${option.city} (${option.code})`);
    setOpenField(null);
  };

  const selectTo = (option: AirportOption) => {
    setToQuery(`${option.city} (${option.code})`);
    setOpenField(null);
  };

  const totalPassengers =
    passengers.adults + passengers.children + passengers.infants;
  const searchHref = (() => {
    const params = new URLSearchParams();
    params.set("from", fromQuery);
    params.set("to", toQuery);
    if (dateValue) {
      params.set("date", dateValue);
    }
    params.set("pax", String(totalPassengers));
    params.set("cabin", cabinClass);
    return `${ROUTES.SEARCH_RESULTS}?${params.toString()}`;
  })();

  return (
    <div className="bg-bg-surface min-h-screen">
      {/* Hero */}
      <section className="relative pb-5">
        <div className="absolute inset-0 bg-primary-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-100/65 via-primary-100/50 to-primary-100/30" />

        <div className="relative z-10 flex flex-col items-center gap-2 pt-8 px-4">
          <h1
            className={`${typography.heading.h1.bold} md:text-display-2 text-text-static-light text-center`}
          >
            Where do you want to fly?
          </h1>
          <p
            className={`${typography.paragraph.md.normal} md:text-para-lg text-white/80 text-center`}
          >
            Great fares, simple booking, seamless travel — only on SkyLink.
          </p>
        </div>

        {/* Search card */}
        <div className="relative z-10 mx-auto mb-16 mt-8 w-full max-w-[800px] px-4">
          <div className="bg-bg-page rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.08)] p-6 flex flex-col gap-4">
            {/* Trip type pills */}
            <div className="flex gap-2">
              <TripTypePill tripType={tripType} setTripType={setTripType} />
            </div>

            {/* From / To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div ref={fromRef} className="relative">
                <div
                  className={`flex items-center gap-2 ${colors.surface.input} border border-tertiary-30 rounded-[10px] px-4 h-14 cursor-text`}
                  onClick={() => setOpenField("from")}
                >
                  <CiLocationOn
                    size={16}
                    strokeWidth={1}
                    className={`shrink-0 text-primary-60`}
                  />
                  <input
                    type="text"
                    value={fromQuery}
                    onChange={(event) => {
                      setFromQuery(event.target.value);
                      setOpenField("from");
                    }}
                    onFocus={() => setOpenField("from")}
                    placeholder="From - City or airport"
                    className={`bg-transparent flex-1 ${typography.paragraph.md.normal} ${colors.text.primary} outline-none placeholder:${colors.text.tertiary}`}
                    autoComplete="off"
                  />
                </div>
                {openField === "from" && (
                  <div className="absolute z-40 mt-2 w-full rounded-[14px] border border-tertiary-30 bg-white p-2 shadow-[0px_10px_20px_rgba(0,0,0,0.12)]">
                    {fromOptions.map((option) => (
                      <button
                        key={option.code}
                        type="button"
                        onClick={() => selectFrom(option)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
                          {option.code}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {option.city}
                          </p>
                          <p className="text-xs text-slate-500">
                            {option.airport} - {option.country}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div ref={toRef} className="relative">
                <div
                  className={`flex items-center gap-2 ${colors.surface.input} border border-tertiary-30 rounded-[10px] px-4 h-14 cursor-text`}
                  onClick={() => setOpenField("to")}
                >
                  <CiLocationOn
                    size={16}
                    strokeWidth={1}
                    className={`shrink-0 text-primary-60`}
                  />
                  <input
                    type="text"
                    value={toQuery}
                    onChange={(event) => {
                      setToQuery(event.target.value);
                      setOpenField("to");
                    }}
                    onFocus={() => setOpenField("to")}
                    placeholder="To - City or airport"
                    className={`bg-transparent flex-1 ${typography.paragraph.md.normal} ${colors.text.primary} outline-none placeholder:${colors.text.tertiary}`}
                    autoComplete="off"
                  />
                </div>
                {openField === "to" && (
                  <div className="absolute z-40 mt-2 w-full rounded-[14px] border border-tertiary-30 bg-white p-2 shadow-[0px_10px_20px_rgba(0,0,0,0.12)]">
                    {toOptions.map((option) => (
                      <button
                        key={option.code}
                        type="button"
                        onClick={() => selectTo(option)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
                          {option.code}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {option.city}
                          </p>
                          <p className="text-xs text-slate-500">
                            {option.airport} - {option.country}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date / Passengers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DatePicker value={dateValue} onChange={setDateValue} />
              <PassengerSelector
                defaultPassengers={passengers}
                defaultCabinClass={cabinClass}
                onChange={(counts, cabin) => {
                  setPassengers(counts);
                  setCabinClass(cabin);
                }}
              />
            </div>

            {/* Search CTA */}
            <Link
              to={searchHref}
              className={`w-full ${colors.action.primary} ${colors.action.primaryHover} ${colors.action.primaryPress} ${typography.label.md.semiBold} h-14 rounded-[10px] flex items-center justify-center gap-2 transition-colors`}
            >
              <CiSearch size={18} strokeWidth={1.5} className="shrink-0" />
              Search Flights
            </Link>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <div className="max-w-[1131px] mx-auto px-6 py-10 flex flex-col gap-12">
        <section>
          <SectionHeader
            title="Best Deals Right Now"
            linkLabel="See all deals"
            to={ROUTES.EXPLORE_PROMOS}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEALS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Popular Routes"
            linkLabel="Explore all"
            to={ROUTES.SEARCH_RESULTS}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_ROUTES.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Explore Destinations"
            linkLabel="View all"
            to={ROUTES.EXPLORE}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {DESTINATIONS.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookingLandingPage;
