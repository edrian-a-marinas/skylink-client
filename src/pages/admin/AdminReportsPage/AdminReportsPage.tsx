import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarChart3, ScrollText } from "lucide-react";
import AdminLayout from "../_components/AdminLayout";
import Toast from "@/pages/_shared/components/ui/Toast";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";
import RevenueSummary from "./__components/RevenueSummary";
import BookingsRoute from "./__components/BookingsRoute";
import CancellationRate from "./__components/CancellationRate";
import UserGrowth from "./__components/UserGrowth";
import type { ReportType, DateRange } from "./__components/types";
import ActivityLogTab from "./subPageActivityLog";

const AdminReportsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActivityLogRoute = location.pathname.includes("activity-log");
  const activeTab = isActivityLogRoute ? "activity-log" : "reports";

  const [reportType, setReportType] = useState<ReportType>("revenue");
  const [dateRange, setDateRange] = useState<DateRange>("all");

  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: "success" | "error" | "info" }>({
    isOpen: false, message: "", type: "success"
  });

  const handleToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ isOpen: true, message, type });
  };

  const dateRangeLabel = useMemo(() => {
    switch (dateRange) {
      case "all": return "All Time";
      case "today": return "Today";
      case "week": return "This Week";
      case "month": return "This Month";
      case "3months": return "Last 3 Months";
      case "custom": return "Custom Range";
    }
  }, [dateRange]);

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
          <p className="text-sm font-medium text-slate-500">System overview and operations audit log.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-slate-100">
          <button
            onClick={() => navigate(ROUTES.ADMIN_REPORTS)}
            className={cn("flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer", activeTab === "reports" ? "text-[#496B92] border-[#496B92]" : "text-slate-400 border-transparent hover:text-slate-600")}
          >
            <BarChart3 size={18} /> Reports
          </button>
          <button
            onClick={() => navigate("/admin/activity-log")}
            className={cn("flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer", activeTab === "activity-log" ? "text-[#496B92] border-[#496B92]" : "text-slate-400 border-transparent hover:text-slate-600")}
          >
            <ScrollText size={18} /> Activity Log
          </button>
        </div>

        {activeTab === "reports" ? (
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm items-center">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Report Type</span>
                <div className="flex flex-wrap gap-2">
                  {(["revenue", "route", "cancellation", "growth"] as ReportType[]).map((type) => {
                    const label = type === "revenue" ? "Revenue Summary" : type === "route" ? "Bookings by Route" : type === "cancellation" ? "Cancellation Rate" : "User Growth";
                    return (
                      <button key={type} onClick={() => setReportType(type)} className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer", reportType === type ? "bg-[#496B92] text-white shadow-sm" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-transparent hover:border-slate-200")}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2 md:text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block md:pr-1">Date Range</span>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {(["all", "today", "week", "month", "3months", "custom"] as DateRange[]).map((range) => {
                    const label = range === "all" ? "All Time" : range === "today" ? "Today" : range === "week" ? "This Week" : range === "month" ? "This Month" : range === "3months" ? "Last 3 Months" : "Custom";
                    return (
                      <button key={range} onClick={() => setDateRange(range)} className={cn("px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer", dateRange === range ? "border-[#496B92] text-[#496B92] bg-[#496B92]/5" : "border-slate-200 text-slate-500 bg-white hover:border-[#496B92]/30")}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Report Components */}
            {reportType === "revenue" && <RevenueSummary dateRange={dateRange} dateRangeLabel={dateRangeLabel} onToast={handleToast} />}
            {reportType === "route" && <BookingsRoute dateRange={dateRange} dateRangeLabel={dateRangeLabel} onToast={handleToast} />}
            {reportType === "cancellation" && <CancellationRate dateRange={dateRange} dateRangeLabel={dateRangeLabel} onToast={handleToast} />}
            {reportType === "growth" && <UserGrowth dateRange={dateRange} dateRangeLabel={dateRangeLabel} onToast={handleToast} />}
          </div>
        ) : (
          <ActivityLogTab />
        )}
      </div>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, isOpen: false }))} />
    </AdminLayout>
  );
};

export default AdminReportsPage;