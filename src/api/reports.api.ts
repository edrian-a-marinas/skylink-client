import axiosClient from "./axiosClient";
import { handleApiError } from "./api.helpers";
import type { ExportRequest, ReportResult } from "@/types";

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
