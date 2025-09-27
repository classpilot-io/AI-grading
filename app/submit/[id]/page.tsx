"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Download,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Badge,
  Info,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { GetFetcher } from "@/lib/helpers";
import Link from "next/link";
import KaTeXComponent from "@/components/kaTexComponent";
import ReactMarkdown from "react-markdown";

export default function StudentSubmissionPage() {
  const params = useParams();
  const [assignment, setAssignment] = useState<any>();
  const [files, setFiles] = useState<File | any>();
  const [studentName, setStudentName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionsPaperUrl, setQuestionsPaperUrl] = useState<any>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Streaming state
  const [streamingResult, setStreamingResult] = useState<string>("");
  const [streamError, setStreamError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<any>(null);

  const streamRef = useRef<string>("");
  const gradingBoxRef = useRef<HTMLDivElement>(null);
  const streamEndRef = useRef<HTMLDivElement>(null);

  const getAssignment = async () => {
    setIsDataLoading(true);
    try {
      const res: any = await GetFetcher(`/assignment/get?id=${params?.id}`);
      if (res?.hasError) {
        toast.error(
          res?.errors?.[0] || "Failed to fetch assignment. Please try again."
        );
        return;
      }
      setAssignment(res?.assignment);
      setQuestionsPaperUrl(res?.assignment?.questionPaperPath);
    } catch (err: any) {
      console.error("Error fetching assignment:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    getAssignment();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(file);
      toast.success(`File selected`);
    }
  };

  const removeFile = () => {
    setFiles(undefined);
  };

  // Streaming submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStreamError(null);
    setStreamingResult("");
    setParsedResult(null);

    if (!studentName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!files) {
      toast.error("Please upload at least one file");
      return;
    }

    setIsSubmitting(true);

    // Scroll to grading box after submit
    setTimeout(() => {
      gradingBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("answerFile", files as Blob);
      formData.append("assignmentId", params.id as string);
      formData.append("studentIdentifier", studentName.trim());

      const response = await fetch("/api/submission", {
        method: "POST",
        body: formData,
      });

      if (!response.body) {
        throw new Error("No response stream from server.");
      }

      // 1. Read the full stream and store it
      const reader = response.body.getReader();
      let resultText = "";
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = new TextDecoder().decode(value);
          resultText += chunk;
        }
      }

      // 2. Parse the result as JSON
      let rawJsonText = resultText.replace(/```json\n?/, "").replace(/\n?```/, "");
      let gradingResult;
      try {
        gradingResult = JSON.parse(rawJsonText);
        simulateStreamingResult(gradingResult);
        toast.success("Your submission has been uploaded and graded!");
      } catch (err) {
        setStreamError("Failed to parse grading result. Please contact your teacher.");
        toast.error("Failed to parse grading result. Please contact your teacher.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setStreamError(err.message || "Failed to submit or grade assignment.");
      toast.error(err.message || "Failed to submit or grade assignment.");
      setIsSubmitting(false);
    }
    // setIsSubmitting(false) is now handled after streaming finishes (in simulateStreamingResult)
  };

  // Simulate streaming the parsed result as formatted content
  function simulateStreamingResult(gradingResult: any) {
    // For mathematics: stream each question one by one
    if (
      assignment?.subject?.toLowerCase() === "mathematics" &&
      gradingResult?.grades
    ) {
      let i = 0;
      const gradesRef = { current: [] as any[] };
      setParsedResult({ grades: [] });

      const streamNext = () => {
        gradesRef.current = [...gradesRef.current, gradingResult.grades[i]];
        setParsedResult({ grades: [...gradesRef.current] });
        i++;
        setTimeout(() => {
          streamEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
        if (i < gradingResult.grades.length) {
          setTimeout(streamNext, 180); // adjust speed as needed
        } else {
          setIsSubmitting(false);
        }
      };
      streamNext();
    }
    // For english: stream summary and then feedback line by line
    else if (assignment?.subject?.toLowerCase() === "english" && gradingResult) {
      setParsedResult({ ...gradingResult, detailed_feedback: "" });
      let lines = (gradingResult.detailed_feedback || "")
        .split("\n")
        .filter(Boolean);
      let i = 0;
      const streamNext = () => {
        setParsedResult((prev: any) => ({
          ...gradingResult,
          detailed_feedback: lines.slice(0, i + 1).join("\n"),
        }));
        setTimeout(() => {
          streamEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
        i++;
        if (i < lines.length) {
          setTimeout(streamNext, 400); // adjust speed as needed
        } else {
          setIsSubmitting(false);
        }
      };
      setTimeout(streamNext, 600);
    } else {
      setParsedResult(gradingResult);
      setIsSubmitting(false);
    }
  }

  // Download question paper with fetch and force download
  const downloadQuestionPaper = async () => {
    if (!questionsPaperUrl) {
      toast.error("No question paper available.");
      return;
    }
    setIsDownloading(true);
    try {
      const response = await fetch(questionsPaperUrl, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to download file.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename =
        questionsPaperUrl.split("/").pop() || "question-paper.pdf";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Question paper downloaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to download question paper.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <Link href={"/"}>
                <h1 className="text-xl font-bold text-gray-900">Classpilot</h1>
              </Link>
              <p className="text-sm text-gray-500">Student Submission Portal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pt-8">
        {/* Assignment Info */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{assignment?.name}</CardTitle>
                <CardDescription className="flex items-center space-x-3 mt-2">
                  <span className="capitalize inline-block px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded">
                    {assignment?.subject}
                  </span>
                  <span>{assignment?.className}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          {assignment?.description && (
            <CardContent>
              <p className="text-gray-700">{assignment?.description}</p>
            </CardContent>
          )}
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Download Section */}
          <Card className="w-full max-w-sm  bg-white/70 p-6 backdrop-blur-sm shadow-lg">
            <CardHeader className="flex flex-col items-center border-b border-gray-200 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner">
                <Download className="h-6 w-6" />
              </div>
              <CardTitle className="mt-4 text-2xl font-bold tracking-tight text-gray-800">
                Question Paper
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-gray-500">
                Download the assignment question paper.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center pt-4">
              {/* File details */}
              <div className="w-full space-y-2 text-center text-gray-600">
                <div className="flex items-center justify-center">
                  <span className="text-xl leading-none text-blue-500">📄</span>
                  <p
                    className="ml-2 truncate font-medium"
                    title={questionsPaperUrl.split("/").pop()}
                  >
                    {questionsPaperUrl.split("/").pop()}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  • Read carefully before submission
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 mt-6 flex items-center justify-center"
                onClick={downloadQuestionPaper}
                disabled={isDownloading}
                type="button"
              >
                {isDownloading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                    Download Question Paper
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-emerald-600" />
                <span>Submit Your Work</span>
              </CardTitle>
              <CardDescription>
                Upload your completed assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Student Name Input */}
                <div className="grid gap-2">
                  <Label htmlFor="studentName">Your Name</Label>
                  <Input
                    id="studentName"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="files">Upload Files (PDF or Images)</Label>
                  <Input
                    id="files"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Accepted formats: PDF, JPG, PNG
                  </p>
                </div>

                {files && (
                  <div className="space-y-2">
                    <Label>Selected File:</Label>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {files?.name}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!files || !studentName.trim() || isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading & Grading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Streaming Result Section */}
        {(isSubmitting || streamingResult || parsedResult || streamError) && (
          <div ref={gradingBoxRef}>
            <Card className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">
                  {streamError
                    ? "Error"
                    : parsedResult
                    ? "Grading Result"
                    : "Grading in Progress..."}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {streamError && (
                  <div className="text-red-600 font-semibold">{streamError}</div>
                )}

                {/* Live streaming text (show as code block for JSON) */}
                {!streamError && !parsedResult && (
                  <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-3 rounded-md max-h-72 overflow-auto border">
                    {streamingResult}
                  </pre>
                )}

                {/* Parsed result rendering (like teacher's view) */}
                {parsedResult && (
                  <div>
                    {/* Mathematics */}
                    {assignment?.subject?.toLowerCase() === "mathematics" &&
                      parsedResult?.grades?.map((grade: any, index: any) => (
                        <Card
                          key={index}
                          className="mb-6 p-6 rounded-lg shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-4">
                            {grade?.question_number && (
                              <h2 className="text-xl font-semibold text-indigo-700">
                                Question {grade?.question_number}
                              </h2>
                            )}
                            <div className="flex justify-end gap-6 items-center">
                              {grade?.awarded_marks !== undefined &&
                                grade?.total_marks !== undefined && (
                                  <div className="text-lg font-bold text-blue-600">
                                    {grade?.awarded_marks}/{grade?.total_marks}
                                  </div>
                                )}
                              {grade?.status && (
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    grade?.status === "Correct"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {grade?.status}
                                </span>
                              )}
                            </div>
                          </div>
                          {grade?.question_text && (
                            <div className="space-y-4 mb-4">
                              <div>
                                <p className="text-sm font-semibold text-indigo-500">
                                  Question:
                                </p>
                                <div className="mt-1 text-base text-gray-900">
                                  <KaTeXComponent
                                    mathText={grade?.question_text}
                                  />
                                </div>
                              </div>
                              {grade?.answer_text && (
                                <div>
                                  <p className="text-sm font-semibold text-indigo-500">
                                    Student's Answer:
                                  </p>
                                  <div className="mt-1 text-base text-gray-900">
                                    <KaTeXComponent
                                      mathText={grade?.answer_text.replace(
                                        /\\n/g,
                                        "\n"
                                      )}
                                    />
                                  </div>
                                </div>
                              )}
                              {grade?.correct_answer &&
                                grade?.correct_answer !== "null" &&
                                grade?.correct_answer !== null && (
                                  <div>
                                    <p className="text-sm font-semibold text-green-600">
                                      Correct Answer:
                                    </p>
                                    <div className="mt-1 text-base text-gray-900">
                                      <KaTeXComponent
                                        mathText={grade?.correct_answer}
                                      />
                                    </div>
                                  </div>
                                )}
                          </div>
                        )}
                        {grade?.parts && grade?.parts.length > 0 && (
                          <div className="space-y-4 border-t pt-4 mt-4">
                            <h3 className="text-lg font-semibold text-indigo-700">
                              Breakdown of Marks
                            </h3>
                            {grade?.parts.map((part: any, partIndex: any) => (
                              <div
                                key={partIndex}
                                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  {part.part_number && (
                                    <h4 className="text-md font-medium text-indigo-600">
                                      Part {part.part_number}
                                    </h4>
                                  )}
                                  <div className="flex justify-end gap-6 items-center">
                                    {part.awarded_marks !== undefined &&
                                      part.total_marks !== undefined && (
                                        <div className="text-md font-bold text-blue-600">
                                          {part.awarded_marks}/
                                          {part.total_marks}
                                        </div>
                                      )}
                                    {part.status && (
                                      <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                          part.status === "Correct"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {part.status}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {part.question_text && (
                                  <div>
                                    <p className="text-sm font-semibold text-indigo-500">
                                      Question Text:
                                    </p>
                                    <div className="mt-1 text-base text-gray-900">
                                      <KaTeXComponent
                                        mathText={part.question_text}
                                      />
                                    </div>
                                  </div>
                                )}
                                {part.answer_text && (
                                  <div>
                                    <p className="text-sm font-semibold text-indigo-500">
                                      Student's Answer:
                                    </p>
                                    <div className="mt-1 text-base text-gray-900">
                                      <KaTeXComponent
                                        mathText={part.answer_text.replace(
                                          /\\n/g,
                                          "\n"
                                        )}
                                      />
                                    </div>
                                  </div>
                                )}
                                {part.correct_answer &&
                                  part.correct_answer !== "null" &&
                                  part.correct_answer !== null && (
                                    <div>
                                      <p className="text-sm font-semibold text-green-600">
                                        Correct Answer:
                                      </p>
                                      <div className="mt-1 text-base text-gray-900">
                                        <KaTeXComponent
                                          mathText={part.correct_answer}
                                        />
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  {/* English */}
                  {assignment?.subject?.toLowerCase() === "english" &&
                    parsedResult && (
                      <Card className="mb-6 p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-semibold text-indigo-700">
                            Overall Marks
                          </h2>
                          <div className="text-lg font-bold text-blue-600">
                            {parsedResult.submission_awarded_marks}/
                            {parsedResult.submission_total_marks}
                          </div>
                        </div>
                        {parsedResult.summary && (
                          <div className="mb-6">
                            <p className="text-sm font-semibold text-indigo-500">
                              Summary:
                            </p>
                            <p className="mt-2 text-base text-gray-900">
                              {parsedResult.summary}
                            </p>
                          </div>
                        )}
                        {parsedResult.detailed_feedback && (
                          <div>
                            <p className="text-sm font-semibold text-indigo-500">
                              Detailed Feedback:
                            </p>
                            <div className="prose prose-indigo mt-2 text-gray-900 max-w-none leading-relaxed">
                              <ReactMarkdown>
                                {parsedResult.detailed_feedback}
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}
                      </Card>
                    )}
                    <div ref={streamEndRef} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-8 bg-gradient-to-r from-gray-50 to-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">Submission Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Download and complete the question paper if available
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Show all your working steps clearly</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Upload clear, readable files (PDF preferred)</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Your work will be automatically graded and reviewed by your
                  teacher
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
