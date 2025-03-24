
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Clock, ChartBar, Plus, Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DataTable from '@/components/ui/DataTable';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
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
  maxStrength: 50,
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
  performanceMetrics: {
    averageAttendance: 85 + (Math.random() * 10),
    averageAcademics: 70 + (Math.random() * 20),
    passPercentage: 90 + (Math.random() * 10)
  }
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
  const { toast } = useToast();
  
  // State for editing
  const [isMaxStrengthDialogOpen, setIsMaxStrengthDialogOpen] = useState(false);
  const [isRollNumberDialogOpen, setIsRollNumberDialogOpen] = useState(false);
  const [isEditStudentDialogOpen, setIsEditStudentDialogOpen] = useState(false);
  const [students, setStudents] = useState<StudentData[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [maxStrength, setMaxStrength] = useState<number>(0);
  const [rollNumberPrefix, setRollNumberPrefix] = useState("2024");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  // Find the class by id
  const [classData, setClassData] = useState<Class | undefined>(
    mockClasses.find(c => c.id === id)
  );
  
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

  // Set initial max strength
  React.useEffect(() => {
    if (classData) {
      setMaxStrength(classData.maxStrength);
    }
  }, [classData]);
  
  const sortedStudents = [...students].sort((a, b) => {
    // Sort by gender (F first) then by name
    if (a.gender !== b.gender) {
      return a.gender === 'F' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const handleEditStudent = (student: StudentData) => {
    setSelectedStudent(student);
    setIsEditStudentDialogOpen(true);
  };

  const handleSaveStudent = (updatedStudent: StudentData) => {
    const updatedStudents = students.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    );
    setStudents(updatedStudents);
    setIsEditStudentDialogOpen(false);
    toast({
      title: "Student Updated",
      description: `${updatedStudent.name}'s information has been updated.`,
    });
  };

  const handleAddStudent = () => {
    const newStudent: StudentData = {
      id: `STU${students.length + 1}`,
      name: "New Student",
      gender: "M",
      academicAverage: 75,
      attendancePercentage: 80,
      rollNumber: `${rollNumberPrefix}${(students.length + 1).toString().padStart(4, '0')}`,
    };
    setSelectedStudent(newStudent);
    setIsEditStudentDialogOpen(true);
  };

  const handleSaveMaxStrength = () => {
    setClassData({
      ...classData,
      maxStrength
    });
    setIsMaxStrengthDialogOpen(false);
    toast({
      title: "Maximum Strength Updated",
      description: `Maximum strength for ${classData.name} has been set to ${maxStrength}.`,
    });
  };

  const handleRegenerateRollNumbers = () => {
    const newStudents = students.map((student, index) => ({
      ...student,
      rollNumber: `${rollNumberPrefix}${(index + 1).toString().padStart(4, '0')}`
    }));
    setStudents(newStudents);
    setIsRollNumberDialogOpen(false);
    toast({
      title: "Roll Numbers Updated",
      description: `Roll numbers have been updated with prefix ${rollNumberPrefix}.`,
    });
  };

  const handleDeleteStudent = () => {
    if (!selectedStudent) return;
    
    const updatedStudents = students.filter(student => student.id !== selectedStudent.id);
    setStudents(updatedStudents);
    setIsConfirmDeleteOpen(false);
    setSelectedStudent(null);
    
    // Update class data
    setClassData({
      ...classData,
      totalStudents: updatedStudents.length
    });
    
    toast({
      title: "Student Removed",
      description: `${selectedStudent.name} has been removed from the class.`,
    });
  };

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
    {
      accessor: 'id' as keyof StudentData,
      header: 'Actions',
      cell: (row: StudentData) => (
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.stopPropagation();
          handleEditStudent(row);
        }}>
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
      ),
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
                    <p className="text-sm text-muted-foreground mb-1">Students</p>
                    <p className="font-medium flex items-center gap-2">
                      {classData.totalStudents} 
                      <span className="text-muted-foreground">/ {classData.maxStrength}</span>
                      <Button variant="ghost" size="sm" onClick={() => setIsMaxStrengthDialogOpen(true)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classData.performanceMetrics?.averageAttendance.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Average attendance rate</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Academic Average</CardTitle>
              <ChartBar className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classData.performanceMetrics?.averageAcademics.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Average academic performance</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Percentage</CardTitle>
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classData.performanceMetrics?.passPercentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Overall pass rate</p>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Student List</CardTitle>
                <CardDescription>
                  {students.length} students enrolled out of {classData.maxStrength} maximum strength
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsRollNumberDialogOpen(true)}>
                  Regenerate Roll Numbers
                </Button>
                <Button size="sm" onClick={handleAddStudent}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Student
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={sortedStudents}
                columns={studentColumns}
                className="w-full"
                onRowClick={(row) => handleEditStudent(row as StudentData)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Academic Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Average Score</span>
                          <span className="text-sm font-medium">{classData.performanceMetrics?.averageAcademics.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${classData.performanceMetrics?.averageAcademics || 0}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Pass Rate</span>
                          <span className="text-sm font-medium">{classData.performanceMetrics?.passPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${classData.performanceMetrics?.passPercentage || 0}%` }}></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <Card className="p-3">
                          <p className="text-xs text-muted-foreground">Excellent</p>
                          <p className="text-lg font-bold">{Math.round(students.filter(s => s.academicAverage >= 90).length / students.length * 100)}%</p>
                        </Card>
                        <Card className="p-3">
                          <p className="text-xs text-muted-foreground">Average</p>
                          <p className="text-lg font-bold">{Math.round(students.filter(s => s.academicAverage >= 75 && s.academicAverage < 90).length / students.length * 100)}%</p>
                        </Card>
                        <Card className="p-3">
                          <p className="text-xs text-muted-foreground">Need Help</p>
                          <p className="text-lg font-bold">{Math.round(students.filter(s => s.academicAverage < 75).length / students.length * 100)}%</p>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Attendance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Average Attendance</span>
                          <span className="text-sm font-medium">{classData.performanceMetrics?.averageAttendance.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${classData.performanceMetrics?.averageAttendance || 0}%` }}></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <Card className="p-3">
                          <p className="text-xs text-muted-foreground">Regular (>90%)</p>
                          <p className="text-lg font-bold">{Math.round(students.filter(s => s.attendancePercentage >= 90).length / students.length * 100)}%</p>
                        </Card>
                        <Card className="p-3">
                          <p className="text-xs text-muted-foreground">Irregular</p>
                          <p className="text-lg font-bold">{Math.round(students.filter(s => s.attendancePercentage >= 75 && s.attendancePercentage < 90).length / students.length * 100)}%</p>
                        </Card>
                        <Card className="p-3">
                          <p className="text-xs text-muted-foreground">Critical</p>
                          <p className="text-lg font-bold">{Math.round(students.filter(s => s.attendancePercentage < 75).length / students.length * 100)}%</p>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Max Strength Dialog */}
      <Dialog open={isMaxStrengthDialogOpen} onOpenChange={setIsMaxStrengthDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Maximum Class Strength</DialogTitle>
            <DialogDescription>
              Set the maximum number of students allowed in this class.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="maxStrength">Maximum Strength</Label>
              <Input
                id="maxStrength"
                type="number"
                value={maxStrength}
                onChange={(e) => setMaxStrength(Number(e.target.value))}
                min={classData.totalStudents}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMaxStrengthDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMaxStrength}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Roll Number Dialog */}
      <Dialog open={isRollNumberDialogOpen} onOpenChange={setIsRollNumberDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Regenerate Roll Numbers</DialogTitle>
            <DialogDescription>
              This will update all student roll numbers with the specified prefix.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="rollNumberPrefix">Roll Number Prefix</Label>
              <Input
                id="rollNumberPrefix"
                value={rollNumberPrefix}
                onChange={(e) => setRollNumberPrefix(e.target.value)}
                placeholder="e.g. 2024"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Preview: {rollNumberPrefix}0001, {rollNumberPrefix}0002, etc.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRollNumberDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegenerateRollNumbers}>Regenerate Roll Numbers</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      {selectedStudent && (
        <Dialog open={isEditStudentDialogOpen} onOpenChange={(open) => {
          setIsEditStudentDialogOpen(open);
          if (!open) setSelectedStudent(null);
        }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedStudent.id.includes("STU") ? "Edit Student" : "Add New Student"}</DialogTitle>
              <DialogDescription>
                Update student information and details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Student Name</Label>
                  <Input
                    id="name"
                    value={selectedStudent.name}
                    onChange={(e) => setSelectedStudent({...selectedStudent, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={selectedStudent.gender}
                    onChange={(e) => setSelectedStudent({...selectedStudent, gender: e.target.value as 'M' | 'F'})}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    value={selectedStudent.rollNumber}
                    onChange={(e) => setSelectedStudent({...selectedStudent, rollNumber: e.target.value})}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="academicAverage">Academic Average (%)</Label>
                  <Input
                    id="academicAverage"
                    type="number"
                    min="0"
                    max="100"
                    value={selectedStudent.academicAverage}
                    onChange={(e) => setSelectedStudent({...selectedStudent, academicAverage: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="attendancePercentage">Attendance Percentage (%)</Label>
                <Input
                  id="attendancePercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={selectedStudent.attendancePercentage}
                  onChange={(e) => setSelectedStudent({...selectedStudent, attendancePercentage: Number(e.target.value)})}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <div>
                {selectedStudent.id.includes("STU") && (
                  <Button variant="destructive" onClick={() => {
                    setIsConfirmDeleteOpen(true);
                  }}>
                    Delete Student
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setIsEditStudentDialogOpen(false);
                  setSelectedStudent(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (selectedStudent.id.includes("STU")) {
                    handleSaveStudent(selectedStudent);
                  } else {
                    const newStudent = {
                      ...selectedStudent,
                      id: `STU${students.length + 1}`
                    };
                    setStudents([...students, newStudent]);
                    setIsEditStudentDialogOpen(false);
                    setSelectedStudent(null);
                    
                    // Update class data
                    setClassData({
                      ...classData,
                      totalStudents: students.length + 1
                    });
                    
                    toast({
                      title: "Student Added",
                      description: `${newStudent.name} has been added to the class.`,
                    });
                  }
                }}>
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirm Delete Student Dialog */}
      <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {selectedStudent?.name} from this class. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClassDetail;
