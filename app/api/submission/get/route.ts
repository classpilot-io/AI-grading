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
    const submissionId = searchParams.get("submissionId");

    if (!submissionId) {
      return generateErrorResponse(
        "Submission ID is required",
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
        .eq("id", submissionId)
        .maybeSingle();

    if (submissionsFetchError) {
      return generateErrorResponse(
        submissionsFetchError.message,
        HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
      );
    }

    if (!submissionsData) {
      return generateErrorResponse(
        "Submission not found",
        HTTP_STATUS_CODES.HTTP_NOT_FOUND
      );
    }

    return generateResultResponse({ submission: submissionsData });
  } catch (err: any) {
    return generateErrorResponse(
      err.message || "Internal Server Error",
      HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}
