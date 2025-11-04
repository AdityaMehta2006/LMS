import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { User, Course } from "../types/lms";
import { Degree } from "../lib/mockData";
import { Users, GraduationCap, BookOpen, CheckCircle, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Progress } from "./ui/progress";

interface AdminDashboardHomeProps {
  users: User[];
  courses: Course[];
  degrees: Degree[];
  onNavigate: (page: string) => void;
}

export function AdminDashboardHome({ users, courses, degrees, onNavigate }: AdminDashboardHomeProps) {
  const userStats = {
    total: users.length,
    teachers: users.filter(u => u.role === 'teacher').length,
    editors: users.filter(u => u.role === 'editor').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const courseStats = {
    total: courses.length,
    totalTopics: courses.reduce((sum, course) => 
      sum + course.units.reduce((uSum, unit) => uSum + unit.topics.length, 0), 0
    ),
    finalizedTopics: courses.reduce((sum, course) => 
      sum + course.units.reduce((uSum, unit) => 
        uSum + unit.topics.filter(t => t.status === 'finalized').length, 0
      ), 0
    ),
  };

  const overallProgress = courseStats.totalTopics > 0 
    ? Math.round((courseStats.finalizedTopics / courseStats.totalTopics) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and management</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('users')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userStats.total}</div>
            <p className="text-xs text-gray-600 mt-1">
              System users
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('programs')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Degree Programs</CardTitle>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{degrees.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              Across {new Set(degrees.map(d => d.department)).size} departments
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('courses')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Courses</CardTitle>
            <BookOpen className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{courseStats.total}</div>
            <p className="text-xs text-gray-600 mt-1">
              {courseStats.totalTopics} topics
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Content Progress</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{overallProgress}%</div>
            <p className="text-xs text-gray-600 mt-1">
              {courseStats.finalizedTopics}/{courseStats.totalTopics} finalized
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Breakdown and Content Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Breakdown</CardTitle>
            <CardDescription>Distribution by role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Administrators</span>
                </div>
                <span className="font-medium">{userStats.admins}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Teachers</span>
                </div>
                <span className="font-medium">{userStats.teachers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Editors</span>
                </div>
                <span className="font-medium">{userStats.editors}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onNavigate('users')}
            >
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Production</CardTitle>
            <CardDescription>Overall completion status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="font-medium">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-xs text-gray-600">Total Topics</p>
                <p className="text-2xl">{courseStats.totalTopics}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-600">Finalized</p>
                <p className="text-2xl text-green-600">{courseStats.finalizedTopics}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onNavigate('courses')}
            >
              View All Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
