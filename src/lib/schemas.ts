import { z } from "zod";

export const AssessmentInputSchema = z.object({
  subject: z.string().min(1),
  topic: z.string().min(1),
  grade_level: z.string().min(1),
  curriculum: z.string().optional().default(""),
  language: z.string().optional().default("English"),
  num_questions: z
    .number()
    .int()
    .min(1)
    .max(50),
});

export type AssessmentInput = z.infer<typeof AssessmentInputSchema>;

const OptionsSchema = z.object({
  A: z.string(),
  B: z.string(),
  C: z.string(),
  D: z.string(),
});

const DistractorAnalysisSchema = z.object({
  A: z.string(),
  B: z.string(),
  C: z.string(),
  D: z.string(),
});

const QuestionSchema = z.object({
  id: z.number(),
  micro_skill: z.string(),
  concept_category: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  blooms_level: z.enum(["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"]),
  question: z.string(),
  options: OptionsSchema,
  correct_option: z.enum(["A", "B", "C", "D"]),
  misconception_tested: z.string(),
  explanation: z.string(),
  distractor_analysis: DistractorAnalysisSchema,
  estimated_time_seconds: z.number(),
  grade_alignment_confidence: z.number().min(0).max(1),
});

export type Question = z.infer<typeof QuestionSchema>;

const DifficultyDistributionSchema = z.object({
  Easy: z.union([z.string(), z.number()]),
  Medium: z.union([z.string(), z.number()]),
  Hard: z.union([z.string(), z.number()]),
});

const AssessmentMetadataSchema = z.object({
  difficulty_distribution: DifficultyDistributionSchema,
  estimated_completion_minutes: z.number(),
});

export const AssessmentOutputSchema = z.object({
  subject: z.string(),
  topic: z.string(),
  grade: z.string(),
  curriculum: z.string(),
  language: z.string(),
  assessment_metadata: AssessmentMetadataSchema,
  questions: z.array(QuestionSchema),
});

export type AssessmentOutput = z.infer<typeof AssessmentOutputSchema>;

const StudentResponseSchema = z.object({
  question_id: z.number(),
  selected_option: z.enum(["A", "B", "C", "D"]),
  time_taken_seconds: z.number().optional(),
});

export const DiagnosticInputSchema = z.object({
  topic: z.string().min(1),
  student_quiz_data: z.array(StudentResponseSchema).min(1),
  assessment_json: AssessmentOutputSchema,
});

export type DiagnosticInput = z.infer<typeof DiagnosticInputSchema>;

const IdentifiedGapSchema = z.object({
  micro_skill: z.string(),
  severity: z.enum(["High", "Medium", "Low"]),
  misconception: z.string(),
  root_cause: z.enum([
    "Concept missing",
    "Calculation error",
    "Reading misunderstanding",
    "Guessing",
    "Carelessness",
    "Pattern confusion",
    "Unknown",
  ]),
  evidence: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  recommended_priority: z.enum(["Critical", "Recommended", "Optional"]),
});

export const DiagnosticOutputSchema = z.object({
  overall_score: z.number().min(0).max(100),
  mastery_level: z.enum([
    "Advanced",
    "Intermediate",
    "Beginner",
    "Needs Immediate Intervention",
  ]),
  strengths: z.array(z.string()),
  identified_gaps: z.array(IdentifiedGapSchema),
  learning_path: z.array(z.string()),
  gap_summary: z.string(),
  teacher_notes: z.string(),
  student_friendly_summary: z.string(),
});

export type DiagnosticOutput = z.infer<typeof DiagnosticOutputSchema>;

export const TutorLessonInputSchema = z.object({
  regional_language: z.string().min(1),
  grade_level: z.string().min(1),
  gap_json: DiagnosticOutputSchema,
  learning_path: z.array(z.string()).min(1),
});

export type TutorLessonInput = z.infer<typeof TutorLessonInputSchema>;

const PracticeQuestionSchema = z.object({
  question: z.string(),
  hint: z.string(),
  solution: z.string(),
  why_this_works: z.string(),
});

export const TutorLessonOutputSchema = z.object({
  simplified_explanation: z.string(),
  visual_mental_model: z.string(),
  real_life_analogy: z.string(),
  worked_example: z.string(),
  common_mistakes: z.string(),
  guided_practice: z.array(PracticeQuestionSchema).length(3),
  independent_practice: z.array(PracticeQuestionSchema).length(2),
  challenge_question: PracticeQuestionSchema,
  revision_checklist: z.array(z.string()),
  motivational_message: z.string(),
  mnemonic: z.string().optional(),
});

export type TutorLessonOutput = z.infer<typeof TutorLessonOutputSchema>;

export const RetestInputSchema = z.object({
  gap_json: DiagnosticOutputSchema,
  previous_assessment: AssessmentOutputSchema,
  num_questions: z.number().int().min(5).max(10).default(7),
});

export type RetestInput = z.infer<typeof RetestInputSchema>;

export const RetestOutputSchema = AssessmentOutputSchema;
export type RetestOutput = AssessmentOutput;

export const ProgressEvalInputSchema = z.object({
  initial_assessment: AssessmentOutputSchema,
  initial_responses: z.array(StudentResponseSchema).min(1),
  retest_assessment: AssessmentOutputSchema,
  retest_responses: z.array(StudentResponseSchema).min(1),
  gap_json: DiagnosticOutputSchema,
});

export type ProgressEvalInput = z.infer<typeof ProgressEvalInputSchema>;

export const ProgressEvalOutputSchema = z.object({
  improvement_score: z.number().min(0).max(100),
  initial_weighted_score: z.number().min(0).max(100),
  retest_weighted_score: z.number().min(0).max(100),
  remaining_gaps: z.array(z.string()),
  resolved_gaps: z.array(z.string()),
  ready_for_next_topic: z.boolean(),
  recommended_next_topics: z.array(z.string()),
  remediation_needed: z.boolean(),
  assessment_summary: z.string(),
});

export type ProgressEvalOutput = z.infer<typeof ProgressEvalOutputSchema>;
