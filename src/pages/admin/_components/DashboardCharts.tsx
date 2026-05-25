import { cn } from "@/utils/cn";

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Bookings Over Time - Line Chart Placeholder */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 leading-none">Bookings Over Time</h3>
          <p className="mt-1 text-sm text-slate-500 font-medium">Last 30 days</p>
        </div>
        <div className="relative h-64 w-full">
          {/* Simple SVG Line Chart representation */}
          <svg className="h-full w-full" viewBox="0 0 400 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#496B92" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#496B92" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,100 Q20,80 40,110 T80,70 T120,90 T160,50 T200,80 T240,40 T280,60 T320,30 T360,70 T400,20"
              fill="none"
              stroke="#496B92"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M0,100 Q20,80 40,110 T80,70 T120,90 T160,50 T200,80 T240,40 T280,60 T320,30 T360,70 T400,20 V160 H0 Z"
              fill="url(#gradient)"
            />
          </svg>
          <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Mar 13</span>
            <span>Mar 23</span>
            <span>Apr 02</span>
            <span>Apr 12</span>
          </div>
        </div>
      </div>

      {/* Revenue by Route - Bar Chart Placeholder */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 leading-none">Revenue by Route</h3>
          <p className="mt-1 text-sm text-slate-500 font-medium">Top 5 routes this month</p>
        </div>
        <div className="space-y-4">
          {[
            { label: "MNL → LAX", value: 90, color: "bg-[#5D80A6]" },
            { label: "MNL → NRT", value: 75, color: "bg-[#7195BA]" },
            { label: "MNL → SIN", value: 60, color: "bg-[#86A9CD]" },
            { label: "MNL → KUL", value: 45, color: "bg-[#9CBEDE]" },
            { label: "MNL → CEB", value: 30, color: "bg-[#B2D2F0]" },
          ].map((route) => (
            <div key={route.label} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>{route.label}</span>
              </div>
              <div className="h-4 w-full rounded-full bg-slate-50">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000", route.color)}
                  style={{ width: `${route.value}%` }}
                />
              </div>
            </div>
          ))}
          <div className="mt-6 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-3">
            <span>₱0k</span>
            <span>₱350k</span>
            <span>₱700k</span>
            <span>₱1050k</span>
            <span>₱1400k</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
