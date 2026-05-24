import { useState } from "react";
import { Link } from "react-router-dom";
import { colors, typography } from "@/constants/theme";

const BookingCard = () => {
  const [pnr, setPnr] = useState("");

  const handleRetrieve = () => {
    // TODO: wire up PNR lookup
  };

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-[var(--color-tertiary-30)] bg-white px-6 py-6">

      {/* PNR Input */}
      <div className="flex flex-col gap-2">
        <label className={`${typography.paragraph.sm.semiBold} text-text-tertiary text-left`}>
          Booking Reference (PNR)
        </label>
        <div className="flex h-[52px] items-center rounded-[14px] border border-[var(--color-tertiary-30)] bg-[var(--color-grey-10)] px-4">
          <input
            type="text"
            value={pnr}
            onChange={(e) => setPnr(e.target.value.toUpperCase())}
            placeholder="e.g. SK7831"
            maxLength={10}
            className={`${typography.label.lg.bold} ${colors.text.tertiary} flex items-center w-full `}
          />
        </div>
      </div>

      {/* Retrieve Button */}
      <button
        type="button"
        onClick={handleRetrieve}
        className={`${typography.label.md.semiBold} ${colors.action.primary} ${colors.text.onPrimary} flex items-center justify-center w-full h-12 rounded-[14px] py-3 text-center`}
      >
        Retrieve Booking
      </button>

      {/* Divider */}
      <div className="h-px bg-[var(--color-tertiary-30)]" />

      {/* Sign In Link */}
      <Link
        to="#"
        className={`${typography.label.md.semiBold} ${colors.action.ghost} ${colors.text.link} text-center flex items-center justify-center w-full h-12 rounded-[14px]`}
      >
        Sign In to View All Bookings
      </Link>
    </div>
  );
};

export default BookingCard;