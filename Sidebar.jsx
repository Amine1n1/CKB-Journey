import { Terminal, Server } from "lucide-react";

const UpdateIcon = () => (
  <svg width="18" height="18" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
    <polygon points="18,3 31,10.5 31,25.5 18,33 5,25.5 5,10.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    <line x1="18" y1="12" x2="18" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <polyline points="13.5,18 18,22.5 22.5,18" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="13" y1="25" x2="23" y2="25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export default function Sidebar({ tab, setTab, menuOpen, setMenuOpen }) {

  return (
    <div className={`sidebar ${menuOpen ? "open" : ""}`}>

      <h2>Node Manager</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>

        <li
          className={tab === "node" ? "active" : ""}
          onClick={() => { setTab("node"); setMenuOpen(false); }}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Server size={18} color="#ffffff" />
          Node Info
        </li>

        <li
          className={tab === "network" ? "active" : ""}
          onClick={() => { setTab("network"); setMenuOpen(false); }}
        >
          🌐 Peers
        </li>

        <li
          className={tab === "blockchain" ? "active" : ""}
          onClick={() => { setTab("blockchain"); setMenuOpen(false); }}
        >
          ⛓️ Blockchain
        </li>

        <li
          className={tab === "sync" ? "active" : ""}
          onClick={() => { setTab("sync"); setMenuOpen(false); }}
        >
          🔄 Sync
        </li>

        <li
          className={tab === "nodelogs" ? "active" : ""}
          onClick={() => { setTab("nodelogs"); setMenuOpen(false); }}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Terminal size={18} color="#a8ff78" />
          Node Logs
        </li>

        <li
          className={tab === "updatechecker" ? "active" : ""}
          onClick={() => { setTab("updatechecker"); setMenuOpen(false); }}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <UpdateIcon />
          CKB Update Checker
        </li>

        <li
          className={tab === "overview" ? "active" : ""}
          onClick={() => { setTab("overview"); setMenuOpen(false); }}
        >
          📊 Overview
        </li>

      </ul>
    </div>
  );
}