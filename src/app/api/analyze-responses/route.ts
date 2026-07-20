import { NextRequest, NextResponse } from "next/server";
import { DiagnosticInputSchema } from "@/lib/schemas";
import { analyzeDiagnostic } from "@/lib/diagnostic-analyzer";
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

    const parseResult = DiagnosticInputSchema.safeParse(body);
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

    const validIds = new Set(input.assessment_json.questions.map((q) => q.id));
    const invalidResponses = input.student_quiz_data.filter(
      (r) => !validIds.has(r.question_id)
    );
    if (invalidResponses.length > 0) {
      return NextResponse.json(
        {
          error: "student_quiz_data references question IDs not found in assessment_json",
          invalid_ids: invalidResponses.map((r) => r.question_id),
        },
        { status: 400 }
      );
    }

    const analysis = await analyzeDiagnostic(input);
    return NextResponse.json(analysis, { status: 200 });
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
    module: 2,
    description: "Diagnostic gap analysis — identifies WHY students answered incorrectly",
    endpoint: "POST /api/analyze-responses",
    required_fields: ["topic", "student_quiz_data", "assessment_json"],
    student_quiz_data_format: [
      { question_id: 1, selected_option: "A" },
      { question_id: 2, selected_option: "C", time_taken_seconds: 38 },
    ],
  });
}
