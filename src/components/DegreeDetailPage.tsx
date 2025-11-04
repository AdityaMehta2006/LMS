import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, GraduationCap, BookOpen, Clock, Video, CheckCircle } from "lucide-react";
import { Course } from "../types/lms";
import { Degree } from "../lib/mockData";
import { ProgressIndicator } from "./ProgressIndicator";
import { Badge } from "./ui/badge";

interface DegreeDetailPageProps {
  degree: Degree;
  courses: Course[];
  onBack: () => void;
  onViewCourse: (courseId: string) => void;
}

export function DegreeDetailPage({
  degree,
  courses,
  onBack,
  onViewCourse,
}: DegreeDetailPageProps) {
  const degreeCourses = courses.filter(course => course.program === degree.shortName);

  const getCourseStats = (course: Course) => {
    const allTopics = course.units.flatMap(unit => unit.topics);
    const totalTopics = allTopics.length;
    const finalizedTopics = allTopics.filter(topic => topic.status === 'finalized').length;
    const totalDuration = allTopics.reduce((sum, topic) => sum + topic.estimatedTime, 0);
    
    return {
      totalTopics,
      finalizedTopics,
      totalDuration,
      progress: totalTopics > 0 ? Math.round((finalizedTopics / totalTopics) * 100) : 0,
    };
  };

  const overallStats = degreeCourses.reduce(
    (acc, course) => {
      const stats = getCourseStats(course);
      return {
        totalTopics: acc.totalTopics + stats.totalTopics,
        finalizedTopics: acc.finalizedTopics + stats.finalizedTopics,
        totalDuration: acc.totalDuration + stats.totalDuration,
      };
    },
    { totalTopics: 0, finalizedTopics: 0, totalDuration: 0 }
  );

  const overallProgress = overallStats.totalTopics > 0 
    ? Math.round((overallStats.finalizedTopics / overallStats.totalTopics) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Degrees
        </Button>
      </div>

      {/* Degree Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-gray-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-3xl">{degree.name}</CardTitle>
                <Badge variant="outline">{degree.shortName}</Badge>
              </div>
              <CardDescription className="text-base">
                {degree.department} • {degree.duration}
              </CardDescription>
              <p className="text-gray-600 mt-3">{degree.description}</p>
            </div>
          </div>

          {degreeCourses.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl">{degreeCourses.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Total Topics</p>
                  <p className="text-2xl">{overallStats.totalTopics}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Videos Published</p>
                  <p className="text-2xl">{overallStats.finalizedTopics}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Total Duration</p>
                  <p className="text-2xl">{Math.round(overallStats.totalDuration / 60)}h</p>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Courses List */}
      <Card>
        <CardHeader>
          <CardTitle>Courses in this Program</CardTitle>
          <CardDescription>
            {degreeCourses.length > 0 
              ? `${degreeCourses.length} course${degreeCourses.length !== 1 ? 's' : ''} available`
              : 'No courses available yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {degreeCourses.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                No courses have been added to this degree program yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {degreeCourses.map(course => {
                const stats = getCourseStats(course);
                const allTopics = course.units.flatMap(unit => unit.topics);

                return (
                  <Card key={course.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{course.name}</CardTitle>
                            {course.code && (
                              <Badge variant="secondary" className="font-mono text-xs">
                                {course.code}
                              </Badge>
                            )}
                          </div>
                          <CardDescription>
                            {course.department} • Instructor: {course.teacherName}
                          </CardDescription>
                        </div>
                        <Button onClick={() => onViewCourse(course.id)}>
                          View Details
                        </Button>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-500" />
                          <span>{course.units.length} Units</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-gray-500" />
                          <span>{stats.totalTopics} Topics</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{stats.finalizedTopics} Published</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{stats.totalDuration} min</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <ProgressIndicator topics={allTopics} />
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
