"use client";
import React, { useState } from "react";
import { CheckCircle, ChevronRight, Brain, Clock, Zap } from "lucide-react";
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
  const progressPercent = ((currentIdx) / assessment.questions.length) * 100;

  const handleSelect = (opt: string) => {
    setResponses(prev => ({ ...prev, [question.id]: opt }));
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
      setCurrentIdx(c => c + 1);
    }
  };

  const currentSelection = responses[question.id];

  return (
    <div className="glass-panel animate-slide-up" style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem" }}>
      <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
        <h3 className="gradient-text" style={{ fontSize: "1.75rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
          <Brain size={28} /> {assessment.topic}
        </h3>
        <div className="badge" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
          <Clock size={14} /> Question {currentIdx + 1} of {assessment.questions.length}
        </div>
      </div>

      <div className="progress-bar-container" style={{ marginBottom: "3rem" }}>
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="card" style={{ marginBottom: "2.5rem", border: "1px solid var(--border)", background: "rgba(0,0,0,0.2)", padding: "2.5rem" }}>
        <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
          <span className={`badge ${question.difficulty === 'Hard' ? 'badge-danger' : question.difficulty === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
            <Zap size={12} /> {question.difficulty}
          </span>
        </div>
        
        <h2 style={{ fontSize: "1.35rem", lineHeight: "1.7", marginBottom: "2.5rem", fontWeight: "500", color: "#fff" }}>
          {question.question}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {Object.entries(question.options).map(([key, value]) => {
            const isSelected = currentSelection === key;
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                style={{
                  textAlign: "left",
                  background: isSelected ? "rgba(139, 92, 246, 0.15)" : "var(--surface)",
                  border: `1px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: "var(--radius)",
                  padding: "1.25rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  transform: isSelected ? "translateX(8px)" : "none",
                  boxShadow: isSelected ? "var(--shadow-glow)" : "var(--shadow-sm)"
                }}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%", 
                  background: isSelected ? "var(--primary)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "bold", color: isSelected ? "white" : "var(--text-secondary)",
                  transition: "all 0.3s ease"
                }}>
                  {key}
                </div>
                <span style={{ flex: 1, fontSize: "1.1rem", color: isSelected ? "#fff" : "var(--text-secondary)" }}>
                  {value as string}
                </span>
                {isSelected && <CheckCircle size={24} color="var(--primary)" className="animate-fade-in" />}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button 
          onClick={handleNext} 
          disabled={!currentSelection || isSubmitting}
          className="btn btn-primary"
          style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}
        >
          {isSubmitting ? (
            <><div className="loading-spinner"></div> Analyzing Diagnostics...</>
          ) : isLast ? (
            "Submit Assessment"
          ) : (
            <>Next Question <ChevronRight size={20} /></>
          )}
        </button>
      </div>
    </div>
  );
}
