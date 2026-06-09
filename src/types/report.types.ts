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

export interface ActivityLogItem {
  id: string;
  email: string;
  ip_address?: string | null;
  attempted_at: string;
}

export interface ActivityLogList {
  logs: ActivityLogItem[];
  total: number;
}

// ─── ML Types ─────────────────────────────────────────────────────────────────

export interface RevenueForecastPoint {
  month: string;
  year: number;
  revenue: number;
}

export interface RevenueForecast {
  historical: RevenueForecastPoint[];
  forecast: RevenueForecastPoint[];
  r2_score: number | null;
  confidence: string | null;
  message?: string | null;
}

export interface DemandForecastRoute {
  route: string;
  predicted_bookings_next_30_days: number;
  avg_monthly_bookings: number;
  r2_score: number;
  confidence: string;
}

export interface DemandForecast {
  routes: DemandForecastRoute[];
  message?: string | null;
}

export interface CancellationRisk {
  booking_id: string;
  risk_score: number | null;
  risk_level: "low" | "medium" | "high" | "unknown";
  confidence: string;
  lead_time_days?: number;
  route?: string;
  message?: string | null;
}

export interface RevenueAnomalyPoint {
  month: string;
  year: number;
  revenue: number;
  z_score: number;
  is_anomaly: boolean;
  severity: "warning" | "critical" | null;
}

export interface RevenueAnomalies {
  monthly: RevenueAnomalyPoint[];
  anomalies: RevenueAnomalyPoint[];
  mean_revenue: number;
  std_revenue: number;
  message?: string | null;
}

export interface PricingSuggestion {
  seat_class_id: number;
  seat_class_name: string;
  current_price: number;
  suggested_price: number;
  adjustment_pct: number;
  occupancy_rate: number;
  available_seats: number;
  total_seats: number;
  days_until_departure: number;
  avg_monthly_booking_velocity: number;
  reason: string;
}

export interface PricingSuggestions {
  flight_id: string;
  suggestions: PricingSuggestion[];
}