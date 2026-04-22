import { useEffect, useRef, useState } from "react";
import { Terminal } from "lucide-react";

const FILTERS = [
  { key: "all",   label: "All" },
  { key: "info",  label: "Info" },
  { key: "warn",  label: "Warn" },
  { key: "error", label: "Error" },
];

// CKB outputs WARN/DEBUG/INFO inside the message string itself
function getLogLevel(log) {
  if (log.type === "error") return "error";
  const msg = log.message?.toUpperCase() || "";
  if (msg.includes("WARN")) return "warn";
  return "info";
}

const LEVEL_COLOR = {
  info:  "#a8ff78",
  warn:  "#fbbf24",
  error: "#ff6b6b",
};

const FILTER_STYLES = {
  active: {
    all:   { background: "#333",    color: "#fff"    },
    info:  { background: "#1a3a1a", color: "#a8ff78" },
    warn:  { background: "#3a2e0a", color: "#fbbf24" },
    error: { background: "#3a1a1a", color: "#ff6b6b" },
  },
  inactive: {
    background: "transparent",
    color: "#666",
    border: "1px solid #333",
  },
};

export default function NodeLogs() {
  const [logs, setLogs]       = useState([]);
  const [filter, setFilter]   = useState("all");
  const containerRef          = useRef(null);

  useEffect(() => {
    const source = new EventSource("http://localhost:3001/logs");
    source.onmessage = (e) => {
      const log = JSON.parse(e.data);
      setLogs(prev => [...prev.slice(-500), log]);
    };
    source.onerror = () => console.error("SSE connection lost");
    return () => source.close();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, filter]);

  const visibleLogs = filter === "all"
    ? logs
    : logs.filter(log => getLogLevel(log) === filter);

  const counts = logs.reduce((acc, log) => {
    const level = getLogLevel(log);
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 16, marginTop: 24 }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ color: "#fff", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <Terminal size={18} color="#a8ff78" />
          Node Logs
        </h3>
        <button
          onClick={() => setLogs([])}
          style={{ background: "#333", color: "#fff", border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer" }}
        >
          Clear
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {FILTERS.map(({ key, label }) => {
          const isActive = filter === key;
          const activeStyle = FILTER_STYLES.active[key];
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: 5,
                border: isActive ? "1px solid transparent" : "1px solid #333",
                cursor: "pointer",
                fontSize: 11,
                fontFamily: "monospace",
                transition: "all 0.15s",
                ...(isActive ? activeStyle : FILTER_STYLES.inactive),
              }}
            >
              {label}
              {key !== "all" && counts[key] > 0 && (
                <span style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  padding: "0 4px",
                  fontSize: 10,
                  minWidth: 16,
                  textAlign: "center",
                }}>
                  {counts[key]}
                </span>
              )}
            </button>
          );
        })}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#444", fontFamily: "monospace", alignSelf: "center" }}>
          {visibleLogs.length} / {logs.length}
        </span>
      </div>

      {/* ── Log list ── */}
      <div
        ref={containerRef}
        onWheel={e => e.stopPropagation()}
        style={{ height: 300, overflowY: "auto", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6 }}
      >
        {visibleLogs.length === 0 ? (
          <p style={{ color: "#666" }}>
            {logs.length === 0 ? "No logs available..." : `No ${filter} logs.`}
          </p>
        ) : (
          visibleLogs.map((log, i) => {
            const level = getLogLevel(log);
            return (
              <div key={i} style={{
                color: LEVEL_COLOR[level],
                borderBottom: "1px solid #222",
                padding: "2px 0",
                display: "flex",
                gap: 6,
              }}>
                <span style={{ color: "#666", flexShrink: 0 }}>[{log.time}]</span>
                <span style={{
                  color: level === "warn" ? "#fbbf24" : level === "error" ? "#ff6b6b" : "#555",
                  flexShrink: 0,
                  fontSize: 10,
                  alignSelf: "center",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  {level}
                </span>
                <span style={{ color: LEVEL_COLOR[level] }}>{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}