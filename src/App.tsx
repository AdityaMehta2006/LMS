import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent } from "./components/ui/card";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { EditorDashboard } from "./components/EditorDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { mockCourses } from "./lib/mockData";
import { Course } from "./types/lms";
import { Users, Edit3, Settings } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [currentRole, setCurrentRole] = useState<'teacher' | 'editor' | 'admin'>('teacher');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Role Switcher - Floating for demo purposes */}
      <div className="fixed top-4 right-4 z-50">
        <Card className="shadow-lg">
          <CardContent className="p-2">
            <Tabs value={currentRole} onValueChange={(value) => setCurrentRole(value as 'teacher' | 'editor' | 'admin')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="teacher" className="text-xs px-3">
                  <Users className="w-3 h-3 mr-1" />
                  Teacher
                </TabsTrigger>
                <TabsTrigger value="editor" className="text-xs px-3">
                  <Edit3 className="w-3 h-3 mr-1" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-xs px-3">
                  <Settings className="w-3 h-3 mr-1" />
                  Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {currentRole === 'teacher' && (
        <TeacherDashboard courses={courses} onUpdateCourses={setCourses} />
      )}

      {currentRole === 'editor' && (
        <EditorDashboard courses={courses} onUpdateCourses={setCourses} />
      )}

      {currentRole === 'admin' && (
        <AdminDashboard courses={courses} onUpdateCourses={setCourses} />
      )}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
