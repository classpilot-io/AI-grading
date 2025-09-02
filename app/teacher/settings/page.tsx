"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, User, Bell, Shield } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Prof. Smith",
    email: "prof.smith@school.edu",
    school: "Greenwood High School",
    department: "Mathematics",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    autoGrading: true,
    detailedFeedback: true,
  });

  const [systemPrompt, setSystemPrompt] = useState("");

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
  };

  const handleSavePreferences = () => {
    toast.success("Preferences saved successfully");
  };

  const handleSavePrompt = () => {
    toast.success("System prompt updated successfully");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile, preferences, and system configuration
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription>
              Update your personal and professional details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school">School/Institution</Label>
                <Input
                  id="school"
                  value={profile.school}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, school: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={profile.department}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <Button
              onClick={handleSaveProfile}
              className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Preferences</span>
            </CardTitle>
            <CardDescription>
              Configure your notification and grading preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <div className="text-sm text-gray-500">
                  Receive email alerts for new submissions
                </div>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    emailNotifications: checked,
                  }))
                }
                className={`
    data-[state=checked]:bg-gradient-to-r 
    data-[state=checked]:from-blue-600 
    data-[state=checked]:to-indigo-600
    data-[state=unchecked]:bg-gray-300
  `}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-Grading</Label>
                <div className="text-sm text-gray-500">
                  Automatically grade submissions when received
                </div>
              </div>
              <Switch
                checked={preferences.autoGrading}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, autoGrading: checked }))
                }
                className={`
    data-[state=checked]:bg-gradient-to-r 
    data-[state=checked]:from-blue-600 
    data-[state=checked]:to-indigo-600
    data-[state=unchecked]:bg-gray-300
  `}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Detailed Feedback</Label>
                <div className="text-sm text-gray-500">
                  Generate comprehensive feedback for each question
                </div>
              </div>
              <Switch
                checked={preferences.detailedFeedback}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    detailedFeedback: checked,
                  }))
                }
                className={`
    data-[state=checked]:bg-gradient-to-r 
    data-[state=checked]:from-blue-600 
    data-[state=checked]:to-indigo-600
    data-[state=unchecked]:bg-gray-300
  `}
              />
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* AI System Prompt */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>AI Grading Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure the AI system prompt for assignment grading (will be provided by business team)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter the AI system prompt for grading assignments..."
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                This prompt will guide the AI in how to evaluate and grade student submissions
              </p>
            </div>
            <Button onClick={handleSavePrompt}>
              Update System Prompt
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
