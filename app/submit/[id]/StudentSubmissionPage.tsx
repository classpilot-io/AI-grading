'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Download, Upload, FileText, CheckCircle, AlertCircle, Badge } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

// Mock assignment data
const mockAssignment = {
  id: '1',
  name: 'Algebra Fundamentals Quiz',
  className: 'Grade 10A',
  subject: 'Mathematics',
  description: 'Basic algebra concepts and problem solving. Please show all your working steps clearly.',
  questionPaper: 'algebra-quiz.pdf',
  hasQuestionPaper: true,
};

export default function StudentSubmissionPage({params}: {params: {id: string}}) {
  const paramss = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      toast.success(`${selectedFiles.length} file(s) selected`);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Submission uploaded successfully!');
    }, 2000);
  };

  const downloadQuestionPaper = () => {
    // Simulate download
    toast.success('Question paper download started');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your work has been uploaded successfully and will be graded automatically.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>{files.length} file(s) submitted</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>Results will be available to your teacher</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI-Auto Marker</h1>
              <p className="text-sm text-gray-500">Student Submission Portal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pt-8">
        {/* Assignment Info */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{mockAssignment.name}</CardTitle>
                <CardDescription className="flex items-center space-x-3 mt-2">
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded">{mockAssignment.subject}</span>
                  <span>{mockAssignment.className}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          {mockAssignment.description && (
            <CardContent>
              <p className="text-gray-700">{mockAssignment.description}</p>
            </CardContent>
          )}
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Download Section */}
          {mockAssignment.hasQuestionPaper && (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  <span>Question Paper</span>
                </CardTitle>
                <CardDescription>
                  Download the assignment question paper
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={downloadQuestionPaper}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Question Paper
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  PDF • {mockAssignment.questionPaper}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Upload Section */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-emerald-600" />
                <span>Submit Your Work</span>
              </CardTitle>
              <CardDescription>
                Upload your completed assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="files">Upload Files (PDF or Images)</Label>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Accepted formats: PDF, DOC, DOCX, JPG, PNG
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Files:</Label>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={files.length === 0 || isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-gradient-to-r from-gray-50 to-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">Submission Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Download and complete the question paper if available</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Show all your working steps clearly</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Upload clear, readable files (PDF preferred)</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Your work will be automatically graded and reviewed by your teacher</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// const demoAssignments = [
//   { id: 'demo-1' },
//   { id: 'demo-2' },
// ];

// export function generateStaticParams() {
//   return demoAssignments.map(a => ({ id: a.id }));
// }