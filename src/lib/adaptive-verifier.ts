import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildRetestPrompt } from "./retest-prompt";
import { buildProgressEvalPrompt } from "./progress-eval-prompt";
import {
  AssessmentOutputSchema,
  ProgressEvalOutputSchema,
  type RetestInput,
  type RetestOutput,
  type ProgressEvalInput,
  type ProgressEvalOutput,
} from "./schemas";

const MODEL_NAME = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not set. " +
        "Get a free key at https://aistudio.google.com"
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

async function callGemini(prompt: string, maxOutputTokens: number): Promise<unknown> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
      maxOutputTokens,
    },
  });

  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const rawText = result.response.text().trim();
      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      return JSON.parse(cleaned);
    } catch (err) {
      lastError = err;
      if (attempt === 2) break;
    }
  }
  throw new Error(
    `Gemini call failed after 2 attempts: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}

export async function generateRetest(input: RetestInput): Promise<RetestOutput> {
  const prompt = buildRetestPrompt(input);
  const parsed = await callGemini(prompt, 6144);

  const validated = AssessmentOutputSchema.safeParse(parsed);
  if (!validated.success) {
    return parsed as RetestOutput;
  }
  return validated.data;
}

export async function evaluateProgress(input: ProgressEvalInput): Promise<ProgressEvalOutput> {
  const prompt = buildProgressEvalPrompt(input);
  const parsed = await callGemini(prompt, 2048);

  const validated = ProgressEvalOutputSchema.safeParse(parsed);
  if (!validated.success) {
    return parsed as ProgressEvalOutput;
  }
  return validated.data;
}
