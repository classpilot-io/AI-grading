"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { emailRegex, ROLE } from "@/lib/helpers";
import { PostFetcher } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Cookies from "js-cookie";
import { AUTH_COOKIE, USER_ROLE_KEY } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Mail, Lock } from "lucide-react";
import useUserStore from "@/store/userStore";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    role: ROLE.TEACHER,
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role: string) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || !formData.role) {
      setError("Please fill all fields.");
      return;
    }

    if (!emailRegex?.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const res: any = await PostFetcher("/auth/login", formData, "POST");
      if (res?.hasError) {
        setError(res?.errors?.[0] || "Login failed. Please try again.");
        return;
      }
      if (res?.access_token) {
        Cookies.set(AUTH_COOKIE, res.access_token, {
          path: "/",
          sameSite: "lax",
          secure: true,
        });
        (useUserStore?.getState() as any)?.setUser(res?.user);
        // if (formData?.role) {
        //   window.location.href = "/student";
        // } else {
        setTimeout(() => {
          window.location.reload();
        }, 100);
        // }
      } else {
        setError("Login failed. No access token returned.");
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
          <CardTitle className="text-3xl font-extrabold text-center text-gray-900 relative">
            Welcome Back
            <span className="block w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></span>
          </CardTitle>
          <CardDescription className="text-center text-gray-600 mt-2">
            Login to continue your journey
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
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[--radix-dropdown-menu-trigger-width]"
                >
                  <DropdownMenuItem
                    onClick={() => handleRoleSelect(ROLE.STUDENT)}
                  >
                    Student
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleRoleSelect(ROLE.TEACHER)}
                  >
                    Teacher
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> */}

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-lg shadow-md transition-all"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="px-2 text-gray-400 text-sm">or</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
