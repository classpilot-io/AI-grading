import { HTTP_STATUS_CODES } from "@/lib/constants";
    import {
    generateErrorResponse,
    generateResultResponse,
    } from "@/lib/responseUtils";
    import { requireRole } from "@/authUtils";
    import { GoogleGenerativeAI } from "@google/generative-ai";

    export async function POST(req: Request) {
    const { user, supabase, error } = await requireRole(req, ["teacher"]);

    if (error || !user) {
        return generateErrorResponse(
        "Unauthorized",
        HTTP_STATUS_CODES.HTTP_UNAUTHORIZED
        );
    }

    try {
        const { assignmentId } = await req.json();
        if (!assignmentId) {
        return generateErrorResponse(
            "assignmentId required",
            HTTP_STATUS_CODES.HTTP_BAD_REQUEST
        );
        }

        // Fetch assignment and submissions with results
        const { data: assignment, error: assignmentError } = await supabase
        .from("Assignment")
        .select(
            `
            *,
            submissions:Submission (
            id,
            studentIdentifier,
            scoreTotal,
            status,
            results
            )
            `
        )
        .eq("id", assignmentId)
        .maybeSingle();

        if (assignmentError) {
        return generateErrorResponse(
            assignmentError.message,
            HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
        );
        }
        if (!assignment) {
        return generateErrorResponse(
            "Assignment not found",
            HTTP_STATUS_CODES.HTTP_NOT_FOUND
        );
        }

        // Only include results for graded submissions
        const resultsSummary = (assignment.submissions || [])
        .filter((s: any) => s.status === "graded" && s.results)
        .map((s: any) => ({
            results: s.results,
        }));

        const prompt = `
    You are an AI assistant for teachers. Given the following student submissions (with scores and LLM results), generate a concise Markdown summary (max 4 lines) so a teacher can quickly understand overall class performance and progress.

    Submissions:
    ${JSON.stringify(resultsSummary, null, 2)}

    Summary (Markdown, max 4 lines):
    `;

        // Call Gemini 2.5 Flash
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const geminiRes = await model.generateContent(prompt);
        const summary = geminiRes.response.text().trim();

        // Store summary in ClassSummary table
        const { data: classSummary, error: summaryError } = await supabase
        .from("ClassSummary")
        .insert([
            {
            assignmentId,
            metrics: { summary }, // store as JSON
            },
        ])
        .select()
        .maybeSingle();

        if (summaryError) {
        return generateErrorResponse(
            summaryError.message,
            HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
        );
        }

        return generateResultResponse({
        summary,
        classSummaryId: classSummary?.id,
        });
    } catch (err: any) {
        return generateErrorResponse(
        err.message || "Internal Server Error",
        HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
        );
    }
    }