import { useState } from "react";
import { colors, typography } from "@/constants/theme";
import { CiLocationOn } from "react-icons/ci"
import { CiSearch } from 'react-icons/ci'
import { CiClock2 } from "react-icons/ci"
import DatePicker from "@/components/ui/DatePicker";
import TripTypePill, { type TripType } from "./components/TripTypePill";
import PassengerSelector from "./components/PassengerSelector";


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

const ROUTES: Route[] = [
  { id: "1", from: "Manila", fromCode: "MNL", to: "Cebu",      toCode: "CEB", price: "₱1,890",  duration: "1h 20m" },
  { id: "2", from: "Manila", fromCode: "MNL", to: "Davao",     toCode: "DVO", price: "₱1,750",  duration: "1h 45m" },
  { id: "3", from: "Manila", fromCode: "MNL", to: "Palawan",   toCode: "PPS", price: "₱2,499",  duration: "1h 20m" },
  { id: "4", from: "Manila", fromCode: "MNL", to: "Boracay",   toCode: "KLO", price: "₱1,650",  duration: "1h 10m" },
  { id: "5", from: "Manila", fromCode: "MNL", to: "Singapore", toCode: "SIN", price: "₱7,500",  duration: "4h 00m" },
  { id: "6", from: "Manila", fromCode: "MNL", to: "Hong Kong", toCode: "HKG", price: "₱11,200", duration: "2h 30m" },
];

const DESTINATIONS: Destination[] = [
  { id: "1", city: "Cebu",             startingFrom: "From ₱1,890", bgClass: "bg-primary-60" },
  { id: "2", city: "Puerto Princesa",  startingFrom: "From ₱2,499", bgClass: "bg-success-70" },
  { id: "3", city: "Kalibo (Boracay)", startingFrom: "From ₱1,650", bgClass: "bg-info-50"    },
  { id: "4", city: "Davao",            startingFrom: "From ₱1,750", bgClass: "bg-primary-80" },
];

function IconChevronRight() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <button
      type="button"
      className="bg-bg-page border border-tertiary-30 rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.04)] text-left w-full hover:shadow-md transition-shadow"
    >
      <div className="relative h-[140px] bg-tertiary-20">
        {deal.image
          ? <img src={deal.image} alt={deal.title} className="absolute inset-0 w-full h-full object-cover" />
          : <div className="absolute inset-0 bg-tertiary-20" />
        }
        <span className={`absolute top-3 left-3 bg-danger-60 text-text-on-primary ${typography.label.xs.bold} px-2 py-1 rounded-full`}>
          {deal.discount}
        </span>
        <span className={`absolute bottom-3 right-3 ${deal.badgeClass} text-text-on-primary ${typography.label.xs.semiBold} px-2 py-1 rounded-full`}>
          {deal.badge}
        </span>
      </div>
      <div className="p-4">
        <p className={`${typography.label.md.bold} ${colors.text.primary}`}>{deal.title}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className={`${typography.heading.h3.bold} font-extrabold text-primary-60`}>{deal.price}</span>
          <span className={`${typography.paragraph.sm.medium} ${colors.text.secondary} line-through`}>{deal.originalPrice}</span>
        </div>
        <div className={`flex items-center gap-1.5 mt-2 ${colors.text.secondary}`}>
          <CiClock2 size={11} className="shrink-0" />
          <span className={typography.paragraph.xs.medium}>{deal.validUntil}</span>
        </div>
      </div>
    </button>
  );
}

