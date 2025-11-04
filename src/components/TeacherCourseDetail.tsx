import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Plus, ArrowLeft, ChevronRight, Edit, Trash2, Eye, FileText } from "lucide-react";
import { Course, Topic } from "../types/lms";
import { StatusBadge } from "./StatusBadge";
import { ProgressIndicator } from "./ProgressIndicator";

interface TeacherCourseDetailProps {
  course: Course;
  onBack: () => void;
  onAddUnit: () => void;
  onAddTopic: (unitId: string) => void;
  onDeleteTopic: (unitId: string, topicId: string) => void;
  onStartScripting: (unitId: string, topicId: string, topic: Topic) => void;
  onReviewTopic: (unitId: string, topicId: string, topic: Topic) => void;
  onMarkUnderReview: (unitId: string, topicId: string) => void;
}

export function TeacherCourseDetail({
  course,
  onBack,
  onAddUnit,
  onAddTopic,
  onDeleteTopic,
  onStartScripting,
  onReviewTopic,
  onMarkUnderReview,
}: TeacherCourseDetailProps) {
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  const getAllTopics = (): Topic[] => {
    return course.units.flatMap(unit => unit.topics);
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
                {course.department} • {course.program} • {course.units.length} units, {getAllTopics().length} topics
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-6">
            <ProgressIndicator topics={getAllTopics()} />
          </div>
        </CardHeader>
      </Card>

      {/* Units and Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Course Structure</CardTitle>
          <CardDescription>Manage units and topics for this course</CardDescription>
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
                    <div className="space-y-2 mt-2">
                      {unit.topics.length === 0 ? (
                        <p className="text-sm text-gray-500 italic py-4 text-center">No topics added yet</p>
                      ) : (
                        unit.topics.map((topic, topicIndex) => (
                          <div key={topic.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-sm text-gray-600 font-mono">
                                {unitIndex + 1}.{topicIndex + 1}
                              </span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                              <span>{topic.name}</span>
                              <span className="text-sm text-gray-500">
                                ({topic.estimatedTime} min)
                              </span>
                              <StatusBadge status={topic.status} />
                              {topic.teacherNotes && (
                                <span className="text-xs text-gray-500 italic">
                                  "{topic.teacherNotes}"
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {topic.status === 'planned' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => onStartScripting(unit.id, topic.id, topic)}
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  Start Scripting
                                </Button>
                              )}
                              {(topic.status === 'uploaded' || topic.status === 'under_review') && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    if (topic.status === 'uploaded') {
                                      onMarkUnderReview(unit.id, topic.id);
                                    }
                                    onReviewTopic(unit.id, topic.id, topic);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => onDeleteTopic(unit.id, topic.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => onAddTopic(unit.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Topic
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onAddUnit}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Unit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
