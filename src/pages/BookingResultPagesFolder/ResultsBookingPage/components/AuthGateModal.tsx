import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

type AuthGateModalProps = {
  open: boolean;
  onClose: () => void;
  continueTo?: string;
};

const AuthGateModal = ({ open, onClose, continueTo }: AuthGateModalProps) => {
  if (!open) {
    return null;
  }

  const guestLink = continueTo ?? ROUTES.BOOKING_PASSENGER_DETAILS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            x
          </button>
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          Ready to Book?
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to save your booking to your account, or continue as a guest.
        </p>

        <div className="mt-5 space-y-2">
          <Link
            to={ROUTES.LOGIN}
            className="block w-full rounded-lg bg-[#5D7FA7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4E6B8D]"
          >
            Sign In
          </Link>
          <Link
            to={guestLink}
            className="block w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
          >
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthGateModal;
