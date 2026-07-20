"use client";
import React, { useState } from "react";
import { TutorLessonOutput } from "@/lib/schemas";
import { ArrowLeft, BookOpen, Image as ImageIcon, Map, PenTool, CheckSquare, Heart, Lightbulb } from "lucide-react";

interface TutorViewProps {
  lesson: TutorLessonOutput;
  onBack: () => void;
}

export default function TutorView({ lesson, onBack }: TutorViewProps) {
  return (
    <div className="animate-fade-in page-container" style={{ maxWidth: "800px", padding: "2rem" }}>
      <button onClick={onBack} className="btn btn-outline" style={{ marginBottom: "3rem", padding: "0.75rem 1.5rem" }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="glass-panel tutor-content" style={{ padding: "4rem 3rem" }}>
        <h2 className="gradient-text" style={{ fontSize: "2.5rem", marginBottom: "3rem", textAlign: "center", lineHeight: "1.3" }}>
          Your Personalized Lesson
        </h2>

        <SectionCard 
          icon={<BookOpen size={24} />} 
          title="Concept Explained" 
          content={lesson.simplified_explanation} 
          color="var(--primary)" 
        />

        <SectionCard 
          icon={<ImageIcon size={24} />} 
          title="Mental Model" 
          content={lesson.visual_mental_model} 
          color="var(--secondary)" 
          bgOpacity="0.05"
        />

        <SectionCard 
          icon={<Map size={24} />} 
          title="Real-life Analogy" 
          content={lesson.real_life_analogy} 
          color="var(--success)" 
          bgOpacity="0.05"
        />

        <div className="card" style={{ marginBottom: "2.5rem", padding: "2rem", borderLeft: `4px solid var(--primary)` }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: 0, color: "var(--text-primary)" }}>
            <PenTool size={24} color="var(--primary)" /> Let's Solve Together
          </h3>
          <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.4)", borderRadius: "var(--radius)", whiteSpace: "pre-wrap", color: "var(--text-primary)", fontFamily: "monospace", fontSize: "1.1rem", lineHeight: "1.6", border: "1px solid rgba(255,255,255,0.05)" }}>
            {lesson.worked_example}
          </div>
        </div>

        <SectionCard 
          icon={<AlertTriangle size={24} />} 
          title="Watch out for these mistakes!" 
          content={lesson.common_mistakes} 
          color="var(--warning)" 
          bgOpacity="0.05"
        />

        <h3 className="gradient-text" style={{ textAlign: "center", fontSize: "2rem", margin: "4rem 0 2.5rem" }}>Practice Time</h3>

        {lesson.guided_practice.map((q, i) => (
          <PracticeQuestion key={i} index={i} question={q} />
        ))}

        <div className="glass-panel" style={{ marginTop: "4rem", background: "linear-gradient(180deg, rgba(20,20,22,0.8) 0%, rgba(20,20,22,0.4) 100%)", textAlign: "center", padding: "3rem" }}>
          <h3 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginTop: 0, fontSize: "1.5rem" }}>
            <CheckSquare size={24} color="var(--success)"/> Revision Checklist
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: "2rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {lesson.revision_checklist.map((item, i) => (
              <li key={i} style={{ color: "var(--text-primary)", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                <CheckCircle size={18} color="var(--success)" /> {item}
              </li>
            ))}
          </ul>
          
          <div style={{ padding: "2rem", background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15))", borderRadius: "var(--radius-lg)", marginTop: "3rem", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Heart size={40} color="var(--primary)" style={{ marginBottom: "1.5rem" }}/>
            <p style={{ fontStyle: "italic", color: "white", fontSize: "1.2rem", lineHeight: "1.6" }}>{lesson.motivational_message}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function SectionCard({ icon, title, content, color, bgOpacity = "0" }: { icon: React.ReactNode, title: string, content: string, color: string, bgOpacity?: string }) {
  return (
    <div className="card" style={{ marginBottom: "2.5rem", padding: "2rem", background: `rgba(255,255,255,${bgOpacity})`, borderLeft: `4px solid ${color}` }}>
      <h3 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: 0, color: "var(--text-primary)" }}>
        <div style={{ color }}>{icon}</div> {title}
      </h3>
      <p style={{ fontSize: "1.1rem", lineHeight: "1.7", color: "var(--text-secondary)" }}>{content}</p>
    </div>
  );
}

function PracticeQuestion({ index, question }: { index: number, question: any }) {
  const [showSolution, setShowSolution] = useState(false);
  
  return (
    <div className="card" style={{ marginBottom: "2rem", padding: "2rem", border: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
        <div className="badge badge-info" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}>Guided Question {index + 1}</div>
      </div>
      <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "white", lineHeight: "1.6" }}>{question.question}</p>
      
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1rem", background: "rgba(245, 158, 11, 0.1)", borderRadius: "var(--radius)", marginBottom: "1.5rem", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
        <Lightbulb size={20} color="var(--warning)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <p style={{ color: "var(--warning)", fontSize: "1rem", margin: 0 }}>{question.hint}</p>
      </div>
      
      {!showSolution ? (
        <button onClick={() => setShowSolution(true)} className="btn btn-outline" style={{ width: "100%", padding: "1rem" }}>
          Reveal Solution
        </button>
      ) : (
        <div className="animate-fade-in" style={{ background: "rgba(0,0,0,0.3)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--primary)", marginBottom: "1rem", fontSize: "1.1rem" }}>Solution:</h4>
          <p style={{ marginBottom: "1.5rem", color: "var(--text-primary)", lineHeight: "1.6" }}>{question.solution}</p>
          <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
            <p style={{ color: "var(--success)", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
              <CheckCircle size={18} /> <em>Why it works: {question.why_this_works}</em>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AlertTriangle({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
}

function CheckCircle({ size, color="currentColor" }: { size: number, color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
}
