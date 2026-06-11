import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import BookingStepper from "@/pages/BookingPagesFolder/components/BookingStepper";
import { formatCurrency } from "@/pages/BookingPagesFolder/bookingData";
import useBookingFlowStore from "@/store/useBookingFlowStore";
import { useNavigate } from "react-router-dom";
import { getFlightById } from "@/api/flights.api";
import useAsyncValue from "@/hooks/useAsyncValue";
import { useCallback, useState } from "react";
import { useBookingActions } from "@/hooks/useBookings";

type LocationState = {
  seat?: string;
};

const BookingSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchSuffix = location.search ?? "";
  const backHref = `${ROUTES.BOOKING_SEAT_SELECTION}${searchSuffix}`;
  const locationState = location.state as LocationState | null;
  const { state } = useBookingFlowStore();
  const { passengers, pricing, selectedFlightId, seatSelections } = state;
  const passenger = passengers[0];
  const seatLabel = locationState?.seat ?? seatSelections[0] ?? "—";
  
  const { create, isLoading: isCreating } = useBookingActions();
  const [error, setError] = useState("");

  const flightLoader = useCallback(async () => {
    if (!selectedFlightId) return null;
    return getFlightById(selectedFlightId);
  }, [selectedFlightId]);
  
  const { data: flight } = useAsyncValue(flightLoader, ["booking-flight", selectedFlightId]);
  
  const baseFare = formatCurrency(pricing ? Math.round(pricing.baseFare) : 0);
  const taxes = formatCurrency(pricing ? Math.round(pricing.taxes) : 0);
  const total = formatCurrency(pricing ? Math.round(pricing.total) : 0);

  const handleProceedToPayment = async () => {
    if (!selectedFlightId || passengers.length === 0) {
      setError("Missing booking information. Please go back and fill in all details.");
      return;
    }

    try {
      setError("");
      
      const searchParams = new URLSearchParams(searchSuffix);
      const cabinParam = searchParams.get("cabin") ?? "Economy";
      const seatClassId = cabinParam.toLowerCase() === "business" ? 2 : 1;

      // Align with backend snake_case and schema requirements
      const payload = {
        flight_id: selectedFlightId,
        seat_class_id: seatClassId,
        seat_number: seatLabel !== "—" && seatLabel !== "Auto-assign" ? seatLabel : undefined,
        passengers: passengers.map(p => ({
          first_name: p.firstName,
          last_name: p.lastName,
          date_of_birth: p.dateOfBirth,
          passport_number: p.passport,
          nationality: p.nationality
        })),
        total_price: pricing?.total ?? 0,
      };

      const booking = await create(payload as any);
      if (booking && booking.id) {
        // Navigate to payment with the real booking ID
        const paymentParams = new URLSearchParams(searchSuffix);
        paymentParams.set("booking_id", booking.id);
        navigate(`${ROUTES.PAYMENT}?${paymentParams.toString()}`);
      } else {
        throw new Error("Failed to create booking. Please try again.");
      }
    } catch (err: any) {
      let errMsg = "An error occurred while creating your booking.";
      if (err.details?.detail) {
        if (typeof err.details.detail === "string") {
          errMsg = err.details.detail;
        } else if (Array.isArray(err.details.detail)) {
          errMsg = err.details.detail.map((d: any) => d.msg).join(", ");
        }
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    }
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

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                {error}
              </div>
            )}
            
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Flight
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-slate-800">
                    {flight ? `${flight.origin} → ${flight.destination}` : "—"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {flight?.flightNumber} {" - "}
                    {flight ? (() => {
                      const d = new Date(flight.departureTime);
                      if (isNaN(d.getTime())) return "—";
                      try {
                        return d.toISOString().slice(11, 16);
                      } catch {
                        return "—";
                      }
                    })() : "—"}
                    {" → "}
                    {flight ? (() => {
                      const d = new Date(flight.arrivalTime);
                      if (isNaN(d.getTime())) return "—";
                      try {
                        return d.toISOString().slice(11, 16);
                      } catch {
                        return "—";
                      }
                    })() : "—"}
                  </p>
                </div>
                <Link
                  to={`${ROUTES.SEARCH_RESULTS}${searchSuffix}`}
                  className="text-xs font-semibold text-[#5D7FA7] hover:text-[#4E6B8D]"
                >
                  Edit
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Passenger
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-slate-800">
                    {passenger ? `${passenger.firstName} ${passenger.lastName}` : "—"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {passenger?.nationality ?? "—"}
                  </p>
                  <p className="text-xs text-slate-500">
                    ID: {passenger?.passport ?? "—"}
                  </p>
                </div>
                <Link
                  to={`${ROUTES.BOOKING_PASSENGER_DETAILS}${searchSuffix}`}
                  className="text-xs font-semibold text-[#5D7FA7] hover:text-[#4E6B8D]"
                >
                  Edit
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Seat
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-slate-800">
                    {seatLabel}
                  </h3>
                </div>
                <Link
                  to={`${ROUTES.BOOKING_SEAT_SELECTION}${searchSuffix}`}
                  className="text-xs font-semibold text-[#5D7FA7] hover:text-[#4E6B8D]"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">
              Price Breakdown
            </h3>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Flight fare</span>
                <span>{baseFare}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Taxes & fees</span>
                <span>{taxes}</span>
              </div>
            </div>

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
              disabled={isCreating}
              onClick={handleProceedToPayment}
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#5D7FA7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4E6B8D] disabled:opacity-70"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </button>
            <p className="mt-3 text-[11px] text-slate-400">
              By proceeding to payment, you agree to SkyLink's Terms of Service
              and Privacy Policy.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default BookingSummaryPage;
