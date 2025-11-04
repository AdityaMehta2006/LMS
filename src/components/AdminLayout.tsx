import { useState } from "react";
import { Menu, Search, LayoutDashboard, BookOpen, LogOut, GraduationCap, Users, Settings } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function AdminLayout({ children, currentPage, onNavigate, searchQuery, onSearchChange }: AdminLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'programs', label: 'Programs', icon: GraduationCap },
    { id: 'courses', label: 'Courses', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger Menu */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuOpen(true)}
              className="p-2"
            >
              <Menu className="w-6 h-6" />
            </Button>

            {/* Center: Admin Badge */}
            <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
              <Settings className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-600">Admin Portal</span>
            </div>

            {/* Right: Search Bar */}
            <div className="flex-1 max-w-md ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search users, courses, programs..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Admin Portal</SheetTitle>
            <SheetDescription>System administration and management</SheetDescription>
          </SheetHeader>
          <div className="mt-8 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onNavigate(item.id);
                    setMenuOpen(false);
                  }}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
            <div className="pt-4 mt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
