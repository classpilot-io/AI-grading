import { HTTP_STATUS_CODES } from "@/lib/constants";
import { generateErrorResponse } from "@/lib/responseUtils";
import { createServerSupabaseClient } from "@/services/supabase/server";
import { randomUUID } from "crypto";
import { ENGLISH_GRADING_PROMPT, MATHEMATICS_GRADING_PROMPT, sanitizeFileName } from "@/lib/helpers";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();

  try {
    const formData = await req.formData();
    const assignmentId = formData.get("assignmentId") as string | null;
    const studentIdentifier = formData.get("studentIdentifier") as string | null;
    const answerFile = formData.get("answerFile") as File | null;

    if (!assignmentId || !studentIdentifier || !answerFile) {
      return generateErrorResponse(
        "Required fields are missing",
        HTTP_STATUS_CODES.HTTP_BAD_REQUEST
      );
    }

    // Fetch assignment details
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

    const submissionType = assignmentData?.subject;
    const safeFileName = sanitizeFileName(answerFile.name);
    const filePath = `submissions/${assignmentId}/${studentIdentifier}/${safeFileName}`;

    // Upload the file to Supabase Storage
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

    // Fetch and prepare the file for Gemini
    const submissionResponse = await fetch(submissionFileUrl);
    if (!submissionResponse.ok) {
      throw new Error(`Failed to fetch submission file: ${submissionResponse.statusText}`);
    }
    const submissionBuffer = await submissionResponse.arrayBuffer();
    const base64SubmissionFile = Buffer.from(submissionBuffer).toString('base64');
    const submissionMimeType = submissionFileUrl.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg';

    const submissionPart = {
      inlineData: {
        data: base64SubmissionFile,
        mimeType: submissionMimeType
      }
    };

    let gradingPrompt = '';
    switch (submissionType) {
      case 'mathematics':
        gradingPrompt = MATHEMATICS_GRADING_PROMPT;
        break;
      case 'english':
        gradingPrompt = ENGLISH_GRADING_PROMPT;
        break;
      default:
        return generateErrorResponse(
          'Invalid submissionType. Must be "mathematics" or "english".',
          HTTP_STATUS_CODES.HTTP_BAD_REQUEST
        );
    }

    // Generate a streaming response
    const geminiStream = await geminiModel.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: gradingPrompt }, submissionPart] }]
    });

    let fullResponse = '';
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of geminiStream.stream) {
          const textChunk = chunk.text();
          fullResponse += textChunk;
          controller.enqueue(textChunk);
        }

        // After the stream is complete, update the database
        const submissionId = randomUUID(); // Generate a new ID for the new entry
        let rawJsonText = fullResponse.replace(/```json\n?/, '').replace(/\n?```/, '');
        let gradingResult;
        try {
          gradingResult = JSON.parse(rawJsonText);
        } catch (parseError) {
          console.error('Failed to parse Gemini JSON:', parseError);
          throw new Error(`Invalid JSON from Gemini: ${rawJsonText}`);
        }

        const submissionData = {
          assignmentId,
          studentIdentifier,
          submissionFilePath: submissionFileUrl,
          status: "graded",
          results: gradingResult,
          gradedAt: new Date().toISOString(),
        };

        const { error: insertError } = await supabase
          .from("Submission")
          .insert({ id: submissionId, ...submissionData });

        if (insertError) {
          console.error('Supabase insert failed:', insertError.message);
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });

  } catch (err: any) {
    return generateErrorResponse(
      err.message || "Internal Server Error",
      HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}