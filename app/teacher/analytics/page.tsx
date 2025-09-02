'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, BookOpen, Target, Award, Clock } from 'lucide-react';

const analyticsData = {
  overview: {
    totalAssignments: 12,
    totalSubmissions: 145,
    averageScore: 82,
    completionRate: 78,
  },
  recentPerformance: [
    { assignment: 'Algebra Fundamentals Quiz', average: 80, submissions: 12 },
    { assignment: 'Essay on Climate Change', average: 78, submissions: 8 },
    { assignment: 'Geometry Problem Set', average: 91, submissions: 20 },
  ],
  subjectPerformance: [
    { subject: 'Mathematics', averageScore: 83, assignmentCount: 8 },
    { subject: 'English', averageScore: 79, assignmentCount: 4 },
  ],
};

export default function AnalyticsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track performance and engagement across all your assignments
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Total Assignments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{analyticsData.overview.totalAssignments}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-emerald-700 flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Total Submissions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{analyticsData.overview.totalSubmissions}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Average Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{analyticsData.overview.averageScore}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Completion Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{analyticsData.overview.completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recent Assignment Performance</span>
            </CardTitle>
            <CardDescription>
              Latest assignment results and student engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentPerformance.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div>
                    <div className="font-medium text-gray-900">{item.assignment}</div>
                    <div className="text-sm text-gray-500">{item.submissions} submissions</div>
                  </div>
                  <Badge 
                    variant={ 'default' }
                    className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {item.average}% avg
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Subject Performance</span>
            </CardTitle>
            <CardDescription>
              Performance breakdown by subject area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.subjectPerformance.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{subject.subject}</div>
                    <div className="text-sm text-gray-500">{subject.assignmentCount} assignments</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${subject.averageScore}%` }}
                      ></div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {subject.averageScore}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}