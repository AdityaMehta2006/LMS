import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Degree } from "../lib/mockData";
import { Course } from "../types/lms";
import { GraduationCap, Plus, Edit, Trash2, BookOpen, Clock } from "lucide-react";
import { Progress } from "./ui/progress";

interface AdminProgramManagementProps {
  degrees: Degree[];
  courses: Course[];
  onAddProgram: () => void;
  onEditProgram: (degreeId: string) => void;
  onDeleteProgram: (degreeId: string) => void;
}

export function AdminProgramManagement({
  degrees,
  courses,
  onAddProgram,
  onEditProgram,
  onDeleteProgram,
}: AdminProgramManagementProps) {
  const getDegreeCourses = (degreeShortName: string) => {
    return courses.filter(course => course.program === degreeShortName);
  };

  const calculateDegreeProgress = (degreeShortName: string) => {
    const degreeCourses = getDegreeCourses(degreeShortName);
    if (degreeCourses.length === 0) return 0;

    const allTopics = degreeCourses.flatMap(course => 
      course.units.flatMap(unit => unit.topics)
    );
    
    if (allTopics.length === 0) return 0;

    const finalizedTopics = allTopics.filter(topic => topic.status === 'finalized').length;
    return Math.round((finalizedTopics / allTopics.length) * 100);
  };

  const getDepartmentStats = () => {
    const depts = new Set(degrees.map(d => d.department));
    return {
      total: degrees.length,
      departments: depts.size,
      totalCourses: courses.length,
    };
  };

  const stats = getDepartmentStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Program Management</h1>
          <p className="text-gray-600 mt-1">Manage degree programs and curricula</p>
        </div>
        <Button onClick={onAddProgram}>
          <Plus className="w-4 h-4 mr-2" />
          Add Program
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl">{stats.total}</div>
            <p className="text-xs text-gray-600 mt-1">Total Programs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-blue-600">{stats.departments}</div>
            <p className="text-xs text-gray-600 mt-1">Departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-green-600">{stats.totalCourses}</div>
            <p className="text-xs text-gray-600 mt-1">Total Courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {degrees.map(degree => {
          const progress = calculateDegreeProgress(degree.shortName);
          const degreeCourses = getDegreeCourses(degree.shortName);

          return (
            <Card key={degree.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{degree.shortName}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {degree.department}
                      </CardDescription>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-3">
                  {degree.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{degree.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{degree.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{degreeCourses.length} Courses</span>
                  </div>
                </div>

                {degreeCourses.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEditProgram(degree.id)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteProgram(degree.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
