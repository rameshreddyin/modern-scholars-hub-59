
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Clock, ChartBar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DataTable from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';
import { Class } from '@/types';

interface StudentData {
  id: string;
  name: string;
  gender: 'F' | 'M';
  academicAverage: number;
  attendancePercentage: number;
  rollNumber: string;
}

// Mock class data - this would be fetched from an API in a real application
const mockClasses: Class[] = Array.from({ length: 9 }, (_, i) => ({
  id: `C${100 + i}`,
  name: `Class ${9 + Math.floor(i / 3)} ${['A', 'B', 'C'][i % 3]}`,
  standard: `${9 + Math.floor(i / 3)}`,
  section: ['A', 'B', 'C'][i % 3],
  classTeacher: ['Dr. Rajesh Kumar', 'Mrs. Priya Sharma', 'Mr. Amit Singh', 'Dr. Neha Gupta', 'Mr. Vikram Mehta', 'Mrs. Anjali Verma', 'Mr. Sanjay Patel', 'Dr. Pooja Reddy'][i % 8],
  totalStudents: 30 + (i % 15),
  subjects: [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 
    'Social Studies', 'Computer Science', 'Physical Education'
  ].slice(0, 6 + (i % 3)),
  schedule: [
    {
      day: 'Monday',
      periods: [
        { number: 1, subject: 'Mathematics', teacher: 'Dr. Neha Gupta', startTime: '08:00', endTime: '08:45' },
        { number: 2, subject: 'English', teacher: 'Mrs. Priya Sharma', startTime: '08:45', endTime: '09:30' },
        { number: 3, subject: 'Physics', teacher: 'Mr. Amit Singh', startTime: '09:45', endTime: '10:30' },
        { number: 4, subject: 'Chemistry', teacher: 'Mr. Vikram Mehta', startTime: '10:30', endTime: '11:15' },
        { number: 5, subject: 'Hindi', teacher: 'Mrs. Anjali Verma', startTime: '11:30', endTime: '12:15' },
        { number: 6, subject: 'Social Studies', teacher: 'Dr. Pooja Reddy', startTime: '12:15', endTime: '13:00' },
      ]
    },
    {
      day: 'Tuesday',
      periods: [
        { number: 1, subject: 'Physics', teacher: 'Mr. Amit Singh', startTime: '08:00', endTime: '08:45' },
        { number: 2, subject: 'Mathematics', teacher: 'Dr. Neha Gupta', startTime: '08:45', endTime: '09:30' },
        { number: 3, subject: 'English', teacher: 'Mrs. Priya Sharma', startTime: '09:45', endTime: '10:30' },
        { number: 4, subject: 'Hindi', teacher: 'Mrs. Anjali Verma', startTime: '10:30', endTime: '11:15' },
        { number: 5, subject: 'Chemistry', teacher: 'Mr. Vikram Mehta', startTime: '11:30', endTime: '12:15' },
        { number: 6, subject: 'Computer Science', teacher: 'Mr. Sanjay Patel', startTime: '12:15', endTime: '13:00' },
      ]
    },
    {
      day: 'Wednesday',
      periods: [
        { number: 1, subject: 'Chemistry', teacher: 'Mr. Vikram Mehta', startTime: '08:00', endTime: '08:45' },
        { number: 2, subject: 'Physics', teacher: 'Mr. Amit Singh', startTime: '08:45', endTime: '09:30' },
        { number: 3, subject: 'Mathematics', teacher: 'Dr. Neha Gupta', startTime: '09:45', endTime: '10:30' },
        { number: 4, subject: 'English', teacher: 'Mrs. Priya Sharma', startTime: '10:30', endTime: '11:15' },
        { number: 5, subject: 'Social Studies', teacher: 'Dr. Pooja Reddy', startTime: '11:30', endTime: '12:15' },
        { number: 6, subject: 'Physical Education', teacher: 'Dr. Rajesh Kumar', startTime: '12:15', endTime: '13:00' },
      ]
    },
    {
      day: 'Thursday',
      periods: [
        { number: 1, subject: 'English', teacher: 'Mrs. Priya Sharma', startTime: '08:00', endTime: '08:45' },
        { number: 2, subject: 'Hindi', teacher: 'Mrs. Anjali Verma', startTime: '08:45', endTime: '09:30' },
        { number: 3, subject: 'Chemistry', teacher: 'Mr. Vikram Mehta', startTime: '09:45', endTime: '10:30' },
        { number: 4, subject: 'Physics', teacher: 'Mr. Amit Singh', startTime: '10:30', endTime: '11:15' },
        { number: 5, subject: 'Mathematics', teacher: 'Dr. Neha Gupta', startTime: '11:30', endTime: '12:15' },
        { number: 6, subject: 'Computer Science', teacher: 'Mr. Sanjay Patel', startTime: '12:15', endTime: '13:00' },
      ]
    },
    {
      day: 'Friday',
      periods: [
        { number: 1, subject: 'Hindi', teacher: 'Mrs. Anjali Verma', startTime: '08:00', endTime: '08:45' },
        { number: 2, subject: 'Social Studies', teacher: 'Dr. Pooja Reddy', startTime: '08:45', endTime: '09:30' },
        { number: 3, subject: 'English', teacher: 'Mrs. Priya Sharma', startTime: '09:45', endTime: '10:30' },
        { number: 4, subject: 'Mathematics', teacher: 'Dr. Neha Gupta', startTime: '10:30', endTime: '11:15' },
        { number: 5, subject: 'Physics', teacher: 'Mr. Amit Singh', startTime: '11:30', endTime: '12:15' },
        { number: 6, subject: 'Chemistry', teacher: 'Mr. Vikram Mehta', startTime: '12:15', endTime: '13:00' },
      ]
    },
    {
      day: 'Saturday',
      periods: [
        { number: 1, subject: 'Computer Science', teacher: 'Mr. Sanjay Patel', startTime: '08:00', endTime: '08:45' },
        { number: 2, subject: 'Physical Education', teacher: 'Dr. Rajesh Kumar', startTime: '08:45', endTime: '09:30' },
        { number: 3, subject: 'Mathematics', teacher: 'Dr. Neha Gupta', startTime: '09:45', endTime: '10:30' },
        { number: 4, subject: 'English', teacher: 'Mrs. Priya Sharma', startTime: '10:30', endTime: '11:15' },
      ]
    },
  ],
  room: `Room ${200 + i}`,
}));

