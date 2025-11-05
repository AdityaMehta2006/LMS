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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Degree Programs</h1>
          <p className="text-muted-foreground mt-2">Browse and manage all degree programs</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle>Filter Degrees</CardTitle>
          <CardDescription>Filter degree programs by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 max-w-md">
              <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
                <SelectTrigger className="border-border/60 hover:border-blue-300 transition-colors">
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
            <Card key={degree.id} className="border-border/50 hover:border-blue-300 hover:shadow-xl transition-all group bg-gradient-to-br from-white to-blue-50/20">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{degree.shortName}</CardTitle>
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
                <p className="text-sm text-muted-foreground leading-relaxed">{degree.description}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-900">{degree.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-900">{degreeCourses.length} Courses</span>
                  </div>
                </div>

                {degreeCourses.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Course Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2.5" />
                    <p className="text-xs text-muted-foreground">
                      {totalTopics} total topics across all courses
                    </p>
                  </div>
                )}

                <Button 
                  className={`w-full shadow-sm ${degreeCourses.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
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
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <GraduationCap className="w-10 h-10 opacity-40" />
            </div>
            <p className="text-muted-foreground">No degree programs found for the selected department.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
