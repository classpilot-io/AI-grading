"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Download } from "lucide-react";
import Link from "next/link";
import { GetFetcher } from "@/lib/helpers";
import { toast } from "sonner";
import KaTeXComponent from "@/components/kaTexComponent";

export default function SubmissionView() {
  const params = useParams<any>();
  const [submission, setSubmission] = useState<any>({});
  const [assignment, setAssignment] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!submission) {
    return <div className="p-6">Submission not found.</div>;
  }

  const getAssignment = async () => {
    try {
      const res: any = await GetFetcher(`/assignment/get?id=${params?.id}`);
      if (res?.hasError) {
        toast.error(
          res?.errors?.[0] || "Failed to fetch assignment. Please try again."
        );
        return;
      }
      setAssignment(res?.assignment);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      toast.error("Something went wrong while fetching assignment.");
    }
  };

  const getSubmissions = async () => {
    try {
      const res: any = await GetFetcher(
        `/submission/get?submissionId=${params?.submissionId}`
      );
      if (res?.hasError) {
        toast.error(
          res?.errors?.[0] ||
            "Failed to fetch submission details. Please try again."
        );
        return;
      }
      setSubmission(res?.submission);
    } catch (error) {
      console.error("Error fetching submission:", error);
      toast.error("Something went wrong while fetching submission.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getAssignment(), getSubmissions()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const downloadSubmission = async () => {
    if (!submission?.submissionFilePath) {
      console.error("No submission file path available.");
      return;
    }
    setIsDownloading(true);
    try {
      const fileUrl = submission.submissionFilePath;
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch submission file.");
      }

      const blob = await response.blob();
      const fileName = fileUrl.split("/").pop() || "submission-file";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download submission file.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-4">
          <Link href={`/teacher/assignments/${params.id}/dashboard`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Individual Submission
            </h1>
            <div className="flex items-center space-x-3 mt-2">
              <Badge variant="secondary" className="capitalize">
                {assignment.subject}
              </Badge>
              <span className="text-sm text-gray-500">
                {assignment.className}
              </span>
            </div>
          </div>
          <Button
            onClick={downloadSubmission}
            variant="outline"
            disabled={isDownloading}
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Downloading..." : "Download Submission File"}
          </Button>
        </div>

        {/* Student Info */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                  {submission.User?.name
                    ?.split(" ")
                    .map((n: any) => n[0])
                    .join("")}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {submission.User?.name}
                  </CardTitle>
                  <CardDescription>{submission.User?.email}</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-900">
                  {submission?.results?.submission_awarded_marks}/
                  {submission?.results?.submission_total_marks}
                </div>
                <div className="text-sm text-blue-600">
                  {Math.round(
                    (Number(submission?.results?.submission_awarded_marks) /
                      Number(submission?.results?.submission_total_marks)) *
                      100
                  )}
                  %
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Submitted:{" "}
                {new Date(submission.gradedAt).toLocaleDateString("en-GB")} at{" "}
                {new Date(submission.gradedAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graded Submission Details */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Graded Submission Details
        </h1>

        {submission?.results?.grades?.map((grade: any, index: any) => (
          <Card key={index} className="mb-6 p-6">
            <div className="flex justify-between items-center mb-4">
              {grade.question_number && (
                <h2 className="text-xl font-semibold text-gray-800">
                  Question {grade.question_number}
                </h2>
              )}
              {grade.total_marks !== undefined && (
                <div className="text-lg font-medium text-blue-600">
                  {grade.total_marks}
                </div>
              )}
            </div>

            {/* Main Question Text and Answer */}
            {grade.question_text && (
              <div className="space-y-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Question:
                  </p>
                  <div className="mt-1 text-base text-gray-900">
                    <KaTeXComponent mathText={grade.question_text} />
                  </div>
                </div>
                {grade.answer_text && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Student's Answer:
                    </p>
                    <div className="mt-1 text-base text-gray-900">
                      <KaTeXComponent
                        mathText={grade.answer_text.replace(/\\n/g, "\n")}
                      />
                    </div>
                  </div>
                )}
                {grade.correct_answer && grade.correct_answer !== "null" && grade.correct_answer !== null && (
                  <div>
                    <p className="text-sm font-semibold text-green-600">
                      Correct Answer:
                    </p>
                    <div className="mt-1 text-base text-gray-900">
                      <KaTeXComponent mathText={grade.correct_answer} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rendering Parts if they exist */}
            {grade.parts && grade.parts.length > 0 && (
              <div className="space-y-4 border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Breakdown of Marks
                </h3>
                {grade.parts.map((part: any, partIndex: any) => (
                  <div
                    key={partIndex}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    {part.part_number && (
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        Part {part.part_number}
                      </h4>
                    )}

                    {part.question_text && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          Question Text:
                        </p>
                        <div className="mt-1 text-base text-gray-900">
                          <KaTeXComponent mathText={part.question_text} />
                        </div>
                      </div>
                    )}

                    {part.answer_text && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          Student's Answer:
                        </p>
                        <div className="mt-1 text-base text-gray-900">
                          <KaTeXComponent
                            mathText={part.answer_text.replace(/\\n/g, "\n")}
                          />
                        </div>
                      </div>
                    )}

                    {part.correct_answer && part.correct_answer !== "null" && part.correct_answer !== null && (
                      <div>
                        <p className="text-sm font-semibold text-green-600">
                          Correct Answer:
                        </p>
                        <div className="mt-1 text-base text-gray-900">
                          <KaTeXComponent mathText={part.correct_answer} />
                        </div>
                      </div>
                    )}

                    {part.marks !== undefined && (
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-600">
                          Marks:
                        </span>
                        <span className="ml-2 text-md font-bold text-blue-600">
                          {part.marks}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
