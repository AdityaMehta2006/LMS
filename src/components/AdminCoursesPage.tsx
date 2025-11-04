import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Course } from "../types/lms";
import { BookOpen, Eye, Video, CheckCircle } from "lucide-react";
import { ProgressIndicator } from "./ProgressIndicator";

interface AdminCoursesPageProps {
  courses: Course[];
  selectedDepartment: string;
  selectedProgram: string;
  onDepartmentChange: (department: string) => void;
  onProgramChange: (program: string) => void;
  onViewCourse: (courseId: string) => void;
}

export function AdminCoursesPage({
  courses,
  selectedDepartment,
  selectedProgram,
  onDepartmentChange,
  onProgramChange,
  onViewCourse,
}: AdminCoursesPageProps) {
  const getDepartments = () => {
    const depts = new Set(courses.map(c => c.department));
    return Array.from(depts);
  };

  const getPrograms = () => {
    const progs = new Set(courses.map(c => c.program));
    return Array.from(progs);
  };

  const getCourseStats = (course: Course) => {
    const allTopics = course.units.flatMap(unit => unit.topics);
    const totalTopics = allTopics.length;
    const finalizedTopics = allTopics.filter(topic => topic.status === 'finalized').length;
    const totalDuration = allTopics.reduce((sum, topic) => sum + topic.estimatedTime, 0);
    
    return {
      totalTopics,
      finalizedTopics,
      totalDuration,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Courses Overview</h1>
          <p className="text-gray-600 mt-1">View course progress and content</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Courses</CardTitle>
          <CardDescription>Filter by department and program</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {getDepartments().map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={selectedProgram} onValueChange={onProgramChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {getPrograms().map(prog => (
                    <SelectItem key={prog} value={prog}>{prog}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => {
          const stats = getCourseStats(course);
          const allTopics = course.units.flatMap(unit => unit.topics);

          return (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    {course.code && (
                      <Badge variant="secondary" className="mt-2 font-mono text-xs">
                        {course.code}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {course.department} • {course.program}
                </CardDescription>
                <CardDescription className="text-xs">
                  Instructor: {course.teacherName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="text-sm">{course.units.length}</p>
                    <p className="text-xs text-gray-600">Units</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Video className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="text-sm">{stats.totalTopics}</p>
                    <p className="text-xs text-gray-600">Topics</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-sm">{stats.finalizedTopics}</p>
                    <p className="text-xs text-gray-600">Published</p>
                  </div>
                </div>

                <div>
                  <ProgressIndicator topics={allTopics} />
                </div>

                <Button className="w-full" onClick={() => onViewCourse(course.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No courses found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
