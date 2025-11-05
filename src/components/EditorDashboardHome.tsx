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
      {/* Progress Section */}
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-6">
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
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Video className="w-5 h-5 text-purple-600" />
                </div>
                Videos Ready for Recording
              </CardTitle>
              <CardDescription className="mt-2">
                {needsRecording.length} videos with completed scripts
              </CardDescription>
            </div>
            {needsRecording.length > 3 && (
              <Button variant="outline" size="sm" onClick={() => onNavigate('courses')} className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300">
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {needsRecording.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Video className="w-10 h-10 opacity-40" />
              </div>
              <p>No videos ready for recording</p>
              <p className="text-sm mt-1">All caught up! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {needsRecording.slice(0, 5).map(({ topic, unitName, courseName, courseId, unitId }) => (
                <div key={topic.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50/50 to-transparent border border-border rounded-xl hover:border-purple-300 hover:shadow-sm transition-all group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={topic.status} />
                      <span className="text-sm text-muted-foreground">{courseName}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{unitName}</span>
                    </div>
                    <h4 className="text-sm text-foreground group-hover:text-purple-600 transition-colors">{topic.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Duration: {topic.estimatedTime} min
                      {topic.editorComments && <span> • Notes available</span>}
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => onStartRecording(courseId, unitId, topic.id)}
                    className="ml-4 bg-purple-600 hover:bg-purple-700 shadow-sm"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer border-border/50 hover:border-purple-300 hover:shadow-lg transition-all group bg-gradient-to-br from-white to-purple-50/30" onClick={() => onNavigate('courses')}>
          <CardHeader className="pb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-600 transition-colors">
              <Video className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <CardTitle className="text-base">Manage Courses</CardTitle>
            <CardDescription>View and work on course videos</CardDescription>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer border-border/50 hover:border-cyan-300 hover:shadow-lg transition-all group bg-gradient-to-br from-white to-cyan-50/30">
          <CardHeader className="pb-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-cyan-600 transition-colors">
              <ChevronRight className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" />
            </div>
            <CardTitle className="text-base">Production Analytics</CardTitle>
            <CardDescription>View detailed progress reports</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
