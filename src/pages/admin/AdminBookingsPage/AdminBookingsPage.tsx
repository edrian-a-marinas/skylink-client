import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "../_components/AdminLayout";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import StatusBadge from "@/pages/_shared/components/ui/StatusBadge";
import { getAllBookingsAdmin } from "@/api/bookings.api";
import { ROUTES } from "@/constants/routes";
import type { Booking } from "@/types";
import AdminBookingDrawer from "./_AdminBookingDrawer"; 


const getPaymentMethod = (booking?: any) => {
  return booking?.payment?.payment_method_type ?? "—";
};

const AdminBookingsPage = () => {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const normalizeBooking = (b: any): Booking => ({
    id: String(b.id),
    pnr: b.id.toString().toUpperCase().slice(0, 8),
    userId: String(b.user_id ?? b.userId ?? ""),
    flightId: String(b.flight?.id ?? b.flight_id ?? ""),
    status: b.status ?? "confirmed",
    totalPrice: b.total_price ?? b.totalPrice ?? 0,
    createdAt: b.booked_at ?? b.createdAt ?? new Date().toISOString(),
    updatedAt: b.updated_at ?? b.updatedAt ?? b.booked_at ?? new Date().toISOString(),
    paymentStatus: b.status === "cancelled" ? "refunded" : "captured",
    flight: b.flight ? {
      flightNumber: b.flight.flight_number ?? b.flight.flightNumber ?? "—",
      origin: b.flight.origin_airport?.iata_code ?? b.flight.origin ?? "—",
      destination: b.flight.destination_airport?.iata_code ?? b.flight.destination ?? "—",
      departureTime: b.flight.departure_time ?? b.flight.departureTime ?? b.booked_at,
      arrivalTime: b.flight.arrival_time ?? b.flight.arrivalTime ?? b.booked_at,
      airline: b.flight.origin_airport?.name ?? "—",
    } : {
      flightNumber: "—", origin: "—", destination: "—",
      departureTime: b.booked_at ?? new Date().toISOString(),
      arrivalTime: b.booked_at ?? new Date().toISOString(),
      airline: "—",
    },
    passengers: Array.isArray(b.passengers) && b.passengers.length > 0
      ? b.passengers.map((p: any) => ({
          firstName: p.first_name ?? p.firstName ?? "—",
          lastName: p.last_name ?? p.lastName ?? "—",
          seatNumber: b.seat_number ?? b.seatNumber ?? "—",
          mealPreference: "standard",
        }))
      : [],
  });

  const { data: bookingsResult, isLoading } = useQuery({
    queryKey: ["admin-bookings", currentPage, statusFilter, searchQuery, dateFilter],
    queryFn: async () => {
      const params: Parameters<typeof getAllBookingsAdmin>[0] = {
        page: currentPage,
        size: itemsPerPage,
      };
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;
      if (dateFilter) params.departure_date = dateFilter;
      const result = await getAllBookingsAdmin(params);
      return {
        bookings: (result?.items ?? []).map(normalizeBooking),
        total: result?.total ?? 0,
      };
    },
    staleTime: 30 * 1000,
  });

  const bookings = bookingsResult?.bookings ?? [];
  const totalBookings = bookingsResult?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalBookings / itemsPerPage));
  // Columns definition
  const columns: TableColumn<Booking>[] = [
    {
      key: "pnr",
      header: "PNR",
      cell: (row) => (
        <Link
          to={ROUTES.ADMIN_BOOKING_DETAIL.replace(":id", row.id)}
          className="font-bold text-[#496B92] hover:underline"
        >
          {row.pnr || row.id.toUpperCase()}
        </Link>
      ),
    },
    {
      key: "passenger",
      header: "PASSENGER",
      cell: (row) => {
        const p = row.passengers?.[0];
        return <span className="font-medium text-slate-900">{p ? `${p.firstName} ${p.lastName}` : "—"}</span>;
      },
    },
    {
      key: "route",
      header: "ROUTE",
      cell: (row) => (
        <span className="text-slate-700 font-medium">
          {row.flight ? `${row.flight.origin} → ${row.flight.destination}` : "—"}
        </span>
      ),
    },
    {
      key: "departure",
      header: "DEPARTURE",
      cell: (row) => (
        <span className="text-slate-500 whitespace-nowrap">
          {row.flight?.departureTime ? row.flight.departureTime.split("T")[0] : "—"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "AMOUNT",
      cell: (row) => (
        <span className="font-bold text-slate-950">
          ₱{(row.totalPrice ?? 0).toLocaleString("en-US")}
        </span>
      ),
    },
    {
      key: "payment",
      header: "PAYMENT",
      cell: (row) => <span className="text-slate-600">{getPaymentMethod(row)}</span>,
    },
    {
      key: "status",
      header: "STATUS",
      cell: (row) => <StatusBadge label={row.status} />,
    },
    {
      key: "actions",
      header: "ACTIONS",
      cell: (row) => (
        <button
          onClick={() => setSelectedBookingId(row.id)} 
          className="p-2 text-slate-500 hover:text-[#496B92] hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors"
          aria-label="View Booking"
        >
          <Eye size={15} />
        </button>
      ),
    },
  ];

  const handleExportCSV = () => {
    const headers = ["PNR,Passenger,Route,Departure,Amount,Payment Method,Status\n"];
    const rows = bookings.map((b) => {
      const p = b.passengers?.[0];
      const passengerName = p ? `${p.firstName} ${p.lastName}` : "—";
      const route = b.flight ? `${b.flight.origin} -> ${b.flight.destination}` : "—";
      const departure = b.flight ? b.flight.departureTime.split("T")[0] : "—";
      return `${b.pnr || b.id.toUpperCase()},"${passengerName}",${route},${departure},${b.totalPrice},${getPaymentMethod(b)},${b.status}\n`;
    });
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bookings_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Bookings</h2>
            <p className="text-sm font-medium text-slate-500">
              {totalBookings} bookings found
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 border border-slate-200 bg-white hover:border-[#496B92] hover:text-[#496B92] text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          {/* Search bar */}
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by PNR, passenger, or route..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-xl bg-slate-50 pl-10 pr-4 text-sm outline-none border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Status dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl bg-slate-50 border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 px-4 text-sm font-medium text-slate-600 outline-none transition-all cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="boarded">Boarded</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Method dropdown   --> MIGHT REMOVE THE WHOLE DROPDOWN
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl bg-slate-50 border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 px-4 text-sm font-medium text-slate-600 outline-none transition-all cursor-pointer"
          >
            <option value="">All Payment Methods</option>
            <option value="Credit Card">Credit Card</option>
            <option value="GCash">GCash</option>
            <option value="Debit Card">Debit Card</option>
          </select>
          */}

          {/* Departure Date */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl bg-slate-50 border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 px-4 text-sm font-medium text-slate-600 outline-none transition-all cursor-pointer"
          />
        </div>

        {/* Table list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            rows={bookings}
            rowKey={(r) => r.id}
            emptyState={
              <div className="py-20 text-center">
                {isLoading ? (
                  <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full mx-auto" />
                ) : (
                  <p className="text-slate-500 font-medium">No bookings found.</p>
                )}
              </div>
            }
          />

          {/* Pagination */}
          {bookings.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50 bg-slate-50/30">
              <p className="text-sm font-medium text-slate-500">
                Showing {Math.min(totalBookings, (currentPage - 1) * itemsPerPage + 1)}-
                {Math.min(totalBookings, currentPage * itemsPerPage)} of {totalBookings}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  &lt;
                </button>
                {(() => {
                  const pages: (number | "...")[] = [];
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (currentPage > 3) pages.push("...");
                    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
                    if (currentPage < totalPages - 2) pages.push("...");
                    pages.push(totalPages);
                  }
                  return pages.map((p, idx) =>
                    p === "..." ? (
                      <span key={`e-${idx}`} className="px-2 py-1.5 text-xs text-slate-400">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          currentPage === p
                            ? "bg-[#496B92] text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >{p}</button>
                    )
                  );
                })()}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <AdminBookingDrawer
        bookingId={selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
      />
    </AdminLayout>
  );
};
export default AdminBookingsPage;
