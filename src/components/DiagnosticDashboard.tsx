"use client";
import React from "react";
import { DiagnosticOutput } from "@/lib/schemas";
import { Activity, AlertTriangle, Lightbulb, Sparkles, RefreshCw, BarChart2, ShieldAlert } from "lucide-react";

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
  isGeneratingRetest 
}: DiagnosticDashboardProps) {

  const getMasteryColor = (level: string) => {
    switch (level) {
      case "Advanced": return "var(--success)";
      case "Intermediate": return "var(--primary)";
      case "Beginner": return "var(--warning)";
      default: return "var(--danger)";
    }
  };

  const masteryColor = getMasteryColor(report.mastery_level);

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ textAlign: "center", padding: "4rem 2rem", background: "linear-gradient(180deg, rgba(20,20,22,0.8) 0%, rgba(20,20,22,0.4) 100%)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", background: "rgba(139, 92, 246, 0.1)", marginBottom: "1.5rem", border: "1px solid rgba(139, 92, 246, 0.3)", color: "var(--primary)" }}>
          <BarChart2 size={32} />
        </div>
        <h2 className="gradient-text" style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>Diagnostic Report</h2>
        <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}>
          {report.student_friendly_summary}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "4rem", marginTop: "4rem" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              fontSize: "4.5rem", 
              fontWeight: "bold", 
              color: masteryColor, 
              lineHeight: "1",
              textShadow: `0 0 30px ${masteryColor}40`
            }}>
              {report.overall_score}%
            </div>
            <div style={{ color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "1rem", fontSize: "0.9rem", fontWeight: "600" }}>
              Overall Score
            </div>
          </div>
          <div style={{ width: "1px", background: "linear-gradient(180deg, transparent, var(--border-light), transparent)" }}></div>
          <div style={{ textAlign: "center" }}>
            <div style={{ 
              fontSize: "3rem", 
              fontWeight: "bold", 
              color: "#fff", 
              lineHeight: "1.5",
              textShadow: "0 4px 10px rgba(0,0,0,0.5)"
            }}>
              {report.mastery_level}
            </div>
            <div style={{ color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "0.25rem", fontSize: "0.9rem", fontWeight: "600" }}>
              Mastery Level
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid-2">
        <div className="card" style={{ borderTop: "3px solid var(--success)", background: "linear-gradient(180deg, rgba(16,185,129,0.05) 0%, transparent 100%)" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", color: "var(--success)", fontSize: "1.25rem" }}>
            <Sparkles size={24} /> Identified Strengths
          </h3>
          <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingLeft: "0", listStyle: "none" }}>
            {report.strengths.map((s, i) => (
              <li key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", color: "var(--text-primary)", lineHeight: "1.5" }}>
                <div style={{ color: "var(--success)", marginTop: "2px" }}><CheckCircle size={18} /></div>
                {s}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="card" style={{ borderTop: "3px solid var(--warning)", background: "linear-gradient(180deg, rgba(245,158,11,0.05) 0%, transparent 100%)" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", color: "var(--warning)", fontSize: "1.25rem" }}>
            <ShieldAlert size={24} /> Knowledge Gaps
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {report.identified_gaps.map((gap, i) => (
              <div key={i} style={{ 
                padding: "1.25rem", 
                background: "rgba(0,0,0,0.3)", 
                borderRadius: "var(--radius)", 
                borderLeft: `4px solid ${gap.severity === 'High' ? 'var(--danger)' : 'var(--warning)'}`,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)"
              }}>
                <h4 style={{ color: "#fff", marginBottom: "0.5rem", fontSize: "1.1rem" }}>{gap.micro_skill}</h4>
                <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "1rem" }}>{gap.misconception}</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span className={`badge ${gap.severity === 'High' ? 'badge-danger' : 'badge-warning'}`}>{gap.severity} Severity</span>
                  <span className="badge badge-info">{gap.root_cause}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", textAlign: "center", padding: "4rem 2rem" }}>
        <h3 style={{ fontSize: "2rem", color: "#fff" }}>Next Steps in Learning</h3>
        <p style={{ color: "var(--text-secondary)", maxWidth: "500px", fontSize: "1.1rem", lineHeight: "1.6" }}>
          We have generated a personalized learning path to address these gaps. Choose how you would like to proceed.
        </p>
        
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "2rem" }}>
          <button onClick={onGenerateTutor} disabled={isGeneratingTutor || isGeneratingRetest} className="btn btn-primary" style={{ padding: "1.25rem 2.5rem", fontSize: "1.1rem" }}>
            {isGeneratingTutor ? <><div className="loading-spinner"></div> Building Lesson...</> : <><Lightbulb /> Learn with Tutor</>}
          </button>
          
          <button onClick={onGenerateRetest} disabled={isGeneratingTutor || isGeneratingRetest} className="btn btn-outline" style={{ padding: "1.25rem 2.5rem", fontSize: "1.1rem" }}>
            {isGeneratingRetest ? <><div className="loading-spinner"></div> Generating...</> : <><RefreshCw /> Take a Retest</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
}
