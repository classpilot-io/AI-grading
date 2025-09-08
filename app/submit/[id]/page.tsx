"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import useUserStore from "@/store/userStore";
import { GetFetcher, PostFetcher } from "@/lib/helpers";
import Link from "next/link";

// // Mock assignment data
// const assignment? = {
//   id: "1",
//   name: "Algebra Fundamentals Quiz",
//   className: "Grade 10A",
//   subject: "Mathematics",
//   description:
//     "Basic algebra concepts and problem solving. Please show all your working steps clearly.",
//   questionPaper: "algebra-quiz.pdf",
//   hasQuestionPaper: true,
// };

export default function StudentSubmissionPage() {
  const params = useParams();
  const user = useUserStore((state: any) => state.user);
  const [assignment, setAssignment] = useState<any>();

  const [files, setFiles] = useState<File | any>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionsPaperUrl, setQuestionsPaperUrl] = useState<any>("");

  const [isDataLoading, setIsDataLoading] = useState(false);

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

  const removeFile = (index: number) => {
    setFiles(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files) {
      toast.error("Please upload at least one file");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("answerFile", files as Blob);
      formData.append("assignmentId", params.id as string);
      formData.append("studentIdentifier", user?.userId);

      const res: any = await PostFetcher("/submission", formData, "POST");

      if (res?.hasError) {
        toast.error(
          res?.errors?.[0] || "Failed to create assignment. Please try again."
        );
        return;
      }

      if (res?.submission) {
        setIsSubmitted(true);
        toast.success("Your submission has been uploaded successfully!");
      }
    } catch (err: any) {
      console.error("Error while submitting:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadQuestionPaper = () => {
    // Simulate download
    toast.success("Question paper download started");
  };

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Submission Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              Your work has been uploaded successfully and will be graded
              automatically.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Solution submitted</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>Results will be available to your teacher</span>
              </div>
            </div>

            {/* Added Home link */}
            <div className="mt-8">
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  Go to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
                <h1 className="text-xl font-bold text-gray-900">AskAndLearn</h1>
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

              <a
                className="mt-6 w-full"
                href={questionsPaperUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 mt-6">
                  <Download className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                  Download Question Paper
                </Button>
              </a>
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
                <div className="grid gap-2">
                  <Label htmlFor="files">Upload Files (PDF or Images)</Label>
                  <Input
                    id="files"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Accepted formats: PDF, DOC, DOCX, JPG, PNG
                  </p>
                </div>

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
                      onClick={() => setFiles(undefined)}
                    >
                      ×
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!files || isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
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
