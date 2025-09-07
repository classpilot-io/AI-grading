import { HTTP_STATUS_CODES } from "@/lib/constants";
import { randomUUID } from "crypto";
import {
  generateErrorResponse,
  generateResultResponse,
} from "@/lib/responseUtils";
import { requireRole } from "@/authUtils";

export async function POST(req: Request) {
  const { user, supabase, error } = await requireRole(req, ["teacher"]);

  if (error || !user) {
    return generateErrorResponse(
      "Unauthorized",
      HTTP_STATUS_CODES.HTTP_UNAUTHORIZED
    );
  }

  try {
    const formData = await req.formData();

    const subject = formData.get("subject") as string | null;
    const name = formData.get("name") as string | null;
    const className = formData.get("className") as string | null;
    // const level = formData.get("level") as string | null;
    const description = formData.get("description") as string | null;

    const questionPaper = formData.get("questionPaper") as File | null;
    const answerKey = formData.get("answerKey") as File | null;

    if (!subject || !name || !className || !questionPaper) {
      return generateErrorResponse(
        "Required fields are missing",
        HTTP_STATUS_CODES.HTTP_BAD_REQUEST
      );
    }

    const assignmentId = randomUUID();
    let questionPaperUrl = "";
    let answerKeyUrl = "";

    if (questionPaper) {
      const questionPath = `questions/${assignmentId}/${questionPaper.name}`;
      const { error: questionUploadError } = await supabase.storage
        .from("files")
        .upload(questionPath, questionPaper, { upsert: true });
      if (questionUploadError)
        return generateErrorResponse(
          questionUploadError.message,
          HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
        );

      const { data: questionSigned } = supabase.storage
        .from("files")
        .getPublicUrl(questionPath);
      questionPaperUrl = questionSigned.publicUrl;
    }

    if (answerKey) {
      const answerPath = `answers/${assignmentId}/${answerKey.name}`;
      const { error: answerUploadError } = await supabase.storage
        .from("files")
        .upload(answerPath, answerKey, { upsert: true });
      if (answerUploadError)
        return generateErrorResponse(
          answerUploadError.message,
          HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
        );

      const { data: answerSigned } = supabase.storage
        .from("files")
        .getPublicUrl(answerPath);
      answerKeyUrl = answerSigned.publicUrl;
    }

    const { data: assignmentData, error: assignmentInsertError } =
      await supabase
        .from("Assignment")
        .insert({
          id: assignmentId,
          teacherId: user.id,
          subject,
          name,
          className,
          // level,
          description: description ?? "",
          questionPaperPath: questionPaperUrl,
          answerKeyPath: answerKeyUrl,
          submissionLink: `${process.env.BASE_URL}/submit/${assignmentId}`,
        })
        .select()
        .maybeSingle();

    if (assignmentInsertError)
      return generateErrorResponse(
        assignmentInsertError.message,
        HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
      );

    return generateResultResponse({ assignment: assignmentData });
  } catch (err: any) {
    return generateErrorResponse(
      err.message || "Internal Server Error",
      HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}

export async function PUT(req: Request) {
  const { user, supabase, error } = await requireRole(req, ["teacher"]);

  if (error || !user) {
    return generateErrorResponse(
      "Unauthorized",
      HTTP_STATUS_CODES.HTTP_UNAUTHORIZED
    );
  }

  try {
    const formData = await req.formData();

    const assignmentId = formData.get("id") as string | null;
    if (!assignmentId) {
      return generateErrorResponse(
        "Assignment ID is required",
        HTTP_STATUS_CODES.HTTP_BAD_REQUEST
      );
    }

    const subject = formData.get("subject") as string | null;
    const name = formData.get("name") as string | null;
    const className = formData.get("className") as string | null;
    // const level = formData.get("level") as string | null;
    const description = formData.get("description") as string | null;

    const questionPaper = formData.get("questionPaper") as File | null;
    const answerKey = formData.get("answerKey") as File | null;

    const isNewQuestionPaperRaw = formData.get("isNewQuestionPaper") as string;
    const isNewQuestionPaper = isNewQuestionPaperRaw === "true";
    const isNewAnswerKeyRaw = formData.get("isNewAnswerKey") as string;
    const isNewAnswerKey = isNewAnswerKeyRaw === "true";

    // if (!subject || !name || !className || !level || !questionPaper) {
    //   return generateErrorResponse(
    //     "Required fields are missing",
    //     HTTP_STATUS_CODES.HTTP_BAD_REQUEST
    //   );
    // }

    let questionPaperUrl: string | undefined;
    let answerKeyUrl: string | undefined;

    if (isNewQuestionPaper && questionPaper) {
      const questionPath = `questions/${assignmentId}/${questionPaper.name}`;
      const { error: questionUploadError } = await supabase.storage
        .from("files")
        .upload(questionPath, questionPaper, { upsert: true });
      if (questionUploadError)
        return generateErrorResponse(
          questionUploadError.message,
          HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
        );

      const { data: questionSigned } = supabase.storage
        .from("files")
        .getPublicUrl(questionPath);
      questionPaperUrl = questionSigned.publicUrl;
    }

    if (isNewAnswerKey && answerKey) {
      const answerPath = `answers/${assignmentId}/${answerKey.name}`;
      const { error: answerUploadError } = await supabase.storage
        .from("files")
        .upload(answerPath, answerKey, { upsert: true });
      if (answerUploadError)
        return generateErrorResponse(
          answerUploadError.message,
          HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
        );

      const { data: answerSigned } = supabase.storage
        .from("files")
        .getPublicUrl(answerPath);
      answerKeyUrl = answerSigned.publicUrl;
    }

    const updatePayload: any = {
      subject: subject ?? undefined,
      name: name ?? undefined,
      className: className ?? undefined,
      // level: level ?? undefined,
      description: description ?? undefined,
    };

    if (questionPaperUrl) {
      updatePayload.questionPaperPath = questionPaperUrl;
    }
    if (answerKeyUrl) {
      updatePayload.answerKeyPath = answerKeyUrl;
    }

    const { data: updatedAssignment, error: assignmentUpdateError } =
      await supabase
        .from("Assignment")
        .update(updatePayload)
        .eq("id", assignmentId)
        .eq("teacherId", user.id)
        .select()
        .maybeSingle();

    if (assignmentUpdateError)
      return generateErrorResponse(
        assignmentUpdateError.message,
        HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
      );

    return generateResultResponse({ assignment: updatedAssignment });
  } catch (err: any) {
    return generateErrorResponse(
      err.message || "Internal Server Error",
      HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}
