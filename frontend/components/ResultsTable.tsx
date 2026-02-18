"use client";
import { useState } from "react";

export interface Record {
  Name: string;
  Address: string;
  Phone: string;
  City?: string;
  Keyword?: string;
}

interface Props {
  data: Record[];
}

export default function ResultsTable({ data }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const PER_PAGE = 20;

  const filtered = data.filter(r =>
    r.Name?.toLowerCase().includes(search.toLowerCase()) ||
    r.City?.toLowerCase().includes(search.toLowerCase()) ||
    r.Address?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <input className="input-field" style={{ maxWidth: 320 }} placeholder="Search results..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "DM Mono" }}>
          Showing {filtered.length.toLocaleString()} of {data.length.toLocaleString()} records
        </span>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--border)" }}>
        <table className="data-table">
          <thead>
            <tr style={{ background: "var(--bg-card)" }}>
              <th style={{ width: 40 }}>#</th>
              <th>Name</th>
              <th>City</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>No results found</td></tr>
            ) : (
              pageData.map((row, i) => (
                <tr key={i}>
                  <td style={{ color: "var(--text-muted)", fontSize: 11 }}>{(page - 1) * PER_PAGE + i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{row.Name || "—"}</td>
                  <td><span className="tag-pill" style={{ fontSize: 11 }}>{row.City || "—"}</span></td>
                  <td style={{ color: "var(--text-secondary)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.Address || "—"}</td>
                  <td style={{ color: row.Phone ? "var(--accent)" : "var(--text-muted)" }}>{row.Phone || "—"}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: 11 }}>{row.Keyword || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16, alignItems: "center" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost" style={{ padding: "6px 14px", fontSize: 12, cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
          <span style={{ fontFamily: "DM Mono", fontSize: 12, color: "var(--text-secondary)" }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost" style={{ padding: "6px 14px", fontSize: 12, cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>Next →</button>
        </div>
      )}
    </div>
  );
}
