"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STATS = [
  { value: "300+", label: "Indian Cities" },
  { value: "3", label: "Scraping Modes" },
  { value: "CSV & Excel", label: "Export Formats" },
  { value: "100%", label: "Free & Open Source" },
];

const FEATURES = [
  { icon: "◎", title: "Single Target", desc: "One category, one city. Fast and precise. Perfect for targeted lead generation." },
  { icon: "⊞", title: "City Sweep", desc: "One category across multiple cities. Scale your search nationwide instantly." },
  { icon: "⧉", title: "Full Blast", desc: "Multiple categories across multiple cities. Maximum coverage, zero manual work." },
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {mounted && (
        <div style={{ position: "fixed", left: mousePos.x - 200, top: mousePos.y - 200, width: 400, height: 400, background: "radial-gradient(circle, #00ff8808 0%, transparent 70%)", pointerEvents: "none", zIndex: 0, transition: "left 0.1s ease, top 0.1s ease" }} />
      )}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", background: "rgba(8,8,8,0.8)", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="pulse-dot" />
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "0.05em" }}>
            JD<span style={{ color: "var(--accent)" }}>Scraper</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="https://github.com/r7avi/JustDial-Data-Scrapper" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13, cursor: "pointer", textDecoration: "none" }}>GitHub ↗</a>
          <button className="btn-accent" style={{ padding: "8px 20px", fontSize: 13, cursor: "pointer", border: "none" }} onClick={() => router.push("/scraper")}>Launch App</button>
        </div>
      </nav>

      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", textAlign: "center" }}>
        <div className="animate-fade-in" style={{ marginBottom: 32 }}>
          <span className="tag-pill"><span>▲</span> JustDial Lead Generation Tool</span>
        </div>
        <h1 className="animate-fade-in-delay-1" style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: 24, maxWidth: 900 }}>
          Scrape Business Leads <span className="gradient-text">Across India</span><br />in Minutes.
        </h1>
        <p className="animate-fade-in-delay-2" style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 560, lineHeight: 1.7, marginBottom: 48, fontFamily: "DM Mono, monospace" }}>
          Extract names, addresses & phone numbers from JustDial for any city, any category. Export to CSV or Excel instantly.
        </p>
        <div className="animate-fade-in-delay-3" style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 80 }}>
          <button className="btn-accent" style={{ padding: "16px 40px", fontSize: 16, cursor: "pointer", border: "none" }} onClick={() => router.push("/scraper")}>Start Scraping →</button>
          <a href="https://github.com/r7avi/JustDial-Data-Scrapper" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: "16px 40px", fontSize: 16, cursor: "pointer", textDecoration: "none" }}>View on GitHub</a>
        </div>
        <div className="animate-fade-in-delay-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1, maxWidth: 700, width: "100%", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{ padding: "28px 20px", background: "var(--bg-card)", textAlign: "center", borderRight: i < STATS.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: "var(--accent)", marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{ color: "var(--accent)", fontFamily: "DM Mono", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Three Modes</p>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800 }}>Built for Every Scale</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: 36 }}>
              <div style={{ fontSize: 32, color: "var(--accent)", marginBottom: 20, fontFamily: "DM Mono" }}>{f.icon}</div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 48px", border: "1px solid var(--border)", borderRadius: 16, background: "var(--bg-card)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, #00ff8808 0%, transparent 60%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, marginBottom: 16, position: "relative" }}>Ready to Generate Leads?</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 36, position: "relative" }}>No API keys. No signup. Just open and scrape.</p>
          <button className="btn-accent" style={{ padding: "16px 48px", fontSize: 16, cursor: "pointer", border: "none", position: "relative" }} onClick={() => router.push("/scraper")}>Launch Scraper →</button>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15 }}>JD<span style={{ color: "var(--accent)" }}>Scraper</span></span>
        <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Built with Next.js + Python Selenium</span>
        <a href="https://github.com/r7avi/JustDial-Data-Scrapper" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)", fontSize: 13, textDecoration: "none" }}>GitHub ↗</a>
      </footer>
    </div>
  );
}
