"use client";
import React, { useState } from "react";
import { TutorLessonOutput } from "@/lib/schemas";
import { ArrowLeft, Check, Lightbulb } from "lucide-react";

interface TutorViewProps {
  lesson: TutorLessonOutput;
  onBack: () => void;
}

export default function TutorView({ lesson, onBack }: TutorViewProps) {
  return (
    <div className="fade-in page-container" style={{ maxWidth: "760px", padding: "0" }}>
      <button onClick={onBack} className="btn btn-outline" style={{ marginBottom: "2rem" }}>
        <ArrowLeft size={18} /> Back to report
      </button>

      <div className="sheet sheet-tab blue">
        <div className="sheet-pad-lg">
          <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>Study handout</div>
          <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem" }}>Your personalized lesson</h2>

          <WorksheetSection number="01" title="The concept" content={lesson.simplified_explanation} />
          <WorksheetSection number="02" title="Picture it" content={lesson.visual_mental_model} />
          <WorksheetSection number="03" title="Real-life analogy" content={lesson.real_life_analogy} />

          <div style={{ marginBottom: "2.25rem" }}>
            <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>04 · Worked example</div>
            <div
              style={{
                padding: "1.5rem",
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-sm)",
                whiteSpace: "pre-wrap",
                fontFamily: "var(--font-mono)",
                fontSize: "0.98rem",
                lineHeight: "1.7",
                color: "var(--ink)",
              }}
            >
              {lesson.worked_example}
            </div>
          </div>

          <WorksheetSection number="05" title="Watch out for these mistakes" content={lesson.common_mistakes} accent="var(--red)" />

          <hr className="divider-line" />

          <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Practice</h3>
          {lesson.guided_practice.map((q, i) => (
            <PracticeQuestion key={i} index={i} question={q} />
          ))}

          <div style={{ marginTop: "2.5rem", padding: "2rem", border: "1px solid var(--line)", borderRadius: "var(--radius)", textAlign: "center" }}>
            <h4 style={{ fontSize: "1.2rem", marginBottom: "1.2rem" }}>Revision checklist</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", alignItems: "center", marginBottom: "1.8rem" }}>
              {lesson.revision_checklist.map((item, i) => (
                <div key={i} className="check-line">
                  <Check size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontStyle: "italic", color: "var(--ink)", fontSize: "1.05rem" }}>
              {lesson.motivational_message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorksheetSection({
  number,
  title,
  content,
  accent = "var(--ink)",
}: {
  number: string;
  title: string;
  content: string;
  accent?: string;
}) {
  return (
    <div style={{ marginBottom: "2.25rem" }}>
      <div className="eyebrow" style={{ marginBottom: "0.6rem", color: accent }}>
        {number} · {title}
      </div>
      <p style={{ fontSize: "1.05rem", lineHeight: "1.75" }}>{content}</p>
    </div>
  );
}

function PracticeQuestion({ index, question }: { index: number; question: any }) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div style={{ marginBottom: "1.5rem", padding: "1.75rem", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)" }}>
      <div className="eyebrow" style={{ marginBottom: "1rem" }}>Guided question {index + 1}</div>
      <p style={{ fontSize: "1.1rem", marginBottom: "1.2rem", color: "var(--ink)", lineHeight: "1.6" }}>{question.question}</p>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", padding: "0.9rem 1rem", background: "var(--amber-soft)", borderRadius: "var(--radius-sm)", marginBottom: "1.2rem" }}>
        <Lightbulb size={18} color="var(--amber)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <p style={{ color: "var(--amber)", fontSize: "0.95rem" }}>{question.hint}</p>
      </div>

      {!showSolution ? (
        <button onClick={() => setShowSolution(true)} className="btn btn-outline btn-block">
          Reveal solution
        </button>
      ) : (
        <div className="fade-in" style={{ background: "var(--paper)", padding: "1.25rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)" }}>
          <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>Solution</div>
          <p style={{ marginBottom: "1rem", color: "var(--ink)", lineHeight: "1.6" }}>{question.solution}</p>
          <div style={{ paddingTop: "0.8rem", borderTop: "1px solid var(--line)" }}>
            <p style={{ color: "var(--green)", fontSize: "0.95rem", fontStyle: "italic" }}>
              Why it works: {question.why_this_works}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
