import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "./prompt-template";
import { AssessmentOutputSchema, type AssessmentInput, type AssessmentOutput } from "./schemas";

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

export async function generateAssessment(
  input: AssessmentInput
): Promise<AssessmentOutput> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
      maxOutputTokens: 8192,
    },
  });

  const prompt = buildPrompt(input);
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

      const parsed: unknown = JSON.parse(cleaned);

      const validated = AssessmentOutputSchema.safeParse(parsed);
      if (!validated.success) {
        lastError = validated.error;
        if (attempt === 2) {
          return parsed as AssessmentOutput;
        }
        continue;
      }

      return validated.data;
    } catch (err) {
      lastError = err;
      if (attempt === 2) break;
    }
  }

  throw new Error(
    `Failed to generate assessment after 2 attempts. Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}
