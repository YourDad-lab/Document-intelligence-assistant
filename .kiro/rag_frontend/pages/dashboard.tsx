import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

// ─── Mock data generators ───────────────────────────────────────────────────
const queryVolume = [
  { time: "00:00", queries: 12 }, { time: "02:00", queries: 5 },
  { time: "04:00", queries: 3 },  { time: "06:00", queries: 18 },
  { time: "08:00", queries: 47 }, { time: "10:00", queries: 89 },
  { time: "12:00", queries: 134 },{ time: "14:00", queries: 112 },
  { time: "16:00", queries: 98 }, { time: "18:00", queries: 76 },
  { time: "20:00", queries: 54 }, { time: "22:00", queries: 31 },
];

const confidenceTrend = [
  { day: "Mon", high: 68, medium: 22, low: 10 },
  { day: "Tue", high: 72, medium: 19, low: 9 },
  { day: "Wed", high: 65, medium: 25, low: 10 },
  { day: "Thu", high: 80, medium: 15, low: 5 },
  { day: "Fri", high: 77, medium: 18, low: 5 },
  { day: "Sat", high: 83, medium: 13, low: 4 },
  { day: "Sun", high: 79, medium: 16, low: 5 },
];

const latencyData = [
  { day: "Mon", retrieval: 142, generation: 890 },
  { day: "Tue", retrieval: 138, generation: 921 },
  { day: "Wed", retrieval: 155, generation: 875 },
  { day: "Thu", retrieval: 129, generation: 843 },
  { day: "Fri", retrieval: 147, generation: 912 },
  { day: "Sat", retrieval: 133, generation: 867 },
  { day: "Sun", retrieval: 141, generation: 898 },
];

const topQueries = [
  { query: "What is artificial intelligence?", count: 143, confidence: "high" },
  { query: "Explain machine learning algorithms", count: 98, confidence: "high" },
  { query: "Contract termination clauses", count: 87, confidence: "medium" },
  { query: "Define neural networks", count: 76, confidence: "high" },
  { query: "What are legal obligations?", count: 64, confidence: "medium" },
  { query: "How does deep learning work?", count: 59, confidence: "high" },
  { query: "Wikipedia article on climate", count: 41, confidence: "low" },
];

const docUsage = [
  { name: "Wikipedia 2023", value: 44, color: "#38bdf8" },
  { name: "Wikipedia 2020", value: 31, color: "#818cf8" },
  { name: "CUAD Contracts", value: 25, color: "#34d399" },
];

const feedbackData = [
  { day: "Mon", positive: 82, negative: 18 },
  { day: "Tue", positive: 78, negative: 22 },
  { day: "Wed", positive: 85, negative: 15 },
  { day: "Thu", positive: 91, negative: 9 },
  { day: "Fri", positive: 88, negative: 12 },
  { day: "Sat", positive: 93, negative: 7 },
  { day: "Sun", positive: 89, negative: 11 },
];

