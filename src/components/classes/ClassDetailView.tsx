
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from '@/components/ui/DataTable';
import { ChartBar, Users, Clock } from 'lucide-react';
import { Class, Student } from '@/types';
import { cn } from '@/lib/utils';

interface ClassDetailViewProps {
  classData: Class;
}

interface StudentData {
  id: string;
  name: string;
  gender: 'F' | 'M';
  academicAverage: number;
  attendancePercentage: number;
  rollNumber: string;
}

// Mock student data - replace with actual data in production
const mockStudents: StudentData[] = Array.from({ length: 20 }, (_, i) => ({
  id: `STU${i + 1}`,
  name: `${i % 2 === 0 ? 'Sarah Wilson' : 'John Smith'} ${i + 1}`,
  gender: i % 2 === 0 ? 'F' : 'M',
  academicAverage: 75 + Math.random() * 20,
  attendancePercentage: 80 + Math.random() * 15,
  rollNumber: `${2024}${i + 1}`.padStart(8, '0'),
}));

const ClassDetailView: React.FC<ClassDetailViewProps> = ({ classData }) => {
  const sortedStudents = [...mockStudents].sort((a, b) => {
    // Sort by gender (F first) then by name
    if (a.gender !== b.gender) {
      return a.gender === 'F' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const studentColumns = [
    {
      accessor: 'rollNumber' as keyof StudentData,
      header: 'Roll No.',
      cell: (row: StudentData) => (
        <div className="font-mono text-sm">{row.rollNumber}</div>
      ),
    },
    {
      accessor: 'name' as keyof StudentData,
      header: 'Student Name',
      cell: (row: StudentData) => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            row.gender === 'F' ? "bg-pink-400" : "bg-blue-400"
          )} />
          {row.name}
        </div>
      ),
    },
    {
      accessor: 'academicAverage' as keyof StudentData,
      header: 'Academic Average',
      cell: (row: StudentData) => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "px-2 py-1 rounded text-xs font-medium",
            row.academicAverage >= 90 ? "bg-green-100 text-green-700" :
            row.academicAverage >= 75 ? "bg-blue-100 text-blue-700" :
            "bg-yellow-100 text-yellow-700"
          )}>
            {row.academicAverage.toFixed(1)}%
          </div>
        </div>
      ),
    },
    {
      accessor: 'attendancePercentage' as keyof StudentData,
      header: 'Attendance',
      cell: (row: StudentData) => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "px-2 py-1 rounded text-xs font-medium",
            row.attendancePercentage >= 90 ? "bg-green-100 text-green-700" :
            row.attendancePercentage >= 75 ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700"
          )}>
            {row.attendancePercentage.toFixed(1)}%
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold">{classData.name}</h2>
        <p className="text-muted-foreground">
          Room {classData.room} • {classData.totalStudents} Students
        </p>
      </div>

      <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.subjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                data={sortedStudents}
                columns={studentColumns}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetable">
          <Card>
            <CardContent className="pt-6">
              {/* Timetable view will be implemented in the next iteration */}
              <div className="text-center text-muted-foreground">
                Timetable view coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardContent className="pt-6">
              {/* Performance metrics will be implemented in the next iteration */}
              <div className="text-center text-muted-foreground">
                Performance metrics coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassDetailView;
