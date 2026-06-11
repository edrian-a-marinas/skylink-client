import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Tag } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import useAsyncValue from "@/hooks/useAsyncValue";
import { getPromotions } from "@/api/promotions.api";

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

const PromosPage = () => {
  const [filter, setFilter] = useState<string>("all");

  const loader = useCallback(async () => {
    const data = await getPromotions();
    return data || [];
  }, []);

  const { data: promotions, isLoading } = useAsyncValue(loader);

  const deals = useMemo(() => {
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
            ? "bg-rose-500 text-white"
            : promo.badge_type === "limited"
              ? "bg-amber-500 text-white"
              : promo.badge_type === "new"
                ? "bg-emerald-600 text-white"
                : "bg-[#496B92] text-white",
        validUntil: promo.valid_until || "Limited Time",
        image: promo.image_url ?? "",
      };
    });

    if (filter === "all") return allDeals;
    return allDeals.filter((deal) =>
      promotions?.find((p) => p.id === deal.id)?.badge_type === filter
    );
  }, [promotions, filter]);

  const categories = [
    { id: "all", label: "All Deals" },
    { id: "hot", label: "Hot Deal" },
    { id: "limited", label: "Limited" },
    { id: "new", label: "New" },
  ];
  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 p-2 rounded-lg text-rose-600">
              <Tag size={20} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Current Promos</h1>
          </div>
          <p className="mt-2 text-slate-500 max-w-2xl">
            Grab the lowest fares before they disappear. Limited-time offers on
            select domestic and international routes.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  filter === cat.id
                    ? "bg-[#496B92] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#496B92] border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <Link
                key={deal.id}
                to={ROUTES.EXPLORE_PROMO_DETAIL.replace(":id", deal.id)}
                state={{ deal: promotions?.find((p) => p.id === deal.id) }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <article className="flex h-full flex-col">
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {deal.image ? (
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <Tag size={48} />
                      </div>
                    )}
                    <div className="absolute left-3 top-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${deal.badgeClass}`}
                      >
                        {deal.badge}
                      </span>
                    </div>
                    <div className="absolute right-3 top-3">
                      <span className="rounded-full bg-rose-600 px-2 py-1 text-[11px] font-bold text-white">
                        {deal.discount}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {deal.title}
                    </h3>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Starting from</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-[#496B92]">
                            {deal.price}
                          </span>
                          <span className="text-sm text-slate-400 line-through">
                            {deal.originalPrice}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                          <Clock size={12} />
                          <span>Expires {deal.validUntil}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}

            {!isLoading && deals.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-500 font-medium">
                  No active promotions found in this category.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default PromosPage;
