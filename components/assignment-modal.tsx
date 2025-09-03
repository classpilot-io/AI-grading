"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Upload, FileText, Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingAssignment?: any;
  generatedUrl?: string;
}

export function AssignmentModal({
  isOpen,
  onClose,
  onSubmit,
  editingAssignment,
  generatedUrl,
}: AssignmentModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    subject: "mathematics",
    name: "",
    className: "",
    level: "",
    description: "",
    questionPaper: null as File | null,
    answerKey: null as File | null,
  });

  useEffect(() => {
    if (editingAssignment) {
      setFormData({
        id: editingAssignment.id,
        subject: editingAssignment.subject?.toLocaleLowerCase(),
        name: editingAssignment.name,
        className: editingAssignment.className,
        level: editingAssignment.level || "",
        description: editingAssignment.description || "",
        questionPaper: null,
        answerKey: null,
      });
    } else {
      setFormData({
        subject: "mathematics",
        name: "",
        className: "",
        level: "",
        description: "",
        questionPaper: null,
        answerKey: null,
      } as any);
    }
  }, [editingAssignment, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingAssignment && !formData.questionPaper) {
      toast.error("Please upload a question paper before submitting");
      return;
    }

    onSubmit({ ...formData });
  };

  const handleFileUpload =
    (type: "questionPaper" | "answerKey") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFormData((prev) => ({ ...prev, [type]: file }));
        toast.success(
          `${
            type === "questionPaper" ? "Question paper" : "Answer key"
          } uploaded successfully`
        );
      }
    };

  const copyUrl = () => {
    if (generatedUrl) navigator.clipboard.writeText(generatedUrl as string);
    toast.success("Submission URL copied to clipboard!");
  };

  const isFormValid =
    formData.name.trim() !== "" && editingAssignment
      ? true
      : formData.questionPaper !== null;

  if (generatedUrl) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Assignment Created Successfully!
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Your assignment "{formData.name}" has been created. Share this
              link with your students:
            </p>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-sm text-gray-800 break-all">
                  {generatedUrl}
                </code>
                <Button size="sm" variant="outline" onClick={copyUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              This URL will be saved and accessible from your assignments list.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
            {/* <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button> */}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, subject: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Assignment Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter assignment name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                value={formData.className}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    className: e.target.value,
                  }))
                }
                placeholder="e.g., Grade 10A"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                value={formData.level}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, level: e.target.value }))
                }
                placeholder="e.g., Beginner, Intermediate, Advanced"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Additional notes or instructions..."
                rows={3}
              />
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Question Paper {editingAssignment ? "" : "*"}</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("questionPaper")?.click()
                    }
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.questionPaper
                      ? formData.questionPaper.name
                      : "Upload Question Paper"}
                  </Button>
                  {formData.questionPaper && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          questionPaper: null,
                        }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <input
                  id="questionPaper"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload("questionPaper")}
                  className="hidden"
                  required={!editingAssignment}
                />
                {formData.questionPaper && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{formData.questionPaper.name}</span>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Answer Key (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("answerKey")?.click()
                    }
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.answerKey
                      ? formData.answerKey.name
                      : "Upload Answer Key"}
                  </Button>
                  {formData.answerKey && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, answerKey: null }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <input
                  id="answerKey"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload("answerKey")}
                  className="hidden"
                />
                {formData.answerKey && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{formData.answerKey.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
            >
              {editingAssignment ? "Save Changes" : "Create Assignment"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
