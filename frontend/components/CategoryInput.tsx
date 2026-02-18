"use client";
import { useState } from "react";
import { SUGGESTED_KEYWORDS } from "@/lib/cities";

interface Props {
  categories: string[];
  onChange: (cats: string[]) => void;
  single?: boolean;
}

export default function CategoryInput({ categories, onChange, single = false }: Props) {
  const [input, setInput] = useState("");

  const add = (val: string) => {
    const formatted = val.trim().toLowerCase().replace(/\s+/g, "-");
    if (!formatted) return;
    if (single) {
      onChange([formatted]);
      setInput("");
      return;
    }
    if (!categories.includes(formatted)) {
      onChange([...categories, formatted]);
    }
    setInput("");
  };

  const remove = (cat: string) => onChange(categories.filter(c => c !== cat));

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
    }
    if (e.key === "Backspace" && !input && categories.length > 0) {
      remove(categories[categories.length - 1]);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ color: "var(--accent)", fontFamily: "DM Mono", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Step 3 — {single ? "Enter Category" : "Enter Categories"}
        </p>
        {!single && categories.length > 0 && (
          <button onClick={() => onChange([])} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "DM Mono" }}>Clear all</button>
        )}
      </div>

      {categories.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {categories.map(cat => (
            <span key={cat} className="tag-pill" style={{ background: "#0088ff15", borderColor: "#0088ff40", color: "#0088ff" }}>
              {cat}
              <button onClick={() => remove(cat)} style={{ background: "none", border: "none", color: "#0088ff", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button>
            </span>
          ))}
        </div>
      )}

      <input className="input-field" placeholder={single ? 'e.g. builders' : 'Type category + Enter (e.g. builders, architects)'} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} onBlur={() => input && add(input)} />

      <p style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Mono" }}>Spaces auto-converted to hyphens. Press Enter to add.</p>

      <div style={{ marginTop: 14 }}>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontFamily: "DM Mono", letterSpacing: "0.05em" }}>QUICK ADD:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SUGGESTED_KEYWORDS.filter(k => !categories.includes(k)).slice(0, 12).map(kw => (
            <button key={kw} onClick={() => add(kw)} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 100, padding: "4px 12px", fontSize: 11, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "DM Mono", transition: "all 0.15s ease" }} onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--accent)"; (e.target as HTMLButtonElement).style.color = "var(--accent)"; }} onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--border)"; (e.target as HTMLButtonElement).style.color = "var(--text-secondary)"; }}>
              + {kw}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
