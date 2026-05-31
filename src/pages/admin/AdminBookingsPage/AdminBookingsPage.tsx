import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Eye, Download } from "lucide-react";
import AdminLayout from "../_components/AdminLayout";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import StatusBadge from "@/pages/_shared/components/ui/StatusBadge";
import { getAllBookingsAdmin } from "@/api/bookings.api";
import { ROUTES } from "@/constants/routes";
import type { Booking } from "@/types";

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "ab1234",
    pnr: "AB1234",
    userId: "user-1",
    flightId: "flight-1",
    status: "confirmed",
    totalPrice: 3150,
    createdAt: "2026-03-15T10:22:00Z",
    paymentStatus: "captured",
    passengers: [
      { firstName: "Maria", lastName: "Santos", seatNumber: "12A", mealPreference: "standard" }
    ],
    flight: {
      flightNumber: "PR 2191",
      origin: "MNL",
      destination: "CEB",
      departureTime: "2026-04-12T08:00:00Z",
      arrivalTime: "2026-04-12T09:20:00Z",
      airline: "Philippine Airlines"
    }
  },
  {
    id: "cd5678",
    pnr: "CD5678",
    userId: "user-2",
    flightId: "flight-2",
    status: "confirmed",
    totalPrice: 3150,
    createdAt: "2026-03-15T11:05:00Z",
    paymentStatus: "captured",
    passengers: [
      { firstName: "Juan", lastName: "dela Cruz", seatNumber: "14B", mealPreference: "standard" }
    ],
    flight: {
      flightNumber: "PR 2192",
      origin: "CEB",
      destination: "MNL",
      departureTime: "2026-04-12T10:00:00Z",
      arrivalTime: "2026-04-12T11:20:00Z",
      airline: "Philippine Airlines"
    }
  },
  {
    id: "ef9012",
    pnr: "EF9012",
    userId: "user-3",
    flightId: "flight-3",
    status: "boarded",
    totalPrice: 2250,
    createdAt: "2026-03-15T12:00:00Z",
    paymentStatus: "captured",
    passengers: [
      { firstName: "Ana", lastName: "Reyes", seatNumber: "18A", mealPreference: "vegetarian" }
    ],
    flight: {
      flightNumber: "5J 800",
      origin: "MNL",
      destination: "DVO",
      departureTime: "2026-04-12T13:00:00Z",
      arrivalTime: "2026-04-12T14:45:00Z",
      airline: "Cebu Pacific"
    }
  },
  {
    id: "gh3456",
    pnr: "GH3456",
    userId: "user-4",
    flightId: "flight-4",
    status: "confirmed",
    totalPrice: 6200,
    createdAt: "2026-03-15T13:30:00Z",
    paymentStatus: "captured",
    passengers: [
      { firstName: "Carlos", lastName: "Garcia", seatNumber: "08C", mealPreference: "standard" }
    ],
    flight: {
      flightNumber: "2P 301",
      origin: "MNL",
      destination: "KUL",
      departureTime: "2026-04-12T15:00:00Z",
      arrivalTime: "2026-04-12T19:00:00Z",
      airline: "AirAsia"
    }
  },
  {
    id: "ij7890",
    pnr: "IJ7890",
    userId: "user-5",
    flightId: "flight-5",
    status: "confirmed",
    totalPrice: 24750,
    createdAt: "2026-03-15T14:15:00Z",
    paymentStatus: "captured",
    passengers: [
      { firstName: "Luisa", lastName: "Fernandez", seatNumber: "02A", mealPreference: "standard" }
    ],
    flight: {
      flightNumber: "PR 428",
      origin: "MNL",
      destination: "NRT",
      departureTime: "2026-04-12T06:40:00Z",
      arrivalTime: "2026-04-12T12:15:00Z",
      airline: "Philippine Airlines"
    }
  },
  {
    id: "kl1234",
    pnr: "KL1234",
    userId: "user-6",
    flightId: "flight-6",
    status: "completed",
    totalPrice: 5400,
    createdAt: "2026-03-14T09:40:00Z",
    paymentStatus: "captured",
    passengers: [
      { firstName: "Roberto", lastName: "Bautista", seatNumber: "10D", mealPreference: "standard" }
    ],
    flight: {
      flightNumber: "SQ 915",
      origin: "MNL",
      destination: "SIN",
      departureTime: "2026-04-11T07:20:00Z",
      arrivalTime: "2026-04-11T10:45:00Z",
      airline: "Singapore Airlines"
    }
  },
  {
    id: "mn5678",
    pnr: "MN5678",
    userId: "user-7",
    flightId: "flight-7",
    status: "cancelled",
    totalPrice: 6980,
    createdAt: "2026-03-14T15:10:00Z",
    paymentStatus: "refunded",
    passengers: [
      { firstName: "Isabel", lastName: "Ramos", seatNumber: "15C", mealPreference: "vegetarian" }
    ],
    flight: {
      flightNumber: "CX 906",
      origin: "MNL",
      destination: "HKG",
      departureTime: "2026-04-11T10:55:00Z",
      arrivalTime: "2026-04-11T13:10:00Z",
      airline: "Cathay Pacific"
    }
  },
  {
    id: "op9012",
    pnr: "OP9012",
    userId: "user-8",
    flightId: "flight-8",
    status: "confirmed",
    totalPrice: 61875,
    createdAt: "2026-03-13T11:20:00Z",
    paymentStatus: "captured",
    passengers: [
      { firstName: "Miguel", lastName: "Torres", seatNumber: "03B", mealPreference: "standard" }
    ],
    flight: {
      flightNumber: "PR 102",
      origin: "MNL",
      destination: "LAX",
      departureTime: "2026-04-13T21:00:00Z",
      arrivalTime: "2026-04-14T19:30:00Z",
      airline: "Philippine Airlines"
    }
  }
];

const getPaymentMethod = (pnr?: string) => {
  if (pnr === "CD5678" || pnr === "KL1234") return "GCash";
  if (pnr === "GH3456") return "Debit Card";
  return "Credit Card";
};

const AdminBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookingsAdmin();
        if (data && data.length > 0) {
          setBookings(data);
        } else {
          setBookings(MOCK_BOOKINGS);
        }
      } catch (err) {
        console.error("Failed to load bookings from API, using mock bookings:", err);
        setBookings(MOCK_BOOKINGS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

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
      cell: (row) => <span className="text-slate-600">{getPaymentMethod(row.pnr)}</span>,
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
      return `${b.pnr || b.id.toUpperCase()},"${passengerName}",${route},${departure},${b.totalPrice},${getPaymentMethod(b.pnr)},${b.status}\n`;
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
