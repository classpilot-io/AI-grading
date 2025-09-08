"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  X,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/userStore";
import { AUTH_COOKIE } from "@/lib/constants";
import Cookies from "js-cookie";
import { toast } from "sonner";

const navigation = [
  { name: "Assignments", href: "/teacher/assignments", icon: BookOpen },
  { name: "Analytics", href: "/teacher/analytics", icon: BarChart3 },
  { name: "Settings", href: "/teacher/settings", icon: Settings },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useUserStore((state: any) => state.user);
  console.log("TeacherLayout user:", user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const onShowInfo = (e: any) => {
    e.preventDefault();
    toast.info("Feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div
          className="fixed inset-0 bg-gray-600/75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <Link
              href="/"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-sm sm:text-xl font-bold text-gray-900">
                AskAndLearn
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-8 px-4 relative min-h-[88dvh]">
            <ul className="space-y-2 ">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.name}
                    onClick={(e) => {
                      if (item?.name == "Assignments") return;
                      onShowInfo(e);
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      onClick={() => setSidebarOpen(false)}
                      style={{
                        pointerEvents:
                          item?.name == "Assignments" ? "auto" : "none",
                      }}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/login"
              className="mt-auto p-4 absolute bottom-0 w-full left-0"
            >
              <Button
                className="bg-blue-600 text-white hover:bg-blue-800 px-4 w-full mb-2"
                onClick={() => {
                  Cookies.remove(AUTH_COOKIE, { path: "/" });
                }}
              >
                Logout
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-lg">
          <div className="flex h-16 items-center px-4">
            <Link
              href="/"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-sm sm:text-xl font-bold text-gray-900">
                AskAndLearn
              </span>
            </Link>
          </div>
          <nav className="mt-8 flex-1 px-4 pb-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.name}
                    onClick={(e) => {
                      if (item?.name == "Assignments") return;
                      onShowInfo(e);
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      style={{
                        pointerEvents:
                          item?.name == "Assignments" ? "auto" : "none",
                      }}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Link href="/login" className="mt-auto p-4">
            <Button
              className="bg-blue-600 text-white hover:bg-blue-800 px-4 w-full mb-2"
              onClick={() => {
                Cookies.remove(AUTH_COOKIE, { path: "/" });
              }}
            >
              Logout
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 justify-between">
            <h1 className="text-sm sm:text-xl  font-semibold text-gray-900 align-middle mt-[6px]">
              Teacher Dashboard
            </h1>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">
                {user?.name || "Teacher"}
              </div>
              <div className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100">
                <User className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">{children}</main>
      </div>
    </div>
  );
}
