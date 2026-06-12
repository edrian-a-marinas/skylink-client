import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import BookingStepper from "@/pages/BookingPagesFolder/components/BookingStepper";
import { formatCurrency } from "@/pages/BookingPagesFolder/bookingData";
import { useBookingDetail } from "@/hooks/useBookings";
import {
  createPaymentIntent,
  createPaymongoPaymentMethod,
  attachPaymongoPaymentIntent,
} from "@/api/payments.api";

type PaymentMethod = "card" | "gcash" | "paymaya";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchSuffix = location.search ?? "";
  const query = new URLSearchParams(location.search);
  const bookingId = query.get("booking_id");
  
  if (!bookingId) {
    // If no booking ID, we can't proceed with payment.
    // Navigate back to summary or search
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7]">
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-800">No Booking ID found</h2>
          <p className="mt-2 text-sm text-slate-500">Please go back to summary and try again.</p>
          <Link to={ROUTES.HOME} className="mt-4 inline-block text-[#5D7FA7] font-semibold hover:underline">
            Go to Home
          </Link>
        </div>
      </main>
    );
  }
  
  const backHref = `${ROUTES.BOOKING_SUMMARY}${searchSuffix}`;
  const [method, setMethod] = useState<PaymentMethod>("gcash");
  
  const { data: bookingDetail, isLoading: isLoadingBooking } = useBookingDetail(bookingId);
  const bookingTotal = bookingDetail?.totalPrice || 0;
  const total = formatCurrency(bookingTotal);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[0-9\s]*$/.test(val) && val.length <= 19) {
      setCardDetails(prev => ({ ...prev, cardNumber: val }));
    }
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[A-Za-z\s'-]*$/.test(val) && val.length <= 50) {
      setCardDetails(prev => ({ ...prev, cardName: val }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[0-9\s/]*$/.test(val) && val.length <= 7) {
      setCardDetails(prev => ({ ...prev, expiry: val }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[0-9]*$/.test(val) && val.length <= 4) {
      setCardDetails(prev => ({ ...prev, cvv: val }));
    }
  };

  const handlePay = async () => {
    try {
      setIsProcessing(true);
      setErrorMsg("");

      // 1. Create Payment Intent via Backend
      const intentRes = await createPaymentIntent(bookingId, method);

      if (method === "gcash" || method === "paymaya") {
        navigate(`${ROUTES.PAYMENT_PROCESSING}${searchSuffix}`);
        return;
      }

      if (!intentRes?.client_key) {
        throw new Error("Failed to initialize payment intent.");
      }
      const clientKey = intentRes.client_key;
      const intentId = clientKey.split("_client_")[0];

      // 2. Create Payment Method via PayMongo API
      let pmPayload: any = { type: method };

      if (method === "card") {
        const [month, year] = cardDetails.expiry.split("/").map(s => s.trim());
        pmPayload.details = {
          card_number: cardDetails.cardNumber.replace(/\s+/g, ""),
          exp_month: parseInt(month, 10),
          exp_year: parseInt(year, 10),
          cvc: cardDetails.cvv,
        };
        pmPayload.billing = {
          name: cardDetails.cardName || "Customer Name",
          email: "customer@skylink.com",
        };
      } else {
        pmPayload.billing = {
          name: "Customer Name",
          email: "customer@skylink.com",
        };
      }

      const pmRes = await createPaymongoPaymentMethod(pmPayload);
      const pmId = pmRes.id;

      // 3. Attach Payment Method to Intent
      const returnUrl = `${window.location.origin}${ROUTES.PAYMENT_PROCESSING}${searchSuffix}`;
      const attachRes = await attachPaymongoPaymentIntent(intentId, pmId, clientKey, returnUrl);

      // 4. Handle Redirect or Success
      if (attachRes?.attributes?.next_action?.type === "redirect") {
        window.location.href = attachRes.attributes.next_action.redirect.url;
      } else {
        // If no redirect (e.g. valid test card), proceed to processing/polling page
        navigate(`${ROUTES.PAYMENT_PROCESSING}${searchSuffix}`);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      const msg =
        err.details?.detail ||
        err.message ||
        "An error occurred during payment processing.";
      setErrorMsg(msg);
      setIsProcessing(false);
    }
  };

  if (isLoadingBooking) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7]">
        <Loader2 className="h-8 w-8 animate-spin text-[#496B92]" />
      </main>
    );
  }

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

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {errorMsg && (
              <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600 border border-rose-200">
                {errorMsg}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3 text-xs">
              {[
                { id: "gcash", label: "GCash" },
                { id: "paymaya", label: "Maya" },
                { id: "card", label: "Credit / Debit Card" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMethod(tab.id as PaymentMethod)}
                  disabled={isProcessing}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    method === tab.id
                      ? "bg-[#5D7FA7] text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  } disabled:opacity-50`}
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
                    value={cardDetails.cardNumber}
                    onChange={handleCardNumberChange}
                    disabled={isProcessing}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm disabled:opacity-50"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">
                    Cardholder Name *
                  </label>
                  <input
                    value={cardDetails.cardName}
                    onChange={handleCardNameChange}
                    disabled={isProcessing}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm disabled:opacity-50"
                    placeholder="AS WRITTEN ON CARD"
                    maxLength={50}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Expiry *
                  </label>
                  <input
                    value={cardDetails.expiry}
                    onChange={handleExpiryChange}
                    disabled={isProcessing}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm disabled:opacity-50"
                    placeholder="MM / YY"
                    maxLength={7}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    CVV *
                  </label>
                  <input
                    value={cardDetails.cvv}
                    onChange={handleCvvChange}
                    disabled={isProcessing}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm disabled:opacity-50"
                    placeholder="***"
                    maxLength={4}
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  <Lock className="h-4 w-4 text-slate-400" />
                  Your payment is secured with 256-bit SSL encryption.
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                You will be redirected to complete this payment method securely once you click Pay Now.
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm h-fit">
            <h3 className="text-sm font-semibold text-slate-800">
              Order Total
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              {bookingDetail?.flight?.flightNumber || "Flight"} fare
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
              disabled={isProcessing}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#5D7FA7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4E6B8D] disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay Now - ${total}`
              )}
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
