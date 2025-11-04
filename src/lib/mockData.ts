import { Course, User } from '../types/lms';

export const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Dr. Sarah Johnson', 
    email: 'sarah.johnson@university.edu',
    password: 'teacher123',
    role: 'teacher', 
    department: 'Computer Science',
    createdAt: '2025-01-15'
  },
  { 
    id: '2', 
    name: 'Mike Editor', 
    email: 'mike.editor@university.edu',
    password: 'editor123',
    role: 'editor', 
    department: 'Computer Science',
    createdAt: '2025-02-01'
  },
  { 
    id: '3', 
    name: 'Admin Smith', 
    email: 'admin.smith@university.edu',
    password: 'admin123',
    role: 'admin', 
    department: 'Administration',
    createdAt: '2024-12-01'
  },
  { 
    id: '4', 
    name: 'Dr. John Doe', 
    email: 'john.doe@university.edu',
    password: 'teacher456',
    role: 'teacher', 
    department: 'Mathematics',
    createdAt: '2025-01-20'
  },
  { 
    id: '5', 
    name: 'Emma Editor', 
    email: 'emma.editor@university.edu',
    password: 'editor456',
    role: 'editor', 
    department: 'Business Administration',
    createdAt: '2025-02-15'
  },
  { 
    id: '6', 
    name: 'Dr. Michael Chen', 
    email: 'michael.chen@university.edu',
    password: 'teacher789',
    role: 'teacher', 
    department: 'Physics',
    createdAt: '2025-03-05'
  },
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    name: 'Basics of Programming',
    code: 'CS101',
    department: 'Computer Science',
    program: 'BCA',
    teacherId: '1',
    teacherName: 'Dr. Sarah Johnson',
    createdAt: '2025-09-01',
    updatedAt: '2025-10-20',
    units: [
      {
        id: 'unit-1',
        name: 'Introduction to Computing',
        topics: [
          {
            id: 'topic-1-1',
            name: 'What is a Computer?',
            estimatedTime: 45,
            status: 'finalized',
            videoUrl: 'video-url-1.mp4',
            pptUrl: 'ppt-url-1.pptx',
            contentMaterialsUrl: ['material-1.pdf', 'material-2.pdf'],
            uploadedBy: 'Mike Editor',
            reviewedBy: 'Dr. Sarah Johnson',
            editorComments: 'Reference slides 5-10 for main concepts',
          },
          {
            id: 'topic-1-2',
            name: 'Components of a Computer System',
            estimatedTime: 60,
            status: 'approved',
            videoUrl: 'video-url-2.mp4',
            pptUrl: 'ppt-url-2.pptx',
            contentMaterialsUrl: ['material-3.pdf'],
            uploadedBy: 'Mike Editor',
            reviewedBy: 'Dr. Sarah Johnson',
            teacherNotes: 'Great content! Ready for final polish.',
            editorComments: 'Focus on the hardware components diagram on slide 8',
          },
          {
            id: 'topic-1-3',
            name: 'Types of Software',
            estimatedTime: 50,
            status: 'under_review',
            videoUrl: 'video-url-3.mp4',
            pptUrl: 'ppt-url-3.pptx',
            uploadedBy: 'Mike Editor',
          },
          {
            id: 'topic-1-4',
            name: 'Introduction to Programming',
            estimatedTime: 55,
            status: 'uploaded',
            videoUrl: 'video-url-4.mp4',
            pptUrl: 'ppt-url-4.pptx',
            uploadedBy: 'Mike Editor',
          },
          {
            id: 'topic-1-5',
            name: 'Programming Languages Overview',
            estimatedTime: 40,
            status: 'editing',
            pptUrl: 'ppt-url-5.pptx',
            contentMaterialsUrl: ['languages-comparison.pdf'],
            uploadedBy: 'Mike Editor',
          },
          {
            id: 'topic-1-6',
            name: 'History of Computing',
            estimatedTime: 35,
            status: 'scripting',
            pptUrl: 'ppt-url-6.pptx',
            contentMaterialsUrl: ['timeline.pdf', 'pioneers.pdf'],
            editorComments: 'Materials ready. Will start recording this week.',
          },
        ],
      },
      {
        id: 'unit-2',
        name: 'Programming Fundamentals',
        topics: [
          {
            id: 'topic-2-1',
            name: 'Variables and Data Types',
            estimatedTime: 70,
            status: 'recording',
            pptUrl: 'ppt-url-7.pptx',
            contentMaterialsUrl: ['data-types-guide.pdf'],
            uploadedBy: 'Mike Editor',
            editorComments: 'Include code examples from the PDF',
          },
          {
            id: 'topic-2-2',
            name: 'Operators and Expressions',
            estimatedTime: 65,
            status: 'planned',
          },
          {
            id: 'topic-2-3',
            name: 'Control Structures',
            estimatedTime: 80,
            status: 'planned',
          },
        ],
      },
      {
        id: 'unit-3',
        name: 'Advanced Concepts',
        topics: [
          {
            id: 'topic-3-1',
            name: 'Functions and Procedures',
            estimatedTime: 75,
            status: 'planned',
          },
          {
            id: 'topic-3-2',
            name: 'Arrays and Strings',
            estimatedTime: 70,
            status: 'planned',
          },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    name: 'Data Structures',
    code: 'CS201',
    department: 'Computer Science',
    program: 'MCA',
    teacherId: '1',
    teacherName: 'Dr. Sarah Johnson',
    createdAt: '2025-09-15',
    updatedAt: '2025-10-18',
    units: [
      {
        id: 'unit-4',
        name: 'Introduction to Data Structures',
        topics: [
          {
            id: 'topic-4-1',
            name: 'What are Data Structures?',
            estimatedTime: 40,
            status: 'finalized',
            videoUrl: 'video-url-6.mp4',
            uploadedBy: 'Mike Editor',
            reviewedBy: 'Dr. Sarah Johnson',
          },
          {
            id: 'topic-4-2',
            name: 'Arrays and Linked Lists',
            estimatedTime: 90,
            status: 'approved',
            videoUrl: 'video-url-7.mp4',
            uploadedBy: 'Mike Editor',
            reviewedBy: 'Dr. Sarah Johnson',
          },
        ],
      },
      {
        id: 'unit-5',
        name: 'Stack and Queue',
        topics: [
          {
            id: 'topic-5-1',
            name: 'Stack Implementation',
            estimatedTime: 60,
            status: 'under_review',
            videoUrl: 'video-url-8.mp4',
            uploadedBy: 'Mike Editor',
          },
          {
            id: 'topic-5-2',
            name: 'Queue Implementation',
            estimatedTime: 60,
            status: 'planned',
          },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    name: 'Database Management Systems',
    code: 'CS102',
    department: 'Computer Science',
    program: 'BCA',
    teacherId: '1',
    teacherName: 'Dr. Sarah Johnson',
    createdAt: '2025-08-20',
    updatedAt: '2025-10-22',
    units: [
      {
        id: 'unit-6',
        name: 'Database Fundamentals',
        topics: [
          {
            id: 'topic-6-1',
            name: 'Introduction to Databases',
            estimatedTime: 45,
            status: 'finalized',
            videoUrl: 'video-url-9.mp4',
            uploadedBy: 'Mike Editor',
            reviewedBy: 'Dr. Sarah Johnson',
          },
          {
            id: 'topic-6-2',
            name: 'Relational Database Concepts',
            estimatedTime: 60,
            status: 'scripting',
            pptUrl: 'ppt-url-8.pptx',
          },
        ],
      },
    ],
  },
];

export const departments = ['Computer Science', 'Mathematics', 'Physics', 'Business Administration'];
export const programs = ['BCA', 'MCA', 'B.Tech', 'M.Tech', 'MBA', 'BBA', 'BSc'];

// Degree programs with their courses
export interface Degree {
  id: string;
  name: string;
  shortName: string;
  department: string;
  duration: string;
  totalCourses: number;
  description: string;
}

export const mockDegrees: Degree[] = [
  {
    id: 'degree-1',
    name: 'Bachelor of Computer Applications',
    shortName: 'BCA',
    department: 'Computer Science',
    duration: '3 Years',
    totalCourses: 2,
    description: 'A comprehensive program in computer applications and software development',
  },
  {
    id: 'degree-2',
    name: 'Master of Computer Applications',
    shortName: 'MCA',
    department: 'Computer Science',
    duration: '2 Years',
    totalCourses: 1,
    description: 'Advanced study in computer science and application development',
  },
  {
    id: 'degree-3',
    name: 'Bachelor of Business Administration',
    shortName: 'BBA',
    department: 'Business Administration',
    duration: '3 Years',
    totalCourses: 0,
    description: 'Comprehensive business management and administration program',
  },
  {
    id: 'degree-4',
    name: 'Master of Business Administration',
    shortName: 'MBA',
    department: 'Business Administration',
    duration: '2 Years',
    totalCourses: 0,
    description: 'Advanced business strategy and leadership program',
  },
  {
    id: 'degree-5',
    name: 'Bachelor of Science in Statistics',
    shortName: 'BSc Statistics',
    department: 'Mathematics',
    duration: '3 Years',
    totalCourses: 0,
    description: 'Statistical analysis and data science fundamentals',
  },
  {
    id: 'degree-6',
    name: 'Bachelor of Technology',
    shortName: 'B.Tech',
    department: 'Computer Science',
    duration: '4 Years',
    totalCourses: 0,
    description: 'Engineering and technology with specialization options',
  },
];
