export type ReportType = "revenue" | "route" | "cancellation" | "growth";
export type DateRange = "all" | "today" | "week" | "month" | "3months" | "custom";

export interface MonthlyRevenuePoint {
  month: string;
  year: number;
  revenue: number;
  bookings: number;
}

export interface BookingReport {
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  confirmed_revenue: number;
  monthly_revenue: MonthlyRevenuePoint[];
}

export interface ReportDataRow {
  period: string;
  value: number | string;
  change: string;
  changeValue?: number;
}

export interface ActivityLog {
  timestamp: string;
  admin: string;
  action: string;
  recordId: string;
  details: string;
}

export interface RouteDataRow {
  route: string;
  bookings: number;
  revenue: string;
}

export interface CancellationDataRow {
  period: string;
  value: number;
  change: string;
  changeValue?: number | undefined; 
}

export interface UserGrowthDataRow {
  period: string;
  value: number;
  change: string;
  changeValue?: number | undefined;
}