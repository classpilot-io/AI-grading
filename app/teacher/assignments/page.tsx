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
import { Plus, BookOpen, Users, Calendar, MoreVertical } from "lucide-react";
import { AssignmentModal } from "@/components/assignment-modal";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { GetFetcher, PostFetcher } from "@/lib/helpers";
import { toast } from "sonner";
import { GET } from "@/app/api/assignment/get/route";
import useUserStore from "@/store/userStore";
import { get } from "node:http";

// // Mock data
// const mockAssignments = [
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

export default function AssignmentsPage() {
  const user = useUserStore((state: any) => state.user);
  const [assignments, setAssignments] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const getAllAssignments = async () => {
    try {
      const res: any = await GetFetcher(
        `/assignment/list?teacherId=${user?.userId}`
      );

      if (res?.assignments) {
        setAssignments(res.assignments);
      } else {
        toast.error("No assignments found.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch assignments.");
    }
  };

  useEffect(() => {
    if (user?.userId) {
      getAllAssignments();
    }
  }, [user?.userId]);

  const handleCreateAssignment = async (assignmentData: any) => {
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(assignmentData).forEach(([key, value]: any) => {
      formData.append(key, value);
    });

    const res: any = await PostFetcher("/assignment", formData, "POST");
    if (res?.hasError) {
      toast.error(
        res?.errors?.[0] || "Failed to create assignment. Please try again."
      );
      return;
    }
    if (res?.assignment) {
      setGeneratedUrl(res?.assignment?.submissionLink);
      setAssignments([res?.assignment, ...assignments]);
      toast.success("Assignment created successfully!");
    }
    setIsLoading(false);
  };

  const handleEditAssignment = async (assignmentData: any) => {
    setIsLoading(true);
    const updatedAssignment: any = assignments?.find(
      (a: any) => a.id === assignmentData.id
    );
    console.log("assignment data updated: ", updatedAssignment);
    const formData = new FormData();
    Object.entries(assignmentData).forEach(([key, value]: any) => {
      formData.append(key, value);
    });

    const res: any = await PostFetcher("/assignment", formData, "PUT");
    if (res?.hasError) {
      toast.error(
        res?.errors?.[0] || "Failed to create assignment. Please try again."
      );
      return;
    }
    if (res?.assignment) {
      setAssignments(
        assignments.map((a: any) =>
          a.id === editingAssignment.id ? { ...a, ...res?.assignment } : a
        )
      );
    }
    setIsModalOpen(false);
    setEditingAssignment(null);
    setGeneratedUrl(undefined);
    toast.success("Assignment Updated successfully!");
    setIsLoading(false);
  };

  const openEditModal = (assignment: any) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const getProgressColor = (submitted: number, total: number) => {
    const percentage = (submitted / total) * 100;
    if (percentage >= 80) return "text-emerald-600";
    if (percentage >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const onShowInfo = (e: any) => {
    e.preventDefault();
    toast.info("Feature coming soon!");
  };

  if (!user?.userId) {
    return <div className="px-4 sm:px-6 lg:px-8">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage your assignments
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments?.map((assignment: any, index: any) => (
          <Card
            key={assignment.id}
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge
                      variant={
                        assignment.subject === "Mathematics"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        assignment.subject === "Mathematics"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      }
                    >
                      {assignment.subject}
                    </Badge>
                  </div>
                  <CardTitle
                    className="text-lg leading-tight group-hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => openEditModal(assignment)}
                  >
                    {assignment.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {assignment.className}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditModal(assignment)}>
                      Edit Assignment
                    </DropdownMenuItem>
                    <Link
                      href={`/teacher/assignments/${assignment.id}/dashboard`}
                      style={{ pointerEvents: "none" }}
                    >
                      <DropdownMenuItem
                        onClick={(e) => {
                          onShowInfo(e);
                        }}
                      >
                        View Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        onShowInfo(e);
                      }}
                    >
                      Delete Assignment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignment.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {assignment.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-500">
                    {/* <Users className="h-4 w-4" />
                    <span
                      className={getProgressColor(
                        assignment.submissionCount,
                        assignment.totalStudents
                      )}
                    >
                      {assignment.submissionCount}/{assignment.totalStudents}{" "}
                      submitted
                    </span> */}
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {assignment.questionPaper && (
                    <Badge variant="outline" className="text-xs">
                      Question Paper
                    </Badge>
                  )}
                  {assignment.answerKey && (
                    <Badge variant="outline" className="text-xs">
                      Answer Key
                    </Badge>
                  )}
                </div>

                <div
                  className="pt-2 border-t"
                  onClick={(e) => {
                    onShowInfo(e);
                  }}
                >
                  <Link
                    href={`/teacher/assignments/${assignment.id}/dashboard`}
                    style={{ pointerEvents: "none" }}
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {assignments?.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No assignments
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first assignment.
          </p>
          <div className="mt-6">
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        </div>
      )}

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAssignment(null);
          setGeneratedUrl(undefined);
        }}
        onSubmit={
          editingAssignment ? handleEditAssignment : handleCreateAssignment
        }
        editingAssignment={editingAssignment}
        generatedUrl={generatedUrl}
        isLoading={isLoading}
      />

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
