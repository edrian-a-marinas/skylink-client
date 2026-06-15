import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import type { ActivityLogItem } from "@/types/report.types";
import { getActivityLogs } from "@/api/reports.api";

const LOGS_PER_PAGE = 8;

const ActivityLogTab = () => {
  const [logSearch, setLogSearch] = useState("");
  const [logDateFilter, setLogDateFilter] = useState("");
  const [logPage, setLogPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["activity-logs", logPage, logSearch, logDateFilter],
    queryFn: async () => {
      const params: Record<string, string | number> = { page: logPage, size: LOGS_PER_PAGE };
      if (logSearch) params.search = logSearch;
      if (logDateFilter) {
        params.date_from = `${logDateFilter}T00:00:00Z`;
        params.date_to = `${logDateFilter}T23:59:59Z`;
      }
      const res = await getActivityLogs(params as any);
      return { logs: res.logs ?? [], total: res.total ?? 0 };
    },
    staleTime: 5 * 60 * 1000,
  });

  const logs = data?.logs ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LOGS_PER_PAGE));
  const handleSearch = (val: string) => {
    setLogSearch(val);
    setLogPage(1);
  };

  const handleDateFilter = (val: string) => {
    setLogDateFilter(val);
    setLogPage(1);
  };

  const columns: TableColumn<ActivityLogItem>[] = [
    {
      key: "attempted_at",
      header: "TIMESTAMP",
      cell: (row) => (
        <span className="text-slate-500 whitespace-nowrap">
          {new Date(row.attempted_at).toLocaleString("en-PH", { timeZone: "Asia/Manila" })}
        </span>
      ),
    },
    {
      key: "email",
      header: "EMAIL",
      cell: (row) => <span className="font-bold text-slate-800">{row.email}</span>,
    },
    {
      key: "ip_address",
      header: "IP ADDRESS",
      cell: (row) => (
        <span className="font-mono font-bold text-[#496B92]">{row.ip_address ?? "—"}</span>
      ),
    },
    {
      key: "id",
      header: "ACTION",
      cell: (row) => (
        <span
          className={`inline-flex border px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
            row.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {row.success ? "Login Success" : "Login Failed"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by email or IP..."
            value={logSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-11 w-full rounded-xl bg-slate-50 pl-10 pr-4 text-sm outline-none border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 transition-all placeholder:text-slate-400"
          />
        </div>
        <input
          type="date"
          value={logDateFilter}
          onChange={(e) => handleDateFilter(e.target.value)}
          className="h-11 rounded-xl bg-slate-50 border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 px-4 text-sm font-medium text-slate-600 outline-none transition-all cursor-pointer"
        />
      </div>

      {/* Table */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-1">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin size-8 border-4 border-[#496B92] border-t-transparent rounded-full" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={logs}
              rowKey={(r) => r.id}
              emptyState={
                <div className="py-20 text-center">
                  <p className="text-slate-500 font-medium">No activity logs found.</p>
                </div>
              }
            />
          )}
        </div>

        {total > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50 bg-slate-50/30">
            <p className="text-sm font-medium text-slate-500">
              Showing {Math.min(total, (logPage - 1) * LOGS_PER_PAGE + 1)}–{Math.min(total, logPage * LOGS_PER_PAGE)} of {total} logs
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                disabled={logPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >&lt;</button>
              {(() => {
                const pages: (number | "...")[] = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (logPage > 3) pages.push("...");
                  for (let i = Math.max(2, logPage - 1); i <= Math.min(totalPages - 1, logPage + 1); i++) pages.push(i);
                  if (logPage < totalPages - 2) pages.push("...");
                  pages.push(totalPages);
                }
                return pages.map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-xs text-slate-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setLogPage(p)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${logPage === p ? "bg-[#496B92] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                    >{p}</button>
                  )
                );
              })()}
              <button
                onClick={() => setLogPage((p) => Math.min(totalPages, p + 1))}
                disabled={logPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >&gt;</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ActivityLogTab;