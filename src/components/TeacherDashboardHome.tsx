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
      {/* Header */}
      <div>
        <h2>Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Track your course progress and review submissions</p>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Videos Awaiting Review
              </CardTitle>
              <CardDescription className="mt-1">
                {awaitingReview.length} videos need your attention
              </CardDescription>
            </div>
            {awaitingReview.length > 3 && (
              <Button variant="outline" size="sm" onClick={() => onNavigate('courses')}>
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {awaitingReview.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No videos awaiting review</p>
              <p className="text-sm mt-1">All caught up! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {awaitingReview.slice(0, 5).map(({ topic, unitName, courseName, courseId, unitId }) => (
                <div key={topic.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={topic.status} />
                      <span className="text-sm text-gray-600">{courseName}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{unitName}</span>
                    </div>
                    <h4 className="text-sm">{topic.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded by {topic.uploadedBy} • {topic.estimatedTime} min
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => onReviewTopic(courseId, unitId, topic.id, topic)}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('courses')}>
          <CardHeader>
            <CardTitle className="text-base">Manage Courses</CardTitle>
            <CardDescription>View and edit your course content</CardDescription>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">Course Analytics</CardTitle>
            <CardDescription>View detailed progress reports</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
