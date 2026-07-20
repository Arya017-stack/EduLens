import { NextRequest, NextResponse } from "next/server";
import { AssessmentInputSchema } from "@/lib/schemas";
import { generateAssessment } from "@/lib/assessment-generator";
import { ZodError } from "zod";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const parseResult = AssessmentInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const input = parseResult.data;
    const assessment = await generateAssessment(input);
    return NextResponse.json(assessment, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Output validation failed", details: err.flatten() },
        { status: 500 }
      );
    }

    if (err instanceof Error) {
      const isApiKeyError = err.message.includes("GEMINI_API_KEY");
      return NextResponse.json(
        { error: isApiKeyError ? "API key not configured" : err.message },
        { status: isApiKeyError ? 503 : 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "POST /api/generate-assessment",
    model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
    required_fields: ["subject", "topic", "grade_level", "num_questions"],
    optional_fields: ["curriculum", "language"],
  });
}
