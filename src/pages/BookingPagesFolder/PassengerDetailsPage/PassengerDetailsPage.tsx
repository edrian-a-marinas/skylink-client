import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Info, Loader2, User } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import BookingStepper from "@/pages/BookingPagesFolder/components/BookingStepper";
import { formatCurrency } from "@/pages/BookingPagesFolder/bookingData";
import useBookingFlowStore from "@/store/useBookingFlowStore";
import { getFlightById } from "@/api/flights.api";
import useAsyncValue from "@/hooks/useAsyncValue";
import { FALLBACK_NATIONALITIES } from "@/utils/nationalities";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1923 }, (_, i) => currentYear - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const nameRegex = /^[A-Za-z\s'-]*$/;
const passportRegex = /^[A-Za-z0-9]*$/;

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
  const { selectedFlightId, pricing, passengers: storedPassengers } = state;

  const flightLoader = useCallback(async () => {
    if (!selectedFlightId) return null;
    return getFlightById(selectedFlightId);
  }, [selectedFlightId]);

  const { data: flight, isLoading } = useAsyncValue(flightLoader, ["booking-flight", selectedFlightId]);

  const existingPassenger = storedPassengers?.[0];
  const dobParts = existingPassenger?.dateOfBirth ? existingPassenger.dateOfBirth.split("-") : [];

  // Form state pre-filled from context if editing
  const [firstName, setFirstName] = useState(existingPassenger?.firstName || "");
  const [lastName, setLastName] = useState(existingPassenger?.lastName || "");
  const [nationality, setNationality] = useState(existingPassenger?.nationality || "");
  const [passportNumber, setPassportNumber] = useState(existingPassenger?.passport || "");
  const [dobMonth, setDobMonth] = useState(dobParts[1] || "");
  const [dobDay, setDobDay] = useState(dobParts[2] || "");
  const [dobYear, setDobYear] = useState(dobParts[0] || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Nationalities autocomplete state
  const [nationalityList] = useState<string[]>(FALLBACK_NATIONALITIES);
  const [searchQuery, setSearchQuery] = useState(existingPassenger?.nationality || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter nationality list options based on user search
  const filteredNationalities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return nationalityList.slice(0, 10); // show top 10 as suggestion
    return nationalityList.filter(n => n.toLowerCase().includes(q));
  }, [searchQuery, nationalityList]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (nameRegex.test(val) && val.length <= 30) {
      setFirstName(val);
      setErrors((prev) => ({ ...prev, firstName: "" }));
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (nameRegex.test(val) && val.length <= 30) {
      setLastName(val);
      setErrors((prev) => ({ ...prev, lastName: "" }));
    }
  };

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s/g, ""); // strip space immediately
    if (passportRegex.test(val) && val.length <= 20) {
      setPassportNumber(val);
      setErrors((prev) => ({ ...prev, passportNumber: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedPassport = passportNumber.trim();
    const trimmedNat = nationality.trim();

    if (!trimmedFirst) {
      newErrors.firstName = "First name is required.";
    } else if (trimmedFirst.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters.";
    } else if (trimmedFirst.length > 30) {
      newErrors.firstName = "First name must be at most 30 characters.";
    }

    if (!trimmedLast) {
      newErrors.lastName = "Last name is required.";
    } else if (trimmedLast.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters.";
    } else if (trimmedLast.length > 30) {
      newErrors.lastName = "Last name must be at most 30 characters.";
    }

    if (!trimmedNat) {
      newErrors.nationality = "Nationality is required.";
    } else if (!nationalityList.some(n => n.toLowerCase() === trimmedNat.toLowerCase())) {
      newErrors.nationality = "Please select a valid nationality from the list.";
    }

    if (!trimmedPassport) {
      newErrors.passportNumber = "Passport / ID number is required.";
    } else if (trimmedPassport.length < 6) {
      newErrors.passportNumber = "Passport / ID number must be at least 6 characters.";
    } else if (trimmedPassport.length > 20) {
      newErrors.passportNumber = "Passport / ID number must be at most 20 characters.";
    }

    if (!dobMonth || !dobDay || !dobYear) {
      newErrors.dob = "Date of birth is required.";
    }

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
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: `${dobYear}-${dobMonth}-${dobDay}`,
        nationality: nationality.trim(),
        passport: passportNumber.trim(),
      } as any,
    ]);
    navigate(seatSelectionHref);
  };

  const formatTimeSafe = (timeStr?: string) => {
    if (!timeStr) return "—";
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return "—";
    try {
      return d.toISOString().slice(11, 16);
    } catch {
      return "—";
    }
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
                  onChange={handleFirstNameChange}
                  placeholder="Enter first name"
                  maxLength={30}
                />
                {errors.firstName && <p className="mt-1 text-xs text-rose-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Last Name *</label>
                <input
                  className={inputClass}
                  value={lastName}
                  onChange={handleLastNameChange}
                  placeholder="Enter last name"
                  maxLength={30}
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
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </div>
                {errors.dob && <p className="mt-1 text-xs text-rose-500">{errors.dob}</p>}
              </div>
              <div className="relative text-left" ref={dropdownRef}>
                <label className="text-xs font-semibold text-slate-600">Nationality *</label>
                <input
                  className={inputClass}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setNationality(e.target.value);
                    setShowDropdown(true);
                    setErrors((prev) => ({ ...prev, nationality: "" }));
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Type to search nationality..."
                  maxLength={100}
                />
                {showDropdown && (
                  <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    {filteredNationalities.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-slate-400 italic">No nationalities found</div>
                    ) : (
                      filteredNationalities.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setNationality(option);
                            setSearchQuery(option);
                            setShowDropdown(false);
                            setErrors((prev) => ({ ...prev, nationality: "" }));
                          }}
                          className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-[#EAF0F7] hover:text-slate-800 text-slate-700"
                        >
                          {option}
                        </button>
                      ))
                    )}
                  </div>
                )}
                {errors.nationality && <p className="mt-1 text-xs text-rose-500">{errors.nationality}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Passport / ID Number *</label>
                <input
                  className={inputClass}
                  value={passportNumber}
                  onChange={handlePassportChange}
                  placeholder="Enter passport or ID number"
                  maxLength={20}
                />
                {errors.passportNumber && <p className="mt-1 text-xs text-rose-500">{errors.passportNumber}</p>}
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 text-left">
              <Info className="mt-0.5 h-4 w-4 text-slate-400 shrink-0" />
              <span>Please ensure passenger details match exactly as written in the official ID or passport.</span>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 text-left">
              Your Booking
            </h3>
            {isLoading ? (
              <div className="mt-4 flex justify-center">
                <Loader2 className="animate-spin text-[#496B92]" size={20} />
              </div>
            ) : flight ? (
              <div className="mt-3 rounded-xl bg-slate-50 p-4 text-left">
                <p className="text-[11px] font-semibold text-slate-400">Flight</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">
                    {flight.origin} {"→"} {flight.destination}
                  </span>
                  <span className="text-[11px] text-slate-400">{flight.flightNumber}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {formatTimeSafe(flight.departureTime)}
                  {" → "}
                  {formatTimeSafe(flight.arrivalTime)}
                </p>
                <p className="text-xs text-slate-500">Economy</p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-400 text-left">No flight selected.</p>
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
