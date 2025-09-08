import { HTTP_STATUS_CODES } from "@/lib/constants";
import {
  generateErrorResponse,
  generateResultResponse,
} from "@/lib/responseUtils";
import { requireRole } from "@/authUtils";
import { randomUUID } from "crypto";
import { sanitizeFileName } from "@/lib/helpers";

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

    // Get uploaded answer key file
    const { data: assignmentData, error: assignmentFetchError } = await supabase
      .from("Assignment")
      .select(`answerKeyPath, subject`)
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

    const answerKeyPath = assignmentData?.answerKeyPath;
    const submissionType = assignmentData?.subject;

    const studentId = user.id;

    // Check for an existing submission from this student for this assignment
    const { data: existingSubmission } = await supabase
      .from("Submission")
      .select("id")
      .eq("assignmentId", assignmentId)
      .eq("studentId", studentId)
      .maybeSingle();

    let submissionId: string;
    let newSubmission = false;

    if (existingSubmission) {
      // If a submission exists, use its ID for the update
      submissionId = existingSubmission.id;
    } else {
      // If no submission exists, generate a new ID and prepare to insert a new row
      submissionId = randomUUID();
      newSubmission = true;
    }

    const safeFileName = sanitizeFileName(answerFile.name);

    // Upload the file to Supabase Storage, using the same path for overwriting
    const filePath = `submissions/${assignmentId}/${studentId}/${safeFileName}`;
    const { error: answerUploadError } = await supabase.storage
      .from("files")
      .upload(filePath, answerFile, { upsert: true });

    if (answerUploadError) {
      return generateErrorResponse(
        answerUploadError.message,
        HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
      );
    }

    // Get the public URL for the uploaded file
    const { data: signedFile } = supabase.storage
      .from("files")
      .getPublicUrl(filePath);

    const submissionFileUrl = signedFile.publicUrl;

    const submissionData = {
      assignmentId,
      studentId,
      studentIdentifier,
      submissionFilePath: submissionFileUrl,
      status: "pending",
      scoreTotal: null,
      summary: null,
      gradedAt: new Date().toISOString(),
    };

    let result;
    if (newSubmission) {
      // Create a new submission record
      const { data: insertData, error: insertError } = await supabase
        .from("Submission")
        .insert({ id: submissionId, ...submissionData })
        .select()
        .maybeSingle();

      if (insertError) {
        return generateErrorResponse(
          insertError.message,
          HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
        );
      }
      result = insertData;
    } else {
      // Update the existing submission record
      const { data: updateData, error: updateError } = await supabase
        .from("Submission")
        .update(submissionData)
        .eq("id", submissionId)
        .select()
        .maybeSingle();

      if (updateError) {
        return generateErrorResponse(
          updateError.message,
          HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
        );
      }
      result = updateData;
    }

    // Trigger grading function
    supabase.functions.invoke('grade-submission', {
      body: { submissionId, submissionFileUrl, submissionType, ...(answerKeyPath ? { answerKeyUrl: answerKeyPath } : {}) },
    });

    return generateResultResponse({
      submission: result,
    });
  } catch (err: any) {
    return generateErrorResponse(
      err.message || "Internal Server Error",
      HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}
