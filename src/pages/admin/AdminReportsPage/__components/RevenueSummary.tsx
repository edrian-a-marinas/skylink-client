import { useState, useMemo, useEffect } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import { cn } from "@/utils/cn";
import { generateReport } from "@/api/reports.api";
import { exportCSV, exportPDF } from "../__docs/export";
import type { DateRange, BookingReport, ReportDataRow } from "./types";

interface Props {
  dateRange: DateRange;
  dateRangeLabel: string;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
  customStartDate?: string;
  customEndDate?: string;
}

const RevenueSummary = ({ dateRange, dateRangeLabel, onToast, customStartDate, customEndDate }: Props) => {
  const [reportData_api, setReportData_api] = useState<BookingReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

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
        const data = await generateReport(
          date_from !== undefined
            ? ({ date_from: date_from as string, date_to: date_to as string } as any)
            : undefined
        );
        setReportData_api(data as unknown as BookingReport);
      } catch (err) {
        console.error("Failed to load revenue report:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [dateRange, customStartDate, customEndDate]);

  // @ts-ignore
  const reportData: ReportDataRow[] = useMemo(() => {
    if (!reportData_api?.monthly_revenue?.length) return [];
    return reportData_api.monthly_revenue.map((m, idx, arr) => {
      const prev = arr[idx - 1];
      const changeValue = prev
        ? parseFloat((((m.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1))
        : undefined;
      return {
        period: `${m.month} ${m.year}`,
        value: m.revenue / 100,
        change: changeValue !== undefined ? `${changeValue > 0 ? "+" : ""}${changeValue}%` : "—",
        changeValue,
      };
    });
  }, [reportData_api]);

  const chartPoints = useMemo(() => {
    if (reportData.length === 0) return [];
    const count = reportData.length;
    const xStart = 120, xEnd = 660;
    const xCoords = reportData.map((_, i) =>
      count === 1 ? (xStart + xEnd) / 2 : xStart + (i / (count - 1)) * (xEnd - xStart)
    );
    const maxVal = Math.max(...reportData.map(d => typeof d.value === "number" ? d.value : 0));
    const maxY = maxVal > 0 ? Math.ceil(maxVal * 1.3) : 100;
    return reportData.map((d, idx) => {
      const val = typeof d.value === "number" ? d.value : 0;
      return { x: xCoords[idx], y: 260 - (val / maxY) * 200, value: val, period: d.period };
    });
  }, [reportData]);

  const chartSmoothPath = useMemo(() => {
    if (chartPoints.length === 0) return "";
    let d = `M ${chartPoints[0].x},${chartPoints[0].y}`;
    for (let i = 0; i < chartPoints.length - 1; i++) {
      const p0 = chartPoints[i], p1 = chartPoints[i + 1];
      const cpX = p0.x + (p1.x - p0.x) / 2;
      d += ` C ${cpX},${p0.y} ${cpX},${p1.y} ${p1.x},${p1.y}`;
    }
    return d;
  }, [chartPoints]);

  const chartFillPath = useMemo(() => {
    if (!chartSmoothPath || chartPoints.length === 0) return "";
    return `${chartSmoothPath} L ${chartPoints[chartPoints.length - 1].x},260 L ${chartPoints[0].x},260 Z`;
  }, [chartSmoothPath, chartPoints]);

  const columns: TableColumn<ReportDataRow>[] = [
    { key: "period", header: "PERIOD", cell: (row) => <span className="font-bold text-slate-800">{row.period}</span> },
    { key: "value", header: "VALUE", cell: (row) => <span className="font-bold text-slate-900">₱{(row.value as number).toLocaleString()}</span> },
    {
      key: "change", header: "CHANGE", cell: (row) => {
        if (!row.changeValue) return <span className="text-slate-400 font-medium">—</span>;
        const isUp = row.changeValue > 0;
        return (
          <span className={cn("inline-flex items-center gap-1 font-bold text-xs", isUp ? "text-emerald-600" : "text-rose-600")}>
            {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {row.change}
          </span>
        );
      }
    },
  ];

  return (
    <div className="space-y-6">
      {/* Chart Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Revenue Summary</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{dateRangeLabel}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportCSV("revenue", reportData, "Revenue Summary", (msg) => onToast(msg, "success"))}
              className="flex items-center gap-2 border border-slate-200 bg-white hover:border-[#496B92] hover:text-[#496B92] text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <FileSpreadsheet size={15} /> Export CSV
            </button>
            <button
              onClick={() => exportPDF("revenue", reportData, "Revenue Summary", dateRangeLabel, (msg) => onToast(msg, "info"), (msg) => onToast(msg, "success"))}
              className="flex items-center gap-2 bg-[#496B92] hover:bg-[#3B5470] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <FileText size={15} /> Export PDF
            </button>
          </div>
        </div>

        <div className="relative pt-6 min-h-[320px] flex items-center justify-center bg-slate-50/20 rounded-2xl border border-slate-100/50">
          {isLoading ? (
            <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full" />
          ) : chartPoints.length === 0 ? (
            <p className="text-slate-400 font-medium text-sm">No data for this period.</p>
          ) : (
            <svg className="w-full h-[280px]" viewBox="0 0 800 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#496B92" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#496B92" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {Array.from({ length: 5 }).map((_, idx) => {
                const y = 60 + idx * 50;
                const maxVal = Math.max(...chartPoints.map(p => p.value));
                const step = maxVal > 0 ? Math.ceil(maxVal / 4) : 0;
                return (
                  <g key={idx}>
                    <line x1="80" y1={y} x2="720" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x="70" y={y + 4} textAnchor="end" className="text-[10px] font-bold text-slate-400 fill-current">
                      ₱{((4 - idx) * step).toLocaleString()}
                    </text>
                  </g>
                );
              })}
              {chartPoints.map((pt, idx) => (
                <text key={idx} x={pt.x} y="280" textAnchor="middle" className="text-xs font-bold text-slate-400 fill-current">{pt.period}</text>
              ))}
              {chartFillPath && <path d={chartFillPath} fill="url(#chart-gradient)" />}
              {chartSmoothPath && <path d={chartSmoothPath} fill="none" stroke="#496B92" strokeWidth="3.5" strokeLinecap="round" />}
              {chartPoints.map((pt, idx) => (
                <g key={idx} className="cursor-pointer">
                  <circle cx={pt.x} cy={pt.y} r="15" fill="transparent" onMouseEnter={() => setHoveredPoint(idx)} onMouseLeave={() => setHoveredPoint(null)} />
                  <circle cx={pt.x} cy={pt.y} r={hoveredPoint === idx ? "7" : "5"} fill="#496B92" stroke="#ffffff" strokeWidth={hoveredPoint === idx ? "3" : "2"} className="transition-all duration-150" />
                </g>
              ))}
              <line x1="80" y1="260" x2="720" y2="260" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="80" y1="60" x2="80" y2="260" stroke="#cbd5e1" strokeWidth="1" />
            </svg>
          )}
          {hoveredPoint !== null && chartPoints[hoveredPoint] && (
            <div
              className="absolute bg-slate-900/95 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-slate-700 pointer-events-none flex flex-col gap-0.5"
              style={{ left: `${(chartPoints[hoveredPoint].x / 800) * 100}%`, top: `${((chartPoints[hoveredPoint].y - 55) / 300) * 100}%`, transform: "translateX(-50%)" }}
            >
              <span className="text-slate-400 font-semibold">{chartPoints[hoveredPoint].period}</span>
              <span className="text-white text-sm">₱{chartPoints[hoveredPoint].value.toLocaleString()}</span>
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
              rows={reportData}
              rowKey={(r) => r.period}
              emptyState={<div className="py-16 text-center text-slate-400 font-medium">No data available.</div>}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default RevenueSummary;