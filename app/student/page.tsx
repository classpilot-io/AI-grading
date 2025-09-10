"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  Download,
  Upload,
  CheckCircle,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function StudentDemoPage() {
  const [assignmentUrl, setAssignmentUrl] = useState("");
  const router = useRouter();

  const handleGoToAssignment = () => {
    if (!assignmentUrl.trim()) {
      toast.error("Please enter URL");
      return;
    }
    // Accepts either `/submit/<uuid>` OR full URL with domain
    const regex = /^(?:https?:\/\/[^\s/]+)?\/submit\/[0-9a-fA-F-]{36}$/;

    if (!regex.test(assignmentUrl.trim())) {
      toast.error("Invalid URL");
      return;
    }
    router.push(assignmentUrl.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur border-b border-blue-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                AskAndLearn
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Student Demo Portal
              </p>
            </div>
          </div>
          {/* <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-700 hover:bg-blue-50"
            >
              Home
            </Button>
          </Link> */}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <section className="w-full max-w-xl mx-auto">
          <Card className="shadow-lg border-blue-100">
            <CardHeader>
              <CardTitle className="text-xl text-center font-semibold text-blue-900">
                Assignment Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center mb-6">
                Enter your assignment URL below to access and submit your work.
              </p>
              <form
                className="flex flex-col sm:flex-row items-center gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGoToAssignment();
                }}
              >
                <input
                  type="text"
                  value={assignmentUrl}
                  onChange={(e) => setAssignmentUrl(e.target.value)}
                  placeholder="/submit/cb21cfd0-3e62-4e29-9a5a-cd25c306080e"
                  className="w-full sm:w-80 px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
                >
                  <LinkIcon className="h-4 w-4" />
                  Go to Assignment
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Instructions Card */}
        <section className="w-full max-w-3xl mx-auto mt-10">
          <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-blue-100 shadow">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 shadow">
                    <Download className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    1. Download
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    Get the question paper from your teacher.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 shadow">
                    <Upload className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    2. Upload
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    Submit your completed work.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 shadow">
                    <CheckCircle className="h-7 w-7 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    3. Auto-Grade
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    AI grades your work instantly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
