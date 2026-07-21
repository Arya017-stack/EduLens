"use client";
import React, { useState } from "react";
import { PenLine } from "lucide-react";

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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "num_questions" ? parseInt(value) || 5 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="sheet sheet-tab fade-in" style={{ maxWidth: "640px", margin: "0 auto" }}>
      <div className="sheet-pad-lg">
        <div style={{ marginBottom: "2.5rem" }}>
          <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>Diagnostic intake · Form A</div>
          <h2 style={{ fontSize: "2.1rem", marginBottom: "0.6rem" }}>Set up the assessment</h2>
          <p style={{ maxWidth: "460px" }}>
            Fill in the subject and level. We'll build a diagnostic quiz that finds exactly
            where understanding breaks down, not just what score comes out.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.9rem" }}>
          <div className="grid-2">
            <div>
              <label className="field-label">Subject</label>
              <input
                required
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="field-input"
                placeholder="e.g. Mathematics"
              />
            </div>
            <div>
              <label className="field-label">Topic</label>
              <input
                required
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="field-input"
                placeholder="e.g. Fractions"
              />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label className="field-label">Grade level</label>
              <input
                required
                type="text"
                name="grade_level"
                value={formData.grade_level}
                onChange={handleChange}
                className="field-input"
                placeholder="e.g. Grade 5"
              />
            </div>
            <div>
              <label className="field-label">Curriculum</label>
              <input
                type="text"
                name="curriculum"
                value={formData.curriculum}
                onChange={handleChange}
                className="field-input"
                placeholder="e.g. CBSE, Common Core"
              />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label className="field-label">Language</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="field-input"
                placeholder="e.g. English, Hindi"
              />
            </div>
            <div>
              <label className="field-label">Number of questions</label>
              <input
                type="number"
                min={1}
                max={20}
                name="num_questions"
                value={formData.num_questions}
                onChange={handleChange}
                className="field-input"
              />
            </div>
          </div>

          <hr className="divider-line" style={{ margin: "0.5rem 0" }} />

          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading-dot" /> Building assessment…
              </>
            ) : (
              <>
                <PenLine size={18} /> Generate diagnostic assessment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
