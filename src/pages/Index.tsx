
import React from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  ClipboardCheck,
  ArrowUpRight,
  TrendingUp,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import DashboardCard from '@/components/dashboard/DashboardCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { DashboardStats, RecentActivity as ActivityType } from '@/types';

// Mock data for demonstration
const mockStats: DashboardStats = {
  totalStudents: 1250,
  totalFaculty: 78,
  totalClasses: 35,
  averageAttendance: 92.7,
  maleStudents: 640,
  femaleStudents: 598,
  otherStudents: 12
};

const mockActivities: ActivityType[] = [
  {
    id: '1',
    type: 'enrollment',
    title: 'New Student Enrolled',
    description: 'Priya Sharma has been enrolled in Class 9A',
    date: 'Today',
    time: '09:45 AM'
  },
  {
    id: '2',
    type: 'attendance',
    title: 'Attendance Updated',
    description: 'Class 10B attendance marked for today',
    date: 'Today',
    time: '08:30 AM'
  },
  {
    id: '3',
    type: 'exam',
    title: 'Exam Results Published',
    description: 'Mid-term exam results for Class 8 published',
    date: 'Yesterday',
    time: '03:15 PM'
  },
  {
    id: '4',
    type: 'event',
    title: 'Annual Sports Meet',
    description: 'Annual sports meet scheduled for next week',
    date: 'Yesterday',
    time: '02:00 PM'
  },
  {
    id: '5',
    type: 'notice',
    title: 'Holiday Announcement',
    description: 'School will remain closed on 15th August for Independence Day',
    date: '2 days ago',
    time: '10:30 AM'
  },
];

// Helper function to get percentage difference for trend indicators
const getTrend = (current: number, previous: number) => {
  const diff = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(parseFloat(diff.toFixed(1))),
    isPositive: diff >= 0
  };
};

const Index = () => {
  return (
    <div className="animate-fade-in space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">School overview and key metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10">
            <CalendarDays className="mr-2 h-4 w-4" />
            July 2023
          </Button>
          <Button className="h-10">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={mockStats.totalStudents}
          icon={Users}
          description="Enrolled students"
          trend={getTrend(mockStats.totalStudents, 1180)}
        />
        <StatCard
          title="Faculty Members"
          value={mockStats.totalFaculty}
          icon={GraduationCap}
          description="Teaching & non-teaching"
          trend={getTrend(mockStats.totalFaculty, 72)}
        />
        <StatCard
          title="Total Classes"
          value={mockStats.totalClasses}
          icon={BookOpen}
          description="Active classes"
          trend={getTrend(mockStats.totalClasses, 35)}
        />
        <StatCard
          title="Attendance Rate"
          value={`${mockStats.averageAttendance}%`}
          icon={ClipboardCheck}
          description="Monthly average"
          trend={getTrend(mockStats.averageAttendance, 89.5)}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard className="md:col-span-2 lg:col-span-2">
          <h3 className="font-semibold mb-4">Student Demographics</h3>
          <div className="aspect-[2/1] p-4 flex flex-col justify-center items-center">
            <div className="relative w-full max-w-md h-60">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-2xl font-bold">{mockStats.totalStudents}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
              <div className="absolute inset-0">
                {/* This would be a chart in a real app */}
                <div className="flex h-full">
                  <div 
                    className="bg-blue-500 h-full rounded-l-lg flex items-center justify-center text-white font-medium"
                    style={{ width: `${(mockStats.maleStudents / mockStats.totalStudents) * 100}%` }}
                  >
                    {Math.round((mockStats.maleStudents / mockStats.totalStudents) * 100)}%
                  </div>
                  <div 
                    className="bg-pink-500 h-full flex items-center justify-center text-white font-medium"
                    style={{ width: `${(mockStats.femaleStudents / mockStats.totalStudents) * 100}%` }}
                  >
                    {Math.round((mockStats.femaleStudents / mockStats.totalStudents) * 100)}%
                  </div>
                  <div 
                    className="bg-purple-500 h-full rounded-r-lg flex items-center justify-center text-white font-medium"
                    style={{ width: `${(mockStats.otherStudents / mockStats.totalStudents) * 100}%` }}
                  >
                    {Math.round((mockStats.otherStudents / mockStats.totalStudents) * 100)}%
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Male ({mockStats.maleStudents})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-sm">Female ({mockStats.femaleStudents})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Other ({mockStats.otherStudents})</span>
              </div>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard className="md:col-span-2 lg:col-span-1 lg:row-span-2">
          <RecentActivity activities={mockActivities} />
        </DashboardCard>
        
        <DashboardCard className="md:col-span-2 lg:col-span-2">
          <h3 className="font-semibold mb-4">Attendance Trends</h3>
          <div className="aspect-[2/1] flex items-center justify-center">
            <div className="w-full h-full flex flex-col justify-center items-center">
              <TrendingUp className="h-32 w-32 text-muted-foreground/50" />
              <p className="text-muted-foreground mt-2">Attendance trends chart would go here</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Index;
