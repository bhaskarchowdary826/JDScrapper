"use client";
import { Record } from "./ResultsTable";

interface Props {
  data: Record[];
  disabled?: boolean;
}

function downloadCSV(data: Record[]) {
  const headers = ["Name", "Address", "Phone", "City", "Keyword"];
  const rows = data.map(r => [
    `"${(r.Name || "").replace(/"/g, '""')}"`,
    `"${(r.Address || "").replace(/"/g, '""')}"`,
    `"${(r.Phone || "").replace(/"/g, '""')}"`,
    `"${(r.City || "").replace(/"/g, '""')}"`,
    `"${(r.Keyword || "").replace(/"/g, '""')}"`,
  ].join(","));

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `justdial_leads_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

async function downloadExcel(data: Record[]) {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  ws["!cols"] = [
    { wch: 35 },
    { wch: 50 },
    { wch: 15 },
    { wch: 20 },
    { wch: 25 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Leads");

  const summary: Record<string, number> = {};
  data.forEach(r => {
    const key = `${r.Keyword || "unknown"} - ${r.City || "unknown"}`;
    summary[key] = (summary[key] || 0) + 1;
  });

  const summaryData = Object.entries(summary).map(([combo, count]) => ({
    "Category - City": combo,
    "Records": count,
  }));

  const ws2 = XLSX.utils.json_to_sheet(summaryData);
  ws2["!cols"] = [{ wch: 40 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Summary");

  XLSX.writeFile(wb, `justdial_leads_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export default function DownloadPanel({ data, disabled }: Props) {
  const isEmpty = data.length === 0 || disabled;

  return (
    <div>
      <p style={{ color: "var(--accent)", fontFamily: "DM Mono", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Export Results</p>

      <div className="glass-card" style={{ padding: "20px 24px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 32, color: "var(--accent)" }}>⬇</div>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700 }}>{data.length.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "DM Mono" }}>total records ready to export</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button onClick={() => downloadCSV(data)} disabled={!!isEmpty} className="btn-accent" style={{ padding: "14px 20px", fontSize: 14, cursor: isEmpty ? "not-allowed" : "pointer", opacity: isEmpty ? 0.4 : 1, border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 20 }}>📄</span>
          <span>Download CSV</span>
          <span style={{ fontSize: 11, opacity: 0.7, fontFamily: "DM Mono" }}>Comma separated</span>
        </button>

        <button onClick={() => downloadExcel(data)} disabled={!!isEmpty} style={{ padding: "14px 20px", fontSize: 14, cursor: isEmpty ? "not-allowed" : "pointer", opacity: isEmpty ? 0.4 : 1, background: isEmpty ? "var(--bg-card)" : "#00884415", border: `1px solid ${isEmpty ? "var(--border)" : "#00884440"}`, color: isEmpty ? "var(--text-muted)" : "#00dd88", borderRadius: 8, fontFamily: "Syne, sans-serif", fontWeight: 700, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.2s ease" }}>
          <span style={{ fontSize: 20 }}>📊</span>
          <span>Download Excel</span>
          <span style={{ fontSize: 11, opacity: 0.7, fontFamily: "DM Mono" }}>With summary sheet</span>
        </button>
      </div>

      {isEmpty && (
        <p style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)", fontFamily: "DM Mono", textAlign: "center" }}>Run scraping first to enable downloads</p>
      )}
    </div>
  );
}
