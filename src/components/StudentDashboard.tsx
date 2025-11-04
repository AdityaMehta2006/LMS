import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { BookOpen, Video, Presentation, FileText, Clock, CheckCircle2, Play } from "lucide-react";
import { Course } from "../types/lms";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { departments, programs } from "../lib/mockData";
import { Progress } from "./ui/progress";

interface StudentDashboardProps {
  courses: Course[];
}

export function StudentDashboard({ courses }: StudentDashboardProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');

  // Only show courses with at least some finalized content
  const availableCourses = courses.filter(course => {
    if (selectedDepartment !== 'all' && course.department !== selectedDepartment) return false;
    if (selectedProgram !== 'all' && course.program !== selectedProgram) return false;
    
    const hasFinalizedContent = course.units.some(unit => 
      unit.topics.some(topic => topic.status === 'finalized')
    );
    return hasFinalizedContent;
  });

  const getCompletedTopics = (course: Course) => {
    const allTopics = course.units.flatMap(unit => unit.topics);
    const finalized = allTopics.filter(t => t.status === 'finalized').length;
    return { finalized, total: allTopics.length };
  };

  const getTotalDuration = (course: Course) => {
    return course.units.reduce((total, unit) => {
      return total + unit.topics.reduce((sum, topic) => sum + (topic.status === 'finalized' ? topic.estimatedTime : 0), 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>My Courses</h2>
        <p className="text-gray-600 mt-1">Access your enrolled courses and learning materials</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
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

        <Select value={selectedProgram} onValueChange={setSelectedProgram}>
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

      {/* Courses */}
      <div className="grid gap-6">
        {availableCourses.map(course => {
          const { finalized, total } = getCompletedTopics(course);
          const duration = getTotalDuration(course);
          const progress = total > 0 ? (finalized / total) * 100 : 0;

          return (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      {course.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {course.department} • {course.program} • Instructor: {course.teacherName}
                    </CardDescription>
                    <div className="flex gap-6 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.floor(duration / 60)}h {duration % 60}m
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {finalized} of {total} topics available
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Course Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {course.units.map((unit, unitIndex) => {
                    const finalizedTopics = unit.topics.filter(t => t.status === 'finalized');
                    if (finalizedTopics.length === 0) return null;

                    return (
                      <AccordionItem key={unit.id} value={unit.id}>
                        <AccordionTrigger>
                          <div className="flex items-center justify-between w-full pr-4">
                            <span>Unit {unitIndex + 1}: {unit.name}</span>
                            <span className="text-sm text-gray-500">
                              {finalizedTopics.length} topics
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            {finalizedTopics.map((topic, topicIndex) => (
                              <Card key={topic.id} className="border-l-4 border-l-blue-500">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base flex items-center justify-between">
                                    <span>
                                      {unitIndex + 1}.{topicIndex + 1} {topic.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {topic.estimatedTime} min
                                    </span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-2">
                                    {topic.videoUrl && (
                                      <Button variant="default" size="sm">
                                        <Play className="w-4 h-4 mr-1" />
                                        Watch Video
                                      </Button>
                                    )}
                                    {topic.pptUrl && (
                                      <Button variant="outline" size="sm">
                                        <Presentation className="w-4 h-4 mr-1" />
                                        View Slides
                                      </Button>
                                    )}
                                    {topic.documentsUrl && topic.documentsUrl.length > 0 && (
                                      <Button variant="outline" size="sm">
                                        <FileText className="w-4 h-4 mr-1" />
                                        Notes ({topic.documentsUrl.length})
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}

        {availableCourses.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No courses available yet. Check back soon for new content!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
