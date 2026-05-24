import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Tag } from "lucide-react";
import { ROUTES } from "@/constants/routes";

type PromoTag = "Flash" | "Weekend" | "International" | "Domestic" | "Business";

type Promo = {
  id: string;
  title: string;
  description: string;
  price: string;
  oldPrice: string;
  discount: string;
  tag: PromoTag;
  validUntil: string;
  image: string;
};

const FILTERS: Array<"All" | PromoTag> = [
  "All",
  "Flash",
  "Weekend",
  "International",
  "Domestic",
  "Business",
];

const PROMOS: Promo[] = [
  {
    id: "promo-1",
    title: "Flash Sale: Manila-Cebu",
    description:
      "Limited seats at unbeatable prices. Book now and save big on your next getaway!",
    price: "PHP 1,490",
    oldPrice: "PHP 3,500",
    discount: "-57% OFF",
    tag: "Flash",
    validUntil: "Apr 30",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "promo-2",
    title: "Weekend Escape: Manila-Palawan",
    description:
      "Discover Palawan's pristine beaches with our special weekend rates.",
    price: "PHP 2,199",
    oldPrice: "PHP 4,200",
    discount: "-48% OFF",
    tag: "Weekend",
    validUntil: "May 15",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "promo-3",
    title: "Fly to Singapore from PHP 7,500",
    description:
      "Experience the Lion City at amazing prices. Perfect for a long weekend getaway.",
    price: "PHP 7,500",
    oldPrice: "PHP 12,500",
    discount: "-40% OFF",
    tag: "International",
    validUntil: "May 31",
    image:
      "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "promo-4",
    title: "Business Class Upgrade: Manila-Tokyo",
    description:
      "Upgrade your Tokyo experience with our premium Business Class deal.",
    price: "PHP 28,900",
    oldPrice: "PHP 45,000",
    discount: "-36% OFF",
    tag: "Business",
    validUntil: "Jun 30",
    image:
      "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "promo-5",
    title: "Boracay Summer Sale",
    description: "White beaches, crystal waters - now at summer sale prices.",
    price: "PHP 1,650",
    oldPrice: "PHP 3,200",
    discount: "-48% OFF",
    tag: "Flash",
    validUntil: "Apr 25",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "promo-6",
    title: "Discover Bali from PHP 6,200",
    description: "The Island of the Gods awaits - book early and save!",
    price: "PHP 6,200",
    oldPrice: "PHP 9,800",
    discount: "-37% OFF",
    tag: "International",
    validUntil: "Jul 15",
    image:
      "https://images.unsplash.com/photo-1507525428034-16f58c1f13c1?auto=format&fit=crop&w=800&q=80",
  },
];

const TAG_STYLES: Record<PromoTag, string> = {
  Flash: "bg-amber-500",
  Weekend: "bg-emerald-600",
  International: "bg-teal-600",
  Domestic: "bg-slate-600",
  Business: "bg-indigo-600",
};

const PromosPage = () => {
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]>("All");

  const filteredPromos = useMemo(() => {
    if (activeFilter === "All") {
      return PROMOS;
    }
    return PROMOS.filter((promo) => promo.tag === activeFilter);
  }, [activeFilter]);

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      <section className="px-6 pb-16 pt-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5D7FA7]/15 text-[#5D7FA7]">
              <Tag size={18} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                All Deals & Promos
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Exclusive fares and limited-time offers - updated weekly.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                  activeFilter === filter
                    ? "border-[#5D7FA7] bg-[#5D7FA7] text-white"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPromos.map((promo) => (
              <Link
                key={promo.id}
                to={ROUTES.EXPLORE_PROMO_DETAIL}
                className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <article>
                  <div className="relative">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2 py-1 text-[10px] font-semibold text-white">
                      {promo.discount}
                    </span>
                    <span
                      className={`absolute right-3 top-3 rounded-full px-2 py-1 text-[10px] font-semibold text-white ${
                        TAG_STYLES[promo.tag]
                      }`}
                    >
                      {promo.tag}
                    </span>
                  </div>

                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {promo.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {promo.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold text-[#5D7FA7]">
                          {promo.price}
                        </p>
                        <p className="text-xs text-slate-400 line-through">
                          {promo.oldPrice}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={12} />
                        {promo.validUntil}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default PromosPage;
