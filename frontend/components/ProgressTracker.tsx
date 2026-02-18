"use client";

export interface JobItem {
  city: string;
  keyword: string;
  status: "pending" | "running" | "done" | "error";
  records: number;
}

interface Props {
  jobs: JobItem[];
  totalRecords: number;
  isRunning: boolean;
  onStop?: () => void;
}

const STATUS_CONFIG = {
  pending: { icon: "○", label: "Pending", color: "var(--text-muted)" },
  running: { icon: "⟳", label: "Running", color: "var(--warning)" },
  done: { icon: "✓", label: "Done", color: "var(--accent)" },
  error: { icon: "✗", label: "Error", color: "var(--destructive)" },
};

export default function ProgressTracker({ jobs, totalRecords, isRunning, onStop }: Props) {
  const done = jobs.filter(j => j.status === "done").length;
  const total = jobs.length;
  const progress = total > 0 ? (done / total) * 100 : 0;
  const running = jobs.find(j => j.status === "running");

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Progress", value: `${done}/${total}` },
          { label: "Records Found", value: totalRecords.toLocaleString() },
          { label: "Status", value: isRunning ? "Running..." : done === total ? "Complete" : "Ready" },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, color: i === 1 ? "var(--accent)" : "var(--text-primary)", marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "DM Mono" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "DM Mono" }}>
            {running ? `Currently: ${running.keyword} in ${running.city}` : done === total && total > 0 ? "All done!" : "Waiting to start..."}
          </span>
          <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "DM Mono" }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 6, background: "var(--bg-card)", borderRadius: 100, overflow: "hidden" }}>
          <div className={isRunning ? "progress-shimmer" : ""} style={{ height: "100%", width: `${progress}%`, background: isRunning ? undefined : "var(--accent)", borderRadius: 100, transition: "width 0.5s ease" }} />
        </div>
      </div>

      {isRunning && onStop && (
        <button onClick={onStop} style={{ width: "100%", padding: "10px", background: "transparent", border: "1px solid var(--destructive)", color: "var(--destructive)", borderRadius: 8, cursor: "pointer", fontFamily: "DM Mono", fontSize: 13, marginBottom: 20, transition: "all 0.2s ease" }} onMouseEnter={e => (e.currentTarget.style.background = "#ff444415")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
          ⬛ Stop Scraping
        </button>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: 320, overflowY: "auto" }}>
        {jobs.map((job, i) => {
          const config = STATUS_CONFIG[job.status];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: job.status === "running" ? "#ffaa0008" : job.status === "done" ? "#00ff8805" : "transparent", borderRadius: 6, borderLeft: `2px solid ${job.status === "pending" ? "transparent" : config.color}`, transition: "all 0.3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: config.color, fontSize: 14, animation: job.status === "running" ? "spin 1s linear infinite" : "none", display: "inline-block" }}>{config.icon}</span>
                <span style={{ fontSize: 13, fontFamily: "DM Mono", color: job.status === "pending" ? "var(--text-muted)" : "var(--text-primary)" }}>
                  <span style={{ color: config.color }}>{job.keyword}</span> in {job.city}
                </span>
              </div>
              {job.status === "done" && (
                <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "DM Mono" }}>{job.records} records</span>
              )}
              {job.status === "running" && (
                <span style={{ fontSize: 11, color: "var(--warning)", fontFamily: "DM Mono" }}>scraping...</span>
              )}
            </div>
          );
        })}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
