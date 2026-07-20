import { NextRequest, NextResponse } from "next/server";
import { ProgressEvalInputSchema } from "@/lib/schemas";
import { evaluateProgress } from "@/lib/adaptive-verifier";
import { ZodError } from "zod";

export const maxDuration = 60;

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

    const parseResult = ProgressEvalInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const evaluation = await evaluateProgress(parseResult.data);
    return NextResponse.json(evaluation, { status: 200 });
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
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    module: "4b",
    description: "Evaluates student progress comparing initial assessment to retest",
    endpoint: "POST /api/evaluate-progress",
    required_fields: ["initial_assessment", "initial_responses", "retest_assessment", "retest_responses", "gap_json"],
  });
}
