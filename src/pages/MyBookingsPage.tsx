import { useEffect } from "react";
import { useMyBookings } from "@/hooks/useBookings";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import StatusBadge from "@/pages/_shared/components/ui/StatusBadge";
import { Ticket, Plane, Calendar, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import type { Booking } from "@/types";

const MyBookingsPage = () => {
  const { data: bookings, isLoading, refetch } = useMyBookings();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const columns: TableColumn<Booking>[] = [
    {
      key: "pnr",
      header: "PNR",
      cell: (row) => <span className="font-bold text-blue-600 uppercase">{row.pnr || "—"}</span>,
    },
    {
      key: "flight",
      header: "FLIGHT",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Plane size={14} className="text-slate-400" />
          <span className="font-medium text-slate-700">{row.flight?.flightNumber || "PR 2191"}</span>
        </div>
      ),
    },
    {
      key: "route",
      header: "ROUTE",
      cell: (row) => (
        <span className="text-slate-600 font-medium">
          {row.flight?.origin || "MNL"} → {row.flight?.destination || "CEB"}
        </span>
      ),
    },
    {
      key: "date",
      header: "DEPARTURE",
      cell: (row) => (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Calendar size={14} />
          {row.flight?.departureTime ? new Date(row.flight.departureTime).toLocaleDateString() : "2026-04-12"}
        </div>
      ),
    },
    {
      key: "amount",
      header: "AMOUNT",
      cell: (row) => (
        <div className="flex items-center gap-1 font-bold text-slate-900">
          <CreditCard size={14} className="text-slate-400" />
          ₱{(row.totalPrice || 3150).toLocaleString()}
        </div>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      cell: (row) => <StatusBadge label={row.status || "confirmed"} />,
    },
    {
      key: "action",
      header: "",
      cell: (row) => (
        <Link 
          to={ROUTES.BOOKING_DETAIL.replace(":id", row.id)}
          className="text-blue-600 font-bold hover:underline text-xs"
        >
          Details
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 text-primary-60">
            <Ticket size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
            <p className="text-sm font-medium text-slate-500">Manage your flight reservations and itineraries.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            rows={bookings || []}
            rowKey={(row) => row.id}
            emptyState={
              <div className="py-20 text-center">
                {isLoading ? (
                  <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full mx-auto" />
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                      <Ticket size={32} />
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold text-lg">No bookings found</p>
                      <p className="text-slate-400 text-sm mt-1">You haven't made any reservations yet.</p>
                    </div>
                    <Link 
                      to={ROUTES.BOOK}
                      className="inline-block bg-primary-60 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-70 transition-all shadow-lg shadow-primary-60/20"
                    >
                      Book a Flight
                    </Link>
                  </div>
                )}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
