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
    <div className="space-y-8">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border/50 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-white to-blue-50/30" onClick={() => onNavigate('users')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors">
              <Users className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{userStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1.5">
              System users
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-white to-purple-50/30" onClick={() => onNavigate('programs')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Degree Programs</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-600 transition-colors">
              <GraduationCap className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{degrees.length}</div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Across {new Set(degrees.map(d => d.department)).size} departments
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-white to-green-50/30" onClick={() => onNavigate('courses')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Courses</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-600 transition-colors">
              <BookOpen className="w-4 h-4 text-green-600 group-hover:text-white transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{courseStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {courseStats.totalTopics} topics
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-emerald-300 hover:shadow-lg transition-all group bg-gradient-to-br from-white to-emerald-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Content Progress</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-600 transition-colors">
              <CheckCircle className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{overallProgress}%</div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {courseStats.finalizedTopics}/{courseStats.totalTopics} finalized
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Breakdown and Content Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-6">
            <CardTitle>User Breakdown</CardTitle>
            <CardDescription>Distribution by role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-xl border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm">Administrators</span>
                </div>
                <span className="text-xl">{userStats.admins}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm">Teachers</span>
                </div>
                <span className="text-xl">{userStats.teachers}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm">Editors</span>
                </div>
                <span className="text-xl">{userStats.editors}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300"
              onClick={() => onNavigate('users')}
            >
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-6">
            <CardTitle>Content Production</CardTitle>
            <CardDescription>Overall completion status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-xl">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3 bg-muted" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-transparent rounded-xl border border-blue-100">
                <p className="text-xs text-muted-foreground mb-1.5">Total Topics</p>
                <p className="text-3xl">{courseStats.totalTopics}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-transparent rounded-xl border border-green-100">
                <p className="text-xs text-muted-foreground mb-1.5">Finalized</p>
                <p className="text-3xl text-green-600">{courseStats.finalizedTopics}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300"
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
