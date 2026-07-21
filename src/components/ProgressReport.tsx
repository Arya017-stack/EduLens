"use client";
import React from "react";
import { ProgressEvalOutput } from "@/lib/schemas";
import { Check, Target, BookOpen } from "lucide-react";

interface ProgressReportProps {
  report: ProgressEvalOutput;
  onReset: () => void;
}

export default function ProgressReport({ report, onReset }: ProgressReportProps) {
  return (
    <div className="fade-in page-container" style={{ maxWidth: "1000px", padding: "0" }}>
      <div className="sheet sheet-tab green" style={{ marginBottom: "2rem" }}>
        <div className="sheet-pad-lg" style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>Retest results</div>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Learning progress</h2>
          <p style={{ maxWidth: "560px", margin: "0 auto" }}>{report.assessment_summary}</p>

          <div className="gradebook-row">
            <div className="gradebook-cell">
              <div className="label">First attempt</div>
              <div className="old-score">{report.initial_weighted_score}%</div>
            </div>
            <div className="gradebook-cell">
              <div className="label">Retest</div>
              <div className="new-score">{report.retest_weighted_score}%</div>
            </div>
          </div>

          <span className="tag tag-green" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}>
            +{report.improvement_score}% improvement
          </span>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "2rem" }}>
        <div className="sheet sheet-tab green">
          <div className="sheet-pad">
            <div className="eyebrow" style={{ marginBottom: "1.2rem", color: "var(--green)" }}>Resolved gaps</div>
            {report.resolved_gaps.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {report.resolved_gaps.map((g, i) => (
                  <div key={i} className="check-line">
                    <Check size={18} />
                    <span>{g}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No gaps fully resolved yet — keep practicing.</p>
            )}
          </div>
        </div>

        <div className="sheet sheet-tab red">
          <div className="sheet-pad">
            <div className="eyebrow" style={{ marginBottom: "1.2rem", color: "var(--red)" }}>Remaining gaps</div>
            {report.remaining_gaps.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {report.remaining_gaps.map((g, i) => (
                  <div key={i} className="check-line" style={{ color: "var(--ink)" }}>
                    <Target size={16} color="var(--red)" />
                    <span>{g}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--green)" }}>All gaps resolved — well done.</p>
            )}
          </div>
        </div>
      </div>

      <div className="sheet">
        <div className="sheet-pad-lg" style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ marginBottom: "0.8rem" }}>
            <BookOpen size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} />
            Recommended next
          </div>
          <p style={{ maxWidth: "480px", margin: "0 auto 1.5rem" }}>
            {report.ready_for_next_topic
              ? "This topic is mastered. Here's what builds on it next:"
              : "A bit more practice on this topic is recommended before moving on:"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.7rem", marginBottom: "2.5rem" }}>
            {report.recommended_next_topics.map((t, i) => (
              <span key={i} className="tag tag-blue" style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}>
                {t}
              </span>
            ))}
          </div>
          <button onClick={onReset} className="btn btn-primary">
            Start new topic
          </button>
        </div>
      </div>
    </div>
  );
}
