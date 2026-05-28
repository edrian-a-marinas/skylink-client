import AdminLayout from "./_components/AdminLayout";
import { useCallback, useMemo } from "react";
import { generateReport } from "@/api/reports.api";
import type { ReportResult } from "@/types";
import useAsyncValue from "@/hooks/useAsyncValue";

const DEFAULT_REPORT_QUERY = {
  type: "booking_summary" as const,
  filters: {
    datePreset: "this_month" as const,
  },
};

const FALLBACK_REPORT: ReportResult = {
  generatedAt: new Date().toISOString(),
  type: "booking_summary",
  metrics: [
    { label: "Bookings", value: 1842 },
    { label: "Revenue", value: 284500 },
    { label: "Cancelled", value: 18 },
  ],
  rows: [
    { route: "MNL → CEB", bookings: 420, revenue: 836000 },
    { route: "MNL → DVO", bookings: 211, revenue: 491500 },
    { route: "MNL → SIN", bookings: 98, revenue: 734200 },
  ],
};

const AdminReportsPage = () => {
  const loader = useCallback(async () => {
    try {
      return await generateReport(DEFAULT_REPORT_QUERY);
    } catch {
      return FALLBACK_REPORT;
    }
  }, []);

  const { data } = useAsyncValue(loader);

  const report = data ?? FALLBACK_REPORT;
  const columns = useMemo(() => {
    const firstRow = report.rows[0];
    return firstRow ? Object.keys(firstRow) : [];
  }, [report.rows]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
          <p className="text-sm font-medium text-slate-500">
            Generated {new Date(report.generatedAt).toLocaleString()}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {report.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                {metric.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {metric.value.toLocaleString("en-US")}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-50 bg-slate-50/30 px-6 py-4">
            <h3 className="text-lg font-bold text-slate-900">Report Rows</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-white">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {report.rows.map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column} className="px-6 py-4 text-slate-700">
                        {String(row[column] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
