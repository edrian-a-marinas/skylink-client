import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ScrollText,
  FileSpreadsheet,
  FileText
} from "lucide-react";
import AdminLayout from "../_components/AdminLayout";
import Toast from "@/pages/_shared/components/ui/Toast";
import DataTable, { type TableColumn } from "@/pages/_shared/components/ui/DataTable";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";

// --- Types ---
type ReportType = "revenue" | "route" | "cancellation" | "growth";
type DateRange = "today" | "week" | "month" | "3months" | "custom";

interface ReportDataRow {
  period: string;
  value: number | string;
  change: string;
  changeValue?: number; // positive = up, negative = down, undefined = neutral/none
}

interface ActivityLog {
  timestamp: string;
  admin: string;
  action: string;
  recordId: string;
  details: string;
}

// --- Data ---
const REVENUE_DATA: ReportDataRow[] = [
  { period: "Jan", value: 2400000, change: "—" },
  { period: "Feb", value: 1980000, change: "-17.5%", changeValue: -17.5 },
  { period: "Mar", value: 3100000, change: "+56.6%", changeValue: 56.6 },
  { period: "Apr", value: 2750000, change: "-11.3%", changeValue: -11.3 }
];

const ROUTE_DATA: ReportDataRow[] = [
  { period: "MNL→CEB", value: 1240, change: "—" },
  { period: "MNL→DVO", value: 980, change: "-21.0%", changeValue: -21.0 },
  { period: "MNL→SIN", value: 560, change: "-42.9%", changeValue: -42.9 },
  { period: "MNL→KUL", value: 430, change: "-23.2%", changeValue: -23.2 },
  { period: "CEB→DVO", value: 320, change: "-25.6%", changeValue: -25.6 }
];

const CANCELLATION_DATA: ReportDataRow[] = [
  { period: "Jan", value: 3.2, change: "—" },
  { period: "Feb", value: 4.1, change: "+28.1%", changeValue: 28.1 }, // up is bad for cancellations
  { period: "Mar", value: 2.8, change: "-31.7%", changeValue: -31.7 }, // down is good
  { period: "Apr", value: 3.5, change: "+25.0%", changeValue: 25.0 }
];

const GROWTH_DATA: ReportDataRow[] = [
  { period: "Jan", value: 1200, change: "—" },
  { period: "Feb", value: 1450, change: "+20.8%", changeValue: 20.8 },
  { period: "Mar", value: 1830, change: "+26.2%", changeValue: 26.2 },
  { period: "Apr", value: 2140, change: "+16.9%", changeValue: 16.9 }
];

const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    timestamp: "2026-04-11 10:23:45",
    admin: "Admin User",
    action: "Flight Created",
    recordId: "PR 2191",
    details: "New flight PR 2191 MNL→CEB added"
  },
  {
    timestamp: "2026-04-11 10:45:12",
    admin: "Admin User",
    action: "Flight Edited",
    recordId: "5J 800",
    details: "Departure time changed from 09:30 to 10:00"
  },
  {
    timestamp: "2026-04-11 11:02:33",
    admin: "Admin User",
    action: "User Suspended",
    recordId: "U003",
    details: "User Ana Reyes suspended for policy violation"
  },
  {
    timestamp: "2026-04-11 11:30:00",
    admin: "Admin User",
    action: "Refund Issued",
    recordId: "B007",
    details: "Refund of ₱6,980.00 issued for cancelled flight 2P 401"
  },
  {
    timestamp: "2026-04-11 12:15:22",
    admin: "Admin User",
    action: "Settings Changed",
    recordId: "SYSTEM",
    details: "Cancellation window updated from 24hrs to 48hrs"
  },
  {
    timestamp: "2026-04-11 13:00:05",
    admin: "Admin User",
    action: "Booking Cancelled",
    recordId: "B007",
    details: "Booking MN5678 force cancelled due to flight 2P 401 cancellation"
  },
  {
    timestamp: "2026-04-11 14:22:18",
    admin: "Admin User",
    action: "Admin Login",
    recordId: "SYSTEM",
    details: "Successful login from IP 192.168.1.100"
  },
  {
    timestamp: "2026-04-11 15:45:00",
    admin: "Admin User",
    action: "Flight Deleted",
    recordId: "2P 401",
    details: "Flight 2P 401 MNL→HKG deleted. 1 passenger notified."
  },
  {
    timestamp: "2026-04-11 16:10:33",
    admin: "Admin User",
    action: "User Activated",
    recordId: "U007",
    details: "User Isabel Ramos account reactivated"
  },
  {
    timestamp: "2026-04-11 17:30:00",
    admin: "Admin User",
    action: "Mark as Boarded",
    recordId: "B003",
    details: "Booking EF9012 marked as boarded for flight 5J 800"
  }
];

const AdminReportsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tabs: "reports" | "activity-log"
  const isActivityLogRoute = location.pathname.includes("activity-log");
  const activeTab = isActivityLogRoute ? "activity-log" : "reports";

  // Filter & Active States (Reports Tab)
  const [reportType, setReportType] = useState<ReportType>("revenue");
  const [dateRange, setDateRange] = useState<DateRange>("month");

  // Hover states for line chart tooltip
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Filter & Pagination States (Activity Log Tab)
  const [logSearch, setLogSearch] = useState("");
  const [logActionFilter, setLogActionFilter] = useState("");
  const [logDateFilter, setLogDateFilter] = useState("");
  const [logPage, setLogPage] = useState(1);
  const logsPerPage = 8;

  // Toast State
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: "success" | "error" | "info" }>({
    isOpen: false,
    message: "",
    type: "success"
  });

  // Reset tab scroll/state on path updates
  useEffect(() => {
    setHoveredPoint(null);
  }, [activeTab, reportType]);

  // Report details matching Type
  const reportData = useMemo(() => {
    switch (reportType) {
      case "revenue":
        return REVENUE_DATA;
      case "route":
        return ROUTE_DATA;
      case "cancellation":
        return CANCELLATION_DATA;
      case "growth":
        return GROWTH_DATA;
      default:
        return REVENUE_DATA;
    }
  }, [reportType]);

  const activeReportTitle = useMemo(() => {
    switch (reportType) {
      case "revenue": return "Revenue Summary";
      case "route": return "Bookings by Route";
      case "cancellation": return "Cancellation Rate";
      case "growth": return "User Growth";
    }
  }, [reportType]);

  const dateRangeLabel = useMemo(() => {
    switch (dateRange) {
      case "today": return "Today";
      case "week": return "This Week";
      case "month": return "This Month";
      case "3months": return "Last 3 Months";
      case "custom": return "Custom Range";
    }
  }, [dateRange]);

  // CSV Exporter
  const handleExportCSV = () => {
    let csvContent = "";
    if (reportType === "revenue") {
      csvContent = "Period,Revenue (PHP),Change\n" + reportData.map(r => `${r.period},${r.value},${r.change}`).join("\n");
    } else if (reportType === "route") {
      csvContent = "Route,Bookings,Change\n" + reportData.map(r => `${r.period},${r.value},${r.change}`).join("\n");
    } else if (reportType === "cancellation") {
      csvContent = "Period,Cancellation Rate (%),Change\n" + reportData.map(r => `${r.period},${r.value}%,${r.change}`).join("\n");
    } else {
      csvContent = "Period,Users,Change\n" + reportData.map(r => `${r.period},${r.value},${r.change}`).join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setToast({
      isOpen: true,
      message: `${activeReportTitle} exported as CSV successfully.`,
      type: "success"
    });
  };

  // PDF Mock Exporter
  const handleExportPDF = () => {
    setToast({
      isOpen: true,
      message: `Preparing PDF compilation for ${activeReportTitle}...`,
      type: "info"
    });

    setTimeout(() => {
      const summaryText = `
==================================================
                 SKYLINKS REPORT                  
==================================================
REPORT TYPE: ${activeReportTitle.toUpperCase()}
DATE RANGE: ${dateRangeLabel.toUpperCase()}
COMPILED AT: ${new Date().toLocaleString()}
--------------------------------------------------

DATA ENTRIES:
${reportData.map(r => `  - ${r.period}: ${typeof r.value === "number" && reportType === "revenue" ? "₱" + r.value.toLocaleString() : r.value} (${r.change})`).join("\n")}

==================================================
          End of Document - SkyLink Admin         
==================================================
      `.trim();

      const blob = new Blob([summaryText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report_${reportType}_${new Date().toISOString().slice(0, 10)}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      setToast({
        isOpen: true,
        message: `${activeReportTitle} PDF generated successfully.`,
        type: "success"
      });
    }, 1200);
  };

  // --- SVG Chart Calculations ---
  // Viewport: 800 x 300
  // Left padding: 80, Right padding: 40, Top: 40, Bottom: 260
  // Values X: Jan=120, Feb=300, Mar=480, Apr=660
  const chartPoints = useMemo(() => {
    if (reportType === "route") return []; // Horizontal bars drawn separately
    
    const xCoords = [120, 300, 480, 660];
    let maxY = 100;
    if (reportType === "revenue") maxY = 3200000;
    if (reportType === "cancellation") maxY = 8;
    if (reportType === "growth") maxY = 2200;

    return reportData.map((d, idx) => {
      const val = typeof d.value === "number" ? d.value : parseFloat(d.value as string) || 0;
      const y = 260 - (val / maxY) * 200; // 200px chart height
      return { x: xCoords[idx], y, value: val, period: d.period };
    });
  }, [reportType, reportData]);

  // Smooth Cubic Bezier Interpolation
  const chartSmoothPath = useMemo(() => {
    if (chartPoints.length === 0) return "";
    let d = `M ${chartPoints[0].x},${chartPoints[0].y}`;
    for (let i = 0; i < chartPoints.length - 1; i++) {
      const p0 = chartPoints[i];
      const p1 = chartPoints[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      d += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${p1.x},${p1.y}`;
    }
    return d;
  }, [chartPoints]);

  const chartFillPath = useMemo(() => {
    if (chartSmoothPath === "") return "";
    return `${chartSmoothPath} L ${chartPoints[chartPoints.length - 1].x},260 L ${chartPoints[0].x},260 Z`;
  }, [chartSmoothPath, chartPoints]);

  // --- Horizontal Bar Chart Calculations ---
  // Max scale for route is 1400. Width area is 540px. Offset X is 120. Offset Y starts at 40
  const barChartRows = useMemo(() => {
    if (reportType !== "route") return [];
    const scaleMax = 1400;
    const barWidthArea = 540;
    const ySpacing = 42;
    
    return reportData.map((d, idx) => {
      const val = typeof d.value === "number" ? d.value : parseFloat(d.value as string) || 0;
      const width = (val / scaleMax) * barWidthArea;
      const y = 35 + idx * ySpacing;
      return {
        label: d.period,
        width,
        y,
        value: val
      };
    });
  }, [reportType, reportData]);

  // --- Reports Data Table Columns ---
  const reportColumns: TableColumn<ReportDataRow>[] = [
    {
      key: "period",
      header: reportType === "route" ? "ROUTE" : "PERIOD",
      cell: (row) => <span className="font-bold text-slate-800">{row.period}</span>
    },
    {
      key: "value",
      header: "VALUE",
      cell: (row) => {
        if (reportType === "revenue") {
          return <span className="font-bold text-slate-900">₱{(row.value as number).toLocaleString()}</span>;
        }
        if (reportType === "cancellation") {
          return <span className="font-bold text-slate-900">{row.value}%</span>;
        }
        return <span className="font-bold text-slate-900">{(row.value as number).toLocaleString()}</span>;
      }
    },
    {
      key: "change",
      header: "CHANGE",
      cell: (row) => {
        if (!row.changeValue) {
          return <span className="text-slate-400 font-medium">—</span>;
        }
        
        // Cancellation Rate: decrease is GOOD (green), increase is BAD (red)
        const isCancellation = reportType === "cancellation";
        const isUp = row.changeValue > 0;
        const isGood = isCancellation ? !isUp : isUp;
        
        return (
          <span className={cn(
            "inline-flex items-center gap-1 font-bold text-xs",
            isGood ? "text-emerald-600" : "text-rose-600"
          )}>
            {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {row.change}
          </span>
        );
      }
    }
  ];

  // --- Activity Logs Filter & Pagination Logic ---
  const filteredLogs = useMemo(() => {
    return MOCK_ACTIVITY_LOGS.filter(log => {
      const matchesSearch = log.admin.toLowerCase().includes(logSearch.toLowerCase()) || 
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

  // --- Activity Log Badge Renderer ---
  const getActionBadgeClass = (action: string) => {
    const norm = action.toLowerCase();
    if (norm.includes("created") || norm.includes("edited")) {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }
    if (norm.includes("suspended") || norm.includes("deleted")) {
      return "border-rose-200 bg-rose-50 text-rose-700";
    }
    if (norm.includes("refund")) {
      return "border-sky-200 bg-sky-50 text-sky-700";
    }
    if (norm.includes("settings")) {
      return "border-slate-200 bg-slate-100 text-slate-700";
    }
    if (norm.includes("login") || norm.includes("activated") || norm.includes("boarded")) {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
    return "border-slate-200 bg-slate-50 text-slate-600";
  };

  const activityLogColumns: TableColumn<ActivityLog>[] = [
    {
      key: "timestamp",
      header: "TIMESTAMP",
      cell: (row) => <span className="text-slate-500 whitespace-nowrap">{row.timestamp}</span>
    },
    {
      key: "admin",
      header: "ADMIN",
      cell: (row) => <span className="font-bold text-slate-800">{row.admin}</span>
    },
    {
      key: "action",
      header: "ACTION",
      cell: (row) => (
        <span className={cn(
          "inline-flex border px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider",
          getActionBadgeClass(row.action)
        )}>
          {row.action}
        </span>
      )
    },
    {
      key: "recordId",
      header: "RECORD ID",
      cell: (row) => <span className="font-mono font-bold text-[#496B92]">{row.recordId}</span>
    },
    {
      key: "details",
      header: "DETAILS",
      cell: (row) => <span className="text-slate-600 font-medium">{row.details}</span>
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
          <p className="text-sm font-medium text-slate-500">
            System overview and operations audit log.
          </p>
        </div>

        {/* Tab Headers */}
        <div className="flex gap-6 border-b border-slate-100">
          <button
            onClick={() => navigate(ROUTES.ADMIN_REPORTS)}
            className={cn(
              "flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer",
              activeTab === "reports"
                ? "text-[#496B92] border-[#496B92]"
                : "text-slate-400 border-transparent hover:text-slate-600"
            )}
          >
            <BarChart3 size={18} />
            Reports
          </button>
          <button
            onClick={() => navigate("/admin/activity-log")}
            className={cn(
              "flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer",
              activeTab === "activity-log"
                ? "text-[#496B92] border-[#496B92]"
                : "text-slate-400 border-transparent hover:text-slate-600"
            )}
          >
            <ScrollText size={18} />
            Activity Log
          </button>
        </div>

        {/* Dynamic Content */}
        {activeTab === "reports" ? (
          <div className="space-y-6">
            
            {/* Filter Section */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm items-center">
              {/* Report Type */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Report Type</span>
                <div className="flex flex-wrap gap-2">
                  {(["revenue", "route", "cancellation", "growth"] as ReportType[]).map((type) => {
                    const label = type === "revenue" ? "Revenue Summary" :
                                  type === "route" ? "Bookings by Route" :
                                  type === "cancellation" ? "Cancellation Rate" : "User Growth";
                    return (
                      <button
                        key={type}
                        onClick={() => setReportType(type)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                          reportType === type
                            ? "bg-[#496B92] text-white shadow-sm"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-transparent hover:border-slate-200"
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Ranges */}
              <div className="space-y-2 md:text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block md:pr-1">Date Range</span>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {(["today", "week", "month", "3months", "custom"] as DateRange[]).map((range) => {
                    const label = range === "today" ? "Today" :
                                  range === "week" ? "This Week" :
                                  range === "month" ? "This Month" :
                                  range === "3months" ? "Last 3 Months" : "Custom";
                    return (
                      <button
                        key={range}
                        onClick={() => setDateRange(range)}
                        className={cn(
                          "px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                          dateRange === range
                            ? "border-[#496B92] text-[#496B92] bg-[#496B92]/5"
                            : "border-slate-200 text-slate-500 bg-white hover:border-[#496B92]/30"
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interactive Graph Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{activeReportTitle}</h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    {dateRangeLabel}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 border border-slate-200 bg-white hover:border-[#496B92] hover:text-[#496B92] text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <FileSpreadsheet size={15} />
                    Export CSV
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 bg-[#496B92] hover:bg-[#3B5470] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <FileText size={15} />
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Chart Visualizer */}
              <div className="relative pt-6 min-h-[320px] flex items-center justify-center bg-slate-50/20 rounded-2xl border border-slate-100/50">
                
                {reportType !== "route" ? (
                  // Line Charts (Revenue, Cancellation Rate, User Growth)
                  <svg className="w-full h-[280px]" viewBox="0 0 800 300" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#496B92" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#496B92" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Y-axis gridlines & labels */}
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const y = 60 + idx * 50; // grid spacing
                      let label = "";
                      if (reportType === "revenue") label = `₱${((4 - idx) * 800000).toLocaleString()}`;
                      if (reportType === "cancellation") label = `${((4 - idx) * 2)}%`;
                      if (reportType === "growth") label = `${((4 - idx) * 550).toLocaleString()}`;

                      return (
                        <g key={idx}>
                          <line x1="80" y1={y} x2="720" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                          <text x="70" y={y + 4} textAnchor="end" className="text-[10px] font-bold text-slate-400 fill-current">
                            {label}
                          </text>
                        </g>
                      );
                    })}

                    {/* X-axis labels */}
                    {chartPoints.map((pt, idx) => (
                      <text key={idx} x={pt.x} y="280" textAnchor="middle" className="text-xs font-bold text-slate-400 fill-current">
                        {pt.period}
                      </text>
                    ))}

                    {/* Area fill */}
                    {chartFillPath && (
                      <path d={chartFillPath} fill="url(#chart-gradient)" />
                    )}

                    {/* Stroke line */}
                    {chartSmoothPath && (
                      <path d={chartSmoothPath} fill="none" stroke="#496B92" strokeWidth="3.5" strokeLinecap="round" />
                    )}

                    {/* Interactive Points */}
                    {chartPoints.map((pt, idx) => (
                      <g key={idx} className="group cursor-pointer">
                        {/* Hover helper wider circle */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="15"
                          fill="transparent"
                          onMouseEnter={() => setHoveredPoint(idx)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        {/* Visible circle */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredPoint === idx ? "7" : "5"}
                          fill="#496B92"
                          stroke="#ffffff"
                          strokeWidth={hoveredPoint === idx ? "3" : "2"}
                          className="transition-all duration-150"
                        />
                      </g>
                    ))}

                    {/* Chart baseline border */}
                    <line x1="80" y1="260" x2="720" y2="260" stroke="#cbd5e1" strokeWidth="1" />
                    
                    {/* Vertical axis line */}
                    <line x1="80" y1="60" x2="80" y2="260" stroke="#cbd5e1" strokeWidth="1" />
                  </svg>
                ) : (
                  // Bar Chart (Bookings by Route)
                  <svg className="w-full h-[280px]" viewBox="0 0 800 300" preserveAspectRatio="none">
                    {/* Vertical Gridlines & scale labels */}
                    {[0, 350, 700, 1050, 1400].map((val, idx) => {
                      const x = 120 + idx * 135;
                      return (
                        <g key={idx}>
                          {idx > 0 && (
                            <line x1={x} y1="20" x2={x} y2="245" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
                          )}
                          <text x={x} y="265" textAnchor="middle" className="text-[10px] font-bold text-slate-400 fill-current">
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Bars rendering */}
                    {barChartRows.map((bar, idx) => (
                      <g key={idx}>
                        {/* Label */}
                        <text x="110" y={bar.y + 16} textAnchor="end" className="text-xs font-bold text-slate-500 fill-current">
                          {bar.label}
                        </text>
                        {/* Bar Shape */}
                        <rect
                          x="120"
                          y={bar.y}
                          width={bar.width}
                          height="24"
                          rx="6"
                          fill="#496B92"
                          className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                        />
                        {/* Bar Value text on hover/reveal */}
                        <text
                          x={120 + bar.width + 10}
                          y={bar.y + 16}
                          className="text-xs font-bold text-slate-600 fill-current"
                        >
                          {bar.value}
                        </text>
                      </g>
                    ))}

                    {/* Baseline */}
                    <line x1="120" y1="245" x2="660" y2="245" stroke="#cbd5e1" strokeWidth="1.5" />
                    <line x1="120" y1="20" x2="120" y2="245" stroke="#cbd5e1" strokeWidth="1.5" />
                  </svg>
                )}

                {/* Smooth Custom Tooltip overlay */}
                {hoveredPoint !== null && chartPoints[hoveredPoint] && (
                  <div
                    className="absolute bg-slate-900/95 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-slate-700 pointer-events-none transition-all duration-100 flex flex-col gap-0.5"
                    style={{
                      left: `${(chartPoints[hoveredPoint].x / 800) * 100}%`,
                      top: `${((chartPoints[hoveredPoint].y - 55) / 300) * 100}%`,
                      transform: "translateX(-50%)"
                    }}
                  >
                    <span className="text-slate-400 font-semibold">{chartPoints[hoveredPoint].period}</span>
                    <span className="text-white text-sm">
                      {reportType === "revenue" ? "₱" + chartPoints[hoveredPoint].value.toLocaleString() :
                       reportType === "cancellation" ? chartPoints[hoveredPoint].value + "%" :
                       chartPoints[hoveredPoint].value.toLocaleString()}
                    </span>
                  </div>
                )}

              </div>
            </div>

            {/* Table Details */}
            <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-sm font-bold text-slate-900">Data Table</h3>
              </div>
              <div className="p-1">
                <DataTable
                  columns={reportColumns}
                  rows={reportData}
                  rowKey={(r) => r.period}
                />
              </div>
            </section>

          </div>
        ) : (
          // Activity Log Tab
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
              {/* Search Bar */}
              <div className="relative col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by details or ID..."
                  value={logSearch}
                  onChange={(e) => {
                    setLogSearch(e.target.value);
                    setLogPage(1);
                  }}
                  className="h-11 w-full rounded-xl bg-slate-50 pl-10 pr-4 text-sm outline-none border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Action Dropdown */}
              <select
                value={logActionFilter}
                onChange={(e) => {
                  setLogActionFilter(e.target.value);
                  setLogPage(1);
                }}
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

              {/* Date Input */}
              <input
                type="date"
                value={logDateFilter}
                onChange={(e) => {
                  setLogDateFilter(e.target.value);
                  setLogPage(1);
                }}
                className="h-11 rounded-xl bg-slate-50 border border-transparent focus:border-[#496B92]/20 focus:bg-white focus:ring-2 focus:ring-[#496B92]/10 px-4 text-sm font-medium text-slate-600 outline-none transition-all cursor-pointer"
              />
            </div>

            {/* Logs Table */}
            <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-1">
                <DataTable
                  columns={activityLogColumns}
                  rows={paginatedLogs}
                  rowKey={(r, idx) => r.timestamp + idx}
                  emptyState={
                    <div className="py-20 text-center">
                      <p className="text-slate-500 font-medium">No activity log matches found.</p>
                    </div>
                  }
                />
              </div>

              {/* Pagination */}
              {filteredLogs.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50 bg-slate-50/30">
                  <p className="text-sm font-medium text-slate-500">
                    Showing {Math.min(filteredLogs.length, (logPage - 1) * logsPerPage + 1)}-
                    {Math.min(filteredLogs.length, logPage * logsPerPage)} of {filteredLogs.length} logs
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                      disabled={logPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalLogPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLogPage(idx + 1)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          logPage === idx + 1
                            ? "bg-[#496B92] text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setLogPage((p) => Math.min(totalLogPages, p + 1))}
                      disabled={logPage === totalLogPages}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </section>

          </div>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
      />
    </AdminLayout>
  );
};

export default AdminReportsPage;
