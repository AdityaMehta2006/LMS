import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ArrowLeft, ChevronRight, Video, Play } from "lucide-react";
import { Course, Topic } from "../types/lms";
import { StatusTimeline } from "./StatusTimeline";
import { ProgressIndicator } from "./ProgressIndicator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface EditorCourseDetailProps {
  course: Course;
  onBack: () => void;
  onStartRecording: (unitId: string, topicId: string) => void;
  onMoveToEditing: (unitId: string, topicId: string) => void;
  onUpload: (unitId: string, topicId: string, notes: string) => void;
  onFinalize: (unitId: string, topicId: string, notes: string) => void;
}

export function EditorCourseDetail({
  course,
  onBack,
  onStartRecording,
  onMoveToEditing,
  onUpload,
  onFinalize,
}: EditorCourseDetailProps) {
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [actionTopic, setActionTopic] = useState<{ 
    courseId: string; 
    unitId: string; 
    topicId: string; 
    action: string;
    topicName: string;
  } | null>(null);
  const [editorNotes, setEditorNotes] = useState('');

  const getAllTopics = (): Topic[] => {
    return course.units.flatMap(unit => unit.topics);
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'scripting':
        return { label: 'Start Recording', action: 'recording', variant: 'default' as const };
      case 'recording':
        return { label: 'Move to Editing', action: 'editing', variant: 'default' as const };
      case 'editing':
        return { label: 'Upload Video', action: 'upload', variant: 'default' as const };
      case 'approved':
        return { label: 'Finalize', action: 'finalize', variant: 'default' as const };
      default:
        return null;
    }
  };

  const openActionDialog = (unitId: string, topicId: string, topicName: string, action: string) => {
    setActionTopic({ courseId: course.id, unitId, topicId, action, topicName });
    setEditorNotes('');
  };

  const handleDialogAction = () => {
    if (!actionTopic) return;
    
    if (actionTopic.action === 'upload') {
      onUpload(actionTopic.unitId, actionTopic.topicId, editorNotes);
    } else if (actionTopic.action === 'finalize') {
      onFinalize(actionTopic.unitId, actionTopic.topicId, editorNotes);
    }
    
    setActionTopic(null);
    setEditorNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl">{course.name}</CardTitle>
              <CardDescription className="mt-2">
                {course.code && <span className="font-mono">{course.code} • </span>}
                {course.department} • {course.program} • {course.units.length} units, {getAllTopics().length} topics
              </CardDescription>
            </div>
          </div>
          <div className="mt-6">
            <ProgressIndicator topics={getAllTopics()} />
          </div>
        </CardHeader>
      </Card>

      {/* Units and Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Video Production Status</CardTitle>
          <CardDescription>Manage recording, editing, and publishing for all topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {course.units.map((unit, unitIndex) => (
              <Accordion 
                key={unit.id}
                type="single" 
                collapsible
                value={expandedUnit === unit.id ? unit.id : undefined}
                onValueChange={(value) => setExpandedUnit(value || null)}
              >
                <AccordionItem value={unit.id} className="border rounded-lg">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <h4>Unit {unitIndex + 1}: {unit.name}</h4>
                      <span className="text-sm text-gray-500">{unit.topics.length} topics</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3 mt-2">
                      {unit.topics.length === 0 ? (
                        <p className="text-sm text-gray-500 italic py-4 text-center">No topics in this unit</p>
                      ) : (
                        unit.topics.map((topic, topicIndex) => {
                          const nextAction = getNextAction(topic.status);
                          
                          return (
                            <div key={topic.id} className="bg-gray-50 p-4 rounded-lg space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm text-gray-600 font-mono">
                                      {unitIndex + 1}.{topicIndex + 1}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                    <span>{topic.name}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>Duration: {topic.estimatedTime} min</span>
                                    {topic.videoUrl && (
                                      <span className="flex items-center gap-1 text-green-600">
                                        <Video className="w-4 h-4" />
                                        Video uploaded
                                      </span>
                                    )}
                                  </div>
                                  {topic.editorComments && (
                                    <p className="text-xs text-gray-500 mt-2 italic">
                                      Teacher notes: {topic.editorComments}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  {topic.status === 'planned' && (
                                    <span className="text-sm text-gray-500 px-3 py-1.5 bg-gray-100 rounded">
                                      Awaiting scripting...
                                    </span>
                                  )}
                                  {nextAction && (
                                    <Button 
                                      size="sm" 
                                      variant={nextAction.variant}
                                      onClick={() => {
                                        if (nextAction.action === 'recording') {
                                          onStartRecording(unit.id, topic.id);
                                        } else if (nextAction.action === 'editing') {
                                          onMoveToEditing(unit.id, topic.id);
                                        } else if (nextAction.action === 'upload' || nextAction.action === 'finalize') {
                                          openActionDialog(unit.id, topic.id, topic.name, nextAction.action);
                                        }
                                      }}
                                    >
                                      {nextAction.label}
                                    </Button>
                                  )}
                                  {topic.status === 'uploaded' && (
                                    <span className="text-sm text-blue-600 px-3 py-1.5 bg-blue-50 rounded">
                                      Waiting for review...
                                    </span>
                                  )}
                                  {topic.status === 'under_review' && (
                                    <span className="text-sm text-purple-600 px-3 py-1.5 bg-purple-50 rounded">
                                      Teacher reviewing...
                                    </span>
                                  )}
                                  {topic.status === 'finalized' && (
                                    <span className="text-sm text-green-600 px-3 py-1.5 bg-green-50 rounded flex items-center gap-1">
                                      <Play className="w-4 h-4" />
                                      Published
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Status Timeline */}
                              <StatusTimeline status={topic.status} />
                            </div>
                          );
                        })
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      {actionTopic && (
        <Dialog open={true} onOpenChange={() => setActionTopic(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionTopic.action === 'upload' ? 'Upload Video' : 'Finalize Video'}
              </DialogTitle>
              <DialogDescription>
                {actionTopic.action === 'upload' 
                  ? `Upload your edited video for "${actionTopic.topicName}" and add any notes for the reviewing teacher.`
                  : `Make final adjustments and publish "${actionTopic.topicName}" for students.`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {actionTopic.action === 'upload' && (
                <div className="space-y-2">
                  <Label>Video File (Mock Upload)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Video className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to select video file</p>
                    <p className="text-xs text-gray-400 mt-1">MP4, MOV, AVI up to 2GB</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="editor-notes">
                  {actionTopic.action === 'upload' ? 'Notes for Teacher' : 'Final Notes'}
                </Label>
                <Textarea 
                  id="editor-notes"
                  placeholder={actionTopic.action === 'upload' 
                    ? 'Add any context or notes for the reviewing teacher...'
                    : 'Add any final notes about this video...'}
                  value={editorNotes}
                  onChange={(e) => setEditorNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setActionTopic(null)}>
                Cancel
              </Button>
              <Button onClick={handleDialogAction}>
                {actionTopic.action === 'upload' ? 'Upload & Submit for Review' : 'Finalize & Publish'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
