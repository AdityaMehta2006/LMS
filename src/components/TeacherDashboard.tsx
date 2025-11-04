import { useState } from "react";
import { Course, Topic, Unit, ContentStatus } from "../types/lms";
import { TeacherLayout } from "./TeacherLayout";
import { TeacherDashboardHome } from "./TeacherDashboardHome";
import { TeacherCoursesPage } from "./TeacherCoursesPage";
import { TeacherCourseDetail } from "./TeacherCourseDetail";
import { DegreesPage } from "./DegreesPage";
import { DegreeDetailPage } from "./DegreeDetailPage";
import { mockDegrees } from "../lib/mockData";
import { AddCourseDialog } from "./AddCourseDialog";
import { AddUnitDialog } from "./AddUnitDialog";
import { AddTopicDialog } from "./AddTopicDialog";
import { ScriptingDialog } from "./ScriptingDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Eye, CheckCircle, XCircle } from "lucide-react";

interface TeacherDashboardProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
}

export function TeacherDashboard({ courses, onUpdateCourses }: TeacherDashboardProps) {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedDegreeId, setSelectedDegreeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  
  // Dialog states
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState<string | null>(null);
  const [showAddTopic, setShowAddTopic] = useState<{ courseId: string; unitId: string } | null>(null);
  const [scriptingTopic, setScriptingTopic] = useState<{ courseId: string; unitId: string; topicId: string; topic: Topic } | null>(null);
  const [reviewTopic, setReviewTopic] = useState<{ courseId: string; unitId: string; topicId: string; topic: Topic } | null>(null);
  const [teacherNotes, setTeacherNotes] = useState('');

  const selectedCourse = selectedCourseId ? courses.find(c => c.id === selectedCourseId) : null;
  const selectedDegree = selectedDegreeId ? mockDegrees.find(d => d.id === selectedDegreeId) : null;

  // Handle navigation
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page !== 'course-detail') {
      setSelectedCourseId(null);
    }
    if (page !== 'degree-detail') {
      setSelectedDegreeId(null);
    }
  };

  const handleViewCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('course-detail');
  };

  const handleViewDegree = (degreeId: string) => {
    setSelectedDegreeId(degreeId);
  };

  const handleViewCourseFromDegree = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedDegreeId(null);
  };

  // Course management
  const handleAddCourse = (courseData: Partial<Course>) => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name: courseData.name!,
      code: courseData.code,
      department: courseData.department!,
      program: courseData.program!,
      teacherId: '1',
      teacherName: 'Dr. Sarah Johnson',
      units: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateCourses([...courses, newCourse]);
    setShowAddCourse(false);
  };

  const handleAddUnit = (courseId: string, unitName: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const newUnit: Unit = {
          id: `unit-${Date.now()}`,
          name: unitName,
          topics: [],
        };
        return { ...course, units: [...course.units, newUnit] };
      }
      return course;
    });
    onUpdateCourses(updatedCourses);
    setShowAddUnit(null);
  };

  const handleAddTopic = (courseId: string, unitId: string, topicData: Partial<Topic>) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const updatedUnits = course.units.map(unit => {
          if (unit.id === unitId) {
            const newTopic: Topic = {
              id: `topic-${Date.now()}`,
              name: topicData.name!,
              estimatedTime: topicData.estimatedTime!,
              status: 'planned',
            };
            return { ...unit, topics: [...unit.topics, newTopic] };
          }
          return unit;
        });
        return { ...course, units: updatedUnits };
      }
      return course;
    });
    onUpdateCourses(updatedCourses);
    setShowAddTopic(null);
  };

  const handleDeleteTopic = (courseId: string, unitId: string, topicId: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const updatedUnits = course.units.map(unit => {
          if (unit.id === unitId) {
            return { ...unit, topics: unit.topics.filter(t => t.id !== topicId) };
          }
          return unit;
        });
        return { ...course, units: updatedUnits };
      }
      return course;
    });
    onUpdateCourses(updatedCourses);
  };

  // Scripting management
  const handleOpenScripting = (courseId: string, unitId: string, topicId: string, topic: Topic) => {
    setScriptingTopic({ courseId, unitId, topicId, topic });
  };

  const handleScriptingSubmit = (data: {
    estimatedTime: number;
    pptUrl: string;
    contentMaterialsUrl: string[];
    editorComments: string;
  }) => {
    if (!scriptingTopic) return;

    const updatedCourses = courses.map(course => {
      if (course.id === scriptingTopic.courseId) {
        const updatedUnits = course.units.map(unit => {
          if (unit.id === scriptingTopic.unitId) {
            const updatedTopics = unit.topics.map(topic => {
              if (topic.id === scriptingTopic.topicId) {
                return {
                  ...topic,
                  status: 'scripting' as ContentStatus,
                  estimatedTime: data.estimatedTime,
                  pptUrl: data.pptUrl,
                  contentMaterialsUrl: data.contentMaterialsUrl,
                  editorComments: data.editorComments,
                };
              }
              return topic;
            });
            return { ...unit, topics: updatedTopics };
          }
          return unit;
        });
        return { ...course, units: updatedUnits };
      }
      return course;
    });

    onUpdateCourses(updatedCourses);
    setScriptingTopic(null);
  };

  // Review management
  const handleOpenReview = (courseId: string, unitId: string, topicId: string, topic: Topic) => {
    setReviewTopic({ courseId, unitId, topicId, topic });
    setTeacherNotes('');
  };

  const handleReviewAction = (approved: boolean) => {
    if (!reviewTopic) return;

    const updatedCourses = courses.map(course => {
      if (course.id === reviewTopic.courseId) {
        const updatedUnits = course.units.map(unit => {
          if (unit.id === reviewTopic.unitId) {
            const updatedTopics = unit.topics.map(topic => {
              if (topic.id === reviewTopic.topicId) {
                return {
                  ...topic,
                  status: approved ? ('approved' as ContentStatus) : ('uploaded' as ContentStatus),
                  reviewedBy: 'Dr. Sarah Johnson',
                  teacherNotes: teacherNotes,
                };
              }
              return topic;
            });
            return { ...unit, topics: updatedTopics };
          }
          return unit;
        });
        return { ...course, units: updatedUnits };
      }
      return course;
    });

    onUpdateCourses(updatedCourses);
    setReviewTopic(null);
    setTeacherNotes('');
  };

  const markAsUnderReview = (courseId: string, unitId: string, topicId: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const updatedUnits = course.units.map(unit => {
          if (unit.id === unitId) {
            const updatedTopics = unit.topics.map(topic => {
              if (topic.id === topicId && topic.status === 'uploaded') {
                return {
                  ...topic,
                  status: 'under_review' as ContentStatus,
                };
              }
              return topic;
            });
            return { ...unit, topics: updatedTopics };
          }
          return unit;
        });
        return { ...course, units: updatedUnits };
      }
      return course;
    });
    onUpdateCourses(updatedCourses);
  };

  return (
    <TeacherLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {currentPage === 'dashboard' && (
        <TeacherDashboardHome
          courses={courses}
          onNavigate={handleNavigate}
          onReviewTopic={(courseId, unitId, topicId, topic) => handleOpenReview(courseId, unitId, topicId, topic)}
        />
      )}

      {currentPage === 'courses' && (
        <TeacherCoursesPage
          courses={courses}
          selectedDepartment={selectedDepartment}
          selectedProgram={selectedProgram}
          onDepartmentChange={setSelectedDepartment}
          onProgramChange={setSelectedProgram}
          onAddCourse={() => setShowAddCourse(true)}
          onViewCourse={handleViewCourse}
        />
      )}

      {currentPage === 'course-detail' && selectedCourse && (
        <TeacherCourseDetail
          course={selectedCourse}
          onBack={() => {
            if (selectedDegreeId) {
              setSelectedCourseId(null);
            } else {
              handleNavigate('courses');
            }
          }}
          onAddUnit={() => setShowAddUnit(selectedCourse.id)}
          onAddTopic={(unitId) => setShowAddTopic({ courseId: selectedCourse.id, unitId })}
          onDeleteTopic={(unitId, topicId) => handleDeleteTopic(selectedCourse.id, unitId, topicId)}
          onStartScripting={(unitId, topicId, topic) => handleOpenScripting(selectedCourse.id, unitId, topicId, topic)}
          onReviewTopic={(unitId, topicId, topic) => handleOpenReview(selectedCourse.id, unitId, topicId, topic)}
          onMarkUnderReview={(unitId, topicId) => markAsUnderReview(selectedCourse.id, unitId, topicId)}
        />
      )}

      {currentPage === 'degrees' && !selectedDegreeId && !selectedCourseId && (
        <DegreesPage
          courses={courses}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          onViewDegree={handleViewDegree}
        />
      )}

      {currentPage === 'degrees' && selectedDegreeId && selectedDegree && !selectedCourseId && (
        <DegreeDetailPage
          degree={selectedDegree}
          courses={courses}
          onBack={() => setSelectedDegreeId(null)}
          onViewCourse={handleViewCourseFromDegree}
        />
      )}

      {currentPage === 'degrees' && selectedCourseId && selectedCourse && (
        <TeacherCourseDetail
          course={selectedCourse}
          onBack={() => setSelectedCourseId(null)}
          onAddUnit={() => setShowAddUnit(selectedCourse.id)}
          onAddTopic={(unitId) => setShowAddTopic({ courseId: selectedCourse.id, unitId })}
          onDeleteTopic={(unitId, topicId) => handleDeleteTopic(selectedCourse.id, unitId, topicId)}
          onStartScripting={(unitId, topicId, topic) => handleOpenScripting(selectedCourse.id, unitId, topicId, topic)}
          onReviewTopic={(unitId, topicId, topic) => handleOpenReview(selectedCourse.id, unitId, topicId, topic)}
          onMarkUnderReview={(unitId, topicId) => markAsUnderReview(selectedCourse.id, unitId, topicId)}
        />
      )}

      {/* Dialogs */}
      <AddCourseDialog 
        open={showAddCourse} 
        onOpenChange={setShowAddCourse}
        onAdd={handleAddCourse}
      />
      
      {showAddUnit && (
        <AddUnitDialog 
          open={true}
          onOpenChange={() => setShowAddUnit(null)}
          onAdd={(unitName) => handleAddUnit(showAddUnit, unitName)}
        />
      )}

      {showAddTopic && (
        <AddTopicDialog 
          open={true}
          onOpenChange={() => setShowAddTopic(null)}
          onAdd={(topicData) => handleAddTopic(showAddTopic.courseId, showAddTopic.unitId, topicData)}
        />
      )}

      {scriptingTopic && (
        <ScriptingDialog 
          open={true}
          onOpenChange={() => setScriptingTopic(null)}
          topic={scriptingTopic.topic}
          onSubmit={handleScriptingSubmit}
        />
      )}

      {/* Review Dialog */}
      {reviewTopic && (
        <Dialog open={true} onOpenChange={() => setReviewTopic(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Video: {reviewTopic.topic.name}</DialogTitle>
              <DialogDescription>
                Watch the video and provide feedback to the editor
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Mock Video Player */}
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <Eye className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Video Player (Mock)</p>
                  <p className="text-xs opacity-50 mt-1">{reviewTopic.topic.videoUrl}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2">{reviewTopic.topic.estimatedTime} minutes</span>
                </div>
                <div>
                  <span className="text-gray-600">Uploaded by:</span>
                  <span className="ml-2">{reviewTopic.topic.uploadedBy}</span>
                </div>
              </div>

              {reviewTopic.topic.editorComments && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Label className="text-sm">Editor's Notes:</Label>
                  <p className="text-sm mt-1">{reviewTopic.topic.editorComments}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="teacher-notes">Feedback for Editor</Label>
                <Textarea 
                  id="teacher-notes"
                  placeholder="Provide feedback or approval notes..."
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setReviewTopic(null)}>
                Cancel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleReviewAction(false)}
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Request Changes
              </Button>
              <Button onClick={() => handleReviewAction(true)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </TeacherLayout>
  );
}