// Mock student data
const mockStudents: StudentData[] = Array.from({ length: 20 }, (_, i) => ({
  id: `STU${i + 1}`,
  name: `${i % 2 === 0 ? 'Sarah Wilson' : 'John Smith'} ${i + 1}`,
  gender: i % 2 === 0 ? 'F' : 'M',
  academicAverage: 75 + Math.random() * 20,
  attendancePercentage: 80 + Math.random() * 15,
  rollNumber: `${2024}${i + 1}`.padStart(8, '0'),
}));

const ClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the class by id
  const classData = mockClasses.find(c => c.id === id);
  
  if (!classData) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Class not found</h2>
        <Button onClick={() => navigate('/classes')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Classes
        </Button>
      </div>
    );
  }
  
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
      sortable: true,
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
      sortable: true,
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
      sortable: true,
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
      sortable: true,
    },
  ];

  // Prepare timetable data
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const maxPeriods = Math.max(...classData.schedule.map(day => day.periods.length));

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate('/classes')} className="mr-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Classes
        </Button>
        <h1 className="text-3xl font-bold">{classData.name}</h1>
      </div>

      {/* Class Information Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Class Information</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Class Teacher</p>
                    <p className="font-medium">{classData.classTeacher}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Room</p>
                    <p className="font-medium">{classData.room}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                    <p className="font-medium">{classData.totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
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
      </section>

      {/* Tabs for different views */}
      <Tabs defaultValue="students" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student List</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={sortedStudents}
                columns={studentColumns}
                className="w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timetable Tab */}
        <TabsContent value="timetable">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Timetable</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-3 text-left font-medium text-sm border">Period</th>
                    {weekdays.map((day) => (
                      <th key={day} className="p-3 text-left font-medium text-sm border">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: maxPeriods }).map((_, periodIndex) => (
                    <tr key={periodIndex}>
                      <td className="p-3 border font-medium bg-muted/30">
                        Period {periodIndex + 1}
                      </td>
                      {weekdays.map((day) => {
                        const daySchedule = classData.schedule.find(s => s.day === day);
                        const period = daySchedule?.periods.find(p => p.number === periodIndex + 1);
                        return (
                          <td key={`${day}-${periodIndex}`} className="p-3 border">
                            {period ? (
                              <div>
                                <div className="font-medium">{period.subject}</div>
                                <div className="text-sm text-muted-foreground">{period.teacher}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {period.startTime} - {period.endTime}
                                </div>
                              </div>
                            ) : (
                              <div className="text-muted-foreground text-sm">No Class</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Class Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Performance metrics coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassDetail;
