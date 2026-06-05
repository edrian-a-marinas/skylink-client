export type ReportType =
  | "booking_summary"
  | "revenue_overview"
  | "cancellations"
  | "user_activity";

export type ReportDatePreset = "today" | "this_week" | "this_month" | "custom";

export interface ReportFilters {
  datePreset?: ReportDatePreset;
  startDate?: string;
  endDate?: string;
  route?: string;
  flightId?: string;
  status?: string;
  paymentStatus?: string;
}

export interface ReportQuery {
  type: ReportType;
  filters: ReportFilters;
}

export interface ReportMetric {
  label: string;
  value: number;
}

export interface ReportRow {
  [key: string]: string | number | boolean | null;
}

export interface ReportResult {
  generatedAt: string;
  type: ReportType;
  metrics: ReportMetric[];
  rows: ReportRow[];
}

export interface ExportRequest {
  query: ReportQuery;
  format: "pdf" | "csv";
}

export interface RouteBookingPoint {
  route: string;      
  bookings: number;
  revenue: number;
}

export interface RouteReport {
  routes: RouteBookingPoint[];
  date_from?: string | null;
  date_to?: string | null;
}

export interface MonthlyCancellationPoint {
  month: string;
  year: number;
  total_bookings: number;
  cancelled_bookings: number;
  cancellation_rate: number;
}

export interface CancellationReport {
  monthly_cancellations: MonthlyCancellationPoint[];
  date_from?: string | null;
  date_to?: string | null;
}

export interface MonthlyUserGrowthPoint {
  month: string;
  year: number;
  new_users: number;
}

export interface UserGrowthReport {
  monthly_growth: MonthlyUserGrowthPoint[];
  date_from?: string | null;
  date_to?: string | null;
}