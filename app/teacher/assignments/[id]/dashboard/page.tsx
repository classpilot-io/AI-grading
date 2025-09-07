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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, TrendingUp, Download, Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { GetFetcher } from "@/lib/helpers";

// Mock data for submissions
const mockSubmissions = [
  {
    id: "1",
    studentName: "Alice Johnson",
    studentEmail: "alice.johnson@school.edu",
    submittedAt: "2024-01-16T10:30:00Z",
    score: 80,
    totalScore: 100,
    status: "graded",
    questions: [
      {
        question: 1,
        score: 8,
        maxScore: 10,
        feedback: "Good approach, minor calculation error",
      },
      { question: 2, score: 10, maxScore: 10, feedback: "Perfect solution" },
      {
        question: 3,
        score: 7,
        maxScore: 10,
        feedback: "Correct method, incomplete steps",
      },
    ],
  },
  {
    id: "2",
    studentName: "Bob Smith",
    studentEmail: "bob.smith@school.edu",
    submittedAt: "2024-01-16T11:15:00Z",
    score: 92,
    totalScore: 100,
    status: "graded",
    questions: [
      { question: 1, score: 10, maxScore: 10, feedback: "Excellent work" },
      {
        question: 2,
        score: 9,
        maxScore: 10,
        feedback: "Very good, small notation issue",
      },
      {
        question: 3,
        score: 10,
        maxScore: 10,
        feedback: "Perfect solution with clear steps",
      },
    ],
  },
  {
    id: "3",
    studentName: "Carol Davis",
    studentEmail: "carol.davis@school.edu",
    submittedAt: "2024-01-16T14:20:00Z",
    score: 78,
    totalScore: 100,
    status: "graded",
    questions: [
      {
        question: 1,
        score: 7,
        maxScore: 10,
        feedback: "Correct approach, calculation error",
      },
      {
        question: 2,
        score: 8,
        maxScore: 10,
        feedback: "Good understanding shown",
      },
      { question: 3, score: 8, maxScore: 10, feedback: "Solid work overall" },
    ],
  },
];

// const assignment?s = [
//   {
//     id: "1",
//     name: "Algebra Fundamentals Quiz",
//     className: "Grade 10A",
//     subject: "Mathematics",
//     description: "Basic algebra concepts and problem solving",
//     submissionCount: 12,
//     totalStudents: 15,
//     createdAt: "2024-01-15",
//     questionPaper: "algebra-quiz.pdf",
//     answerKey: "algebra-answers.pdf",
//   },
//   {
//     id: "2",
//     name: "Essay on Climate Change",
//     className: "Grade 9B",
//     subject: "English",
//     description: "Write a 500-word essay on climate change impacts",
//     submissionCount: 8,
//     totalStudents: 12,
//     createdAt: "2024-01-14",
//     questionPaper: null,
//     answerKey: "essay-rubric.pdf",
//   },
//   {
//     id: "3",
//     name: "Geometry Problem Set",
//     className: "Grade 11C",
//     subject: "Mathematics",
//     description: "Advanced geometry problems focusing on triangles and circles",
//     submissionCount: 20,
//     totalStudents: 22,
//     createdAt: "2024-01-13",
//     questionPaper: "geometry-problems.pdf",
//     answerKey: "geometry-solutions.pdf",
//   },
// ];

