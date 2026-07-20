import { NextRequest, NextResponse } from "next/server";
import { TutorLessonInputSchema } from "@/lib/schemas";
import { generateLesson } from "@/lib/tutor-generator";
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

    const parseResult = TutorLessonInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const lesson = await generateLesson(parseResult.data);
    return NextResponse.json(lesson, { status: 200 });
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
    module: 3,
    description: "Multilingual personalised tutor — generates a full remedial lesson from gap analysis",
    endpoint: "POST /api/generate-lesson",
    required_fields: ["regional_language", "grade_level", "gap_json", "learning_path"],
  });
}
