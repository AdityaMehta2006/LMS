import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import { Course } from "../types/lms";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { departments, programs } from "../lib/mockData";
import { Progress } from "./ui/progress";

interface EditorCoursesPageProps {
  courses: Course[];
  selectedDepartment: string;
  selectedProgram: string;
  onDepartmentChange: (dept: string) => void;
  onProgramChange: (prog: string) => void;
  onViewCourse: (courseId: string) => void;
}

export function EditorCoursesPage({
  courses,
  selectedDepartment,
  selectedProgram,
  onDepartmentChange,
  onProgramChange,
  onViewCourse,
}: EditorCoursesPageProps) {
  const filteredCourses = courses.filter(course => {
    if (selectedDepartment !== 'all' && course.department !== selectedDepartment) return false;
    if (selectedProgram !== 'all' && course.program !== selectedProgram) return false;
    return true;
  });

  const getCourseProgress = (course: Course) => {
    const allTopics = course.units.flatMap(unit => unit.topics);
    const total = allTopics.length;
    const finalized = allTopics.filter(t => t.status === 'finalized').length;
    const inProduction = allTopics.filter(t => 
      t.status === 'scripting' || t.status === 'recording' || t.status === 'editing'
    ).length;
    const uploaded = allTopics.filter(t => 
      t.status === 'uploaded' || t.status === 'under_review' || t.status === 'approved'
    ).length;
    
    return { 
      total, 
      finalized, 
      inProduction,
      uploaded,
      percentage: total > 0 ? (finalized / total) * 100 : 0 
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Course Videos</h2>
        <p className="text-gray-600 mt-1">Manage video production for all courses</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-64">
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
          <SelectTrigger className="w-64">
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
          const { total, finalized, inProduction, uploaded, percentage } = getCourseProgress(course);
          
          return (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl">
                      {finalized}/{total}
                    </div>
                    <div className="text-xs text-gray-500">Published</div>
                  </div>
                </div>
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <CardDescription>
                  {course.code && <span className="font-mono">{course.code} • </span>}
                  {course.department} • {course.program}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Overall Progress</span>
                    <span>{Math.round(percentage)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-orange-50 p-2 rounded text-center">
                    <div className="text-orange-600 text-xs">Recording</div>
                    <div>{inProduction}</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <div className="text-blue-600 text-xs">Review</div>
                    <div>{uploaded}</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <div className="text-green-600 text-xs">Published</div>
                    <div>{finalized}</div>
                  </div>
                </div>

                {/* Learn More Button */}
                <Button 
                  className="w-full" 
                  variant="outline"
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
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No courses found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
