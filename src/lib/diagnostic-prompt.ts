import type { DiagnosticInput } from "./schemas";

function formatStudentResponses(input: DiagnosticInput): string {
  const { student_quiz_data, assessment_json } = input;
  const questionMap = new Map(
    assessment_json.questions.map((q) => [q.id, q])
  );

  return student_quiz_data
    .map((resp) => {
      const q = questionMap.get(resp.question_id);
      if (!q) return `Question ${resp.question_id}: [not found in assessment]`;

      const isCorrect = resp.selected_option === q.correct_option;
      const chosenText = q.options[resp.selected_option];
      const correctText = q.options[q.correct_option];
      const timeLine = resp.time_taken_seconds != null
        ? `  Time taken: ${resp.time_taken_seconds}s (estimated: ${q.estimated_time_seconds}s)`
        : "";

      return [
        `Question ${q.id} [${q.difficulty}] — ${q.micro_skill}`,
        `  Q: ${q.question}`,
        `  Student answered: ${resp.selected_option}) ${chosenText} → ${isCorrect ? "✓ CORRECT" : "✗ INCORRECT"}`,
        isCorrect ? "" : `  Correct answer: ${q.correct_option}) ${correctText}`,
        `  Misconception probed: ${q.misconception_tested}`,
        `  Bloom's level: ${q.blooms_level} | Concept: ${q.concept_category}`,
        timeLine,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

export function buildDiagnosticPrompt(input: DiagnosticInput): string {
  const { topic, assessment_json } = input;

  const studentResponseBlock = formatStudentResponses(input);
  const totalQuestions = input.student_quiz_data.length;
  const correctCount = input.student_quiz_data.filter((resp) => {
    const q = assessment_json.questions.find((q) => q.id === resp.question_id);
    return q && resp.selected_option === q.correct_option;
  }).length;

  return `You are an expert educational diagnostician specializing in learning analytics, cognitive science, misconception detection, and mastery estimation.

Your task is to identify WHY the student answered incorrectly—not merely WHICH answers were incorrect.

----------------------------------------
INPUT
----------------------------------------

Topic: ${topic}
Subject: ${assessment_json.subject}
Grade: ${assessment_json.grade}
Raw Score: ${correctCount} / ${totalQuestions} correct

Student Responses (with question context):
${studentResponseBlock}

----------------------------------------
ANALYSIS OBJECTIVES
----------------------------------------

For every incorrect answer, determine:
• What concept was misunderstood
• What prerequisite is missing
• What specific misconception is at play
• Confidence level in your diagnosis (0.0–1.0)
• Severity (High | Medium | Low)

Aggregate all gaps into an overall mastery score.

IMPORTANT WEIGHTING RULES:
- Weight Hard questions 3×, Medium questions 2×, Easy questions 1×
- Weight repeated mistakes (same micro-skill wrong multiple times) more heavily
- Do NOT simply count wrong answers — diagnose the underlying cognitive gap

----------------------------------------
ROOT CAUSE TAXONOMY
----------------------------------------

Use exactly one of these root causes per gap:
- "Concept missing" — student never learned this concept
- "Calculation error" — student understands concept but makes computational mistakes
- "Reading misunderstanding" — student misread the question
- "Guessing" — response pattern suggests guessing (fast + wrong, or random)
- "Carelessness" — student knows the concept but made a slip
- "Pattern confusion" — student applies the right procedure to the wrong situation
- "Unknown" — insufficient evidence to determine root cause

----------------------------------------
MASTERY SCORING
----------------------------------------

90–100 → Advanced
70–89  → Intermediate
40–69  → Beginner
0–39   → Needs Immediate Intervention

Use weighted scoring (Hard = 3pts, Medium = 2pts, Easy = 1pt).
Maximum possible weighted score = sum of all question weights.

----------------------------------------
OUTPUT REQUIREMENTS
----------------------------------------

Return ONLY valid JSON. No markdown. No explanations outside JSON.

{
  "overall_score": <weighted percentage 0–100, integer>,
  "mastery_level": "Advanced | Intermediate | Beginner | Needs Immediate Intervention",
  "strengths": [
    "<micro-skill or concept category the student demonstrated mastery in>"
  ],
  "identified_gaps": [
    {
      "micro_skill": "<exact micro-skill from assessment>",
      "severity": "High | Medium | Low",
      "misconception": "<specific misconception the student holds>",
      "root_cause": "<one of the 7 root cause types above>",
      "evidence": ["Question 2", "Question 7"],
      "confidence": <0.0–1.0>,
      "recommended_priority": "Critical | Recommended | Optional"
    }
  ],
  "learning_path": [
    "<Ordered list of micro-skills/concepts to address, from most foundational to most advanced>"
  ],
  "gap_summary": "<2–3 sentence summary of the student's primary knowledge gaps>",
  "teacher_notes": "<Specific, actionable teaching recommendations for the educator>",
  "student_friendly_summary": "<Encouraging, age-appropriate summary for the student themselves>"
}
`;
}
