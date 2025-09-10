import { requireRole } from "@/authUtils";
import { HTTP_STATUS_CODES } from "@/lib/constants";
import { generateErrorResponse, generateResultResponse } from "@/lib/responseUtils";

export async function DELETE(req: Request) {
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
        "assignmentId is required",
        HTTP_STATUS_CODES.HTTP_BAD_REQUEST
      );
    }

    // Delete the assignment and cascade deletes for submissions and class summaries if set up in DB
    const { error: deleteError } = await supabase
      .from("Assignment")
      .delete()
      .eq("id", assignmentId);

    if (deleteError) {
      return generateErrorResponse(
        deleteError.message,
        HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
      );
    }

    return generateResultResponse({ success: true });
  } catch (err: any) {
    return generateErrorResponse(
      err.message || "Internal Server Error",
      HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}