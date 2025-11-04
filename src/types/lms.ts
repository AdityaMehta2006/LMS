// Type definitions for the LMS

export type ContentStatus = 'planned' | 'scripting' | 'recording' | 'editing' | 'uploaded' | 'under_review' | 'approved' | 'finalized';

export interface Topic {
  id: string;
  name: string;
  estimatedTime: number; // in minutes
  status: ContentStatus;
  videoUrl?: string;
  pptUrl?: string;
  contentMaterialsUrl?: string[];
  uploadedBy?: string;
  reviewedBy?: string;
  teacherNotes?: string;
  editorComments?: string;
}

export interface Unit {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Course {
  id: string;
  name: string;
  code?: string;
  department: string;
  program: string;
  teacherId: string;
  teacherName: string;
  units: Unit[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'teacher' | 'editor' | 'admin';
  department?: string;
  createdAt: string;
}

export type UserRole = 'teacher' | 'editor' | 'admin';
