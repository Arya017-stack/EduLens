"use client";
import React, { useState } from "react";
import { BookOpen, Target, GraduationCap, Globe, Layers, BookType, Sparkles } from "lucide-react";

interface SetupFormProps {
  onGenerate: (data: any) => void;
  isLoading: boolean;
}

export default function SetupForm({ onGenerate, isLoading }: SetupFormProps) {
  const [formData, setFormData] = useState({
    subject: "Mathematics",
    topic: "Fractions",
    grade_level: "Grade 5",
    curriculum: "CBSE",
    language: "English",
    num_questions: 5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "num_questions" ? parseInt(value) || 5 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="glass-panel animate-slide-up" style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h2 className="gradient-text" style={{ fontSize: "2.5rem", marginBottom: "0.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <Sparkles className="gradient-text-alt" size={32} /> Diagnostic Setup
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Configure the parameters to generate an AI-powered assessment.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div className="grid-2">
          <div style={{ position: "relative" }}>
            <label className="label">Subject</label>
            <div style={{ position: "relative" }}>
              <BookOpen size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}/>
              <input required type="text" name="subject" value={formData.subject} onChange={handleChange} className="input-field" placeholder="e.g. Mathematics" style={{ paddingLeft: "3rem" }} />
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <label className="label">Topic</label>
            <div style={{ position: "relative" }}>
              <Target size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}/>
              <input required type="text" name="topic" value={formData.topic} onChange={handleChange} className="input-field" placeholder="e.g. Fractions" style={{ paddingLeft: "3rem" }} />
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div style={{ position: "relative" }}>
            <label className="label">Grade Level</label>
            <div style={{ position: "relative" }}>
              <GraduationCap size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}/>
              <input required type="text" name="grade_level" value={formData.grade_level} onChange={handleChange} className="input-field" placeholder="e.g. Grade 5" style={{ paddingLeft: "3rem" }} />
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <label className="label">Curriculum</label>
            <div style={{ position: "relative" }}>
              <Layers size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}/>
              <input type="text" name="curriculum" value={formData.curriculum} onChange={handleChange} className="input-field" placeholder="e.g. CBSE, Common Core" style={{ paddingLeft: "3rem" }} />
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div style={{ position: "relative" }}>
            <label className="label">Language</label>
            <div style={{ position: "relative" }}>
              <Globe size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}/>
              <input type="text" name="language" value={formData.language} onChange={handleChange} className="input-field" placeholder="e.g. English, Hindi" style={{ paddingLeft: "3rem" }} />
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <label className="label">Number of Questions</label>
            <div style={{ position: "relative" }}>
              <BookType size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}/>
              <input type="number" min={1} max={20} name="num_questions" value={formData.num_questions} onChange={handleChange} className="input-field" style={{ paddingLeft: "3rem" }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
          <button type="submit" className={`btn btn-primary ${!isLoading ? "animate-pulse" : ""}`} disabled={isLoading} style={{ width: "100%", padding: "1.25rem", fontSize: "1.1rem" }}>
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Generating Knowledge Graph...
              </>
            ) : (
              "Generate Diagnostic Assessment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
