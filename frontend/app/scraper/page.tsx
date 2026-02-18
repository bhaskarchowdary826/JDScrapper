"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ModeSelector from "@/components/ModeSelector";
import CitySelector from "@/components/CitySelector";
import CategoryInput from "@/components/CategoryInput";
import ProgressTracker, { JobItem } from "@/components/ProgressTracker";
import ResultsTable, { Record } from "@/components/ResultsTable";
import DownloadPanel from "@/components/DownloadPanel";

type Mode = "single" | "sweep" | "blast";
type AppState = "config" | "running" | "done";

export default function ScraperPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("single");
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [appState, setAppState] = useState<AppState>("config");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [results, setResults] = useState<Record[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"progress" | "results" | "download">("progress");

  const canStart = cities.length > 0 && categories.length > 0;
  const combinationCount = cities.length * categories.length;

  const buildJobs = (): JobItem[] => {
    const jobList: JobItem[] = [];
    for (const keyword of categories) {
      for (const city of cities) {
        jobList.push({ city, keyword, status: "pending", records: 0 });
      }
    }
    return jobList;
  };

  const startScraping = async () => {
    if (!canStart) return;
    setError("");
    const initialJobs = buildJobs();
    setJobs(initialJobs);
    setResults([]);
    setTotalRecords(0);
    setAppState("running");
    setActiveTab("progress");

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cities, keywords: categories, mode }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Scraping failed");
      }

      pollProgress(initialJobs);
    } catch (err: any) {
      setError(err.message);
      setAppState("config");
    }
  };

  const pollProgress = async (initialJobs: JobItem[]) => {
    let currentJobs = [...initialJobs];
    let allRecords: Record[] = [];

    for (let i = 0; i < currentJobs.length; i++) {
      currentJobs = currentJobs.map((j, idx) => ({
        ...j,
        status: idx === i ? "running" : j.status,
      }));
      setJobs([...currentJobs]);

      try {
        const res = await fetch("/api/scrape/job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: currentJobs[i].city,
            keyword: currentJobs[i].keyword,
          }),
        });

        const data = await res.json();
        const records: Record[] = (data.records || []).map((r: Record) => ({
          ...r,
          City: currentJobs[i].city,
          Keyword: currentJobs[i].keyword,
        }));

        allRecords = [...allRecords, ...records];
        currentJobs = currentJobs.map((j, idx) => ({
          ...j,
          status: idx === i ? (data.error ? "error" : "done") : j.status,
          records: idx === i ? records.length : j.records,
        }));

        setJobs([...currentJobs]);
        setResults([...allRecords]);
        setTotalRecords(allRecords.length);
      } catch {
        currentJobs = currentJobs.map((j, idx) => ({
          ...j,
          status: idx === i ? "error" : j.status,
        }));
        setJobs([...currentJobs]);
      }
    }

    setAppState("done");
    setActiveTab("results");
  };

  const reset = () => {
    setAppState("config");
    setJobs([]);
    setResults([]);
    setTotalRecords(0);
    setError("");
    setCities([]);
    setCategories([]);
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <nav style={{ padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", background: "rgba(8,8,8,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "DM Mono" }}>← Home</button>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15 }}>JD<span style={{ color: "var(--accent)" }}>Scraper</span></span>
        </div>
        {appState !== "config" && (
          <button onClick={reset} className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>New Scrape</button>
        )}
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: appState === "config" ? "1fr" : "1fr 1fr", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {appState === "config" ? (
            <>
              <div className="glass-card" style={{ padding: 28 }}>
                <ModeSelector selected={mode} onChange={m => { setMode(m); setCities([]); setCategories([]); }} />
              </div>
              <div className="glass-card" style={{ padding: 28 }}>
                <CitySelector selected={cities} onChange={setCities} single={mode === "single"} />
              </div>
              <div className="glass-card" style={{ padding: 28 }}>
                <CategoryInput categories={categories} onChange={setCategories} single={mode === "single"} />
              </div>
              <div className="glass-card" style={{ padding: 28 }}>
                <p style={{ color: "var(--accent)", fontFamily: "DM Mono", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Summary</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {[
                    { label: "Cities", value: cities.length },
                    { label: "Categories", value: categories.length },
                    { label: "Combinations", value: combinationCount },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: "center", padding: "16px", background: "var(--bg-secondary)", borderRadius: 8 }}>
                      <div style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: s.value > 0 ? "var(--accent)" : "var(--text-muted)" }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Mono", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {error && (
                  <div style={{ padding: "12px 16px", background: "#ff444415", border: "1px solid #ff444440", borderRadius: 8, color: "var(--destructive)", fontSize: 13, fontFamily: "DM Mono", marginBottom: 16 }}>✗ {error}</div>
                )}
                <button className="btn-accent" onClick={startScraping} disabled={!canStart} style={{ width: "100%", padding: "16px", fontSize: 15, border: "none", cursor: canStart ? "pointer" : "not-allowed", opacity: canStart ? 1 : 0.4 }}>
                  {canStart ? `🚀 Start Scraping ${combinationCount} combination${combinationCount !== 1 ? "s" : ""}` : "Select cities & categories to start"}
                </button>
              </div>
            </>
          ) : (
            <div className="glass-card" style={{ padding: 28 }}>
              <p style={{ color: "var(--accent)", fontFamily: "DM Mono", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>Job Configuration</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Mono", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Mode</div>
                  <span className="tag-pill">{mode === "single" ? "Single Target" : mode === "sweep" ? "City Sweep" : "Full Blast"}</span>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Mono", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Cities ({cities.length})</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {cities.map(c => <span key={c} className="tag-pill" style={{ fontSize: 11 }}>{c}</span>)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Mono", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Categories ({categories.length})</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {categories.map(c => <span key={c} className="tag-pill" style={{ background: "#0088ff15", borderColor: "#0088ff40", color: "#0088ff", fontSize: 11 }}>{c}</span>)}
                  </div>
                </div>
                {appState === "done" && (
                  <button onClick={reset} className="btn-ghost" style={{ padding: "12px", fontSize: 13, cursor: "pointer", marginTop: 8 }}>↺ Start New Scrape</button>
                )}
              </div>
            </div>
          )}
        </div>

        {appState !== "config" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 0 }}>
              {(["progress", "results", "download"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "14px 24px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab ? "var(--accent)" : "transparent"}`, color: activeTab === tab ? "var(--accent)" : "var(--text-secondary)", cursor: "pointer", fontFamily: "DM Mono", fontSize: 13, textTransform: "capitalize", transition: "all 0.2s ease" }}>
                  {tab === "progress" ? "⟳ Progress" : tab === "results" ? `◈ Results (${results.length})` : "⬇ Download"}
                </button>
              ))}
            </div>
            <div className="glass-card" style={{ padding: 28, borderTop: "none", borderRadius: "0 0 12px 12px" }}>
              {activeTab === "progress" && <ProgressTracker jobs={jobs} totalRecords={totalRecords} isRunning={appState === "running"} />}
              {activeTab === "results" && (results.length > 0 ? <ResultsTable data={results} /> : <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)", fontFamily: "DM Mono" }}>No results yet. Check progress tab.</div>)}
              {activeTab === "download" && <DownloadPanel data={results} disabled={appState === "running"} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
