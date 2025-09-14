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
  Plus,
  BookOpen,
  Users,
  Calendar,
  MoreVertical,
  Trash2,
  BarChart2,
  Edit,
  LinkIcon,
  Trash,
} from "lucide-react";
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
import useUserStore from "@/store/userStore";

// Confirmation Modal (simple implementation)
function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <div className="flex flex-col items-center">
          <Trash2 className="h-10 w-10 text-red-500 mb-2" />
          <h2 className="text-lg font-bold mb-2 text-gray-900">
            Delete Assignment?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete this assignment? This action cannot
            be undone.
          </p>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  const user = useUserStore((state: any) => state.user);
  const [assignments, setAssignments] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isAssignmentLoading, setIsAssignmentLoading] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getAllAssignments = async () => {
    setIsAssignmentLoading(true);
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
      console.error("Error fetching assignments:", err);
      toast.error(err.message || "Failed to fetch assignments.");
    } finally {
      setIsAssignmentLoading(false);
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

  const openDeleteModal = (assignment: any) => {
    setAssignmentToDelete(assignment);
    setDeleteModalOpen(true);
  };

  const handleDeleteAssignment = async () => {
    if (!assignmentToDelete) return;
    setIsDeleting(true);
    try {
      const res: any = await PostFetcher(
        "/assignment/delete",
        { assignmentId: assignmentToDelete.id },
        "DELETE"
      );
      if (res?.hasError) {
        toast.error(
          res?.errors?.[0] || "Failed to delete assignment. Please try again."
        );
      } else {
        setAssignments(
          assignments.filter((a: any) => a.id !== assignmentToDelete.id)
        );
        toast.success("Assignment deleted successfully!");
      }
    } catch (err: any) {
      toast.error("Failed to delete assignment.");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setAssignmentToDelete(null);
    }
  };

  const getProgressColor = (submitted: number, total: number) => {
    const percentage = (submitted / total) * 100;
    if (percentage >= 80) return "text-emerald-600";
    if (percentage >= 50) return "text-orange-600";
    return "text-red-600";
  };

  if (!user?.userId || isAssignmentLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
            className="group flex flex-col hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-md"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            {/* Header */}
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <div className="flex items-center space-x-2 mb-3 capitalize">
                    <Badge
                      variant={
                        assignment.subject === "mathematics"
                          ? "default"
                          : "secondary"
                      }
                      className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                        assignment.subject === "mathematics"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      }`}
                    >
                      {assignment.subject}
                    </Badge>
                  </div>
                  <CardTitle
                    className="text-xl font-semibold leading-snug group-hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => openEditModal(assignment)}
                  >
                    {assignment.name}
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-gray-500">
                    {assignment.className}
                  </CardDescription>
                </div>

                {/* Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => openEditModal(assignment)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit Assignment
                    </DropdownMenuItem>

                    <Link
                      href={`/teacher/assignments/${assignment.id}/dashboard`}
                    >
                      <DropdownMenuItem>
                        <BarChart2 className="h-4 w-4 mr-2" /> View Dashboard
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuItem
                      onClick={() => {
                        const link = `${process.env.NEXT_PUBLIC_BASE_URL}/submit/${assignment.id}`;
                        navigator.clipboard.writeText(link);
                        toast.success(
                          `Submission link copied for "${assignment.name}".`
                        );
                      }}
                    >
                      <LinkIcon className="h-4 w-4 mr-2" /> Copy Link
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => openDeleteModal(assignment)}
                    >
                      <Trash className="h-4 w-4 mr-2 bg-red" /> Delete
                      Assignment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            {/* Main Content */}
            <CardContent className="flex flex-col flex-1">
              <div className="space-y-4 flex-1">
                {/* Description */}
                {assignment.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {assignment.description}
                  </p>
                )}

                {/* Date */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* File tags */}
                <div className="flex flex-wrap gap-2">
                  {assignment.questionPaper && (
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-1 border-blue-200 text-blue-600"
                    >
                      📄 Question Paper
                    </Badge>
                  )}
                  {assignment.answerKey && (
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-1 border-green-200 text-green-600"
                    >
                      Answer Key
                    </Badge>
                  )}
                </div>
              </div>

              {/* Footer (always at bottom) */}
              <div className="pt-3 border-t mt-auto">
                <Link href={`/teacher/assignments/${assignment.id}/dashboard`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-lg font-medium hover:bg-blue-50 hover:text-blue-700"
                  >
                    View Dashboard
                  </Button>
                </Link>
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
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onConfirm={handleDeleteAssignment}
        onCancel={() => {
          setDeleteModalOpen(false);
          setAssignmentToDelete(null);
        }}
        loading={isDeleting}
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
