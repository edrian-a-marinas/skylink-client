import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

type Step = {
  id: number;
  label: string;
  href: string;
};

const STEPS: Step[] = [
  { id: 1, label: "Passenger Details", href: ROUTES.BOOKING_PASSENGER_DETAILS },
  { id: 2, label: "Seat Selection", href: ROUTES.BOOKING_SEAT_SELECTION },
  { id: 4, label: "Booking Summary", href: ROUTES.BOOKING_SUMMARY },
];

type BookingStepperProps = {
  activeId: number;
  searchSuffix?: string;
};

const BookingStepper = ({
  activeId,
  searchSuffix = "",
}: BookingStepperProps) => {
  const activeIndex = Math.max(
    0,
    STEPS.findIndex((step) => step.id === activeId),
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs shadow-sm">
      {STEPS.map((step, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        const circleBase =
          "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold";
        const circleClass = isCompleted
          ? "border-[#5D7FA7] bg-[#5D7FA7] text-white"
          : isActive
            ? "border-[#5D7FA7] text-[#5D7FA7]"
            : "border-slate-300 text-slate-400";
        const labelClass = isActive
          ? "text-slate-700 font-semibold"
          : isCompleted
            ? "text-slate-600"
            : "text-slate-400";
        const stepContent = (
          <div className="flex items-center gap-2">
            <span className={`${circleBase} ${circleClass}`}>
              {isCompleted ? <Check className="h-3.5 w-3.5" /> : step.id}
            </span>
            <span className={`text-xs ${labelClass}`}>{step.label}</span>
          </div>
        );

        return (
          <div key={step.id} className="flex items-center gap-3">
            {isCompleted ? (
              <Link
                to={`${step.href}${searchSuffix}`}
                className="hover:text-slate-700"
              >
                {stepContent}
              </Link>
            ) : (
              <div>{stepContent}</div>
            )}
            {index < STEPS.length - 1 ? (
              <span className="hidden h-px w-10 bg-slate-200 sm:block" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default BookingStepper;
