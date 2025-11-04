import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Course, Topic } from "../types/lms";
import { ArrowLeft, BookOpen, Video, FileText, Clock, CheckCircle, Eye, Download } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ProgressIndicator } from "./ProgressIndicator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";

interface AdminCourseDetailViewProps {
  course: Course;
  onBack: () => void;
}

export function AdminCourseDetailView({ course, onBack }: AdminCourseDetailViewProps) {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const allTopics = course.units.flatMap(unit => unit.topics);
  const totalDuration = allTopics.reduce((sum, topic) => sum + topic.estimatedTime, 0);
  const finalizedTopics = allTopics.filter(t => t.status === 'finalized').length;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const canViewContent = (topic: Topic) => {
    return topic.status === 'finalized' || topic.status === 'approved';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl">{course.name}</h1>
              {course.code && (
                <Badge variant="secondary" className="font-mono">
                  {course.code}
                </Badge>
              )}
            </div>
            <p className="text-gray-600 mt-1">
              {course.department} • {course.program} • Instructor: {course.teacherName}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl">{course.units.length}</div>
                <p className="text-xs text-gray-600">Units</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl">{allTopics.length}</div>
                <p className="text-xs text-gray-600">Topics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl">{finalizedTopics}</div>
                <p className="text-xs text-gray-600">Finalized</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl">{formatDuration(totalDuration)}</div>
                <p className="text-xs text-gray-600">Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Content production status</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressIndicator topics={allTopics} />
        </CardContent>
      </Card>

      {/* Units and Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
          <CardDescription>Units, topics, and learning materials</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-4">
            {course.units.map((unit, unitIndex) => {
              const unitTopics = unit.topics;
              const unitDuration = unitTopics.reduce((sum, topic) => sum + topic.estimatedTime, 0);
              const unitFinalized = unitTopics.filter(t => t.status === 'finalized').length;

              return (
                <AccordionItem key={unit.id} value={unit.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          Unit {unitIndex + 1}
                        </Badge>
                        <span className="font-medium">{unit.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{unitTopics.length} topics</span>
                        <span>{formatDuration(unitDuration)}</span>
                        <span className="text-green-600">
                          {unitFinalized}/{unitTopics.length} finalized
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 mt-3">
                      {unitTopics.map((topic, topicIndex) => (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600 font-mono">
                                {unitIndex + 1}.{topicIndex + 1}
                              </span>
                              <span className="font-medium">{topic.name}</span>
                              <StatusBadge status={topic.status} />
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{topic.estimatedTime} min</span>
                              </div>
                              {topic.uploadedBy && (
                                <span className="text-xs">Editor: {topic.uploadedBy}</span>
                              )}
                              {topic.reviewedBy && (
                                <span className="text-xs">Reviewed by: {topic.reviewedBy}</span>
                              )}
                            </div>
                          </div>
                          {canViewContent(topic) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTopic(topic)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Content
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Content Viewer Dialog */}
      <Dialog open={!!selectedTopic} onOpenChange={(open) => !open && setSelectedTopic(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTopic?.name}</DialogTitle>
            <DialogDescription>
              View finalized learning materials and content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTopic && (
              <>
                {/* Video */}
                {selectedTopic.videoUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Video className="w-5 h-5" />
                        Video Lecture
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                          <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm opacity-75">Video Player</p>
                          <p className="text-xs opacity-50 mt-1">{selectedTopic.videoUrl}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download Video
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* PPT */}
                {selectedTopic.pptUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Presentation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">Presentation Slides</p>
                            <p className="text-sm text-gray-600">{selectedTopic.pptUrl}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Content Materials */}
                {selectedTopic.contentMaterialsUrl && selectedTopic.contentMaterialsUrl.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Additional Materials
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedTopic.contentMaterialsUrl.map((material, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm">{material}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Comments and Notes */}
                {(selectedTopic.editorComments || selectedTopic.teacherNotes) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Notes & Comments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedTopic.editorComments && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Editor Comments:</p>
                          <p className="text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                            {selectedTopic.editorComments}
                          </p>
                        </div>
                      )}
                      {selectedTopic.teacherNotes && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Teacher Notes:</p>
                          <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                            {selectedTopic.teacherNotes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
