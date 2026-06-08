import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarChart3, ScrollText } from "lucide-react";
import AdminLayout from "../_components/AdminLayout";
import Toast from "@/pages/_shared/components/ui/Toast";
import Modal from "@/pages/_shared/components/ui/Modal";
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

  // Custom date states
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [tempStartDate, setTempStartDate] = useState<string>("");
  const [tempEndDate, setTempEndDate] = useState<string>("");
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: "success" | "error" | "info" }>({
    isOpen: false, message: "", type: "success"
  });

  const handleToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ isOpen: true, message, type });
  };

  const handleRangeClick = (range: DateRange) => {
    if (range === "custom") {
      setTempStartDate(customStartDate || "");
      setTempEndDate(customEndDate || "");
      setValidationError("");
      setShowCustomModal(true);
    } else {
      setDateRange(range);
    }
  };

  const handleApplyCustomRange = () => {
    if (!tempStartDate || !tempEndDate) {
      setValidationError("Please select both start and end dates.");
      return;
    }
    const start = new Date(tempStartDate);
    const end = new Date(tempEndDate);
    if (start > end) {
      setValidationError("Start date cannot be after end date.");
      return;
    }
    setCustomStartDate(tempStartDate);
    setCustomEndDate(tempEndDate);
    setDateRange("custom");
    setShowCustomModal(false);
  };

  const dateRangeLabel = useMemo(() => {
    switch (dateRange) {
      case "all": return "All Time";
      case "today": return "Today";
      case "week": return "This Week";
      case "month": return "This Month";
      case "3months": return "Last 3 Months";
      case "custom": {
        if (customStartDate && customEndDate) {
          const formatDate = (dateStr: string) => {
            const d = new Date(dateStr);
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          };
          return `${formatDate(customStartDate)} - ${formatDate(customEndDate)}`;
        }
        return "Custom Range";
      }
    }
  }, [dateRange, customStartDate, customEndDate]);

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
                      <button key={range} onClick={() => handleRangeClick(range)} className={cn("px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer", dateRange === range ? "border-[#496B92] text-[#496B92] bg-[#496B92]/5" : "border-slate-200 text-slate-500 bg-white hover:border-[#496B92]/30")}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Report Components */}
            {reportType === "revenue" && <RevenueSummary dateRange={dateRange} dateRangeLabel={dateRangeLabel} onToast={handleToast} customStartDate={customStartDate} customEndDate={customEndDate} />}
            {reportType === "route" && <BookingsRoute dateRange={dateRange} dateRangeLabel={dateRangeLabel} onToast={handleToast} customStartDate={customStartDate} customEndDate={customEndDate} />}
            {reportType === "cancellation" && <CancellationRate dateRange={dateRange} dateRangeLabel={dateRangeLabel} onToast={handleToast} customStartDate={customStartDate} customEndDate={customEndDate} />}
            {reportType === "growth" && <UserGrowth dateRange={dateRange} dateRangeLabel={dateRangeLabel} onToast={handleToast} customStartDate={customStartDate} customEndDate={customEndDate} />}
          </div>
        ) : (
          <ActivityLogTab />
        )}
      </div>

      <Modal
        isOpen={showCustomModal}
        title="Custom Date Range"
        description="Select a start date and end date to filter report data."
        onClose={() => setShowCustomModal(false)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => {
                  setTempStartDate(e.target.value);
                  setValidationError("");
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#496B92] text-sm text-slate-700 font-semibold"
              />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Date</label>
              <input
                type="date"
                value={tempEndDate}
                onChange={(e) => {
                  setTempEndDate(e.target.value);
                  setValidationError("");
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#496B92] text-sm text-slate-700 font-semibold"
              />
            </div>
          </div>
          
          {validationError && (
            <p className="text-xs text-rose-500 font-bold text-left">{validationError}</p>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={() => setShowCustomModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCustomRange}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#496B92] hover:bg-[#3B5470] transition-all cursor-pointer"
            >
              Apply Range
            </button>
          </div>
        </div>
      </Modal>

      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, isOpen: false }))} />
    </AdminLayout>
  );
};

export default AdminReportsPage;