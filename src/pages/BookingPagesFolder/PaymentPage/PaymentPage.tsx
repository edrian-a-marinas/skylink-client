import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import BookingStepper from "@/pages/BookingPagesFolder/components/BookingStepper";
import {
  BOOKING_DATA,
  loadBookingData,
  formatCurrency,
} from "@/pages/BookingPagesFolder/bookingData";
import useAsyncValue from "@/hooks/useAsyncValue";

type PaymentMethod = "card" | "gcash" | "paypal" | "bank";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchSuffix = location.search ?? "";
  const backHref = `${ROUTES.BOOKING_SUMMARY}${searchSuffix}`;
  const [method, setMethod] = useState<PaymentMethod>("card");
  const { data: bookingData } = useAsyncValue(loadBookingData);
  const booking = bookingData ?? BOOKING_DATA;
  const total = formatCurrency(booking.total);

  const handlePay = () => {
    navigate(`${ROUTES.PAYMENT_OTP}${searchSuffix}`, {
      state: { method },
    });
  };

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      <section className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
          <Link
            to={backHref}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <BookingStepper activeId={4} searchSuffix={searchSuffix} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3 text-xs">
              {[
                { id: "card", label: "Credit / Debit Card" },
                { id: "gcash", label: "GCash" },
                { id: "paypal", label: "PayPal" },
                { id: "bank", label: "Bank Transfer" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMethod(tab.id as PaymentMethod)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    method === tab.id
                      ? "bg-[#5D7FA7] text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {method === "card" ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">
                    Card Number *
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">
                    Cardholder Name *
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                    placeholder="AS WRITTEN ON CARD"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Expiry *
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                    placeholder="MM / YY"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    CVV *
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                    placeholder="***"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  <Lock className="h-4 w-4 text-slate-400" />
                  Your payment is secured with 256-bit SSL encryption.
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                You will be redirected to complete this payment method once you
                continue.
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">
              Order Total
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              {booking.flightCode} fare
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-sm font-semibold text-slate-800">
                Total
              </span>
              <span className="text-lg font-semibold text-[#5D7FA7]">
                {total}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePay}
              className="mt-4 w-full rounded-lg bg-[#5D7FA7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4E6B8D]"
            >
              Pay Now - {total}
            </button>
            <p className="mt-2 text-[11px] text-slate-400">
              By paying, you agree to our Terms of Service.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default PaymentPage;
