import type { RetestInput } from "./schemas";

export function buildRetestPrompt(input: RetestInput): string {
  const { gap_json, previous_assessment, num_questions } = input;

  const weakSkills = gap_json.identified_gaps
    .map(
      (g, i) =>
        `${i + 1}. ${g.micro_skill}
   Misconception: ${g.misconception}
   Severity: ${g.severity} | Priority: ${g.recommended_priority}
   Root cause: ${g.root_cause}`
    )
    .join("\n\n");

  const previousQuestions = previous_assessment.questions
    .map((q) => `- Q${q.id}: "${q.question}" [${q.micro_skill}]`)
    .join("\n");

  const easy = Math.round(num_questions * 0.3);
  const medium = Math.round(num_questions * 0.4);
  const hard = num_questions - easy - medium;

  return `You are an Adaptive Learning Verification Agent specializing in targeted reassessment for K-12 students.

Your task is to generate a focused diagnostic re-assessment that ONLY targets the student's identified weak micro-skills.

----------------------------------------
STUDENT CONTEXT
----------------------------------------

Subject: ${previous_assessment.subject}
Topic: ${previous_assessment.topic}
Grade: ${previous_assessment.grade}
Mastery Level: ${gap_json.mastery_level}
Overall Score: ${gap_json.overall_score}/100

Weak Micro-Skills to Target:
${weakSkills}

----------------------------------------
STRICT RULES
----------------------------------------

1. ONLY generate questions targeting the weak micro-skills listed above.
2. NEVER repeat or paraphrase any of these previous questions:
${previousQuestions}

3. Generate exactly ${num_questions} questions: ${easy} Easy, ${medium} Medium, ${hard} Hard.
4. If mastery_level is "Beginner" or "Needs Immediate Intervention" — start with Easy questions and increase gradually.
5. If mastery_level is "Intermediate" — skip trivial Easy, begin from slightly harder Easy.
6. Each question must target a different distractor/misconception than the original assessment used.
7. Every question must test the SAME micro-skill but from a different angle.

----------------------------------------
QUESTION REQUIREMENTS
----------------------------------------

Every question must include: id, micro_skill, concept_category, difficulty, blooms_level,
question, options (A/B/C/D), correct_option, misconception_tested, explanation,
distractor_analysis, estimated_time_seconds, grade_alignment_confidence.

----------------------------------------
OUTPUT FORMAT
----------------------------------------

Return ONLY valid JSON. No markdown. No explanations outside JSON.

{
  "subject": "${previous_assessment.subject}",
  "topic": "${previous_assessment.topic}",
  "grade": "${previous_assessment.grade}",
  "curriculum": "${previous_assessment.curriculum}",
  "language": "${previous_assessment.language}",
  "assessment_metadata": {
    "difficulty_distribution": {
      "Easy": "${easy}/${num_questions}",
      "Medium": "${medium}/${num_questions}",
      "Hard": "${hard}/${num_questions}"
    },
    "estimated_completion_minutes": <number>
  },
  "questions": [
    {
      "id": 1,
      "micro_skill": "<one of the weak micro-skills above>",
      "concept_category": "",
      "difficulty": "Easy",
      "blooms_level": "Understand",
      "question": "",
      "options": { "A": "", "B": "", "C": "", "D": "" },
      "correct_option": "A",
      "misconception_tested": "",
      "explanation": "",
      "distractor_analysis": { "A": "", "B": "", "C": "", "D": "" },
      "estimated_time_seconds": 45,
      "grade_alignment_confidence": 0.97
    }
  ]
}

Generate exactly ${num_questions} questions.
`;
}
