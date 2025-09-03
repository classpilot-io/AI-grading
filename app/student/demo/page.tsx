"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  ExternalLink,
  Download,
  Upload,
  CheckCircle,
} from "lucide-react"; // ⬅️ Added missing icons
import Link from "next/link";

const demoAssignments = [
  {
    id: "demo-1",
    name: "Algebra Fundamentals Quiz",
    subject: "Mathematics",
    className: "Grade 10A",
    description: "Basic algebra concepts and problem solving",
  },
  {
    id: "demo-2",
    name: "Essay on Climate Change",
    subject: "English",
    className: "Grade 9B",
    description: "Write a 500-word essay on climate change impacts",
  },
];

export default function StudentDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  AskAndLearn
                </h1>
                <p className="text-sm text-gray-500">Student Demo Portal</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignments</h2>
          <p className="text-gray-600">
            Browse and submit your work for the assignments listed below.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {demoAssignments.map((assignment, index) => (
            <Card
              key={assignment.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 200}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {assignment.name}
                </CardTitle>
                <CardDescription className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {assignment.subject}
                    </span>
                    <span className="text-sm">{assignment.className}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {assignment.description}
                </p>
                <Link href={`/submit/${assignment.id}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Submit Solution
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-gray-50 to-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">1. Download</h3>
                <p className="text-sm text-gray-600">
                  Get the question paper from your teacher
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Upload className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900">2. Upload</h3>
                <p className="text-sm text-gray-600">
                  Submit your completed work
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">3. Auto-Grade</h3>
                <p className="text-sm text-gray-600">
                  AI grades your work instantly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
