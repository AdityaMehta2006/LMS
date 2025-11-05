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
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-white border-b border-border/50 sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger Menu */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuOpen(true)}
              className="p-2 hover:bg-emerald-50"
            >
              <Menu className="w-6 h-6" />
            </Button>

            {/* Center: Admin Badge */}
            <div className="flex items-center gap-2.5 absolute left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-full border border-emerald-200">
              <Settings className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-emerald-700">Admin Portal</span>
            </div>

            {/* Right: Search Bar */}
            <div className="flex-1 max-w-md ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users, courses, programs..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 border-border/60 hover:border-emerald-300 focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader className="pb-6 border-b border-border/50">
            <SheetTitle className="text-xl">Admin Portal</SheetTitle>
            <SheetDescription>System administration and management</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-11 ${
                    isActive 
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm' 
                      : 'hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                  onClick={() => {
                    onNavigate(item.id);
                    setMenuOpen(false);
                  }}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              );
            })}
            <div className="pt-6 mt-6 border-t border-border/50">
              <Button
                variant="ghost"
                className="w-full justify-start h-11 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
