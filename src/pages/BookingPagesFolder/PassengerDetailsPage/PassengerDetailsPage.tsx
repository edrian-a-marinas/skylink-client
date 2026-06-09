import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Info, Loader2, User } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import BookingStepper from "@/pages/BookingPagesFolder/components/BookingStepper";
import { formatCurrency } from "@/pages/BookingPagesFolder/bookingData";
import useBookingFlowStore from "@/store/useBookingFlowStore";
import { getFlightById } from "@/api/flights.api";
import useAsyncValue from "@/hooks/useAsyncValue";
import { useCallback } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1923 }, (_, i) => currentYear - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-[#5D7FA7] focus:outline-none focus:ring-2 focus:ring-[#5D7FA7]/20";
const selectClass =
  "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-[#5D7FA7] focus:outline-none focus:ring-2 focus:ring-[#5D7FA7]/20";

const PassengerDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchSuffix = location.search ?? "";
  const seatSelectionHref = `${ROUTES.BOOKING_SEAT_SELECTION}${searchSuffix}`;
  const backHref = `${ROUTES.SEARCH_RESULTS}${searchSuffix}`;

  const { state, setPassengers } = useBookingFlowStore();
  const { selectedFlightId, pricing } = state;

  const flightLoader = useCallback(async () => {
    if (!selectedFlightId) return null;
    return getFlightById(selectedFlightId);
  }, [selectedFlightId]);

  const { data: flight, isLoading } = useAsyncValue(flightLoader);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!nationality.trim()) newErrors.nationality = "Nationality is required.";
    if (!passportNumber.trim()) newErrors.passportNumber = "Passport / ID number is required.";
    if (!dobMonth || !dobDay || !dobYear) newErrors.dob = "Date of birth is required.";
    return newErrors;
  };

  const handleContinue = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setPassengers([
      {
        firstName,
        lastName,
        dateOfBirth: `${dobYear}-${dobMonth}-${dobDay}`,
        nationality,
        passportNumber,
      } as any,
    ]);
    navigate(seatSelectionHref);
  };

  const baseFare = formatCurrency(pricing ? Math.round(pricing.baseFare) : 0);
  const taxes = formatCurrency(pricing ? Math.round(pricing.taxes) : 0);
  const total = formatCurrency(pricing ? Math.round(pricing.total) : 0);

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
        <BookingStepper activeId={1} searchSuffix={searchSuffix} />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF0F7] text-[#5D7FA7]">
                <User className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Passenger Details
                </p>
                <h2 className="text-sm font-semibold text-slate-800">
                  Enter Passenger Information
                </h2>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600">First Name *</label>
                <input
                  className={inputClass}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="mt-1 text-xs text-rose-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Last Name *</label>
                <input
                  className={inputClass}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="mt-1 text-xs text-rose-500">{errors.lastName}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Date of Birth *</label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  <select value={dobMonth} onChange={(e) => setDobMonth(e.target.value)} className={selectClass}>
                    <option value="" disabled>Month</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={String(i + 1).padStart(2, "0")}>{m}</option>
                    ))}
                  </select>
                  <select value={dobDay} onChange={(e) => setDobDay(e.target.value)} className={selectClass}>
                    <option value="" disabled>Day</option>
                    {DAYS.map((d) => (
                      <option key={d} value={String(d).padStart(2, "0")}>{d}</option>
                    ))}
                  </select>
                  <select value={dobYear} onChange={(e) => setDobYear(e.target.value)} className={selectClass}>
                    <option value="" disabled>Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                {errors.dob && <p className="mt-1 text-xs text-rose-500">{errors.dob}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Nationality *</label>
                <input
                  className={inputClass}
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="Nationality"
                />
                {errors.nationality && <p className="mt-1 text-xs text-rose-500">{errors.nationality}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Passport / ID Number *</label>
                <input
                  className={inputClass}
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder="Enter passport or ID number"
                />
                {errors.passportNumber && <p className="mt-1 text-xs text-rose-500">{errors.passportNumber}</p>}
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
              <Info className="mt-0.5 h-4 w-4 text-slate-400" />
              <span>Please ensure passenger details match exactly as written in the official ID or passport.</span>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Your Booking
            </h3>
            {isLoading ? (
              <div className="mt-4 flex justify-center">
                <Loader2 className="animate-spin text-[#496B92]" size={20} />
              </div>
            ) : flight ? (
              <div className="mt-3 rounded-xl bg-slate-50 p-4">
                <p className="text-[11px] font-semibold text-slate-400">Flight</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">
                    {flight.origin} {"→"} {flight.destination}
                  </span>
                  <span className="text-[11px] text-slate-400">{flight.flightNumber}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(flight.departureTime).toISOString().slice(11, 16)}
                  {" → "}
                  {new Date(flight.arrivalTime).toISOString().slice(11, 16)}
                </p>
                <p className="text-xs text-slate-500">Economy</p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-400">No flight selected.</p>
            )}
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Base fare</span>
                <span>{baseFare}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Taxes & fees</span>
                <span>{taxes}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-sm font-semibold text-slate-800">Total</span>
              <span className="text-lg font-semibold text-[#5D7FA7]">{total}</span>
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#5D7FA7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4E6B8D]"
            >
              Continue to Seat Selection
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default PassengerDetailsPage;