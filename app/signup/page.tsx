"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROLE } from "@/lib/helpers";
import { PostFetcher } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Mail, Lock, CheckCircle, ChevronDown } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    role: ROLE.TEACHER,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res: any = await PostFetcher("/auth/signup", formData, "POST");
      if (res?.hasError) {
        setError(res?.errors?.[0] || "Login failed. Please try again.");
        return;
      }
      if (res) {
        router.push("/auth/login");
      } else {
        setError(res.message || "Signup failed.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-3xl font-bold text-center text-gray-900 relative">
            Welcome to AskAndLearn
            <span className="block w-16 h-1 bg-indigo-500 mx-auto mt-2 rounded-full"></span>
          </CardTitle>
          <CardDescription className="text-center text-gray-600 mt-2">
            Sign up to get started with smart assignments
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Dropdown */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-lg border-gray-300"
                  >
                    {formData.role === ROLE.STUDENT ? "Student" : "Teacher"}
                    <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[--radix-dropdown-menu-trigger-width]"
                >
                  <DropdownMenuItem
                    onClick={() => handleRoleChange(ROLE.STUDENT)}
                  >
                    Student
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleRoleChange(ROLE.TEACHER)}
                  >
                    Teacher
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> */}

            {/* Name */}
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <CheckCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 rounded-lg shadow-md transition-all"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="px-2 text-gray-400 text-sm">or</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
