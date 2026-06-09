import { useCallback, useMemo } from "react";
import { ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";
import { Plane, Ticket, Users, Banknote } from "lucide-react";
import AdminLayout from "./_components/AdminLayout";
import KPICard from "./_components/KPICard";
import DashboardCharts from "./_components/DashboardCharts";
import SystemAlerts from "./_components/SystemAlerts";
import DataTable, {
  type TableColumn,
} from "@/pages/_shared/components/ui/DataTable";
import StatusBadge from "@/pages/_shared/components/ui/StatusBadge";
import { getAllBookingsAdmin } from "@/api/bookings.api";
import { getUsers } from "@/api/users.api";
import { searchFlights } from "@/api/flights.api";
import type { Booking, Flight } from "@/types";
import useAsyncValue from "@/hooks/useAsyncValue";

type RecentBooking = {
  pnr: string;
  passenger: string;
  route: string;
  date: string;
  status: string;
  amount: string;
};

type DashboardData = {
  bookings: Booking[];
  flights: Flight[];
  totalUsers: number;
};

function mapBookingToRecentBooking(booking: any): RecentBooking {
  const origin = booking.flight?.origin_airport?.iata_code ?? "—";
  const destination = booking.flight?.destination_airport?.iata_code ?? "—";
  const route = `${origin} → ${destination}`;
  const date = booking.flight?.departure_time?.split?.("T")?.[0] ?? booking.booked_at?.split?.("T")?.[0] ?? "";
  return {
    pnr: booking.id.slice(0, 8).toUpperCase(),
    passenger: booking.seat_class?.name ?? "—",
    route,
    date,
    status: booking.status,
    amount: `₱${((booking.total_price ?? 0) / 100).toLocaleString("en-US")}`,
  };
}

const AdminDashboardPage = () => {
  const loader = useCallback(async (): Promise<DashboardData> => {
    try {
      const [bookings, users, flights] = await Promise.all([
        getAllBookingsAdmin(),
        getUsers(),
        searchFlights(),
      ]);

      return {
        bookings,
        flights,
        totalUsers: users.filter((user) => user.role_id !== 1).length,
      };
    } catch {
      return {
        bookings: [],
        flights: [],
        totalUsers: 0,
      };
    }
  }, []);

  const { data } = useAsyncValue(loader);
  const dashboardData = data ?? { bookings: [], flights: [], totalUsers: 0 };

  const recentBookings = useMemo(() => {
    return dashboardData.bookings.slice(0, 5).map(mapBookingToRecentBooking);
  }, [dashboardData.bookings]);

  const totalRevenue = useMemo(
    () =>
      dashboardData.bookings.reduce(
        (sum, booking) => sum + (booking.totalPrice ?? 0),
        0,
      ),
    [dashboardData.bookings],
  );

  const columns: TableColumn<RecentBooking>[] = useMemo(
    () => [
      {
        key: "pnr",
        header: "PNR",
        cell: (row) => (
          <span className="font-bold text-blue-600">{row.pnr}</span>
        ),
      },
      {
        key: "passenger",
        header: "Passenger",
        cell: (row) => (
          <span className="font-medium text-slate-700">{row.passenger}</span>
        ),
      },
      {
        key: "route",
        header: "Route",
        cell: (row) => <span className="text-slate-600">{row.route}</span>,
      },
      {
        key: "date",
        header: "Date",
        cell: (row) => <span className="text-slate-500">{row.date}</span>,
      },
      {
        key: "status",
        header: "Status",
        cell: (row) => <StatusBadge label={row.status} />,
      },
      {
        key: "amount",
        header: "Amount",
        cell: (row) => (
          <span className="font-bold text-slate-900">{row.amount}</span>
        ),
      },
    ],
    [],
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 font-medium">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            label="Total Flights"
            value={String(dashboardData.flights.length)}
            change="8%"
            trend="up"
            icon={Plane}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <KPICard
            label="Active Bookings"
            value={String(
              dashboardData.bookings.filter(
                (booking) => booking.status !== "cancelled",
              ).length,
            )}
            change="12%"
            trend="up"
            icon={Ticket}
            iconBg="bg-sky-50"
            iconColor="text-sky-600"
          />
          <KPICard
            label="Total Users"
            value={String(dashboardData.totalUsers)}
            change="5%"
            trend="up"
            icon={Users}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <KPICard
            label="Revenue Today (₱)"
            value={`₱${totalRevenue.toLocaleString("en-US")}`}
            change="3%"
            trend="down"
            icon={Banknote}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
        </div>

        {/* Charts */}
        <DashboardCharts bookings={dashboardData.bookings as any[]} />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Bookings Table */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Recent Bookings
                </h3>
                <Link
                  to={ROUTES.ADMIN_BOOKINGS}
                  className="text-sm font-bold text-blue-600 hover:underline"
                >
                  View all →
                </Link>
              </div>
              <DataTable
                columns={columns}
                rows={recentBookings}
                rowKey={(row) => row.pnr}
              />
            </div>
          </div>

          {/* System Alerts */}
          <div>
            <SystemAlerts flights={dashboardData.flights} bookings={dashboardData.bookings as any[]} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
