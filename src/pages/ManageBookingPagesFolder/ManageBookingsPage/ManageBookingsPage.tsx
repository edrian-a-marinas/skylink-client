import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plane, ChevronRight, BookOpen } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  loadManageBookings,
  formatPeso,
  getStatusBadgeClass,
  getStatusLabel,
  type ManageBookingStatus,
  type ManageBooking,
} from "@/pages/ManageBookingPagesFolder/manageBookingData";
import useAsyncValue from "@/hooks/useAsyncValue";

const ManageBookingsPage = () => {
  const [activeTab, setActiveTab] = useState<ManageBookingStatus>("upcoming");
  const { data: loadedBookings } = useAsyncValue(loadManageBookings, ["manage-bookings-list"]);
  const bookingsData = loadedBookings ?? [];

  const counts = useMemo(() => {
    return bookingsData.reduce(
      (acc: Record<ManageBookingStatus, number>, booking: ManageBooking) => {
        acc[booking.status] += 1;
        return acc;
      },
      { upcoming: 0, past: 0, cancelled: 0 },
    );
  }, [bookingsData]);

  const bookings = useMemo(
    () =>
      bookingsData.filter(
        (booking: ManageBooking) => booking.status === activeTab,
      ),
    [activeTab, bookingsData],
  );

  const tabs: { id: ManageBookingStatus; label: string }[] = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <main className="min-h-[calc(100vh-160px)] bg-[#F3F5F7]">
      {/* HEADER SECTION */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#5D7FA7]" />

              <h1 className="text-lg font-bold text-slate-800">My Bookings</h1>
            </div>

            <p className="mt-1 pb-3 text-xs text-slate-400">
              Manage your upcoming, past, and cancelled flights.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`-mb-px inline-flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition ${
                    isActive
                      ? "border-[#5D7FA7] text-[#5D7FA7]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab.label}

                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      isActive
                        ? "bg-[#EAF0F7] text-[#5D7FA7]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {counts[tab.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOOKINGS SECTION */}
      <section className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">
        <div className="space-y-4">
          {bookings.map((booking: ManageBooking) => {
            const statusLabel = getStatusLabel(booking.status);

            const badgeClass =
              booking.status === "upcoming"
                ? "bg-[#EAF0F7] text-[#5D7FA7]"
                : getStatusBadgeClass(booking.status);

            return (
              <Link
                key={booking.id}
                to={ROUTES.MANAGE_BOOKING_DETAIL.replace(":id", booking.id)}
                className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF0F7] text-[#5D7FA7]">
                    <Plane className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-800">
                        {booking.fromCode} {"->"} {booking.toCode}
                      </p>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${badgeClass}`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      {booking.fromCity} {"->"} {booking.toCity}
                    </p>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-8">
                  <div className="grid w-full grid-cols-2 gap-4 text-xs text-slate-500 sm:ml-auto sm:w-auto sm:flex sm:items-center sm:gap-10 sm:text-right">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Date
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {booking.date}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        {booking.departTime} - {booking.cabin}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        PNR
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#5D7FA7]">
                        {booking.pnr}
                      </p>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Total
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {formatPeso(booking.total)}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="hidden h-5 w-5 text-slate-300 sm:block" />
                </div>
              </Link>
            );
          })}

          {bookings.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              No bookings found in this category.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ManageBookingsPage;
