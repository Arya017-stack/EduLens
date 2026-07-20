"use client";
import React, { useState } from "react";
import SetupForm from "./SetupForm";
import QuizPlayer from "./QuizPlayer";
import DiagnosticDashboard from "./DiagnosticDashboard";
import TutorView from "./TutorView";
import ProgressReport from "./ProgressReport";
import { AssessmentOutput, DiagnosticOutput, TutorLessonOutput, ProgressEvalOutput } from "@/lib/schemas";
import { Sparkles, RotateCcw } from "lucide-react";

type FlowState = "SETUP" | "QUIZ_INITIAL" | "DIAGNOSTICS" | "TUTOR" | "QUIZ_RETEST" | "PROGRESS";

export default function AppOrchestrator() {
  const [flow, setFlow] = useState<FlowState>("SETUP");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [topic, setTopic] = useState<string>("");
  const [language, setLanguage] = useState<string>("English");
  const [grade, setGrade] = useState<string>("");
  
  const [initialAssessment, setInitialAssessment] = useState<AssessmentOutput | null>(null);
  const [initialResponses, setInitialResponses] = useState<any[] | null>(null);
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticOutput | null>(null);
  
  const [tutorLesson, setTutorLesson] = useState<TutorLessonOutput | null>(null);
  const [isGeneratingTutor, setIsGeneratingTutor] = useState(false);
  
  const [retestAssessment, setRetestAssessment] = useState<AssessmentOutput | null>(null);
  const [isGeneratingRetest, setIsGeneratingRetest] = useState(false);
  
  const [progressReport, setProgressReport] = useState<ProgressEvalOutput | null>(null);

  const handleGenerateAssessment = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      const assessment = await res.json();
      setTopic(data.topic);
      setLanguage(data.language || "English");
      setGrade(data.grade_level);
      setInitialAssessment(assessment);
      setFlow("QUIZ_INITIAL");
    } catch (err: any) {
      setError(err.message || "Failed to generate assessment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitialQuizSubmit = async (responses: any[]) => {
    setIsLoading(true);
    setError(null);
    setInitialResponses(responses);
    try {
      const res = await fetch("/api/analyze-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          student_quiz_data: responses,
          assessment_json: initialAssessment
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const report = await res.json();
      setDiagnosticReport(report);
      setFlow("DIAGNOSTICS");
    } catch (err: any) {
      setError(err.message || "Failed to analyze responses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTutor = async () => {
    setIsGeneratingTutor(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regional_language: language,
          grade_level: grade,
          gap_json: diagnosticReport,
          learning_path: diagnosticReport?.learning_path || []
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const lesson = await res.json();
      setTutorLesson(lesson);
      setFlow("TUTOR");
    } catch (err: any) {
      setError(err.message || "Failed to generate tutor lesson");
    } finally {
      setIsGeneratingTutor(false);
    }
  };

  const handleGenerateRetest = async () => {
    setIsGeneratingRetest(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-retest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gap_json: diagnosticReport,
          previous_assessment: initialAssessment,
          num_questions: 7
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const retest = await res.json();
      setRetestAssessment(retest);
      setFlow("QUIZ_RETEST");
    } catch (err: any) {
      setError(err.message || "Failed to generate retest");
    } finally {
      setIsGeneratingRetest(false);
    }
  };

  const handleRetestQuizSubmit = async (responses: any[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/evaluate-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initial_assessment: initialAssessment,
          initial_responses: initialResponses,
          retest_assessment: retestAssessment,
          retest_responses: responses,
          gap_json: diagnosticReport
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const evalReport = await res.json();
      setProgressReport(evalReport);
      setFlow("PROGRESS");
    } catch (err: any) {
      setError(err.message || "Failed to evaluate progress");
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setFlow("SETUP");
    setInitialAssessment(null);
    setInitialResponses(null);
    setDiagnosticReport(null);
    setTutorLesson(null);
    setRetestAssessment(null);
    setProgressReport(null);
  };

  return (
    <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "4rem",
        padding: "1.5rem 2.5rem",
        background: "rgba(20, 20, 22, 0.4)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "var(--radius-full)",
        border: "1px solid var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
      }}>
        <h1 className="gradient-text" style={{ fontSize: "1.5rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
          <Sparkles className="gradient-text-alt" size={24} /> CSRBox Adaptive Learning
        </h1>
        {flow !== "SETUP" && (
          <button onClick={resetFlow} className="btn btn-outline" style={{ padding: "0.6rem 1.2rem", fontSize: "0.95rem", borderRadius: "var(--radius-full)" }}>
            <RotateCcw size={16} /> Start Over
          </button>
        )}
      </header>

      {error && (
        <div className="animate-fade-in" style={{ 
          background: "rgba(239, 68, 68, 0.15)", 
          borderLeft: "4px solid var(--danger)", 
          color: "white", 
          padding: "1.5rem 2rem",
          borderRadius: "var(--radius)",
          marginBottom: "3rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          boxShadow: "0 4px 15px rgba(239, 68, 68, 0.2)"
        }}>
          <strong style={{ color: "var(--danger)", fontSize: "1.2rem" }}>Error</strong>
          <span style={{ fontSize: "1.1rem" }}>{error}</span>
        </div>
      )}

      {flow === "SETUP" && (
        <SetupForm onGenerate={handleGenerateAssessment} isLoading={isLoading} />
      )}

      {flow === "QUIZ_INITIAL" && initialAssessment && (
        <QuizPlayer assessment={initialAssessment} onSubmit={handleInitialQuizSubmit} isSubmitting={isLoading} />
      )}

      {flow === "DIAGNOSTICS" && diagnosticReport && (
        <DiagnosticDashboard 
          report={diagnosticReport} 
          onGenerateTutor={handleGenerateTutor}
          onGenerateRetest={handleGenerateRetest}
          isGeneratingTutor={isGeneratingTutor}
          isGeneratingRetest={isGeneratingRetest}
        />
      )}

      {flow === "TUTOR" && tutorLesson && (
        <TutorView lesson={tutorLesson} onBack={() => setFlow("DIAGNOSTICS")} />
      )}

      {flow === "QUIZ_RETEST" && retestAssessment && (
        <QuizPlayer assessment={retestAssessment} onSubmit={handleRetestQuizSubmit} isSubmitting={isLoading} />
      )}

      {flow === "PROGRESS" && progressReport && (
        <ProgressReport report={progressReport} onReset={resetFlow} />
      )}
    </div>
  );
}
