import { useState } from "react";
import { Course, ContentStatus } from "../types/lms";
import { EditorLayout } from "./EditorLayout";
import { EditorDashboardHome } from "./EditorDashboardHome";
import { EditorCoursesPage } from "./EditorCoursesPage";
import { EditorCourseDetail } from "./EditorCourseDetail";
import { DegreesPage } from "./DegreesPage";
import { DegreeDetailPage } from "./DegreeDetailPage";
import { mockDegrees } from "../lib/mockData";

interface EditorDashboardProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
}

export function EditorDashboard({ courses, onUpdateCourses }: EditorDashboardProps) {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedDegreeId, setSelectedDegreeId] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page !== 'degree-detail') {
      setSelectedDegreeId(null);
    }
  };

  const handleViewDegree = (degreeId: string) => {
    setSelectedDegreeId(degreeId);
  };

  const handleViewCourseFromDegree = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedDegreeId(null);
  };

  const updateTopicStatus = (
    courseId: string, 
    unitId: string, 
    topicId: string, 
    newStatus: ContentStatus, 
    additionalData?: any
  ) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const updatedUnits = course.units.map(unit => {
          if (unit.id === unitId) {
            const updatedTopics = unit.topics.map(topic => {
              if (topic.id === topicId) {
                return {
                  ...topic,
                  status: newStatus,
                  uploadedBy: 'Editor Name',
                  ...additionalData,
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

  const handleStartRecording = (unitId: string, topicId: string) => {
    if (!selectedCourseId) return;
    updateTopicStatus(selectedCourseId, unitId, topicId, 'recording');
  };

  const handleMoveToEditing = (unitId: string, topicId: string) => {
    if (!selectedCourseId) return;
    updateTopicStatus(selectedCourseId, unitId, topicId, 'editing');
  };

  const handleUpload = (unitId: string, topicId: string, notes: string) => {
    if (!selectedCourseId) return;
    updateTopicStatus(
      selectedCourseId, 
      unitId, 
      topicId, 
      'uploaded', 
      {
        videoUrl: `video-${topicId}.mp4`,
        editorComments: notes,
      }
    );
  };

  const handleFinalize = (unitId: string, topicId: string, notes: string) => {
    if (!selectedCourseId) return;
    updateTopicStatus(
      selectedCourseId, 
      unitId, 
      topicId, 
      'finalized',
      {
        editorNotes: notes,
      }
    );
  };

  const handleStartRecordingFromHome = (courseId: string, unitId: string, topicId: string) => {
    updateTopicStatus(courseId, unitId, topicId, 'recording');
  };

  const selectedCourse = selectedCourseId ? courses.find(c => c.id === selectedCourseId) : null;
  const selectedDegree = selectedDegreeId ? mockDegrees.find(d => d.id === selectedDegreeId) : null;

  return (
    <EditorLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {currentPage === 'dashboard' && (
        <EditorDashboardHome
          courses={courses}
          onNavigate={handleNavigate}
          onStartRecording={handleStartRecordingFromHome}
        />
      )}

      {currentPage === 'courses' && !selectedCourseId && (
        <EditorCoursesPage
          courses={courses}
          selectedDepartment={selectedDepartment}
          selectedProgram={selectedProgram}
          onDepartmentChange={setSelectedDepartment}
          onProgramChange={setSelectedProgram}
          onViewCourse={(courseId) => {
            setSelectedCourseId(courseId);
          }}
        />
      )}

      {currentPage === 'courses' && selectedCourseId && selectedCourse && (
        <EditorCourseDetail
          course={selectedCourse}
          onBack={() => setSelectedCourseId(null)}
          onStartRecording={handleStartRecording}
          onMoveToEditing={handleMoveToEditing}
          onUpload={handleUpload}
          onFinalize={handleFinalize}
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
        <EditorCourseDetail
          course={selectedCourse}
          onBack={() => setSelectedCourseId(null)}
          onStartRecording={handleStartRecording}
          onMoveToEditing={handleMoveToEditing}
          onUpload={handleUpload}
          onFinalize={handleFinalize}
        />
      )}
    </EditorLayout>
  );
}
