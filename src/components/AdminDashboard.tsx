import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { AdminDashboardHome } from "./AdminDashboardHome";
import { AdminUserManagement } from "./AdminUserManagement";
import { AdminProgramManagement } from "./AdminProgramManagement";
import { AdminCoursesPage } from "./AdminCoursesPage";
import { AdminCourseDetailView } from "./AdminCourseDetailView";
import { AddUserDialog } from "./AddUserDialog";
import { AddProgramDialog } from "./AddProgramDialog";
import { Course, User } from "../types/lms";
import { Degree, mockDegrees, mockUsers } from "../lib/mockData";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";

interface AdminDashboardProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
}

export function AdminDashboard({ courses, onUpdateCourses }: AdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [degrees, setDegrees] = useState<Degree[]>(mockDegrees);
  
  // User management state
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // Program management state
  const [addProgramOpen, setAddProgramOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Degree | null>(null);
  const [programToDelete, setProgramToDelete] = useState<Degree | null>(null);
  
  // Course viewing state
  const [courseDepartmentFilter, setCourseDepartmentFilter] = useState('all');
  const [courseProgramFilter, setCourseProgramFilter] = useState('all');
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);

  // Filter users
  const getFilteredUsers = () => {
    let filtered = users;
    
    if (selectedRole !== 'all') {
      filtered = filtered.filter(u => u.role === selectedRole);
    }
    
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(u => u.department === selectedDepartment);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query) ||
        (u.department && u.department.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  // Filter courses
  const getFilteredCourses = () => {
    let filtered = courses;
    
    if (courseDepartmentFilter !== 'all') {
      filtered = filtered.filter(c => c.department === courseDepartmentFilter);
    }
    
    if (courseProgramFilter !== 'all') {
      filtered = filtered.filter(c => c.program === courseProgramFilter);
    }
    
    if (searchQuery && currentPage === 'courses') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.code?.toLowerCase().includes(query) ||
        c.department.toLowerCase().includes(query) ||
        c.program.toLowerCase().includes(query) ||
        c.teacherName.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  // User management handlers
  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
    setAddUserOpen(false);
    toast.success('User added successfully');
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
      setAddUserOpen(true);
    }
  };

  const handleUpdateUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...userData, id: editingUser.id, createdAt: editingUser.createdAt }
          : u
      ));
      setEditingUser(null);
      setAddUserOpen(false);
      toast.success('User updated successfully');
    }
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserToDelete(user);
    }
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
      toast.success('User deleted successfully');
    }
  };

  // Program management handlers
  const handleAddProgram = (programData: Omit<Degree, 'id' | 'totalCourses'>) => {
    const newProgram: Degree = {
      ...programData,
      id: `degree-${Date.now()}`,
      totalCourses: 0,
    };
    setDegrees([...degrees, newProgram]);
    setAddProgramOpen(false);
    toast.success('Program added successfully');
  };

  const handleEditProgram = (degreeId: string) => {
    const degree = degrees.find(d => d.id === degreeId);
    if (degree) {
      setEditingProgram(degree);
      setAddProgramOpen(true);
    }
  };

  const handleUpdateProgram = (programData: Omit<Degree, 'id' | 'totalCourses'>) => {
    if (editingProgram) {
      setDegrees(degrees.map(d => 
        d.id === editingProgram.id 
          ? { ...programData, id: editingProgram.id, totalCourses: editingProgram.totalCourses }
          : d
      ));
      setEditingProgram(null);
      setAddProgramOpen(false);
      toast.success('Program updated successfully');
    }
  };

  const handleDeleteProgram = (degreeId: string) => {
    const degree = degrees.find(d => d.id === degreeId);
    if (degree) {
      setProgramToDelete(degree);
    }
  };

  const confirmDeleteProgram = () => {
    if (programToDelete) {
      setDegrees(degrees.filter(d => d.id !== programToDelete.id));
      setProgramToDelete(null);
      toast.success('Program deleted successfully');
    }
  };

  // Course viewing handlers
  const handleViewCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setViewingCourse(course);
    }
  };

  // Render appropriate page
  const renderPage = () => {
    if (viewingCourse) {
      return (
        <AdminCourseDetailView 
          course={viewingCourse} 
          onBack={() => setViewingCourse(null)} 
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <AdminDashboardHome
            users={users}
            courses={courses}
            degrees={degrees}
            onNavigate={setCurrentPage}
          />
        );
      
      case 'users':
        return (
          <AdminUserManagement
            users={getFilteredUsers()}
            selectedRole={selectedRole}
            selectedDepartment={selectedDepartment}
            onRoleFilter={setSelectedRole}
            onDepartmentFilter={setSelectedDepartment}
            onAddUser={() => {
              setEditingUser(null);
              setAddUserOpen(true);
            }}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      
      case 'programs':
        return (
          <AdminProgramManagement
            degrees={degrees}
            courses={courses}
            onAddProgram={() => {
              setEditingProgram(null);
              setAddProgramOpen(true);
            }}
            onEditProgram={handleEditProgram}
            onDeleteProgram={handleDeleteProgram}
          />
        );
      
      case 'courses':
        return (
          <AdminCoursesPage
            courses={getFilteredCourses()}
            selectedDepartment={courseDepartmentFilter}
            selectedProgram={courseProgramFilter}
            onDepartmentChange={setCourseDepartmentFilter}
            onProgramChange={setCourseProgramFilter}
            onViewCourse={handleViewCourse}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <AdminLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        {renderPage()}
      </AdminLayout>

      {/* Add/Edit User Dialog */}
      <AddUserDialog
        open={addUserOpen}
        onOpenChange={(open) => {
          setAddUserOpen(open);
          if (!open) setEditingUser(null);
        }}
        onSubmit={editingUser ? handleUpdateUser : handleAddUser}
        editingUser={editingUser}
      />

      {/* Delete User Confirmation */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add/Edit Program Dialog */}
      <AddProgramDialog
        open={addProgramOpen}
        onOpenChange={(open) => {
          setAddProgramOpen(open);
          if (!open) setEditingProgram(null);
        }}
        onSubmit={editingProgram ? handleUpdateProgram : handleAddProgram}
        editingProgram={editingProgram}
      />

      {/* Delete Program Confirmation */}
      <AlertDialog open={!!programToDelete} onOpenChange={(open) => !open && setProgramToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {programToDelete?.name}? This will not delete associated courses, but they will no longer be linked to this program.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProgram} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
