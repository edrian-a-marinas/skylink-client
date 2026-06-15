import axiosClient from "./axiosClient";
import { handleApiError } from "./api.helpers";
import type { ExportRequest, ReportResult, RouteReport, CancellationReport, UserGrowthReport, ActivityLogList, RevenueForecast, DemandForecast, CancellationRisk, RevenueAnomalies, PricingSuggestions } from "@/types";

/**
 * Admin: Get Booking Report
 * GET /api/v1/admin/reports
 */
export async function generateReport(): Promise<ReportResult> {
  try {
    const res = await axiosClient.get("/admin/reports");
    return res.data as ReportResult;
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * Admin: Get KPI
 * GET /api/v1/admin/kpi
 */
export async function getKpiSummary() {
  const res = await axiosClient.get("/admin/kpi");
  return res.data;
}

export async function getRevenueByRoute(): Promise<{ route: string; revenue: number }[]> {
  try {
    const res = await axiosClient.get("/admin/kpi/revenue-by-route");
    return res.data;
  } catch (err) {
    handleApiError(err);
    return [];
  }
}

/**
 * Admin: Get Route Booking Report
 * GET /api/v1/admin/reports/routes
 */
export async function getRouteReport(): Promise<RouteReport> {
  try {
    const res = await axiosClient.get("/admin/reports/routes");
    return res.data as RouteReport;
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * Admin: Get Cancellation Report
 * GET /api/v1/admin/reports/cancellations
 */
export async function getCancellationReport(): Promise<CancellationReport> {
  try {
    const res = await axiosClient.get("/admin/reports/cancellations");
    return res.data as CancellationReport;
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * Admin: Get User Growth Report
 * GET /api/v1/admin/reports/user-growth
 */
export async function getUserGrowthReport(): Promise<UserGrowthReport> {
  try {
    const res = await axiosClient.get("/admin/reports/user-growth");
    return res.data as UserGrowthReport;
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * Admin: Get Activity Logs
 * GET /api/v1/admin/activity-logs
 */
export async function getActivityLogs(params?: {
  page?: number;
  size?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
}): Promise<ActivityLogList> {
  try {
    const res = await axiosClient.get("/admin/activity-logs", { params });
    return res.data as ActivityLogList;
  } catch (err) {
    handleApiError(err);
  }
}

/**
 * Admin: ML — Revenue Forecast
 * GET /api/v1/admin/ml/revenue-forecast
 */
export async function getRevenueForecast(monthsAhead: number = 6): Promise<RevenueForecast> {
  try {
    const res = await axiosClient.get("/admin/ml/revenue-forecast", {
      params: { months_ahead: monthsAhead },
    });
    return res.data as RevenueForecast;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

/**
 * Admin: ML — Demand Forecast
 * GET /api/v1/admin/ml/demand-forecast
 */
export async function getDemandForecast(): Promise<DemandForecast> {
  try {
    const res = await axiosClient.get("/admin/ml/demand-forecast");
    return res.data as DemandForecast;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

/**
 * Admin: ML — Cancellation Risk
 * GET /api/v1/admin/ml/cancellation-risk/{booking_id}
 */
export async function getCancellationRisk(bookingId: string): Promise<CancellationRisk> {
  try {
    const res = await axiosClient.get(`/admin/ml/cancellation-risk/${bookingId}`);
    return res.data as CancellationRisk;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

/**
 * Admin: ML — Revenue Anomalies
 * GET /api/v1/admin/ml/revenue-anomalies
 */
export async function getRevenueAnomalies(): Promise<RevenueAnomalies> {
  try {
    const res = await axiosClient.get("/admin/ml/revenue-anomalies");
    return res.data as RevenueAnomalies;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

/**
 * Admin: ML — Pricing Suggestions
 * GET /api/v1/admin/ml/pricing-suggestion/{flight_id}
 */
export async function getPricingSuggestions(flightId: string): Promise<PricingSuggestions> {
  try {
    const res = await axiosClient.get(`/admin/ml/pricing-suggestion/${flightId}`);
    return res.data as PricingSuggestions;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

/**
 * Admin: Export Report (Optional/Placeholder based on OAS)
 * If your backend has an export endpoint, add it here.
 */
export async function exportReport(payload: ExportRequest): Promise<Blob> {
  try {
    const res = await axiosClient.post("/admin/reports/export", payload, {
      responseType: "blob",
    });
    return res.data as Blob;
  } catch (err) {
    handleApiError(err);
  }
}
