import { useState, useEffect, useMemo } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import { exportCSV, exportPDF } from "../__docs/export";
import type { DateRange, RouteDataRow } from "./types"; 
import type { RouteBookingPoint } from "@/types/report.types";
import { getRouteReport } from "@/api/reports.api";

interface Props {
  dateRange: DateRange;
  dateRangeLabel: string;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
  customStartDate?: string;
  customEndDate?: string;
}

const BookingsRoute = ({ dateRange, dateRangeLabel, onToast, customStartDate, customEndDate }: Props) => {
  const [routes, setRoutes] = useState<RouteBookingPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const now = new Date();
    let date_from: string | undefined;
    let date_to: string | undefined = now.toISOString();

    if (dateRange === "custom") {
      if (customStartDate && customEndDate) {
        date_from = new Date(customStartDate + "T00:00:00.000Z").toISOString();
        date_to = new Date(customEndDate + "T23:59:59.999Z").toISOString();
      } else {
        date_from = undefined;
        date_to = undefined;
      }
    } else if (dateRange === "today") {
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      date_from = start.toISOString();
    } else if (dateRange === "week") {
      const start = new Date(now); start.setDate(now.getDate() - 7);
      date_from = start.toISOString();
    } else if (dateRange === "month") {
      const start = new Date(now); start.setMonth(now.getMonth() - 1);
      date_from = start.toISOString();
    } else if (dateRange === "3months") {
      const start = new Date(now); start.setMonth(now.getMonth() - 3);
      date_from = start.toISOString();
    } else {
      date_from = undefined;
      date_to = undefined;
    }

    const fetch = async () => {
      setIsLoading(true);
      try {
        const data = await getRouteReport(
          date_from !== undefined
            ? ({ date_from, date_to } as any)
            : undefined
        );
        setRoutes(data.routes ?? []);
      } catch (err) {
        console.error("Failed to load route report:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [dateRange, customStartDate, customEndDate]);

  // Chart: horizontal bar chart — top routes by bookings
  const maxBookings = useMemo(() => Math.max(...routes.map(r => r.bookings), 1), [routes]);

  
  const tableRows: RouteDataRow[] = useMemo(() => 
    routes.map(r => ({
      route: r.route,
      bookings: r.bookings,
      revenue: `₱${(r.revenue / 100).toLocaleString()}`,
    })),
    [routes]
  );

  const columns: TableColumn<RouteDataRow>[] = [ 
    {
      key: "route", 
      header: "ROUTE",
      cell: (row) => <span className="font-bold text-slate-800">{row.route}</span>, 
    },
    {
      key: "bookings", 
      header: "BOOKINGS",
      cell: (row) => <span className="font-bold text-slate-900">{row.bookings.toLocaleString()}</span>,
    },
    {
      key: "revenue", 
      header: "REVENUE",
      cell: (row) => <span className="font-bold text-slate-900">{row.revenue}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Chart Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Bookings by Route</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{dateRangeLabel}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportCSV("route", tableRows.map(r => ({ period: r.route, value: r.bookings, change: r.revenue })), "Bookings by Route", (msg) => onToast(msg, "success"))}
              className="flex items-center gap-2 border border-slate-200 bg-white hover:border-[#496B92] hover:text-[#496B92] text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <FileSpreadsheet size={15} /> Export CSV
            </button>
            <button
              onClick={() => exportPDF("route", tableRows.map(r => ({ period: r.route, value: r.bookings, change: r.revenue })), "Bookings by Route", dateRangeLabel, (msg) => onToast(msg, "info"), (msg) => onToast(msg, "success"))}
              className="flex items-center gap-2 bg-[#496B92] hover:bg-[#3B5470] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <FileText size={15} /> Export PDF
            </button>
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="relative min-h-[200px] flex items-center justify-center">
          {isLoading ? (
            <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full" />
          ) : routes.length === 0 ? (
            <p className="text-slate-400 font-medium text-sm">No data for this period.</p>
          ) : (
            <div className="w-full space-y-3">
              {routes.map((r) => (
                <div key={r.route} className="flex items-center gap-4">
                  <span className="w-28 text-xs font-bold text-slate-600 text-right shrink-0">{r.route}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-4 rounded-full bg-[#496B92] transition-all duration-500"
                      style={{ width: `${(r.bookings / maxBookings) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-xs font-bold text-slate-700 shrink-0">{r.bookings}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
          <h3 className="text-sm font-bold text-slate-900">Data Table</h3>
        </div>
        <div className="p-1">
          {isLoading ? (
            <div className="py-16 flex justify-center">
              <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={tableRows}
              rowKey={(r) => r.route}
              emptyState={<div className="py-16 text-center text-slate-400 font-medium">No data available.</div>}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default BookingsRoute;