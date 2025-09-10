import { HTTP_STATUS_CODES } from "@/lib/constants";
import {
  generateErrorResponse,
  generateResultResponse,
} from "@/lib/responseUtils";
import { requireRole } from "@/authUtils";

export async function GET(req: Request) {
  const { user, supabase, error } = await requireRole(req, [
    "teacher",
    "student",
  ]);

  if (error || !user) {
    return generateErrorResponse(
      "Unauthorized",
      HTTP_STATUS_CODES.HTTP_UNAUTHORIZED
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("id");

    if (!assignmentId) {
      return generateErrorResponse(
        "Assignment ID is required",
        HTTP_STATUS_CODES.HTTP_BAD_REQUEST
      );
    }

    const { data: assignmentData, error: assignmentFetchError } = await supabase
      .from("Assignment")
      .select(`
    *,
    classSummaries:ClassSummary (
      id,
      metrics,
      createdAt
    )
  `)
      .eq("id", assignmentId)
      .maybeSingle();


    if (assignmentFetchError) {
      return generateErrorResponse(
        assignmentFetchError.message,
        HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
      );
    }

    if (!assignmentData) {
      return generateErrorResponse(
        "Assignment not found",
        HTTP_STATUS_CODES.HTTP_NOT_FOUND
      );
    }

    return generateResultResponse({ assignment: assignmentData });
  } catch (err: any) {
    return generateErrorResponse(
      err.message || "Internal Server Error",
      HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}
