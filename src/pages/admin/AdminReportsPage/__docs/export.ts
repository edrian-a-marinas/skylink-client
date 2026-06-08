import { jsPDF } from "jspdf";
import type { ReportType, ReportDataRow } from "../__components/types";

// Safe CSV cell escaping to prevent comma splitting
const escapeCSV = (val: string | number) => {
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export function exportCSV(
  reportType: ReportType,
  reportData: ReportDataRow[],
  activeReportTitle: string,
  onSuccess: (msg: string) => void
) {
  let csvContent = "";
  if (reportType === "revenue") {
    csvContent = "Period,Revenue (PHP),Change\n" + reportData.map(r => `${escapeCSV(r.period)},${escapeCSV(r.value)},${escapeCSV(r.change)}`).join("\n");
  } else if (reportType === "route") {
    csvContent = "Route,Bookings,Revenue (PHP)\n" + reportData.map(r => `${escapeCSV(r.period)},${escapeCSV(r.value)},${escapeCSV(r.change)}`).join("\n");
  } else if (reportType === "cancellation") {
    csvContent = "Period,Cancellation Rate (%),Change\n" + reportData.map(r => `${escapeCSV(r.period)},${escapeCSV(r.value)},${escapeCSV(r.change)}`).join("\n");
  } else {
    csvContent = "Period,Users,Change\n" + reportData.map(r => `${escapeCSV(r.period)},${escapeCSV(r.value)},${escapeCSV(r.change)}`).join("\n");
  }
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `report_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  onSuccess(`${activeReportTitle} exported as CSV successfully.`);
}

export function exportPDF(
  reportType: ReportType,
  reportData: ReportDataRow[],
  activeReportTitle: string,
  dateRangeLabel: string,
  onStart: (msg: string) => void,
  onSuccess: (msg: string) => void
) {
  onStart(`Preparing PDF compilation for ${activeReportTitle}...`);
  setTimeout(() => {
    const doc = new jsPDF();
    
    // Header Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138); // slate-900 / primary dark
    doc.text("SkyLink Operations Report", 14, 22);
    
    // Subtext metadata
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-400
    doc.text(`Report Type: ${activeReportTitle}`, 14, 30);
    doc.text(`Date Range: ${dateRangeLabel}`, 14, 36);
    doc.text(`Generated At: ${new Date().toLocaleString()}`, 14, 42);
    
    // Horizontal divider
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(14, 47, 196, 47);
    
    // Section header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text("Data Details", 14, 56);
    
    // Table column titles
    let col1 = "Period";
    let col2 = "Value";
    if (reportType === "revenue") {
      col1 = "Period";
      col2 = "Revenue (PHP)";
    } else if (reportType === "route") {
      col1 = "Route";
      col2 = "Bookings";
    } else if (reportType === "cancellation") {
      col1 = "Period";
      col2 = "Cancellation Rate";
    } else if (reportType === "growth") {
      col1 = "Period";
      col2 = "New Users";
    }
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(col1, 16, 66);
    doc.text(col2, 90, 66);
    doc.text(reportType === "route" ? "Revenue (PHP)" : "Change", 160, 66);
    
    // Table header underline
    doc.line(14, 69, 196, 69);
    
    // Draw table content
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    
    let y = 76;
    reportData.forEach((row) => {
      let valStr = String(row.value);
      if (reportType === "revenue" && typeof row.value === "number") {
        valStr = `₱${row.value.toLocaleString()}`;
      } else if (reportType === "cancellation") {
        valStr = `${row.value}%`;
      } else if (typeof row.value === "number") {
        valStr = row.value.toLocaleString();
      }
      
      doc.text(String(row.period), 16, y);
      doc.text(valStr, 90, y);
      doc.text(String(row.change), 160, y);
      
      // Bottom border for row
      doc.setDrawColor(241, 245, 249);
      doc.line(14, y + 2, 196, y + 2);
      y += 8;
      
      // Page boundary checker
      if (y > 275) {
        doc.addPage();
        y = 20;
        doc.setFont("helvetica", "bold");
        doc.text(col1, 16, y);
        doc.text(col2, 90, y);
        doc.text(reportType === "route" ? "Revenue (PHP)" : "Change", 160, y);
        doc.line(14, y + 3, 196, y + 3);
        doc.setFont("helvetica", "normal");
        y += 10;
      }
    });
    
    // Save file
    doc.save(`report_${reportType}_${new Date().toISOString().slice(0, 10)}.pdf`);
    onSuccess(`${activeReportTitle} PDF generated successfully.`);
  }, 1200);
}