const recentLogs = [
  { time: "14:32:01", query: "What is transfer learning?", confidence: "high", ms: 1024, status: "ok" },
  { time: "14:31:44", query: "Explain GDPR compliance", confidence: "medium", ms: 1187, status: "ok" },
  { time: "14:31:20", query: "Blockchain definition", confidence: "high", ms: 987, status: "ok" },
  { time: "14:30:55", query: "Patent infringement laws", confidence: "low", ms: 1342, status: "warn" },
  { time: "14:30:11", query: "Neural network architecture", confidence: "high", ms: 903, status: "ok" },
  { time: "14:29:48", query: "Climate change effects", confidence: "medium", ms: 1098, status: "ok" },
  { time: "14:29:22", query: "How do LLMs hallucinate?", confidence: "low", ms: 1456, status: "warn" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(ease * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

const CONF_COLORS = { high: "#34d399", medium: "#fbbf24", low: "#f87171" };
const CONF_BG = { high: "rgba(52,211,153,0.12)", medium: "rgba(251,191,36,0.12)", low: "rgba(248,113,113,0.12)" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#cbd5e1" }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: "#f1f5f9" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span>{p.name}: <b style={{ color: "#f1f5f9" }}>{p.value}</b></span>
        </div>
      ))}
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent, icon, prefix = "", suffix = "" }) {
  return (
    <div style={{
      background: "rgba(15,23,42,0.6)",
      border: `1px solid ${accent}33`,
      borderRadius: 16,
      padding: "22px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(12px)",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${accent}22`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${accent}22, transparent 70%)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5 }}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "#f1f5f9", letterSpacing: -1, fontFamily: "'DM Sans', sans-serif" }}>
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'IBM Plex Mono', monospace" }}>{sub}</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 3, height: 18, background: "linear-gradient(180deg,#38bdf8,#818cf8)", borderRadius: 4 }} />
      <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5 }}>{children}</span>
    </div>
  );
}

function ChartCard({ title, children, span = 1 }) {
  return (
    <div style={{
      background: "rgba(15,23,42,0.6)",
      border: "1px solid rgba(148,163,184,0.08)",
      borderRadius: 16,
      padding: "20px 22px",
      gridColumn: `span ${span}`,
      backdropFilter: "blur(12px)",
    }}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function RAGDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [liveCount, setLiveCount] = useState(679);
  const [pulseOn, setPulseOn] = useState(true);
  
  useEffect(() => {
    const id = setInterval(() => setLiveCount(c => c + Math.floor(Math.random() * 3)), 4000);
    const pid = setInterval(() => setPulseOn(p => !p), 900);
    return () => { clearInterval(id); clearInterval(pid); };
  }, []);
  
  const tabs = ["overview", "queries", "performance", "logs"];
  
  return (
    <div style={{
      minHeight: "100vh",
      background: "#020b18",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#f1f5f9",
      padding: "0",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=IBM+Plex+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        body { margin: 0; }
      `}</style>
      
      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(56,189,248,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.03) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      
      {/* Glow blobs */}
      <div style={{ position: "fixed", top: -120, left: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(56,189,248,0.07),transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, right: -60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(129,140,248,0.07),transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#38bdf8,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.5, background: "linear-gradient(90deg,#f1f5f9,#94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>RAG Analytics</h1>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#475569", fontFamily: "'IBM Plex Mono', monospace" }}>Document Q&A · System Intelligence Dashboard</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 20, padding: "8px 16px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", boxShadow: pulseOn ? "0 0 0 4px rgba(52,211,153,0.3)" : "none", transition: "box-shadow 0.4s" }} />
            <span style={{ fontSize: 12, color: "#34d399", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>LIVE</span>
            <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'IBM Plex Mono', monospace" }}>{liveCount.toLocaleString()} queries served</span>
          </div>
        </div>
        
        {/* ── Tab Nav ── */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 12, padding: 4, width: "fit-content" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "8px 20px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              fontFamily: "'IBM Plex Mono', monospace", textTransform: "capitalize", transition: "all 0.2s",
              background: activeTab === tab ? "linear-gradient(135deg,#1e3a5f,#1e2d4a)" : "transparent",
              color: activeTab === tab ? "#38bdf8" : "#475569",
              boxShadow: activeTab === tab ? "0 2px 12px rgba(56,189,248,0.15)" : "none",
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* ════════ OVERVIEW TAB ════════ */}
        {activeTab === "overview" && (
          <>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              <StatCard label="Total Queries" value={liveCount} suffix="" accent="#38bdf8" icon="🔍" sub="↑ 12.4% from yesterday" />
              <StatCard label="High Confidence" value={79} suffix="%" accent="#34d399" icon="✅" sub="of all answers today" />
              <StatCard label="Avg Latency" value={1038} suffix="ms" accent="#818cf8" icon="⚡" sub="retrieval + generation" />
              <StatCard label="Documents Indexed" value={255} accent="#fbbf24" icon="📄" sub="across 3 datasets" />
            </div>
            
            {/* Charts row 1 */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
              <ChartCard title="Query Volume — Today (hourly)">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={queryVolume}>
                    <defs>
                      <linearGradient id="qv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="queries" stroke="#38bdf8" strokeWidth={2} fill="url(#qv)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
              
              <ChartCard title="Dataset Usage">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={docUsage} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={4} dataKey="value" stroke="none">
                      {docUsage.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                  {docUsage.map(d => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                        <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'IBM Plex Mono', monospace" }}>{d.name}</span>
                      </div>
                      <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            {/* Charts row 2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <ChartCard title="Confidence Distribution — Weekly">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={confidenceTrend} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="high" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="medium" stackId="a" fill="#fbbf24" />
                    <Bar dataKey="low" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
              
              <ChartCard title="User Feedback — Weekly (%)">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={feedbackData}>
                    <defs>
                      <linearGradient id="pos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="positive" name="👍 positive" stroke="#34d399" strokeWidth={2} fill="url(#pos)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}

        {/* ════════ QUERIES TAB ════════ */}
        {activeTab === "queries" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <ChartCard title="Top Queries" span={2}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {topQueries.map((q, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "12px 16px",
                    border: "1px solid rgba(148,163,184,0.06)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(56,189,248,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  >
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1e3a5f", fontFamily: "'IBM Plex Mono', monospace", minWidth: 24 }}>#{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#e2e8f0", marginBottom: 6 }}>{q.query}</div>
                      <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(q.count / 143) * 100}%`, background: `linear-gradient(90deg,${CONF_COLORS[q.confidence]},${CONF_COLORS[q.confidence]}88)`, borderRadius: 99, transition: "width 1s" }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'IBM Plex Mono', monospace", minWidth: 40, textAlign: "right" }}>{q.count}x</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, fontFamily: "'IBM Plex Mono', monospace",
                      color: CONF_COLORS[q.confidence], background: CONF_BG[q.confidence],
                      border: `1px solid ${CONF_COLORS[q.confidence]}44`, textTransform: "uppercase",
                    }}>
                      {q.confidence}
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
            
            <ChartCard title="Query Volume — Hourly">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={queryVolume} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="queries" fill="#38bdf8" radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            
            <ChartCard title="Confidence Split — Weekly Trend">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={confidenceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="high" name="High" stroke="#34d399" strokeWidth={2.5} dot={{ r: 4, fill: "#34d399" }} />
                  <Line type="monotone" dataKey="medium" name="Medium" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3, fill: "#fbbf24" }} strokeDasharray="4 2" />
                  <Line type="monotone" dataKey="low" name="Low" stroke="#f87171" strokeWidth={2} dot={{ r: 3, fill: "#f87171" }} strokeDasharray="2 4" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {/* ════════ PERFORMANCE TAB ════════ */}
        {activeTab === "performance" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              <StatCard label="Avg Retrieval" value={141} suffix="ms" accent="#818cf8" icon="🔎" sub="vector search time" />
              <StatCard label="Avg Generation" value={898} suffix="ms" accent="#38bdf8" icon="🤖" sub="LLM response time" />
              <StatCard label="P95 Latency" value={1456} suffix="ms" accent="#fbbf24" icon="📊" sub="95th percentile" />
              <StatCard label="Uptime" value={99} suffix="%" accent="#34d399" icon="🟢" sub="last 30 days" />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <ChartCard title="Latency Breakdown — ms (Weekly)">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={latencyData} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="retrieval" name="Retrieval" fill="#818cf8" radius={[0, 0, 0, 0]} stackId="lat" />
                    <Bar dataKey="generation" name="Generation" fill="#38bdf8" radius={[4, 4, 0, 0]} stackId="lat" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
              
              <ChartCard title="Generation Latency Trend">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={latencyData}>
                    <defs>
                      <linearGradient id="gen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#475569", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="generation" name="Generation ms" stroke="#818cf8" strokeWidth={2} fill="url(#gen)" dot={false} />
                    <Area type="monotone" dataKey="retrieval" name="Retrieval ms" stroke="#38bdf8" strokeWidth={2} fill="none" dot={false} strokeDasharray="4 2" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}

        {/* ════════ LOGS TAB ════════ */}
        {activeTab === "logs" && (
          <ChartCard title="Recent Query Log" span={1}>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
              {["all", "ok", "warn"].map(f => (
                <button key={f} style={{
                  padding: "5px 14px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.12)", background: "rgba(255,255,255,0.03)",
                  color: "#64748b", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer", textTransform: "uppercase", letterSpacing: 1,
                }}>
                  {f}
                </button>
              ))}
              <div style={{ marginLeft: "auto", fontSize: 11, color: "#1e3a5f", fontFamily: "'IBM Plex Mono', monospace" }}>
                auto-refresh: <span style={{ color: "#34d399" }}>ON</span>
              </div>
            </div>
            
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 80px 70px 60px", gap: 12, padding: "8px 12px", color: "#334155", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, borderBottom: "1px solid rgba(148,163,184,0.06)" }}>
                <span>Time</span>
                <span>Query</span>
                <span>Confidence</span>
                <span>Latency</span>
                <span>Status</span>
              </div>
              
              {recentLogs.map((log, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "90px 1fr 80px 70px 60px", gap: 12,
                  padding: "12px", borderBottom: "1px solid rgba(148,163,184,0.04)",
                  transition: "background 0.15s",
                  alignItems: "center",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(56,189,248,0.03)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ color: "#475569" }}>{log.time}</span>
                  <span style={{ color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.query}</span>
                  <span style={{ color: CONF_COLORS[log.confidence], fontSize: 10, textTransform: "uppercase" }}>{log.confidence}</span>
                  <span style={{ color: log.ms > 1200 ? "#fbbf24" : "#64748b" }}>{log.ms}ms</span>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 6, textTransform: "uppercase", fontWeight: 700, width: "fit-content",
                    background: log.status === "ok" ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)",
                    color: log.status === "ok" ? "#34d399" : "#fbbf24",
                    border: `1px solid ${log.status === "ok" ? "rgba(52,211,153,0.2)" : "rgba(251,191,36,0.2)"}`,
                  }}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Footer summary */}
            <div style={{ display: "flex", gap: 24, marginTop: 20, padding: "14px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(148,163,184,0.06)" }}>
              {[
                { label: "Total logged", value: "7", color: "#64748b" },
                { label: "OK", value: "5", color: "#34d399" },
                { label: "WARN (low confidence)", value: "2", color: "#fbbf24" },
                { label: "Errors", value: "0", color: "#f87171" },
                { label: "Avg latency", value: "1142ms", color: "#818cf8" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 10, color: "#334155", fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        )}
        
        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid rgba(148,163,184,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#1e3a5f", fontFamily: "'IBM Plex Mono', monospace" }}>RAG Analytics v1.0 · Built with FastAPI + Next.js</span>
          <span style={{ fontSize: 11, color: "#1e3a5f", fontFamily: "'IBM Plex Mono', monospace" }}>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
