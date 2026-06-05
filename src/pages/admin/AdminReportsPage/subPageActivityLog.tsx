import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import { cn } from "@/utils/cn";
import type { ActivityLog } from "./__components/types";

const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { timestamp: "2026-04-11 10:23:45", admin: "Admin User", action: "Flight Created", recordId: "PR 2191", details: "New flight PR 2191 MNL→CEB added" },
  { timestamp: "2026-04-11 10:45:12", admin: "Admin User", action: "Flight Edited", recordId: "5J 800", details: "Departure time changed from 09:30 to 10:00" },
  { timestamp: "2026-04-11 11:02:33", admin: "Admin User", action: "User Suspended", recordId: "U003", details: "User Ana Reyes suspended for policy violation" },
  { timestamp: "2026-04-11 11:30:00", admin: "Admin User", action: "Refund Issued", recordId: "B007", details: "Refund of ₱6,980.00 issued for cancelled flight 2P 401" },
  { timestamp: "2026-04-11 12:15:22", admin: "Admin User", action: "Settings Changed", recordId: "SYSTEM", details: "Cancellation window updated from 24hrs to 48hrs" },
  { timestamp: "2026-04-11 13:00:05", admin: "Admin User", action: "Booking Cancelled", recordId: "B007", details: "Booking MN5678 force cancelled due to flight 2P 401 cancellation" },
  { timestamp: "2026-04-11 14:22:18", admin: "Admin User", action: "Admin Login", recordId: "SYSTEM", details: "Successful login from IP 192.168.1.100" },
  { timestamp: "2026-04-11 15:45:00", admin: "Admin User", action: "Flight Deleted", recordId: "2P 401", details: "Flight 2P 401 MNL→HKG deleted. 1 passenger notified." },
  { timestamp: "2026-04-11 16:10:33", admin: "Admin User", action: "User Activated", recordId: "U007", details: "User Isabel Ramos account reactivated" },
  { timestamp: "2026-04-11 17:30:00", admin: "Admin User", action: "Mark as Boarded", recordId: "B003", details: "Booking EF9012 marked as boarded for flight 5J 800" },
];

const getActionBadgeClass = (action: string) => {
  const norm = action.toLowerCase();
  if (norm.includes("created") || norm.includes("edited")) return "border-blue-200 bg-blue-50 text-blue-700";
  if (norm.includes("suspended") || norm.includes("deleted")) return "border-rose-200 bg-rose-50 text-rose-700";
  if (norm.includes("refund")) return "border-sky-200 bg-sky-50 text-sky-700";
  if (norm.includes("settings")) return "border-slate-200 bg-slate-100 text-slate-700";
  if (norm.includes("login") || norm.includes("activated") || norm.includes("boarded")) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
};

const ActivityLogTab = () => {
  const [logSearch, setLogSearch] = useState("");
  const [logActionFilter, setLogActionFilter] = useState("");
  const [logDateFilter, setLogDateFilter] = useState("");
  const [logPage, setLogPage] = useState(1);
  const logsPerPage = 8;

  const filteredLogs = useMemo(() => {
    return MOCK_ACTIVITY_LOGS.filter(log => {
      const matchesSearch =
        log.admin.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.recordId.toLowerCase().includes(logSearch.toLowerCase());
      const matchesAction = logActionFilter ? log.action === logActionFilter : true;
      const matchesDate = logDateFilter ? log.timestamp.startsWith(logDateFilter) : true;
      return matchesSearch && matchesAction && matchesDate;
    });
  }, [logSearch, logActionFilter, logDateFilter]);

  const paginatedLogs = useMemo(() => {
    const start = (logPage - 1) * logsPerPage;
    return filteredLogs.slice(start, start + logsPerPage);
  }, [filteredLogs, logPage]);

  const totalLogPages = Math.max(1, Math.ceil(filteredLogs.length / logsPerPage));

  const columns: TableColumn<ActivityLog>[] = [
    { key: "timestamp", header: "TIMESTAMP", cell: (row) => <span className="text-slate-500 whitespace-nowrap">{row.timestamp}</span> },
    { key: "admin", header: "ADMIN", cell: (row) => <span className="font-bold text-slate-800">{row.admin}</span> },
    { key: "action", header: "ACTION", cell: (row) => (
      <span className={cn("inline-flex border px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider", getActionBadgeClass(row.action))}>
        {row.action}
      </span>
    )},
    { key: "recordId", header: "RECORD ID", cell: (row) => <span className="font-mono font-bold text-[#496B92]">{row.recordId}</span> },
    { key: "details", header: "DETAILS", cell: (row) => <span className="text-slate-600 font-medium">{row.details}</span> },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by details or ID..."
            value={logSearch}
            onChange={(e) => { setLogSearch(e.target.value); setLogPage(1); }}
            className="h-11 w-full rounded-xl bg-slate-50 pl-10 pr-4 text-sm outline-none border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 transition-all placeholder:text-slate-400"
          />
        </div>
        <select
          value={logActionFilter}
          onChange={(e) => { setLogActionFilter(e.target.value); setLogPage(1); }}
          className="h-11 rounded-xl bg-slate-50 border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 px-4 text-sm font-medium text-slate-600 outline-none transition-all cursor-pointer"
        >
          <option value="">All Action Types</option>
          <option value="Flight Created">Flight Created</option>
          <option value="Flight Edited">Flight Edited</option>
          <option value="Flight Deleted">Flight Deleted</option>
          <option value="User Suspended">User Suspended</option>
          <option value="User Activated">User Activated</option>
          <option value="Refund Issued">Refund Issued</option>
          <option value="Booking Cancelled">Booking Cancelled</option>
          <option value="Mark as Boarded">Mark as Boarded</option>
          <option value="Settings Changed">Settings Changed</option>
          <option value="Admin Login">Admin Login</option>
        </select>
        <input
          type="date"
          value={logDateFilter}
          onChange={(e) => { setLogDateFilter(e.target.value); setLogPage(1); }}
          className="h-11 rounded-xl bg-slate-50 border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 px-4 text-sm font-medium text-slate-600 outline-none transition-all cursor-pointer"
        />
      </div>

      {/* Table */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-1">
          <DataTable
            columns={columns}
            rows={paginatedLogs}
            rowKey={(r, idx) => r.timestamp + idx}
            emptyState={<div className="py-20 text-center"><p className="text-slate-500 font-medium">No activity log matches found.</p></div>}
          />
        </div>
        {filteredLogs.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50 bg-slate-50/30">
            <p className="text-sm font-medium text-slate-500">
              Showing {Math.min(filteredLogs.length, (logPage - 1) * logsPerPage + 1)}-{Math.min(filteredLogs.length, logPage * logsPerPage)} of {filteredLogs.length} logs
            </p>
            <div className="flex gap-2">
              <button onClick={() => setLogPage((p) => Math.max(1, p - 1))} disabled={logPage === 1} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors">&lt;</button>
              {Array.from({ length: totalLogPages }).map((_, idx) => (
                <button key={idx} onClick={() => setLogPage(idx + 1)} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${logPage === idx + 1 ? "bg-[#496B92] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{idx + 1}</button>
              ))}
              <button onClick={() => setLogPage((p) => Math.min(totalLogPages, p + 1))} disabled={logPage === totalLogPages} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors">&gt;</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ActivityLogTab;