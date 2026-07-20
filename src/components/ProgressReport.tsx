"use client";
import React from "react";
import { ProgressEvalOutput } from "@/lib/schemas";
import { TrendingUp, Target, ArrowRight, BookOpen, Medal } from "lucide-react";

interface ProgressReportProps {
  report: ProgressEvalOutput;
  onReset: () => void;
}

export default function ProgressReport({ report, onReset }: ProgressReportProps) {
  return (
    <div className="animate-fade-in page-container" style={{ maxWidth: "1000px" }}>
      <div className="glass-panel" style={{ textAlign: "center", marginBottom: "3rem", padding: "4rem 2rem", background: "linear-gradient(180deg, rgba(20,20,22,0.8) 0%, rgba(20,20,22,0.4) 100%)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", marginBottom: "1.5rem", border: "1px solid rgba(16, 185, 129, 0.3)", color: "var(--success)" }}>
          <Medal size={40} />
        </div>
        <h2 className="gradient-text" style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>Learning Progress</h2>
        <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}>
          {report.assessment_summary}
        </p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", marginTop: "4rem" }}>
          <div className="card" style={{ flex: 1, border: "1px solid rgba(255,255,255,0.08)", padding: "2.5rem 1rem" }}>
            <div style={{ fontSize: "1.1rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "600", marginBottom: "1rem" }}>Initial Score</div>
            <div style={{ fontSize: "4rem", fontWeight: "bold", color: "rgba(255,255,255,0.8)" }}>{report.initial_weighted_score}%</div>
          </div>
          
          <div style={{ color: "var(--primary)", opacity: 0.8 }}>
            <ArrowRight size={40} className="animate-pulse" />
          </div>

          <div className="card" style={{ flex: 1, border: "2px solid var(--success)", background: "rgba(16, 185, 129, 0.05)", padding: "2.5rem 1rem", boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)" }}>
            <div style={{ fontSize: "1.1rem", color: "var(--success)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "600", marginBottom: "1rem" }}>Retest Score</div>
            <div style={{ fontSize: "4rem", fontWeight: "bold", color: "white", textShadow: "0 0 20px rgba(16,185,129,0.5)" }}>{report.retest_weighted_score}%</div>
          </div>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: "linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))", color: "var(--success)", padding: "1rem 2rem", borderRadius: "999px", fontWeight: "bold", fontSize: "1.25rem", border: "1px solid rgba(16, 185, 129, 0.3)", boxShadow: "0 4px 15px rgba(16, 185, 129, 0.2)" }}>
            <TrendingUp size={28} /> +{report.improvement_score}% Improvement
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card" style={{ background: "linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)", borderTop: "3px solid var(--success)", padding: "2.5rem" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--success)", marginBottom: "2rem", fontSize: "1.3rem" }}>
            <CheckCircle size={24} /> Resolved Gaps
          </h3>
          {report.resolved_gaps.length > 0 ? (
            <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingLeft: "0", listStyle: "none" }}>
              {report.resolved_gaps.map((g, i) => (
                <li key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", color: "var(--text-primary)", fontSize: "1.1rem" }}>
                  <div style={{ color: "var(--success)", marginTop: "2px" }}><CheckCircle size={18} /></div>
                  {g}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>No gaps fully resolved yet. Keep practicing!</p>
          )}
        </div>

        <div className="card" style={{ background: "linear-gradient(180deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)", borderTop: "3px solid var(--danger)", padding: "2.5rem" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--danger)", marginBottom: "2rem", fontSize: "1.3rem" }}>
            <Target size={24} /> Remaining Gaps
          </h3>
          {report.remaining_gaps.length > 0 ? (
            <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingLeft: "0", listStyle: "none" }}>
              {report.remaining_gaps.map((g, i) => (
                <li key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", color: "var(--text-primary)", fontSize: "1.1rem" }}>
                  <div style={{ color: "var(--danger)", marginTop: "2px" }}><Target size={18} /></div>
                  {g}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "var(--success)", fontSize: "1.1rem", fontWeight: "500" }}>All gaps resolved! Amazing work.</p>
          )}
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: "3rem", textAlign: "center", padding: "4rem 2rem" }}>
        <h3 style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", fontSize: "1.75rem", color: "#fff" }}>
          <BookOpen size={28} color="var(--secondary)" /> Recommended Next Steps
        </h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto 2.5rem" }}>
          {report.ready_for_next_topic 
            ? "You have mastered this topic! Here is what you should learn next:"
            : "We recommend reviewing this topic a bit more. Focus on these areas before moving forward:"}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginBottom: "3rem" }}>
          {report.recommended_next_topics.map((t, i) => (
            <span key={i} className="badge" style={{ background: "rgba(6, 182, 212, 0.1)", color: "var(--secondary)", border: "1px solid rgba(6, 182, 212, 0.3)", fontSize: "1.1rem", padding: "0.75rem 1.5rem", borderRadius: "var(--radius-full)" }}>
              {t}
            </span>
          ))}
        </div>

        <button onClick={onReset} className="btn btn-primary" style={{ padding: "1.25rem 3rem", fontSize: "1.1rem" }}>
          Start New Topic
        </button>
      </div>
    </div>
  );
}

function CheckCircle({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
}
