import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import ManageBookingDetailsLayout from "@/pages/ManageBookingPagesFolder/components/ManageBookingDetailsLayout";
import { loadManageBookingById } from "@/pages/ManageBookingPagesFolder/manageBookingData";
import useAsyncValue from "@/hooks/useAsyncValue";

const ManageBookingDetailsPage = () => {
  const { id } = useParams();
  const { data: booking, isLoading } = useAsyncValue(() =>
    loadManageBookingById(id),
  );

  if (isLoading && !booking) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F3F5F7]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#496B92] border-t-transparent" />
      </main>
    );
  }

  if (!booking) {
    return <Navigate to={ROUTES.MANAGE} replace />;
  }

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-6 py-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Link
              to={ROUTES.MANAGE}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5D7FA7] transition hover:text-[#4E6B8D]"
            >
              <ChevronLeft className="h-4 w-4" />
              My Bookings
            </Link>

            <span className="text-slate-300">/</span>

            <span className="font-medium text-slate-400">{booking.pnr}</span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto w-full max-w-7xl px-6 py-6">
        <ManageBookingDetailsLayout booking={booking} />
      </section>
    </main>
  );
};

export default ManageBookingDetailsPage;
