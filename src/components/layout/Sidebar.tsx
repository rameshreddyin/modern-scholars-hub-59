
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  Settings, 
  Calendar, 
  BarChart, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Sidebar as SidebarRoot, 
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';

const Sidebar = () => {
  const { expanded } = useSidebar();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: GraduationCap, label: 'Students', path: '/students' },
    { icon: Users, label: 'Faculty', path: '/faculty' },
    { icon: BookOpen, label: 'Classes', path: '/classes' },
    { icon: ClipboardCheck, label: 'Attendance', path: '/attendance' },
    { icon: Calendar, label: 'Timetable', path: '/timetable' },
    { icon: BarChart, label: 'Reports', path: '/reports' },
    { icon: Bell, label: 'Announcements', path: '/announcements' },
  ];

  return (
    <SidebarRoot className="shadow-md">
      <SidebarHeader className="flex items-center justify-between py-4 px-2">
        <div className="flex items-center">
          {expanded ? (
            <div className="ml-2 flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <span className="font-semibold">SchoolSync</span>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <GraduationCap className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="hidden md:block">
          <SidebarTrigger>
            {expanded ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-4">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 mb-1 rounded-md transition-colors relative group",
              expanded ? "mx-2" : "mx-2 justify-center",
              isActive 
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5 shrink-0", expanded ? "" : "mx-auto")} />
            {expanded && <span>{item.label}</span>}
            {!expanded && (
              <div className="absolute left-full ml-2 rounded-md px-2 py-1 bg-popover text-popover-foreground shadow-md invisible opacity-0 translate-x-2 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="py-4">
        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative group",
            expanded ? "mx-2" : "mx-2 justify-center",
            isActive 
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )}
        >
          <Settings className={cn("h-5 w-5 shrink-0", expanded ? "" : "mx-auto")} />
          {expanded && <span>Settings</span>}
          {!expanded && (
            <div className="absolute left-full ml-2 rounded-md px-2 py-1 bg-popover text-popover-foreground shadow-md invisible opacity-0 translate-x-2 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap z-50">
              Settings
            </div>
          )}
        </NavLink>
      </SidebarFooter>
    </SidebarRoot>
  );
};

export default Sidebar;
