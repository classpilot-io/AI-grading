import { HTTP_STATUS_CODES } from "@/lib/constants";
import {
  generateErrorResponse,
  generateResultResponse,
} from "@/lib/responseUtils";
import { requireRole } from "@/authUtils";

export async function GET(req: Request) {
  const { user, supabase, error } = await requireRole(req, ["teacher"]);

  if (error || !user) {
    return generateErrorResponse(
      "Unauthorized",
      HTTP_STATUS_CODES.HTTP_UNAUTHORIZED
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("assignmentId");

    if (!assignmentId) {
      return generateErrorResponse(
        "Assignment ID is required",
        HTTP_STATUS_CODES.HTTP_BAD_REQUEST
      );
    }

    const { data: submissionsData, error: submissionsFetchError } =
      await supabase
        .from("Submission")
        .select(
          `
            id,
            assignmentId,
            studentIdentifier,
            status,
            gradedAt,
            results,
            User (
            name,
            email
            )
        `
        )
        .eq("assignmentId", assignmentId)
        .order("gradedAt", { ascending: false });

    if (submissionsFetchError) {
      return generateErrorResponse(
        submissionsFetchError.message,
        HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
      );
    }

    const mappedData = submissionsData?.map((s) => ({
      ...s,
      total_submission_marks_awarded:
        s.results?.submission_awarded_marks ?? null,
      total_submission_marks_available:
        s.results?.submission_total_marks ?? null,
      results: undefined,
    }));

    return generateResultResponse({ submissions: mappedData });
  } catch (err: any) {
    return generateErrorResponse(
      err.message || "Internal Server Error",
      HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}
