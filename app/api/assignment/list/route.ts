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
    const teacherId = searchParams.get("teacherId");

    const { data: assignmentData, error: assignmentFetchError } = await supabase
      .from("Assignment")
      .select("*")
<<<<<<< HEAD
      .eq("teacherId", teacherId);
      // .order("created_at", { ascending: false });
=======
      .eq("teacherId", teacherId)
      .order("createdAt", { ascending: false });
>>>>>>> 6f55acf772426c76b694a7c099e1a208565ebcb6

    if (assignmentFetchError) {
      return generateErrorResponse(
        assignmentFetchError.message,
        HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
      );
    }

    return generateResultResponse({ assignments: assignmentData });
  } catch (err: any) {
    return generateErrorResponse(
      err.message || "Internal Server Error",
      HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}
