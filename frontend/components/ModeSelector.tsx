"use client";

type Mode = "single" | "sweep" | "blast";

interface Props {
  selected: Mode;
  onChange: (mode: Mode) => void;
}

const MODES = [
  { id: "single" as Mode, icon: "◎", title: "Single Target", subtitle: "1 category · 1 city", desc: "Fast and precise. Perfect for testing a specific market.", color: "#00ff88" },
  { id: "sweep" as Mode, icon: "⊞", title: "City Sweep", subtitle: "1 category · many cities", desc: "Scale one category across the entire country.", color: "#00ddff" },
  { id: "blast" as Mode, icon: "⧉", title: "Full Blast", subtitle: "many categories · many cities", desc: "Maximum coverage. All combinations scraped automatically.", color: "#ff8844" },
];

export default function ModeSelector({ selected, onChange }: Props) {
  return (
    <div>
      <p style={{ color: "var(--accent)", fontFamily: "DM Mono", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
        Step 1 — Select Mode
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {MODES.map((mode) => {
          const isSelected = selected === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onChange(mode.id)}
              style={{
                background: isSelected ? `${mode.color}10` : "var(--bg-card)",
                border: `1px solid ${isSelected ? mode.color : "var(--border)"}`,
                borderRadius: 12,
                padding: "24px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {isSelected && (
                <div style={{ position: "absolute", top: 12, right: 12, width: 8, height: 8, borderRadius: "50%", background: mode.color, boxShadow: `0 0 8px ${mode.color}` }} />
              )}
              <div style={{ fontSize: 28, marginBottom: 14, color: isSelected ? mode.color : "var(--text-muted)", fontFamily: "DM Mono" }}>{mode.icon}</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{mode.title}</div>
              <div style={{ fontFamily: "DM Mono", fontSize: 11, color: isSelected ? mode.color : "var(--text-muted)", marginBottom: 10, letterSpacing: "0.05em" }}>{mode.subtitle}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{mode.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
