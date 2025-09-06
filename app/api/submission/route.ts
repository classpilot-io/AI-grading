import { HTTP_STATUS_CODES } from "@/lib/constants";
import {
  generateErrorResponse,
  generateResultResponse,
} from "@/lib/responseUtils";
import { requireRole } from "@/authUtils";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { user, supabase, error } = await requireRole(req, [
    "student",
    "teacher",
  ]);

  if (error || !user) {
    return generateErrorResponse(
      "Unauthorized",
      HTTP_STATUS_CODES.HTTP_UNAUTHORIZED
    );
  }

  try {
    const formData = await req.formData();

    const assignmentId = formData.get("assignmentId") as string | null;
    const studentIdentifier = formData.get("studentIdentifier") as
      | string
      | null;
    const answerFile = formData.get("answerFile") as File | null;

    if (!assignmentId || !studentIdentifier || !answerFile) {
      return generateErrorResponse(
        "Required fields are missing",
        HTTP_STATUS_CODES.HTTP_BAD_REQUEST
      );
    }

    var studentId = user.id;
    const filePath = `submissions/${assignmentId}/${studentId}/${answerFile.name}`;
    const { error: answerUploadError } = await supabase.storage
      .from("files")
      .upload(filePath, answerFile, { upsert: true });

    if (answerUploadError) {
      return generateErrorResponse(
        answerUploadError.message,
        HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
      );
    }

    const { data: signedFile } = supabase.storage
      .from("files")
      .getPublicUrl(filePath);

    const submissionFileUrl = signedFile.publicUrl;
    const submissionId = randomUUID();

    const { data: submissionData, error: submissionInsertError } =
      await supabase
        .from("Submission")
        .insert({
          id: submissionId,
          assignmentId,
          studentId,
          studentIdentifier,
          submissionFilePath: submissionFileUrl,
          // status: "submitted",
          // scoreTotal: null,
          // summary: null,
          // gradedAt: null,
        })
        .select()
        .maybeSingle();

    if (submissionInsertError) {
      return generateErrorResponse(
        submissionInsertError.message,
        HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
      );
    }

    // // Trigger grading
    // await fetch(`${process.env.SUPABASE_FUNCTIONS_URL}/grade-submission`, {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` },
    //   body: JSON.stringify({ submissionId: data.id }),
    // });

    return generateResultResponse({
      submission: submissionData,
    });
  } catch (err: any) {
    return generateErrorResponse(
      err.message || "Internal Server Error",
      HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}
