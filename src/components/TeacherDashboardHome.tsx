import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { HemisphereProgress } from "./HemisphereProgress";
import { Course, Topic } from "../types/lms";
import { StatusBadge } from "./StatusBadge";
import { Eye, ChevronRight } from "lucide-react";

interface TeacherDashboardHomeProps {
  courses: Course[];
  onNavigate: (page: string) => void;
  onReviewTopic: (courseId: string, unitId: string, topicId: string, topic: Topic) => void;
}

export function TeacherDashboardHome({ courses, onNavigate, onReviewTopic }: TeacherDashboardHomeProps) {
  // Calculate statistics
  const allTopics = courses.flatMap(course => 
    course.units.flatMap(unit => unit.topics)
  );

  const totalPlanned = allTopics.length;
  const totalScripted = allTopics.filter(t => t.status === 'scripting' || 
    t.status === 'recording' || t.status === 'editing' || 
    t.status === 'uploaded' || t.status === 'under_review' || 
    t.status === 'approved' || t.status === 'finalized').length;
  
  const totalUploaded = allTopics.filter(t => 
    t.status === 'uploaded' || t.status === 'under_review' || 
    t.status === 'approved' || t.status === 'finalized').length;
  const totalReviewed = allTopics.filter(t => 
    t.status === 'approved' || t.status === 'finalized').length;
  
  const totalFinalized = allTopics.filter(t => t.status === 'finalized').length;

  // Get topics awaiting review
  const awaitingReview = courses.flatMap(course => 
    course.units.flatMap(unit => 
      unit.topics
        .filter(topic => topic.status === 'uploaded' || topic.status === 'under_review')
        .map(topic => ({
          topic,
          unitName: unit.name,
          courseName: course.name,
          courseId: course.id,
          unitId: unit.id,
        }))
    )
  );

  return (
    <div className="space-y-8">
      {/* Progress Section */}
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-6">
          <CardTitle>Content Progress</CardTitle>
          <CardDescription>Overview of content creation and review status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HemisphereProgress
              value={totalScripted}
              max={totalPlanned}
              label="Scripted Topics"
              color="#8b5cf6"
            />
            <HemisphereProgress
              value={totalReviewed}
              max={totalUploaded}
              label="Reviewed Videos"
              color="#06b6d4"
            />
            <HemisphereProgress
              value={totalFinalized}
              max={totalPlanned}
              label="Published Videos"
              color="#10b981"
            />
          </div>
        </CardContent>
      </Card>

      {/* Videos to Review Section */}
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                Videos Awaiting Review
              </CardTitle>
              <CardDescription className="mt-2">
                {awaitingReview.length} videos need your attention
              </CardDescription>
            </div>
            {awaitingReview.length > 3 && (
              <Button variant="outline" size="sm" onClick={() => onNavigate('courses')} className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300">
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {awaitingReview.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Eye className="w-10 h-10 opacity-40" />
              </div>
              <p>No videos awaiting review</p>
              <p className="text-sm mt-1">All caught up! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {awaitingReview.slice(0, 5).map(({ topic, unitName, courseName, courseId, unitId }) => (
                <div key={topic.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50/50 to-transparent border border-border rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={topic.status} />
                      <span className="text-sm text-muted-foreground">{courseName}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{unitName}</span>
                    </div>
                    <h4 className="text-sm text-foreground group-hover:text-blue-600 transition-colors">{topic.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Uploaded by {topic.uploadedBy} • {topic.estimatedTime} min
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => onReviewTopic(courseId, unitId, topic.id, topic)}
                    className="ml-4 bg-blue-600 hover:bg-blue-700 shadow-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Review
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer border-border/50 hover:border-blue-300 hover:shadow-lg transition-all group bg-gradient-to-br from-white to-blue-50/30" onClick={() => onNavigate('courses')}>
          <CardHeader className="pb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
              <Eye className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <CardTitle className="text-base">Manage Courses</CardTitle>
            <CardDescription>View and edit your course content</CardDescription>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer border-border/50 hover:border-purple-300 hover:shadow-lg transition-all group bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="pb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-600 transition-colors">
              <ChevronRight className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <CardTitle className="text-base">Course Analytics</CardTitle>
            <CardDescription>View detailed progress reports</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
