import { useState, useRef } from "react";

export default function CkbUpdateChecker({ header, status, updateInfo, ckbUpdateCheck, updateState, startUpdate, percent, errorMsg, newVersion, resetUpdate }) {

  // ── Early returns ──────────────────────────────────────────────

  if (status === "stopped") {
    return (
      <div style={styles.offState}>
        <div style={styles.offIcon}>⬡</div>
        <p style={styles.offText}>Node is offline</p>
        <p style={styles.offSub}>Start the node to check for updates</p>
      </div>
    );
  }

  if (!header) {
    return (
      <div style={styles.card}>
        <div style={styles.skeleton} />
      </div>
    );
  }

  const hasUpdate = updateInfo?.hasUpdate;
  const current   = updateInfo?.current;
  const latest    = updateInfo?.latest;
  const checked   = updateInfo != null;
  const isRunning = ["downloading", "verifying", "replacing"].includes(updateState);

  // ── Progress bar width ────────────────────────────────────────
  const progressPct =
    updateState === "downloading" ? Math.round(percent * 0.75) :
    updateState === "verifying"   ? 80 :
    updateState === "replacing"   ? 92 :
    updateState === "done"        ? 100 : 0;

  const progressColor =
    updateState === "error" ? "#ef4444" :
    updateState === "done"  ? "#34d399" :
    updateState === "verifying"  ? "#a78bfa" :
    updateState === "replacing"  ? "#fb923c" : "#4f8ef7";

  const stageLabel =
    updateState === "downloading" ? `Downloading… ${percent}%` :
    updateState === "verifying"   ? "Verifying checksum…" :
    updateState === "replacing"   ? "Replacing binary…" : "";

  // ── Render ────────────────────────────────────────────────────

  return (
    <div style={styles.card}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.hexIcon}>⬡</div>
          <div>
            <div style={styles.title}>CKB Binary</div>
            <div style={styles.subtitle}>Version manager</div>
          </div>
        </div>
        <button
          onClick={ckbUpdateCheck}
          disabled={isRunning}
          style={{ ...styles.checkBtn, opacity: isRunning ? 0.4 : 1 }}
          onMouseEnter={e => { if (!isRunning) e.currentTarget.style.background = "#1e2230"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          <span style={styles.refreshIcon}>↻</span>
          Check
        </button>
      </div>

      <div style={styles.divider} />

      {/* Version rows */}
      <div style={styles.versionGrid}>
        <div style={styles.versionRow}>
          <span style={styles.versionLabel}>Installed</span>
          <span style={styles.versionValue}>
            {updateState === "done"
              ? <span style={{ color: "#34d399" }}>v{newVersion}</span>
              : current ? `v${current}` : <span style={styles.dim}>—</span>}
          </span>
        </div>
        <div style={styles.versionRow}>
          <span style={styles.versionLabel}>Latest</span>
          <span style={styles.versionValue}>
            {latest ? `v${latest}` : <span style={styles.dim}>—</span>}
          </span>
        </div>
      </div>

      {/* Progress bar (shown while updating) */}
      {isRunning && (
        <>
          <div style={styles.divider} />
          <div style={styles.progressWrap}>
            <div style={styles.progressTrack}>
              <div style={styles.progressFill(progressPct, progressColor)} />
            </div>
            <div style={styles.stageRow}>
              <span style={styles.spinner} />
              <span style={{ color: progressColor, fontSize: 12 }}>{stageLabel}</span>
            </div>
            {/* Stage dots */}
            <div style={styles.stageDots}>
              {[
                { key: "downloading", label: "Download",  color: "#4f8ef7" },
                { key: "verifying",   label: "Verify",    color: "#a78bfa" },
                { key: "replacing",   label: "Replace",   color: "#fb923c" },
              ].map(({ key, label, color }) => {
                const stages = ["downloading", "verifying", "replacing"];
                const curIdx = stages.indexOf(updateState);
                const ownIdx = stages.indexOf(key);
                const done   = ownIdx < curIdx;
                const active = ownIdx === curIdx;
                return (
                  <div key={key} style={styles.stageDot}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: done ? "#34d399" : active ? color : "#2a2f3d",
                      transition: "background 0.3s",
                    }} />
                    <span style={{ fontSize: 10, color: done ? "#34d399" : active ? color : "#3a3f52" }}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Status badge / result */}
      {!isRunning && (
        <>
          <div style={styles.divider} />

          {updateState === "done" && (
            <div style={styles.badgeOk}>
              <span style={styles.badgeDot(false)} />
              Updated to v{newVersion} — restart node to apply
            </div>
          )}

          {updateState === "error" && (
            <div style={styles.badgeError}>
              <span style={{ ...styles.badgeDot(true), background: "#ef4444" }} />
              <span style={{ flex: 1 }}>{errorMsg || "Update failed"}</span>
              <button
                onClick={resetUpdate}
                style={styles.retryBtn}
                onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.style.opacity = "0.7"}
              >
                Retry
              </button>
            </div>
          )}

          {updateState === "idle" && checked && (
            hasUpdate ? (
              <div style={styles.badgeUpdate}>
                <span style={styles.badgeDot(true)} />
                <span style={{ flex: 1 }}>v{latest} is ready</span>
                <button
                  onClick={startUpdate}
                  style={styles.installBtn}
                  onMouseEnter={e => e.currentTarget.style.background = "#1a6be0"}
                  onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}
                >
                  Install
                </button>
              </div>
            ) : (
              <div style={styles.badgeOk}>
                <span style={styles.badgeDot(false)} />
                You're on the latest version
              </div>
            )
          )}
        </>
      )}

    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────

const styles = {
  card: {
    background: "#13161e",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: "20px 22px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    fontFamily: '"IBM Plex Mono", "Fira Code", monospace',
    color: "#c8ccd8",
    minWidth: 300,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  hexIcon: {
    fontSize: 26,
    color: "#4f8ef7",
    lineHeight: 1,
    userSelect: "none",
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: "#e2e5f0",
    letterSpacing: "0.01em",
  },
  subtitle: {
    fontSize: 11,
    color: "#555b72",
    marginTop: 2,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  checkBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#9ba3b8",
    fontSize: 12,
    fontFamily: "inherit",
    padding: "6px 12px",
    cursor: "pointer",
    transition: "background 0.15s",
    letterSpacing: "0.02em",
  },
  refreshIcon: {
    fontSize: 14,
    display: "inline-block",
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.05)",
  },
  versionGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  versionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  versionLabel: {
    fontSize: 11,
    color: "#555b72",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },
  versionValue: {
    fontSize: 13,
    color: "#e2e5f0",
    fontWeight: 500,
  },
  dim: {
    color: "#3a3f52",
  },
  progressWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  progressTrack: {
    height: 3,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: (pct, color) => ({
    height: "100%",
    width: `${pct}%`,
    background: color,
    borderRadius: 2,
    transition: "width 0.4s ease, background 0.3s",
  }),
  stageRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  spinner: {
    display: "inline-block",
    width: 10,
    height: 10,
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderTopColor: "#4f8ef7",
    borderRadius: "50%",
    animation: "ckb-spin 0.8s linear infinite",
    flexShrink: 0,
  },
  stageDots: {
    display: "flex",
    gap: 16,
    marginTop: 2,
  },
  stageDot: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  badgeUpdate: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(251,146,60,0.08)",
    border: "1px solid rgba(251,146,60,0.2)",
    borderRadius: 8,
    padding: "9px 13px",
    fontSize: 12,
    color: "#fb923c",
  },
  badgeOk: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(52,211,153,0.07)",
    border: "1px solid rgba(52,211,153,0.18)",
    borderRadius: 8,
    padding: "9px 13px",
    fontSize: 12,
    color: "#34d399",
  },
  badgeError: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 8,
    padding: "9px 13px",
    fontSize: 12,
    color: "#f87171",
  },
  badgeDot: (isUpdate) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: isUpdate ? "#fb923c" : "#34d399",
    flexShrink: 0,
  }),
  installBtn: {
    marginLeft: "auto",
    background: "#2563eb",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    fontSize: 11,
    fontFamily: "inherit",
    fontWeight: 600,
    padding: "4px 10px",
    cursor: "pointer",
    transition: "background 0.15s",
    letterSpacing: "0.03em",
  },
  retryBtn: {
    marginLeft: "auto",
    background: "transparent",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 6,
    color: "#f87171",
    fontSize: 11,
    fontFamily: "inherit",
    padding: "4px 10px",
    cursor: "pointer",
    opacity: 0.7,
    transition: "opacity 0.15s",
  },
  offState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "32px 24px",
    background: "#13161e",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    fontFamily: '"IBM Plex Mono", "Fira Code", monospace',
    minWidth: 300,
  },
  offIcon: {
    fontSize: 32,
    color: "#2a2f3d",
    marginBottom: 4,
  },
  offText: {
    margin: 0,
    fontSize: 13,
    color: "#555b72",
    fontWeight: 600,
  },
  offSub: {
    margin: 0,
    fontSize: 11,
    color: "#3a3f52",
  },
  skeleton: {
    height: 80,
    borderRadius: 8,
    background: "rgba(255,255,255,0.03)",
  },
};