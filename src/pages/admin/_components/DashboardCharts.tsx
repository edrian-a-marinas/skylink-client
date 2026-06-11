import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { useQuery } from "@tanstack/react-query";
import { getRevenueByRoute } from "@/api/reports.api";
interface RawBooking {
  id: string;
  total_price: number;
  booked_at: string;
  status: string;
  flight?: {
    origin_airport?: { iata_code: string };
    destination_airport?: { iata_code: string };
  };
}
interface Props {
  bookings: RawBooking[];
}

const DashboardCharts = ({ bookings }: Props) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const { data: revenueByRoute = [] } = useQuery({
    queryKey: ["revenue-by-route"],
    queryFn: getRevenueByRoute,
    staleTime: 60 * 1000,
  });
  // --- Bookings Over Time (last 30 days, grouped by date) ---
  const bookingsByDate = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - 29);

    const map: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(cutoff);
      d.setDate(cutoff.getDate() + i);
      map[d.toISOString().split("T")[0]] = 0;
    }

    bookings.forEach((b) => {
      const raw = (b as any).booked_at ?? (b as any).createdAt ?? b.booked_at;
      const day = raw?.split("T")[0];
      if (day && map[day] !== undefined) map[day]++;
    });

    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [bookings]);

  const maxBookings = useMemo(() =>
    Math.max(...bookingsByDate.map((d) => d.count), 1),
    [bookingsByDate]
  );

  const linePoints = useMemo(() => {
    const w = 400, h = 140;
    return bookingsByDate.map((d, i) => ({
      x: (i / (bookingsByDate.length - 1)) * w,
      y: h - (d.count / maxBookings) * (h - 10),
      date: d.date,
      count: d.count,
    }));
  }, [bookingsByDate, maxBookings]);

  const linePath = useMemo(() => {
    if (linePoints.length === 0) return "";
    let d = `M ${linePoints[0].x},${linePoints[0].y}`;
    for (let i = 0; i < linePoints.length - 1; i++) {
      const p0 = linePoints[i], p1 = linePoints[i + 1];
      const cpX = p0.x + (p1.x - p0.x) / 2;
      d += ` C ${cpX},${p0.y} ${cpX},${p1.y} ${p1.x},${p1.y}`;
    }
    return d;
  }, [linePoints]);

  const fillPath = useMemo(() => {
    if (!linePath || linePoints.length === 0) return "";
    return `${linePath} L ${linePoints[linePoints.length - 1].x},160 L 0,160 Z`;
  }, [linePath, linePoints]);

  const dateLabels = useMemo(() => {
    if (bookingsByDate.length === 0) return [];
    const indices = [0, 9, 19, 29].filter((i) => i < bookingsByDate.length);
    return indices.map((i) => {
      const d = new Date(bookingsByDate[i].date);
      return d.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
    });
  }, [bookingsByDate]);

  const maxRevenue = useMemo(() =>
    Math.max(...revenueByRoute.map((r) => r.revenue), 1),
    [revenueByRoute]
  );

  const barColors = [
    "bg-[#5D80A6]", "bg-[#7195BA]", "bg-[#86A9CD]",
    "bg-[#9CBEDE]", "bg-[#B2D2F0]",
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Bookings Over Time */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 leading-none">Bookings Over Time</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
              {bookingsByDate.reduce((sum, d) => sum + d.count, 0)} total
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 font-medium">Last 30 days</p>
        </div>
        <div className="relative h-64 w-full select-none">
          <svg className="h-full w-full" viewBox="0 0 400 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id="booking-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#496B92" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#496B92" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Guide line on hover */}
            {hoveredPoint !== null && linePoints[hoveredPoint] && (
              <line
                x1={linePoints[hoveredPoint].x}
                y1={10}
                x2={linePoints[hoveredPoint].x}
                y2={150}
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="3 3"
                className="pointer-events-none"
              />
            )}
            {fillPath && <path d={fillPath} fill="url(#booking-gradient)" />}
            {linePath && (
              <path d={linePath} fill="none" stroke="#496B92" strokeWidth="3" strokeLinecap="round" />
            )}
            {/* Point triggers */}
            {linePoints.map((pt, idx) => (
              <g key={idx} className="cursor-pointer">
                {/* Transparent hit area */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="8"
                  fill="transparent"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* Visible dot shown on hover */}
                {hoveredPoint === idx && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#496B92"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="pointer-events-none"
                  />
                )}
              </g>
            ))}
          </svg>
          
          {/* Tooltip Overlay */}
          {hoveredPoint !== null && linePoints[hoveredPoint] && (
            <div
              className="absolute bg-slate-900/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg border border-slate-800 pointer-events-none flex flex-col gap-0.5 z-10 whitespace-nowrap"
              style={{
                left: `${(linePoints[hoveredPoint].x / 400) * 100}%`,
                top: `${(linePoints[hoveredPoint].y / 160) * 100}%`,
                transform: "translate(-50%, -125%)",
              }}
            >
              <span className="text-slate-400 font-semibold">
                {new Date(linePoints[hoveredPoint].date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-white text-xs">
                {linePoints[hoveredPoint].count} booking{linePoints[hoveredPoint].count === 1 ? "" : "s"}
              </span>
            </div>
          )}

          <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {dateLabels.map((label) => <span key={label}>{label}</span>)}
          </div>
        </div>
      </div>

      {/* Revenue by Route */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 leading-none">Revenue by Route</h3>
          <p className="mt-1 text-sm text-slate-500 font-medium">Top {revenueByRoute.length} routes</p>
        </div>
        {revenueByRoute.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-sm text-slate-400 font-medium">
            No data available.
          </div>
        ) : (
          <div className="space-y-4">
            {revenueByRoute.map((r, idx) => (
              <div key={r.route} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>{r.route}</span>
                  <span>₱{Number(r.revenue).toLocaleString("en-US")}</span>
                </div>
                <div className="h-4 w-full rounded-full bg-slate-50">
                  <div
                    className={cn("h-full rounded-full transition-all duration-1000", barColors[idx])}
                    style={{ width: `${(r.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;