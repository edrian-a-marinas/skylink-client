import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Eye, Download } from "lucide-react";
import AdminLayout from "../_components/AdminLayout";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import StatusBadge from "@/pages/_shared/components/ui/StatusBadge";
import { getAllBookingsAdmin } from "@/api/bookings.api";
import { getCancellationRisk } from "@/api/reports.api";
import type { CancellationRisk } from "@/types";
import { ROUTES } from "@/constants/routes";
import type { Booking } from "@/types";


const getPaymentMethod = (booking?: any) => {
  return booking?.payment?.payment_method_type ?? "—";
};

const AdminBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  // Payment filter removed from UI since payment method comes from real data
  const [dateFilter, setDateFilter] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [riskScores, setRiskScores] = useState<Record<string, CancellationRisk>>({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookingsAdmin();
        if (data && data.length > 0) {
          const normalized = data.map((b: any) => ({
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
              flightNumber: "—",
              origin: "—",
              destination: "—",
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
          }));
          setBookings(normalized as Booking[]);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("Failed to load bookings from API:", err);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    if (bookings.length === 0) return;
    const fetchRisks = async () => {
      const results = await Promise.allSettled(
        bookings
          .filter((b) => b.status !== "cancelled")
          .slice(0, 20)
          .map((b) => getCancellationRisk(b.id))
      );
      const map: Record<string, CancellationRisk> = {};
      results.forEach((r) => {
        if (r.status === "fulfilled") {
          map[r.value.booking_id] = r.value;
        }
      });
      setRiskScores(map);
    };
    fetchRisks();
  }, [bookings]);

  // Filter logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const pnrMatch = b.pnr?.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase());
      const passenger = b.passengers?.[0];
      const nameMatch = passenger
        ? `${passenger.firstName} ${passenger.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        : false;
      const routeMatch = b.flight
        ? `${b.flight.origin} ${b.flight.destination}`.toLowerCase().includes(searchQuery.toLowerCase())
        : false;

      const matchesSearch = pnrMatch || nameMatch || routeMatch;

      const matchesStatus = statusFilter ? b.status === statusFilter : true;
      const matchesPayment = paymentFilter ? getPaymentMethod(b.pnr) === paymentFilter : true;
      const matchesDate = dateFilter
        ? b.flight?.departureTime?.startsWith(dateFilter)
        : true;

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [bookings, searchQuery, statusFilter, paymentFilter, dateFilter]);

  // Paginated bookings
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));

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
      key: "risk",
      header: (
        <div className="relative group/risk flex items-center gap-1 cursor-default">
          <span>RISK</span>
          <span className="text-[11px] text-slate-400 select-none">ⓘ</span>
          <div className="absolute left-0 top-full mt-2 z-50 hidden group-hover/risk:flex w-64 rounded-xl bg-slate-900 text-white p-3 shadow-xl pointer-events-none">
            <p className="text-[11px] text-slate-300 leading-relaxed">Estimates how likely each booking is to be cancelled, based on the route, seat class, ticket price, and how far in advance it was booked. High = needs attention.</p>
          </div>
        </div>
      ),
      cell: (row) => {
        const risk = riskScores[row.id];
        if (!risk || risk.risk_level === "unknown") {
          return <span className="text-slate-300 text-xs font-medium">—</span>;
        }
        const cls =
          risk.risk_level === "high"
            ? "bg-rose-100 text-rose-700"
            : risk.risk_level === "medium"
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700";
        return (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${cls}`}>
            {risk.risk_level}
            {risk.risk_score !== null && ` · ${risk.risk_score}%`}
          </span>
        );
      },
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
          onClick={() => navigate(ROUTES.ADMIN_BOOKING_DETAIL.replace(":id", row.id))}
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
    const rows = filteredBookings.map((b) => {
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
              {filteredBookings.length} bookings found
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

          {/* Payment Method dropdown */}
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
            rows={paginatedBookings}
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
          {filteredBookings.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50 bg-slate-50/30">
              <p className="text-sm font-medium text-slate-500">
                Showing {Math.min(filteredBookings.length, (currentPage - 1) * itemsPerPage + 1)}-
                {Math.min(filteredBookings.length, currentPage * itemsPerPage)} of {filteredBookings.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentPage === idx + 1
                        ? "bg-[#496B92] text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
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
    </AdminLayout>
  );
};

export default AdminBookingsPage;
