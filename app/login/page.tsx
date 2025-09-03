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
import Cookies from "js-cookie";
import { AUTH_COOKIE, USER_ROLE_KEY } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
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
        router.push("/");
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
          <CardTitle className="text-3xl font-extrabold text-center text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Login to continue your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Dropdown */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-between items-center"
                  >
                    {formData.role === ROLE.STUDENT ? "Student" : "Teacher"}
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
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
            </div>

            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Password Input */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
