import { NextRequest, NextResponse } from "next/server";
import { RetestInputSchema } from "@/lib/schemas";
import { generateRetest } from "@/lib/adaptive-verifier";
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

    const parseResult = RetestInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const retest = await generateRetest(parseResult.data);
    return NextResponse.json(retest, { status: 200 });
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
    module: "4a",
    description: "Generates a targeted re-assessment for weak micro-skills only",
    endpoint: "POST /api/generate-retest",
    required_fields: ["gap_json", "previous_assessment"],
    optional_fields: ["num_questions (5–10, default 7)"],
  });
}
