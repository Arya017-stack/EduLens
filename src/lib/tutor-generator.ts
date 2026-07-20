import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildTutorPrompt } from "./tutor-prompt";
import {
  TutorLessonOutputSchema,
  type TutorLessonInput,
  type TutorLessonOutput,
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

export async function generateLesson(
  input: TutorLessonInput
): Promise<TutorLessonOutput> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
      maxOutputTokens: 8192,
    },
  });

  const prompt = buildTutorPrompt(input);
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

      const validated = TutorLessonOutputSchema.safeParse(parsed);
      if (!validated.success) {
        lastError = validated.error;
        if (attempt === 2) {
          return parsed as TutorLessonOutput;
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
    `Failed to generate lesson after 2 attempts. Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}
