"use client";
import React from "react";
import { DiagnosticOutput } from "@/lib/schemas";
import { Lightbulb, RefreshCw, Check } from "lucide-react";

interface DiagnosticDashboardProps {
  report: DiagnosticOutput;
  onGenerateTutor: () => void;
  onGenerateRetest: () => void;
  isGeneratingTutor: boolean;
  isGeneratingRetest: boolean;
}

export default function DiagnosticDashboard({
  report,
  onGenerateTutor,
  onGenerateRetest,
  isGeneratingTutor,
  isGeneratingRetest,
}: DiagnosticDashboardProps) {
  return (
    <div className="fade-in" style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Score sheet */}
      <div className="sheet sheet-tab red">
        <div className="sheet-pad-lg" style={{ display: "flex", gap: "3rem", alignItems: "center", flexWrap: "wrap" }}>
          <div className="grade-mark">
            <svg viewBox="0 0 156 156">
              <ellipse
                cx="78" cy="78" rx="66" ry="58"
                fill="none" stroke="var(--red)" strokeWidth="3.5"
                transform="rotate(-4 78 78)"
              />
            </svg>
            <div className="grade-mark-value">{report.overall_score}</div>
          </div>

          <div style={{ flex: 1, minWidth: "260px" }}>
            <div className="eyebrow" style={{ marginBottom: "0.5rem" }}>Diagnostic report</div>
            <h2 style={{ fontSize: "1.9rem", marginBottom: "0.8rem" }}>{report.mastery_level}</h2>
            <p style={{ maxWidth: "520px" }}>{report.student_friendly_summary}</p>
          </div>
        </div>
      </div>

      {/* Strengths + gaps */}
      <div className="grid-2">
        <div className="sheet sheet-tab green">
          <div className="sheet-pad">
            <div className="eyebrow" style={{ marginBottom: "1.2rem", color: "var(--green)" }}>Strengths</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {report.strengths.map((s, i) => (
                <div key={i} className="check-line">
                  <Check size={18} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sheet sheet-tab red">
          <div className="sheet-pad">
            <div className="eyebrow" style={{ marginBottom: "1.2rem", color: "var(--red)" }}>Margin notes — gaps found</div>
            {report.identified_gaps.map((gap, i) => (
              <div key={i} className={`margin-note ${gap.severity === "Low" ? "low" : ""}`}>
                <div className="margin-note-title">{gap.micro_skill}</div>
                <p style={{ marginBottom: "0.6rem" }}>{gap.misconception}</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span className={`tag ${gap.severity === "High" ? "tag-red" : "tag-amber"}`}>
                    {gap.severity} severity
                  </span>
                  <span className="tag tag-blue">{gap.root_cause}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="sheet">
        <div className="sheet-pad-lg" style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "1.6rem", marginBottom: "0.7rem" }}>Choose the next step</h3>
          <p style={{ maxWidth: "480px", margin: "0 auto 2rem" }}>
            A learning path has been drawn up from the gaps above. Work through it with the tutor,
            or jump straight to a retest if you're confident.
          </p>
          <div style={{ display: "flex", gap: "1.1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onGenerateTutor} disabled={isGeneratingTutor || isGeneratingRetest} className="btn btn-primary">
              {isGeneratingTutor ? (
                <>
                  <span className="loading-dot" /> Building lesson…
                </>
              ) : (
                <>
                  <Lightbulb size={18} /> Learn with tutor
                </>
              )}
            </button>
            <button onClick={onGenerateRetest} disabled={isGeneratingTutor || isGeneratingRetest} className="btn btn-outline">
              {isGeneratingRetest ? (
                <>
                  <span className="loading-dot" /> Generating…
                </>
              ) : (
                <>
                  <RefreshCw size={18} /> Take a retest
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
