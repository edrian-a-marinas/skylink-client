import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Check, ChevronLeft, Plane } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import BookingStepper from "@/pages/BookingPagesFolder/components/BookingStepper";
import {
  BOOKING_DATA,
  loadBookingData,
} from "@/pages/BookingPagesFolder/bookingData";
import useAsyncValue from "@/hooks/useAsyncValue";

const SeatSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchSuffix = location.search ?? "";
  const backHref = `${ROUTES.BOOKING_PASSENGER_DETAILS}${searchSuffix}`;
  const { data: bookingData } = useAsyncValue(loadBookingData);
  const booking = bookingData ?? BOOKING_DATA;
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const rows = useMemo(() => Array.from({ length: 11 }, (_, i) => i + 1), []);
  const columns = ["A", "B", "C", "D", "E", "F"];
  const occupiedSeats = useMemo(
    () => new Set(["2B", "3A", "3C", "4D", "6B", "7A", "9E", "10C"]),
    [],
  );

  const handleContinue = () => {
    const seat = selectedSeat ?? "Auto-assign";
    navigate(`${ROUTES.BOOKING_SUMMARY}${searchSuffix}`, {
      state: { seat },
    });
  };

  const handleSkip = () => {
    navigate(`${ROUTES.BOOKING_SUMMARY}${searchSuffix}`, {
      state: { seat: "Auto-assign" },
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

        <BookingStepper activeId={2} searchSuffix={searchSuffix} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Select Your Seat
                </h2>
                <p className="text-xs text-slate-500">
                  Airbus A320 - {booking.flightCode}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded border border-slate-300 bg-white" />
                  Available
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded border border-amber-200 bg-amber-50" />
                  Premium (+PHP 500)
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded border border-[#5D7FA7] bg-[#5D7FA7]" />
                  Selected
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded border border-slate-200 bg-slate-200" />
                  Occupied
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Plane className="h-4 w-4" />
                Front of aircraft
              </div>

              <div className="mt-4 flex justify-center">
                <div className="space-y-2">
                  {rows.map((row) => (
                    <div
                      key={row}
                      className="grid grid-cols-[24px_repeat(3,32px)_24px_repeat(3,32px)] items-center gap-2"
                    >
                      <div className="text-[11px] text-slate-400">{row}</div>
                      {columns.slice(0, 3).map((col) => {
                        const seatId = `${row}${col}`;
                        const isPremium = row <= 2;
                        const isOccupied = occupiedSeats.has(seatId);
                        const isSelected = selectedSeat === seatId;
                        const baseClass =
                          "flex h-8 w-8 items-center justify-center rounded border text-[10px] font-semibold transition";
                        const stateClass = isOccupied
                          ? "border-slate-200 bg-slate-200 text-slate-400 cursor-not-allowed"
                          : isSelected
                            ? "border-[#5D7FA7] bg-[#5D7FA7] text-white"
                            : isPremium
                              ? "border-amber-200 bg-amber-50 text-amber-600 hover:border-amber-300"
                              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300";
                        return (
                          <button
                            key={seatId}
                            type="button"
                            className={`${baseClass} ${stateClass}`}
                            disabled={isOccupied}
                            onClick={() =>
                              setSelectedSeat((current) =>
                                current === seatId ? null : seatId,
                              )
                            }
                            aria-label={`Seat ${seatId}`}
                          >
                            {isSelected ? <Check className="h-3 w-3" /> : col}
                          </button>
                        );
                      })}
                      <div />
                      {columns.slice(3).map((col) => {
                        const seatId = `${row}${col}`;
                        const isPremium = row <= 2;
                        const isOccupied = occupiedSeats.has(seatId);
                        const isSelected = selectedSeat === seatId;
                        const baseClass =
                          "flex h-8 w-8 items-center justify-center rounded border text-[10px] font-semibold transition";
                        const stateClass = isOccupied
                          ? "border-slate-200 bg-slate-200 text-slate-400 cursor-not-allowed"
                          : isSelected
                            ? "border-[#5D7FA7] bg-[#5D7FA7] text-white"
                            : isPremium
                              ? "border-amber-200 bg-amber-50 text-amber-600 hover:border-amber-300"
                              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300";
                        return (
                          <button
                            key={seatId}
                            type="button"
                            className={`${baseClass} ${stateClass}`}
                            disabled={isOccupied}
                            onClick={() =>
                              setSelectedSeat((current) =>
                                current === seatId ? null : seatId,
                              )
                            }
                            aria-label={`Seat ${seatId}`}
                          >
                            {isSelected ? <Check className="h-3 w-3" /> : col}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">
              Seat Selection
            </h3>
            <div
              className={`mt-3 rounded-lg border p-3 text-xs ${
                selectedSeat
                  ? "border-slate-200 bg-white text-slate-500"
                  : "border-amber-100 bg-amber-50 text-slate-500"
              }`}
            >
              {selectedSeat ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Selected seat</span>
                  <span className="font-semibold text-slate-800">
                    {selectedSeat}
                  </span>
                </div>
              ) : (
                <p>
                  No seat selected yet. You can skip and get an auto-assigned
                  seat.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!selectedSeat}
              className="mt-4 w-full rounded-lg bg-[#5D7FA7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4E6B8D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
            >
              Skip (Auto-assign)
            </button>
            <p className="mt-3 text-[11px] text-slate-400">
              Seats are held for 15 minutes. Complete your booking before time
              runs out.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default SeatSelectionPage;
