"use client";
import React, { useState } from "react";
import SetupForm from "./SetupForm";
import QuizPlayer from "./QuizPlayer";
import DiagnosticDashboard from "./DiagnosticDashboard";
import TutorView from "./TutorView";
import ProgressReport from "./ProgressReport";
import { AssessmentOutput, DiagnosticOutput, TutorLessonOutput, ProgressEvalOutput } from "@/lib/schemas";
import { RotateCcw, AlertCircle } from "lucide-react";

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
          assessment_json: initialAssessment,
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
          learning_path: diagnosticReport?.learning_path || [],
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
          num_questions: 7,
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
          gap_json: diagnosticReport,
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
    setError(null);
  };

  return (
    <div className="page-container">
      <header className="masthead">
        <h1>
          <span className="masthead-mark">CS</span>
          CSRBox Adaptive Learning
        </h1>
        {flow !== "SETUP" && (
          <button onClick={resetFlow} className="btn btn-outline">
            <RotateCcw size={16} /> Start over
          </button>
        )}
      </header>

      {error && (
        <div className="error-banner fade-in">
          <AlertCircle size={20} />
          <span>{error}</span>
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
