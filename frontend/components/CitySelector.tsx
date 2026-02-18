"use client";
import { useState, useRef, useEffect } from "react";
import { CITIES, POPULAR_CITIES } from "@/lib/cities";

interface Props {
  selected: string[];
  onChange: (cities: string[]) => void;
  single?: boolean;
}

export default function CitySelector({ selected, onChange, single = false }: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = search.length > 0 ? CITIES.filter(c => c.toLowerCase().includes(search.toLowerCase())).slice(0, 40) : POPULAR_CITIES;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (city: string) => {
    if (single) {
      onChange([city]);
      setOpen(false);
      setSearch("");
      return;
    }
    if (selected.includes(city)) {
      onChange(selected.filter(c => c !== city));
    } else {
      onChange([...selected, city]);
    }
  };

  const removeCity = (city: string) => onChange(selected.filter(c => c !== city));
  const selectAll = () => onChange([...CITIES]);
  const clearAll = () => onChange([]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ color: "var(--accent)", fontFamily: "DM Mono", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Step 2 — {single ? "Select City" : "Select Cities"}
        </p>
        {!single && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={selectAll} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "DM Mono" }}>All India</button>
            <span style={{ color: "var(--border)" }}>·</span>
            <button onClick={clearAll} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "DM Mono" }}>Clear</button>
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {selected.map(city => (
            <span key={city} className="tag-pill">
              {city}
              <button onClick={() => removeCity(city)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button>
            </span>
          ))}
        </div>
      )}

      <div ref={ref} style={{ position: "relative" }}>
        <input className="input-field" placeholder={single ? "Search city..." : `Search from ${CITIES.length} cities...`} value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setOpen(true)} />

        {open && (
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, zIndex: 50, maxHeight: 260, overflowY: "auto" }}>
            {search.length === 0 && (
              <div style={{ padding: "8px 14px 4px", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "DM Mono" }}>Popular Cities</div>
            )}
            {filtered.length === 0 && (
              <div style={{ padding: "16px", color: "var(--text-muted)", fontSize: 13, textAlign: "center" }}>No cities found</div>
            )}
            {filtered.map(city => {
              const isSelected = selected.includes(city);
              return (
                <button key={city} onClick={() => toggle(city)} style={{ width: "100%", padding: "10px 14px", background: isSelected ? "var(--accent-dim)" : "transparent", border: "none", cursor: "pointer", textAlign: "left", color: isSelected ? "var(--accent)" : "var(--text-primary)", fontSize: 13, fontFamily: "DM Mono, monospace", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {city}
                  {isSelected && <span style={{ fontSize: 10 }}>✓</span>}
                </button>
              );
            })}
            {search.length === 0 && (
              <div style={{ padding: "8px 14px", fontSize: 11, color: "var(--text-muted)", borderTop: "1px solid var(--border)", fontFamily: "DM Mono" }}>Type to search all {CITIES.length} cities...</div>
            )}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <p style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)", fontFamily: "DM Mono" }}>
          {selected.length} {selected.length === 1 ? "city" : "cities"} selected
        </p>
      )}
    </div>
  );
}
