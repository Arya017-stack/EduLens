"use client";
import React from "react";
import { DiagnosticRecord, HistoryStats } from "@/lib/history";
import { PenLine, BookMarked, TrendingUp, Star, Clock } from "lucide-react";

interface DashboardProps {
  history: DiagnosticRecord[];
  stats: HistoryStats;
  onStartNew: () => void;
}

export default function Dashboard({ history, stats, onStartNew }: DashboardProps) {
  const hasHistory = history.length > 0;

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Hero */}
      <div className="sheet sheet-tab">
        <div className="sheet-pad-lg" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>Diagnostic desk</div>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.7rem" }}>
              {hasHistory ? "Good to see you back." : "Welcome to EduLens."}
            </h2>
            <p style={{ maxWidth: "460px" }}>
              {hasHistory
                ? "Pick up where you left off, or start a fresh diagnostic on a new topic."
                : "Run a quick diagnostic on any topic and EduLens will find exactly where understanding breaks down — then build a lesson to fix it."}
            </p>
          </div>
          <button onClick={onStartNew} className="btn btn-primary" style={{ flexShrink: 0 }}>
            <PenLine size={18} /> Start new diagnostic
          </button>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="stat-grid">
        <StatTile icon={<BookMarked size={18} />} label="Topics studied" value={String(stats.topicsStudied)} />
        <StatTile
          icon={<TrendingUp size={18} />}
          label="Average score"
          value={stats.averageScore !== null ? `${stats.averageScore}%` : "—"}
        />
        <StatTile icon={<Star size={18} />} label="Strongest subject" value={stats.bestSubject ?? "—"} />
        <StatTile
          icon={<Clock size={18} />}
          label="Last session"
          value={stats.lastSessionDate ? formatRelativeDate(stats.lastSessionDate) : "—"}
        />
      </div>

      {/* Ledger */}
      <div className="sheet">
        <div className="sheet-pad">
          <div className="eyebrow" style={{ marginBottom: "1.2rem" }}>Session ledger</div>

          {hasHistory ? (
            <div className="ledger">
              {history.map((r) => (
                <div key={r.id} className="ledger-row">
                  <div>
                    <div className="ledger-topic">{r.topic}</div>
                    <div className="ledger-meta">
                      {r.subject} · {r.grade} · {formatRelativeDate(r.date)}
                    </div>
                  </div>
                  <span className={`tag ${masteryTagClass(r.mastery_level)}`}>
                    {r.overall_score}% · {r.mastery_level}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ padding: "1.5rem 0" }}>
              Your ledger is empty. Once you complete a diagnostic, it'll show up here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="stat-tile">
      <div style={{ color: "var(--ink-soft)", marginBottom: "0.7rem" }}>{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function masteryTagClass(level: string): string {
  switch (level) {
    case "Advanced":
      return "tag-green";
    case "Intermediate":
      return "tag-blue";
    case "Beginner":
      return "tag-amber";
    default:
      return "tag-red";
  }
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}