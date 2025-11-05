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
    <div className="min-h-screen bg-background">
      {/* Role Switcher - Floating for demo purposes */}
      <div className="fixed top-6 right-6 z-50">
        <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-white/95">
          <CardContent className="p-3">
            <Tabs value={currentRole} onValueChange={(value) => setCurrentRole(value as 'teacher' | 'editor' | 'admin')}>
              <TabsList className="grid w-full grid-cols-3 h-11 bg-muted/50">
                <TabsTrigger value="teacher" className="text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Users className="w-4 h-4 mr-1.5" />
                  Teacher
                </TabsTrigger>
                <TabsTrigger value="editor" className="text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Edit3 className="w-4 h-4 mr-1.5" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-xs px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Settings className="w-4 h-4 mr-1.5" />
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
        <TeacherDashboard courses={courses} onUpdateCourses={setCourses} />
      )}

      {currentRole === 'admin' && (
        <TeacherDashboard courses={courses} onUpdateCourses={setCourses} />
      )}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
