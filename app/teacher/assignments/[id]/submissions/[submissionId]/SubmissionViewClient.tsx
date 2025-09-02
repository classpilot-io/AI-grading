"use client";

import { useState } from "react";
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

const mockAssignment = {
  name: "Algebra Fundamentals Quiz",
  className: "Grade 10A",
  subject: "Mathematics",
};
// Shared mock submissions
export const mockSubmissions = [
  {
    id: "1",
    studentName: "Alice Johnson",
    studentEmail: "alice.johnson@school.edu",
    submittedAt: "2024-01-16T10:30:00Z",
    score: 80,
    totalScore: 100,
    summary:
      "Student demonstrates good understanding of algebraic concepts. Shows clear problem-solving approach in most questions. Minor calculation errors in question 1. Excellent work on question 2 with complete solution steps. Question 3 shows correct method but incomplete final steps.",
    questions: [
      {
        question: 1,
        title: "Solve for x: 2x + 5 = 13",
        score: 8,
        maxScore: 10,
        feedback: "Good approach with correct initial steps.",
        studentAnswer: "x = 4",
        correctAnswer: "x = 4",
        isCorrect: true,
      },
      {
        question: 2,
        title: "Expand: (x + 3)(x - 2)",
        score: 10,
        maxScore: 10,
        feedback: "Perfect solution!",
        studentAnswer: "x² + x - 6",
        correctAnswer: "x² + x - 6",
        isCorrect: true,
      },
      {
        question: 3,
        title: "Factorize: x² - 5x + 6",
        score: 7,
        maxScore: 10,
        feedback: "Correct method but incomplete final steps.",
        studentAnswer: "(x - 2)(x - 3)",
        correctAnswer: "(x - 2)(x - 3)",
        isCorrect: true,
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
    summary:
      "Bob shows excellent mastery of algebra. Small notation issue in question 2.",
    questions: [
      {
        question: 1,
        title: "Solve for x: 2x + 5 = 13",
        score: 10,
        maxScore: 10,
        feedback: "Excellent work",
        studentAnswer: "x = 4",
        correctAnswer: "x = 4",
        isCorrect: true,
      },
      {
        question: 2,
        title: "Expand: (x + 3)(x - 2)",
        score: 9,
        maxScore: 10,
        feedback: "Very good, small notation issue",
        studentAnswer: "x² + x - 6",
        correctAnswer: "x² + x - 6",
        isCorrect: true,
      },
      {
        question: 3,
        title: "Factorize: x² - 5x + 6",
        score: 10,
        maxScore: 10,
        feedback: "Perfect solution",
        studentAnswer: "(x - 2)(x - 3)",
        correctAnswer: "(x - 2)(x - 3)",
        isCorrect: true,
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
    summary:
      "Carol demonstrates solid understanding overall. Minor calculation mistakes but good effort.",
    questions: [
      {
        question: 1,
        title: "Solve for x: 2x + 5 = 13",
        score: 7,
        maxScore: 10,
        feedback: "Correct approach, calculation error",
        studentAnswer: "x = 5",
        correctAnswer: "x = 4",
        isCorrect: false,
      },
      {
        question: 2,
        title: "Expand: (x + 3)(x - 2)",
        score: 8,
        maxScore: 10,
        feedback: "Good understanding shown",
        studentAnswer: "x² + x - 5",
        correctAnswer: "x² + x - 6",
        isCorrect: false,
      },
      {
        question: 3,
        title: "Factorize: x² - 5x + 6",
        score: 8,
        maxScore: 10,
        feedback: "Solid work overall",
        studentAnswer: "(x - 2)(x - 3)",
        correctAnswer: "(x - 2)(x - 3)",
        isCorrect: true,
      },
    ],
  },
];

export default function SubmissionView({ params }: { params: any }) {
  const paramss = useParams<{ submissionId: string }>();
  const submission = mockSubmissions.find((s) => s.id === paramss.submissionId);

  if (!submission) {
    return <div className="p-6">Submission not found.</div>;
  }

  const downloadSubmission = () => {
    console.log("Downloading submission files...");
  };

  return (
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
            <Badge variant="secondary">{mockAssignment.subject}</Badge>
            <span className="text-sm text-gray-500">
              {mockAssignment.className}
            </span>
          </div>
        </div>
        <Button onClick={downloadSubmission} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Files
        </Button>
      </div>

      {/* Student Info */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                {submission.studentName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {submission.studentName}
                </CardTitle>
                <CardDescription>{submission.studentEmail}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-900">
                {submission.score}/{submission.totalScore}
              </div>
              <div className="text-sm text-blue-600">
                {Math.round((submission.score / submission.totalScore) * 100)}%
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              Submitted:{" "}
              {new Date(submission.submittedAt).toLocaleDateString("en-GB")} at{" "}
              {new Date(submission.submittedAt).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
