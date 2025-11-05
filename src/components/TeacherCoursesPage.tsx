import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, BookOpen, ArrowRight } from "lucide-react";
import { Course } from "../types/lms";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { departments, programs } from "../lib/mockData";
import { Progress } from "./ui/progress";

interface TeacherCoursesPageProps {
  courses: Course[];
  selectedDepartment: string;
  selectedProgram: string;
  onDepartmentChange: (dept: string) => void;
  onProgramChange: (prog: string) => void;
  onAddCourse: () => void;
  onViewCourse: (courseId: string) => void;
}

export function TeacherCoursesPage({
  courses,
  selectedDepartment,
  selectedProgram,
  onDepartmentChange,
  onProgramChange,
  onAddCourse,
  onViewCourse,
}: TeacherCoursesPageProps) {
  const filteredCourses = courses.filter(course => {
    if (selectedDepartment !== 'all' && course.department !== selectedDepartment) return false;
    if (selectedProgram !== 'all' && course.program !== selectedProgram) return false;
    return true;
  });

  const getCourseProgress = (course: Course) => {
    const allTopics = course.units.flatMap(unit => unit.topics);
    const finalized = allTopics.filter(t => t.status === 'finalized').length;
    const total = allTopics.length;
    return { finalized, total, percentage: total > 0 ? (finalized / total) * 100 : 0 };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2>My Courses</h2>
          <p className="text-muted-foreground mt-1">Manage and organize your course content</p>
        </div>
        <Button onClick={onAddCourse} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          New Course
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-64 border-border/60 hover:border-blue-300 transition-colors">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedProgram} onValueChange={onProgramChange}>
          <SelectTrigger className="w-64 border-border/60 hover:border-blue-300 transition-colors">
            <SelectValue placeholder="Filter by Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            {programs.map(prog => (
              <SelectItem key={prog} value={prog}>{prog}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const { finalized, total, percentage } = getCourseProgress(course);
          
          return (
            <Card key={course.id} className="border-border/50 hover:border-blue-300 hover:shadow-xl transition-all group bg-gradient-to-br from-white to-blue-50/20">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl">
                      <span className="text-blue-600">{finalized}</span>
                      <span className="text-muted-foreground">/{total}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Videos</div>
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{course.name}</CardTitle>
                <CardDescription>
                  {course.code && <span className="font-mono">{course.code} • </span>}
                  {course.department} • {course.program}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{Math.round(percentage)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2.5" />
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gradient-to-br from-blue-50 to-transparent p-3 rounded-xl border border-blue-100">
                    <div className="text-muted-foreground text-xs mb-1">Units</div>
                    <div className="text-lg">{course.units.length}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-transparent p-3 rounded-xl border border-purple-100">
                    <div className="text-muted-foreground text-xs mb-1">Topics</div>
                    <div className="text-lg">{total}</div>
                  </div>
                </div>

                {/* Learn More Button */}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm" 
                  onClick={() => onViewCourse(course.id)}
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center text-muted-foreground">
            <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 opacity-40" />
            </div>
            <p>No courses found</p>
            <Button className="mt-6 bg-blue-600 hover:bg-blue-700" onClick={onAddCourse}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
