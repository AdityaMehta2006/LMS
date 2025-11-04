import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { HemisphereProgress } from "./HemisphereProgress";
import { Course, Topic } from "../types/lms";
import { StatusBadge } from "./StatusBadge";
import { Video, ChevronRight } from "lucide-react";

interface EditorDashboardHomeProps {
  courses: Course[];
  onNavigate: (page: string) => void;
  onStartRecording: (courseId: string, unitId: string, topicId: string) => void;
}

export function EditorDashboardHome({ courses, onNavigate, onStartRecording }: EditorDashboardHomeProps) {
  // Calculate statistics
  const allTopics = courses.flatMap(course => 
    course.units.flatMap(unit => unit.topics)
  );

  const totalPlanned = allTopics.length;
  
  // Scripted topics (scripting stage and beyond)
  const totalScripted = allTopics.filter(t => 
    t.status === 'scripting' || t.status === 'recording' || 
    t.status === 'editing' || t.status === 'uploaded' || 
    t.status === 'under_review' || t.status === 'approved' || 
    t.status === 'finalized'
  ).length;
  
  // Videos to be recorded (scripting completed, need to record)
  const toBeRecorded = allTopics.filter(t => t.status === 'scripting').length;
  
  // Videos published (finalized)
  const totalPublished = allTopics.filter(t => t.status === 'finalized').length;
  
  // Videos approved (awaiting finalization)
  const totalApproved = allTopics.filter(t => t.status === 'approved').length;

  // Get topics that need recording
  const needsRecording = courses.flatMap(course => 
    course.units.flatMap(unit => 
      unit.topics
        .filter(topic => topic.status === 'scripting')
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
        <p className="text-gray-600 mt-1">Track your video production progress</p>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Production Progress</CardTitle>
          <CardDescription>Overview of video recording and publishing status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HemisphereProgress
              value={toBeRecorded}
              max={totalScripted}
              label="To Be Recorded"
              color="#ef4444"
            />
            <HemisphereProgress
              value={totalApproved}
              max={totalPlanned}
              label="Approved Videos"
              color="#06b6d4"
            />
            <HemisphereProgress
              value={totalPublished}
              max={totalPlanned}
              label="Published Videos"
              color="#10b981"
            />
          </div>
        </CardContent>
      </Card>

      {/* Videos to Record Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Videos Ready for Recording
              </CardTitle>
              <CardDescription className="mt-1">
                {needsRecording.length} videos with completed scripts
              </CardDescription>
            </div>
            {needsRecording.length > 3 && (
              <Button variant="outline" size="sm" onClick={() => onNavigate('courses')}>
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {needsRecording.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No videos ready for recording</p>
              <p className="text-sm mt-1">All caught up! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {needsRecording.slice(0, 5).map(({ topic, unitName, courseName, courseId, unitId }) => (
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
                      Duration: {topic.estimatedTime} min
                      {topic.editorComments && <span> • Notes available</span>}
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => onStartRecording(courseId, unitId, topic.id)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Start Recording
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
            <CardDescription>View and work on course videos</CardDescription>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">Production Analytics</CardTitle>
            <CardDescription>View detailed progress reports</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
