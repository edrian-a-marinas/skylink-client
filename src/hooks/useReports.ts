import { useCallback, useState } from "react";
import { exportReport, generateReport } from "@/api/reports.api";
import type {
  APIError,
  ExportRequest,
  ReportQuery,
  ReportResult,
} from "@/types";

export function useReports() {
  const [data, setData] = useState<ReportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<APIError | null>(null);

  const runReport = useCallback(async (query: ReportQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateReport(query);
      setData(result);
      return result;
    } catch (err) {
      setError(err as APIError);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadReport = useCallback(async (payload: ExportRequest) => {
    setIsExporting(true);
    setExportError(null);

    try {
      const fileBlob = await exportReport(payload);
      return fileBlob;
    } catch (err) {
      setExportError(err as APIError);
      return null;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    isExporting,
    exportError,
    runReport,
    downloadReport,
  };
}

export default useReports;
