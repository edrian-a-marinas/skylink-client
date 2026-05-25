import { ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";
import {
  Plane,
  Ticket,
  Users,
  Banknote,
} from "lucide-react";
import AdminLayout from "./_components/AdminLayout";
import KPICard from "./_components/KPICard";
import DashboardCharts from "./_components/DashboardCharts";
import SystemAlerts from "./_components/SystemAlerts";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import StatusBadge from "@/pages/_shared/components/ui/StatusBadge";

type RecentBooking = {
  pnr: string;
  passenger: string;
  route: string;
  date: string;
  status: string;
  amount: string;
};

const RECENT_BOOKINGS: RecentBooking[] = [
  { pnr: "AB1234", passenger: "Maria Santos", route: "MNL → CEB", date: "2026-04-12", status: "confirmed", amount: "₱3,150" },
  { pnr: "CD5678", passenger: "Juan dela Cruz", route: "CEB → MNL", date: "2026-04-12", status: "confirmed", amount: "₱3,150" },
  { pnr: "EF9012", passenger: "Ana Reyes", route: "MNL → DVO", date: "2026-04-12", status: "boarding", amount: "₱2,250" },
  { pnr: "GH3456", passenger: "Carlos Garcia", route: "MNL → KUL", date: "2026-04-12", status: "confirmed", amount: "₱6,200" },
  { pnr: "IJ7890", passenger: "Luisa Fernandez", route: "MNL → NRT", date: "2026-04-12", status: "confirmed", amount: "₱24,750" },
];

const AdminDashboardPage = () => {
  const columns: TableColumn<RecentBooking>[] = [
    {
      key: "pnr",
      header: "PNR",
      cell: (row) => <span className="font-bold text-blue-600">{row.pnr}</span>,
    },
    {
      key: "passenger",
      header: "Passenger",
      cell: (row) => <span className="font-medium text-slate-700">{row.passenger}</span>,
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
      cell: (row) => <span className="font-bold text-slate-900">{row.amount}</span>,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 font-medium">Welcome back! Here's what's happening today.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            label="Total Flights"
            value="284"
            change="8%"
            trend="up"
            icon={Plane}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <KPICard
            label="Active Bookings"
            value="1,842"
            change="12%"
            trend="up"
            icon={Ticket}
            iconBg="bg-sky-50"
            iconColor="text-sky-600"
          />
          <KPICard
            label="Total Users"
            value="9,421"
            change="5%"
            trend="up"
            icon={Users}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <KPICard
            label="Revenue Today (₱)"
            value="₱284,500"
            change="3%"
            trend="down"
            icon={Banknote}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
        </div>

        {/* Charts */}
        <DashboardCharts />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Bookings Table */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Recent Bookings</h3>
                <Link to={ROUTES.ADMIN_BOOKINGS} className="text-sm font-bold text-blue-600 hover:underline">
                  View all →
                </Link>
              </div>
              <DataTable
                columns={columns}
                rows={RECENT_BOOKINGS}
                rowKey={(row) => row.pnr}
              />
            </div>
          </div>

          {/* System Alerts */}
          <div>
            <SystemAlerts />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
