import type { ProgressEvalInput } from "./schemas";

function weightedScore(
  questions: ProgressEvalInput["initial_assessment"]["questions"],
  responses: ProgressEvalInput["initial_responses"]
): { score: number; maxScore: number } {
  const weights: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
  const qMap = new Map(questions.map((q) => [q.id, q]));
  let earned = 0;
  let max = 0;
  for (const r of responses) {
    const q = qMap.get(r.question_id);
    if (!q) continue;
    const w = weights[q.difficulty] ?? 1;
    max += w;
    if (r.selected_option === q.correct_option) earned += w;
  }
  return { score: max > 0 ? Math.round((earned / max) * 100) : 0, maxScore: max };
}

export function buildProgressEvalPrompt(input: ProgressEvalInput): string {
  const {
    initial_assessment,
    initial_responses,
    retest_assessment,
    retest_responses,
    gap_json,
  } = input;

  const initialScores = weightedScore(initial_assessment.questions, initial_responses);
  const retestScores = weightedScore(retest_assessment.questions, retest_responses);

  function formatResponses(
    assessment: ProgressEvalInput["initial_assessment"],
    responses: ProgressEvalInput["initial_responses"],
    label: string
  ): string {
    const qMap = new Map(assessment.questions.map((q) => [q.id, q]));
    return responses
      .map((r) => {
        const q = qMap.get(r.question_id);
        if (!q) return "";
        const correct = r.selected_option === q.correct_option;
        return `${label} Q${q.id} [${q.difficulty}] ${q.micro_skill}: ${correct ? "CORRECT" : `INCORRECT (chose ${r.selected_option}, correct ${q.correct_option})`}`;
      })
      .filter(Boolean)
      .join("\n");
  }

  const initialBlock = formatResponses(initial_assessment, initial_responses, "Initial");
  const retestBlock = formatResponses(retest_assessment, retest_responses, "Retest");

  const originalGaps = gap_json.identified_gaps
    .map((g) => `- ${g.micro_skill} [${g.severity}]`)
    .join("\n");

  return `You are an Adaptive Learning Verification Agent specializing in measuring student learning progress.

Your task is to compare a student's initial assessment against their retest results and determine:
1. How much they have improved
2. Which gaps remain
3. Whether they are ready to move on

----------------------------------------
STUDENT CONTEXT
----------------------------------------

Subject: ${initial_assessment.subject}
Topic: ${initial_assessment.topic}
Grade: ${initial_assessment.grade}
Initial Mastery Level: ${gap_json.mastery_level}

----------------------------------------
SCORE COMPARISON
----------------------------------------

Initial Assessment — Weighted Score: ${initialScores.score}/100
Retest Assessment  — Weighted Score: ${retestScores.score}/100
Raw Improvement: ${retestScores.score - initialScores.score} points

Initial Responses:
${initialBlock}

Retest Responses:
${retestBlock}

Original Gaps Identified:
${originalGaps}

----------------------------------------
ANALYSIS RULES
----------------------------------------

1. Calculate improvement_score as: ((retest_weighted_score - initial_weighted_score) / (100 - initial_weighted_score)) * 100, clamped to 0–100.
   If initial score was 100, improvement_score = 100.

2. A gap is "resolved" if the student answered all retest questions for that micro-skill correctly.
   A gap "remains" if they still got at least one question wrong for that micro-skill.

3. ready_for_next_topic = true if retest_weighted_score >= 70 AND remaining_gaps has no "High" severity items.

4. remediation_needed = true if retest_weighted_score < 50 OR remaining_gaps length >= 2 with High/Critical priority.

5. recommended_next_topics should list 2–4 logically sequential topics that build on the current one.
   If remediation_needed is true, recommend revisiting sub-topics of the current one instead.

6. assessment_summary: 2–3 sentence narrative summary of the student's journey from initial to retest.

----------------------------------------
OUTPUT FORMAT
----------------------------------------

Return ONLY valid JSON. No markdown. No explanations outside JSON.

{
  "improvement_score": <0–100 integer>,
  "initial_weighted_score": ${initialScores.score},
  "retest_weighted_score": ${retestScores.score},
  "remaining_gaps": ["<micro-skill still weak>"],
  "resolved_gaps": ["<micro-skill now mastered>"],
  "ready_for_next_topic": <true|false>,
  "recommended_next_topics": ["<topic 1>", "<topic 2>"],
  "remediation_needed": <true|false>,
  "assessment_summary": "<narrative summary>"
}
`;
}
