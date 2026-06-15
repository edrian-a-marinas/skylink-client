import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { FileSpreadsheet, FileText } from "lucide-react";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import { cn } from "@/utils/cn";
import { getDemandForecast } from "@/api/reports.api";
import { exportCSV, exportPDF } from "../__docs/export";
import type { DemandForecastRoute } from "@/types";
import type { ReportDataRow, DateRange } from "./types";

interface Props {
  dateRange: DateRange;
  dateRangeLabel: string;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

const confidenceBadge = (confidence: string) => {
  if (confidence === "high") return "bg-emerald-100 text-emerald-700";
  if (confidence === "medium") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-500";
};

const DemandForecast = ({ dateRangeLabel, onToast }: Props) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["demand-forecast"],
    queryFn: async () => {
      const result = await getDemandForecast();
      return result.routes as DemandForecastRoute[];
    },
    staleTime: 10 * 60 * 1000,
  });

  const maxPredicted = Math.max(...data.map((r) => r.predicted_bookings_next_30_days), 1);

  const columns: TableColumn<DemandForecastRoute>[] = [
    { key: "route", header: "ROUTE", cell: (row) => <span className="font-bold text-slate-800">{row.route}</span> },
    { key: "predicted_bookings_next_30_days", header: "PREDICTED (30 DAYS)", cell: (row) => <span className="font-bold text-[#496B92]">{row.predicted_bookings_next_30_days}</span> },
    { key: "avg_monthly_bookings", header: "AVG MONTHLY", cell: (row) => <span className="text-slate-600 font-medium">{row.avg_monthly_bookings}</span> },
    {
      key: "confidence", header: "CONFIDENCE",
      cell: (row) => (
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", confidenceBadge(row.confidence))}>
          {row.confidence}
        </span>
      ),
    },
  ];

  const exportRows: ReportDataRow[] = data.map((r) => ({
    period: r.route,
    value: r.predicted_bookings_next_30_days,
    change: r.confidence,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-50">
          <div>
            <div className="flex items-center gap-2 group/demand relative">
              <h3 className="text-lg font-bold text-slate-900">Demand Forecast by Route</h3>
              <span className="text-[11px] text-slate-400 cursor-default select-none">ⓘ</span>
              <div className="absolute left-0 top-full mt-2 z-50 hidden group-hover/demand:flex w-64 rounded-xl bg-slate-900 text-white p-3 shadow-xl pointer-events-none">
                <p className="text-[11px] text-slate-300 leading-relaxed">Estimates how many bookings each route will get in the next 30 days, based on historical booking patterns. Use this to spot which routes need more flights or promotions.</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{dateRangeLabel} · Next 30 days</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportCSV("demand", exportRows, "Demand Forecast", (msg) => onToast(msg, "success"))}
              className="flex items-center gap-2 border border-slate-200 bg-white hover:border-[#496B92] hover:text-[#496B92] text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <FileSpreadsheet size={15} /> Export CSV
            </button>
            <button
              onClick={() => exportPDF("demand", exportRows, "Demand Forecast", dateRangeLabel, (msg) => onToast(msg, "info"), (msg) => onToast(msg, "success"))}
              className="flex items-center gap-2 bg-[#496B92] hover:bg-[#3B5470] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <FileText size={15} /> Export PDF
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-slate-400 font-medium text-sm text-center py-10">No demand forecast data available.</p>
        ) : (
          <div className="space-y-3 pt-2">
            {data.map((r) => (
              <div key={r.route} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>{r.route}</span>
                  <span className="flex items-center gap-1">
                    {r.predicted_bookings_next_30_days > r.avg_monthly_bookings
                      ? <ArrowUpRight size={13} className="text-emerald-500" />
                      : <ArrowDownRight size={13} className="text-rose-500" />}
                    {r.predicted_bookings_next_30_days} bookings
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#496B92] transition-all duration-700"
                    style={{ width: `${(r.predicted_bookings_next_30_days / maxPredicted) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
          <h3 className="text-sm font-bold text-slate-900">Route Breakdown</h3>
        </div>
        <div className="p-1">
          {isLoading ? (
            <div className="py-16 flex justify-center">
              <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={data}
              rowKey={(r) => r.route}
              emptyState={<div className="py-16 text-center text-slate-400 font-medium">No data available.</div>}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default DemandForecast;