function RouteCard({ route }: { route: Route }) {
  return (
    <button
      type="button"
      className="bg-bg-page border border-tertiary-30 rounded-[14px] p-4 flex items-center justify-between hover:shadow-sm transition-shadow w-full text-left"
    >
      <div className="flex items-center gap-3">
        <div>
          <p className={`${typography.label.sm.semiBold} ${colors.text.primary}`}>{route.from}</p>
          <p className={`mt-2 ${typography.paragraph.xs.medium} ${colors.text.secondary}`}>{route.fromCode}</p>
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
          <p className={`${typography.label.sm.semiBold} ${colors.text.primary}`}>{route.to}</p>
          <p className={`mt-2 ${typography.paragraph.xs.medium} ${colors.text.secondary}`}>{route.toCode}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`${typography.label.md.bold} text-primary-60`}>{route.price}</p>
        <p className={`mt-2 ${typography.paragraph.xs.medium} ${colors.text.secondary}`}>{route.duration}</p>
      </div>
    </button>
  );
}

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <button
      type="button"
      className="relative h-[200px] rounded-[14px] overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.06)] w-full text-left hover:shadow-md transition-shadow"
    >
      {destination.image
        ? <img src={destination.image} alt={destination.city} className="absolute inset-0 w-full h-full object-cover" />
        : <div className={`absolute inset-0 ${destination.bgClass}`} />
      }
      <div className="absolute inset-0 bg-gradient-to-t from-primary-100/75 to-transparent" />
      <div className="absolute bottom-3 left-3">
        <p className={`${typography.label.md.bold} text-text-static-light`}>{destination.city}</p>
        <p className={`mt-2 ${typography.paragraph.xs.medium} text-white/80`}>{destination.startingFrom}</p>
      </div>
    </button>
  );
}

function SectionHeader({ title, linkLabel }: { title: string; linkLabel: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className={`${typography.heading.h3.bold} ${colors.text.primary}`}>{title}</h2>
      <button
        type="button"
        className={`${typography.label.sm.semiBold} ${colors.text.link} flex items-center gap-1 transition-colors`}
      >
        {linkLabel}
        <IconChevronRight />
      </button>
    </div>
  );
}

const SearchResultsPage = () => {
  const [tripType, setTripType] = useState<TripType>("one-way");

  return (
    <div className="bg-bg-surface min-h-screen">

      {/* Hero */}
      <section className="relative pb-5">
        <div className="absolute inset-0 bg-primary-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-100/65 via-primary-100/50 to-primary-100/30" />

        <div className="relative z-10 flex flex-col items-center gap-2 pt-8 px-4">
          <h1 className={`${typography.heading.h1.bold} md:text-display-2 text-text-static-light text-center`}>
            Where do you want to fly?
          </h1>
          <p className={`${typography.paragraph.md.normal} md:text-para-lg text-white/80 text-center`}>
            Great fares, simple booking, seamless travel — only on SkyLink.
          </p>
        </div>

        {/* Search card */}
        <div className="relative z-10 mx-auto mb-16 mt-8 w-full max-w-[800px] px-4">
          <div className="bg-bg-page rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.08)] p-6 flex flex-col gap-4">

            {/* Trip type pills */}
            <div className="flex gap-2">
              <TripTypePill 
                tripType={tripType} 
                setTripType={setTripType} 
              />
            </div>

            {/* From / To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className={`flex items-center gap-2 ${colors.surface.input} border border-tertiary-30 rounded-[10px] px-4 h-14 cursor-text`}>
                <CiLocationOn size={16} strokeWidth={1} className={`shrink-0 text-primary-60`} />
                <input
                  type="text"
                  placeholder="From — City or airport"
                  className={`bg-transparent flex-1 ${typography.paragraph.md.normal} ${colors.text.primary} outline-none placeholder:${colors.text.tertiary}`}
                />
              </label>
              <label className={`flex items-center gap-2 ${colors.surface.input} border border-tertiary-30 rounded-[10px] px-4 h-14 cursor-text`}>
                <CiLocationOn size={16} strokeWidth={1} className={`shrink-0 text-primary-60`} />
                <input
                  type="text"
                  placeholder="To — City or airport"
                  className={`bg-transparent flex-1 ${typography.paragraph.md.normal} ${colors.text.primary} outline-none placeholder:${colors.text.tertiary}`}
                />
              </label>
            </div>

            {/* Date / Passengers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DatePicker />
              <PassengerSelector />
            </div>

            {/* Search CTA */}
            <button
              type="button"
              className={`w-full ${colors.action.primary} ${colors.action.primaryHover} ${colors.action.primaryPress} ${typography.label.md.semiBold} h-14 rounded-[10px] flex items-center justify-center gap-2 transition-colors`}
            >
              <CiSearch size={18} strokeWidth={1.5} className="shrink-0" />
              Search Flights
            </button>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <div className="max-w-[1131px] mx-auto px-6 py-10 flex flex-col gap-12">

        <section>
          <SectionHeader title="Best Deals Right Now" linkLabel="See all deals" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEALS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Popular Routes" linkLabel="Explore all" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROUTES.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Explore Destinations" linkLabel="View all" />
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

export default SearchResultsPage;