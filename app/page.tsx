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
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  X,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { AUTH_COOKIE, USER_ROLE_KEY } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROLE } from "@/lib/helpers";
import useUserStore from "@/store/userStore";

export default function Home() {
  const router = useRouter();
  const user = useUserStore((state: any) => state.user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string>(ROLE.TEACHER);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = Cookies.get(AUTH_COOKIE);
    setRole(user?.role || "");
    setIsLoggedIn(!!token);
    setCheckingAuth(false);
  }, [user]);

  const onClickPortal = (isTeacher: boolean) => {
    if (!isTeacher) {
      toast.info("Feature coming soon!");
      return;
    }
    if (!isLoggedIn) {
      toast.error("Please login to access the portal");
    } else {
      if (isTeacher) router.push("/teacher/assignments");
      else router.push("/student/demo");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <header className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between transition-all duration-500 ease-in-out">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-white" />
              <span className="text-lg font-bold text-white">AskAndLearn</span>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex space-x-8 text-white font-medium">
              <Link href="/" className="hover:text-gray-200">
                Home
              </Link>
              <Link href="/" className="hover:text-gray-200">
                Blog
              </Link>
              <Link href="/" className="hover:text-gray-200">
                Contact
              </Link>
              <Link href="/" className="hover:text-gray-200">
                FAQ
              </Link>
            </nav>
            {checkingAuth ? (
              <div className="h-6 w-20 bg-white/30 rounded animate-pulse"></div>
            ) : isLoggedIn ? (
              // <Link href="/login">
              <Button
                className="bg-white text-blue-600 hover:bg-gray-100 px-4"
                onClick={() => {
                  Cookies.remove(AUTH_COOKIE, { path: "/" });

                  window.location.href = "/login";
                }}
              >
                Logout
              </Button>
            ) : (
              // </Link>
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-white hover:text-gray-200">
                  Login
                </Link>
                <Link href="/signup">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-4">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-0 sm:py-16 sm:pb-4 relative bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <div>
              <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Empowering Teachers & Students
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Streamline Assignments with{" "}
                <span className="text-blue-600">AI-Powered Grading</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Simplify assignment creation, student submissions, and instant
                AI grading with detailed feedback — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {checkingAuth ? (
                  <div className="h-8 w-24 bg-black/30 rounded animate-pulse"></div>
                ) : !isLoggedIn ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => onClickPortal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg flex items-center"
                    >
                      Teacher Portal
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <Button
                      onClick={() => onClickPortal(false)}
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 text-lg flex items-center"
                    >
                      Student Portal
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                ) : role == ROLE.TEACHER ? (
                  <Button
                    onClick={() => onClickPortal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg flex items-center"
                  >
                    Teacher Portal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => onClickPortal(false)}
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 text-lg flex items-center"
                  >
                    Student Portal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex justify-center md:justify-end">
              <Image
                src="/robott.jpg"
                alt="Students learning"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 sm:pb-36">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Powerful Features for Modern Education
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 p-3 w-fit">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Assignment Creation</CardTitle>
                <CardDescription>
                  Create assignments with optional question papers and answer
                  keys
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Multiple subjects support</li>
                  <li>• File uploads (PDF, DOC, images)</li>
                  <li>• Unique submission links</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-3 w-fit">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Student Submissions</CardTitle>
                <CardDescription>
                  Easy submission process with instant confirmation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Download question papers</li>
                  <li>• Upload multiple file formats</li>
                  <li>• Real-time submission status</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 p-3 w-fit">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">AI Auto-Marking</CardTitle>
                <CardDescription>
                  Intelligent grading with detailed feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Per-question analysis</li>
                  <li>• Class performance metrics</li>
                  <li>• Detailed submission reviews</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-16 sm:mb-36">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-3xl font-bold text-white">
            Trusted by Educators Worldwide
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">500+</div>
              <div className="text-blue-100">Active Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">15K+</div>
              <div className="text-blue-100">Assignments Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">98%</div>
              <div className="text-blue-100">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-14 mt-16 ">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">AskAndLearn</h3>
            <p className="text-sm leading-relaxed max-w-sm">
              Empowering teachers and students with AI-powered assignment
              evaluation, smart grading, and enhanced learning tools for a
              brighter future in education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>

              <li>
                {role == ROLE.TEACHER && (
                  <Link
                    href="/teacher/assignments"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    Teacher Portal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
              </li>
              <li>
                {role == ROLE.STUDENT && (
                  <Link
                    href="/student/demo"
                    className="hover:text-white transition-colors"
                  >
                    Student Portal
                  </Link>
                )}
              </li>
            </ul>
          </div>

          {/* Social + Contact */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-5 mb-5">
              <Link href="/" target="_blank">
                <Facebook className="h-6 w-6 hover:text-white transition-colors" />
              </Link>
              <Link href="/" target="_blank">
                <X className="h-6 w-6 hover:text-white transition-colors" />
              </Link>
              <Link href="/" target="_blank">
                <Linkedin className="h-6 w-6 hover:text-white transition-colors" />
              </Link>
              <Link href="/" target="_blank">
                <Instagram className="h-6 w-6 hover:text-white transition-colors" />
              </Link>
            </div>
            <p className="text-sm">📧 support@askandlearn.com</p>
            <p className="text-sm">📞 +1 (000) 000-000</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} AskAndLearn. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
