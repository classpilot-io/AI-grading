import { HTTP_STATUS_CODES } from "@/lib/constants";
import {
  generateErrorResponse,
  generateResultResponse,
} from "@/lib/responseUtils";
import { createServerSupabaseClient } from "@/services/supabase/server";

export async function GET(req: Request) {
  const supabase = createServerSupabaseClient();

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
