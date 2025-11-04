import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { GraduationCap, BookOpen, Clock } from "lucide-react";
import { Course } from "../types/lms";
import { Degree, mockDegrees } from "../lib/mockData";
import { Progress } from "./ui/progress";

interface DegreesPageProps {
  courses: Course[];
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  onViewDegree: (degreeId: string) => void;
}

export function DegreesPage({
  courses,
  selectedDepartment,
  onDepartmentChange,
  onViewDegree,
}: DegreesPageProps) {
  const getDepartments = () => {
    const depts = new Set(mockDegrees.map(d => d.department));
    return Array.from(depts);
  };

  const filteredDegrees = selectedDepartment === 'all'
    ? mockDegrees
    : mockDegrees.filter(degree => degree.department === selectedDepartment);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Degree Programs</h1>
          <p className="text-gray-600 mt-1">Browse and manage all degree programs</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Degrees</CardTitle>
          <CardDescription>Filter degree programs by department</CardDescription>
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
          </div>
        </CardContent>
      </Card>

      {/* Degrees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDegrees.map(degree => {
          const progress = calculateDegreeProgress(degree.shortName);
          const degreeCourses = getDegreeCourses(degree.shortName);
          const totalTopics = degreeCourses.flatMap(course => 
            course.units.flatMap(unit => unit.topics)
          ).length;

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
                      <span className="text-gray-600">Course Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-gray-500">
                      {totalTopics} total topics across all courses
                    </p>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  variant={degreeCourses.length > 0 ? "default" : "outline"}
                  onClick={() => onViewDegree(degree.id)}
                >
                  {degreeCourses.length > 0 ? 'View Courses' : 'Learn More'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDegrees.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No degree programs found for the selected department.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