export default function AssignmentDashboardClient() {
  const params = useParams();
  const [submissions, setSubmissions] = useState<any>([]);
  const [classSummary, setClassSummary] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [assignment, setAssignment] = useState<any>({});
  const [isDataLoading, setIsDataLoading] = useState(false);

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
        `/submission/getAssignmentSubmissions?assignmentId=${params?.id}`
      );
      if (res?.hasError) {
        toast.error(
          res?.errors?.[0] || "Failed to fetch submissions. Please try again."
        );
        return;
      }
      setSubmissions(res?.submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Something went wrong while fetching submissions.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        await Promise.all([getAssignment(), getSubmissions()]);
      } catch (err) {
        console.log("Error in fetching assignment or submissions: ", err);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateClassSummary = async () => {
    setGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const scores = submissions.map((s) => s.score);
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      const median = scores.sort((a, b) => a - b)[
        Math.floor(scores.length / 2)
      ];

      setClassSummary({
        totalSubmissions: submissions.length,
        averageScore: average,
        medianScore: median,
        distribution: {
          excellent: scores.filter((s) => s >= 90).length,
          good: scores.filter((s) => s >= 80 && s < 90).length,
          average: scores.filter((s) => s >= 70 && s < 80).length,
          needsImprovement: scores.filter((s) => s < 70).length,
        },
      });
      setGenerating(false);
    }, 1500);
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "text-emerald-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "default";
    if (percentage >= 80) return "secondary";
    if (percentage >= 70) return "outline";
    return "destructive";
  };
  const onShowInfo = (e: any) => {
    e.preventDefault();
    toast.info("Feature coming soon!");
  };

  const getStatusBadgeVariant = (status: any) => {
    switch (status) {
      case "graded":
        return "default";
      case "failed":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/teacher/assignments">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assignments
            </Button>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {assignment?.name}
            </h1>
            <div className="flex items-center space-x-3 mt-2 capitalize">
              <Badge
                variant="secondary"
                className={
                  assignment.subject === "mathematics"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                }
              >
                {assignment?.subject}
              </Badge>
              <span className="text-sm text-gray-500">
                {assignment?.className}
              </span>
            </div>
          </div>
          <Button
            // style={{ pointerEvents: "none" }}
            onClick={(e) => {
              onShowInfo(e);
            }}
            disabled={generating}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {generating ? "Generating..." : "Generate Class Summary"}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {submissions.length}
            </div>
            <p className="text-xs text-blue-600">
              {submissions.length} of {assignment?.totalStudents} students
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-emerald-700">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">
              {submissions.length > 0
                ? Math.round(
                    submissions.reduce(
                      (acc: any, s: any) =>
                        acc +
                        (Number(s.total_submission_marks_awarded) /
                          Number(s.total_submission_marks_available)) *
                          100,
                      0
                    ) / submissions.length
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-emerald-600">Class performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Summary */}
      {classSummary && (
        <Card className="mb-8 bg-gradient-to-r from-gray-50 to-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Class Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 rounded-lg bg-emerald-100">
                <div className="text-2xl font-bold text-emerald-700">
                  {classSummary.distribution.excellent}
                </div>
                <div className="text-sm text-emerald-600">Excellent (90%+)</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-100">
                <div className="text-2xl font-bold text-blue-700">
                  {classSummary.distribution.good}
                </div>
                <div className="text-sm text-blue-600">Good (80-89%)</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-orange-100">
                <div className="text-2xl font-bold text-orange-700">
                  {classSummary.distribution.average}
                </div>
                <div className="text-sm text-orange-600">Average (70-79%)</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-100">
                <div className="text-2xl font-bold text-red-700">
                  {classSummary.distribution.needsImprovement}
                </div>
                <div className="text-sm text-red-600">Needs Work (&lt;70%)</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-8 text-sm">
                <div>
                  <span className="text-gray-500">Average Score:</span>
                  <span className="ml-2 font-semibold">
                    {Math.round(classSummary.averageScore)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Median Score:</span>
                  <span className="ml-2 font-semibold">
                    {classSummary.medianScore}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Student Submissions</span>
          </CardTitle>
          <CardDescription>
            Click on a submission to view detailed results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No submissions yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Students haven't submitted their work yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions?.map((submission: any, index: any) => {
                // Check the status to decide if the submission is clickable
                const isClickable = submission.status === "graded";

                // Define common styling for the submission card
                const cardStyle = {
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                };

                const cardContent = (
                  <div
                    className={`flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-lg border border-gray-200 transition-all duration-200 ${
                      isClickable
                        ? "hover:border-blue-300 hover:shadow-md cursor-pointer group"
                        : "cursor-not-allowed opacity-70"
                    }`}
                    style={cardStyle}
                  >
                    {/* Left Section */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-3">
                        <div
                          className={`font-medium text-gray-900 transition-colors ${
                            isClickable ? "group-hover:text-blue-600" : ""
                          }`}
                        >
                          {submission?.User?.name}
                        </div>
                        <Badge
                          className={`mt-1 md:mt-0 md:ml-auto w-fit capitalize ${
                            getStatusBadgeVariant(submission.status) ===
                            "default"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : getStatusBadgeVariant(submission.status) ===
                                "destructive"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          {submission.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-1 text-sm text-gray-500">
                        <span className="truncate">
                          {submission?.User?.email}
                        </span>
                        <span className="hidden md:inline">•</span>
                        <span>
                          {new Date(submission?.gradedAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center justify-between md:justify-end mt-3 md:mt-0 space-x-3">
                      <div
                        className={`text-lg font-semibold ${getScoreColor(
                          submission.total_submission_marks_awarded,
                          submission.total_submission_marks_available
                        )}`}
                      >
                        {/* Conditionally display the score only if graded */}
                        {submission.status === "graded" ? (
                          <>
                            {Math.round(
                              (Number(
                                submission.total_submission_marks_awarded
                              ) /
                                Number(
                                  submission.total_submission_marks_available
                                )) *
                                100
                            )}
                            %
                          </>
                        ) : (
                          <span className="text-gray-400">--%</span>
                        )}
                      </div>
                      {/* Only show the eye icon for graded submissions */}
                      {isClickable && (
                        <Eye className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      )}
                    </div>
                  </div>
                );

                // Conditional rendering for the Link component
                if (isClickable) {
                  return (
                    <Link
                      key={submission.id}
                      href={`/teacher/assignments/${params.id}/submissions/${submission.id}`}
                    >
                      {cardContent}
                    </Link>
                  );
                } else {
                  return <div key={submission.id}>{cardContent}</div>;
                }
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
