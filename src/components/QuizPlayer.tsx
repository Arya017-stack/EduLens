"use client";
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { AssessmentOutput } from "@/lib/schemas";

interface QuizPlayerProps {
  assessment: AssessmentOutput;
  onSubmit: (responses: any[]) => void;
  isSubmitting: boolean;
}

export default function QuizPlayer({ assessment, onSubmit, isSubmitting }: QuizPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});

  const question = assessment.questions[currentIdx];
  const isLast = currentIdx === assessment.questions.length - 1;
  const progressPercent = (currentIdx / assessment.questions.length) * 100;

  const handleSelect = (opt: string) => {
    setResponses((prev) => ({ ...prev, [question.id]: opt }));
  };

  const handleNext = () => {
    if (isLast) {
      const formatted = Object.entries(responses).map(([qId, sel]) => ({
        question_id: parseInt(qId),
        selected_option: sel,
        time_taken_seconds: 45,
      }));
      onSubmit(formatted);
    } else {
      setCurrentIdx((c) => c + 1);
    }
  };

  const currentSelection = responses[question.id];
  const difficultyTag =
    question.difficulty === "Hard" ? "tag-red" : question.difficulty === "Medium" ? "tag-amber" : "tag-green";

  return (
    <div className="sheet fade-in" style={{ maxWidth: "760px", margin: "0 auto" }}>
      <div className="sheet-pad-lg">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
          <div className="eyebrow">{assessment.topic}</div>
          <div className="eyebrow">
            Q{currentIdx + 1} / {assessment.questions.length}
          </div>
        </div>

        <div className="ruler-track" style={{ marginBottom: "2.75rem" }}>
          <div className="ruler-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <span className={`tag ${difficultyTag}`} style={{ marginBottom: "1.2rem" }}>{question.difficulty}</span>

        <h2 style={{ fontSize: "1.4rem", lineHeight: "1.55", marginBottom: "2.25rem", fontFamily: "var(--font-display)", fontWeight: 600 }}>
          {question.question}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2.5rem" }}>
          {Object.entries(question.options).map(([key, value]) => {
            const isSelected = currentSelection === key;
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`bubble-row ${isSelected ? "selected" : ""}`}
              >
                <div className={`bubble ${isSelected ? "filled" : ""}`}>{key}</div>
                <span className="bubble-text">{value as string}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleNext} disabled={!currentSelection || isSubmitting} className="btn btn-primary">
            {isSubmitting ? (
              <>
                <span className="loading-dot" /> Scoring…
              </>
            ) : isLast ? (
              "Submit assessment"
            ) : (
              <>
                Next question <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
