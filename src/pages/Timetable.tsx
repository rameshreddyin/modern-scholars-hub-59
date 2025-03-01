import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  AlertCircle, 
  FileText, 
  Clock, 
  Copy,
  Download,
  Printer,
  RefreshCcw,
  Edit,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  type WeekDay, 
  type Class, 
  type Faculty, 
  type Period, 
  type TeacherStatus,
  type SubjectAllocation,
  type ClassSubjectAllocation 
} from '@/types';

// Mock data
const mockClasses: Class[] = [
  {
    id: '1',
    name: 'Class 10A',
    standard: '10',
    section: 'A',
    classTeacher: 'Mrs. Priya Sharma',
    totalStudents: 35,
    subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer Science'],
    schedule: [
      {
        day: 'Monday',
        periods: [
          { number: 1, subject: 'Mathematics', teacher: 'Dr. Rajesh Kumar', startTime: '09:00', endTime: '09:45' },
          { number: 2, subject: 'Science', teacher: 'Mrs. Priya Sharma', startTime: '09:45', endTime: '10:30' },
          { number: 3, subject: 'English', teacher: 'Prof. Amit Singh', startTime: '10:45', endTime: '11:30' },
          { number: 4, subject: 'Hindi', teacher: 'Dr. Neha Gupta', startTime: '11:30', endTime: '12:15' },
          { number: 5, subject: 'Lunch', teacher: '-', startTime: '12:15', endTime: '13:00' },
          { number: 6, subject: 'Social Science', teacher: 'Mr. Vikram Mehta', startTime: '13:00', endTime: '13:45' },
          { number: 7, subject: 'Computer Science', teacher: 'Mrs. Anjali Verma', startTime: '13:45', endTime: '14:30' },
        ]
      },
      {
        day: 'Tuesday',
        periods: [
          { number: 1, subject: 'Science', teacher: 'Mrs. Priya Sharma', startTime: '09:00', endTime: '09:45' },
          { number: 2, subject: 'Mathematics', teacher: 'Dr. Rajesh Kumar', startTime: '09:45', endTime: '10:30' },
          { number: 3, subject: 'Hindi', teacher: 'Dr. Neha Gupta', startTime: '10:45', endTime: '11:30' },
          { number: 4, subject: 'English', teacher: 'Prof. Amit Singh', startTime: '11:30', endTime: '12:15' },
          { number: 5, subject: 'Lunch', teacher: '-', startTime: '12:15', endTime: '13:00' },
          { number: 6, subject: 'Computer Science', teacher: 'Mrs. Anjali Verma', startTime: '13:00', endTime: '13:45' },
          { number: 7, subject: 'Social Science', teacher: 'Mr. Vikram Mehta', startTime: '13:45', endTime: '14:30' },
        ]
      },
      {
        day: 'Wednesday',
        periods: [
          { number: 1, subject: 'English', teacher: 'Prof. Amit Singh', startTime: '09:00', endTime: '09:45' },
          { number: 2, subject: 'Hindi', teacher: 'Dr. Neha Gupta', startTime: '09:45', endTime: '10:30' },
          { number: 3, subject: 'Mathematics', teacher: 'Dr. Rajesh Kumar', startTime: '10:45', endTime: '11:30' },
          { number: 4, subject: 'Science', teacher: 'Mrs. Priya Sharma', startTime: '11:30', endTime: '12:15' },
          { number: 5, subject: 'Lunch', teacher: '-', startTime: '12:15', endTime: '13:00' },
          { number: 6, subject: 'Social Science', teacher: 'Mr. Vikram Mehta', startTime: '13:00', endTime: '13:45' },
          { number: 7, subject: 'Physical Education', teacher: 'Mr. Rahul Khanna', startTime: '13:45', endTime: '14:30' },
        ]
      },
      {
        day: 'Thursday',
        periods: [
          { number: 1, subject: 'Social Science', teacher: 'Mr. Vikram Mehta', startTime: '09:00', endTime: '09:45' },
          { number: 2, subject: 'Computer Science', teacher: 'Mrs. Anjali Verma', startTime: '09:45', endTime: '10:30' },
          { number: 3, subject: 'Science', teacher: 'Mrs. Priya Sharma', startTime: '10:45', endTime: '11:30' },
          { number: 4, subject: 'Mathematics', teacher: 'Dr. Rajesh Kumar', startTime: '11:30', endTime: '12:15' },
          { number: 5, subject: 'Lunch', teacher: '-', startTime: '12:15', endTime: '13:00' },
          { number: 6, subject: 'English', teacher: 'Prof. Amit Singh', startTime: '13:00', endTime: '13:45' },
          { number: 7, subject: 'Hindi', teacher: 'Dr. Neha Gupta', startTime: '13:45', endTime: '14:30' },
        ]
      },
      {
        day: 'Friday',
        periods: [
          { number: 1, subject: 'Hindi', teacher: 'Dr. Neha Gupta', startTime: '09:00', endTime: '09:45' },
          { number: 2, subject: 'English', teacher: 'Prof. Amit Singh', startTime: '09:45', endTime: '10:30' },
          { number: 3, subject: 'Social Science', teacher: 'Mr. Vikram Mehta', startTime: '10:45', endTime: '11:30' },
          { number: 4, subject: 'Computer Science', teacher: 'Mrs. Anjali Verma', startTime: '11:30', endTime: '12:15' },
          { number: 5, subject: 'Lunch', teacher: '-', startTime: '12:15', endTime: '13:00' },
          { number: 6, subject: 'Mathematics', teacher: 'Dr. Rajesh Kumar', startTime: '13:00', endTime: '13:45' },
          { number: 7, subject: 'Science', teacher: 'Mrs. Priya Sharma', startTime: '13:45', endTime: '14:30' },
        ]
      },
      {
        day: 'Saturday',
        periods: [
          { number: 1, subject: 'Physics Lab', teacher: 'Mrs. Priya Sharma', startTime: '09:00', endTime: '09:45' },
          { number: 2, subject: 'Chemistry Lab', teacher: 'Dr. Ananya Das', startTime: '09:45', endTime: '10:30' },
          { number: 3, subject: 'Computer Lab', teacher: 'Mrs. Anjali Verma', startTime: '10:45', endTime: '11:30' },
          { number: 4, subject: 'Library', teacher: 'Ms. Pooja Reddy', startTime: '11:30', endTime: '12:15' },
          { number: 5, subject: 'Lunch', teacher: '-', startTime: '12:15', endTime: '13:00' },
          { number: 6, subject: 'Sports', teacher: 'Mr. Rahul Khanna', startTime: '13:00', endTime: '13:45' },
          { number: 7, subject: 'Club Activities', teacher: 'Various', startTime: '13:45', endTime: '14:30' },
        ]
      }
    ],
    room: 'Room 101'
  },
  {
    id: '2',
    name: 'Class 9B',
    standard: '9',
    section: 'B',
    classTeacher: 'Dr. Rajesh Kumar',
    totalStudents: 32,
    subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer Science'],
    schedule: [],
    room: 'Room 102'
  },
  {
    id: '3',
    name: 'Class 11A',
    standard: '11',
    section: 'A',
    classTeacher: 'Prof. Amit Singh',
    totalStudents: 28,
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Physical Education'],
    schedule: [],
    room: 'Room 201'
  }
];

const mockFaculty: Faculty[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    employeeId: 'EMP1001',
    department: 'Mathematics',
    position: 'HOD',
    gender: 'Male',
    subject: ['Algebra', 'Geometry', 'Calculus', 'Mathematics'],
    qualification: 'Ph.D in Mathematics',
    contactNumber: '+91 9876543210',
    email: 'rajesh.kumar@schoolsync.edu',
    joiningDate: '2010-07-15',
    availability: [
      {
        day: 'Monday',
        slots: [
          { periodNumber: 1, startTime: '09:00', endTime: '09:45', isAvailable: false },
          { periodNumber: 2, startTime: '09:45', endTime: '10:30', isAvailable: false },
          { periodNumber: 3, startTime: '10:45', endTime: '11:30', isAvailable: true },
          { periodNumber: 4, startTime: '11:30', endTime: '12:15', isAvailable: true },
          { periodNumber: 6, startTime: '13:00', endTime: '13:45', isAvailable: true },
          { periodNumber: 7, startTime: '13:45', endTime: '14:30', isAvailable: true },
        ]
      },
      {
        day: 'Tuesday',
        slots: [
          { periodNumber: 1, startTime: '09:00', endTime: '09:45', isAvailable: true },
          { periodNumber: 2, startTime: '09:45', endTime: '10:30', isAvailable: false },
          { periodNumber: 3, startTime: '10:45', endTime: '11:30', isAvailable: true },
          { periodNumber: 4, startTime: '11:30', endTime: '12:15', isAvailable: true },
          { periodNumber: 6, startTime: '13:00', endTime: '13:45', isAvailable: false },
          { periodNumber: 7, startTime: '13:45', endTime: '14:30', isAvailable: true },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Mrs. Priya Sharma',
    employeeId: 'EMP1002',
    department: 'Science',
    position: 'Senior Teacher',
    gender: 'Female',
    subject: ['Physics', 'Chemistry', 'Biology', 'Science'],
    qualification: 'M.Sc in Physics',
    contactNumber: '+91 9876543211',
    email: 'priya.sharma@schoolsync.edu',
    joiningDate: '2012-06-10',
    availability: [
      {
        day: 'Monday',
        slots: [
          { periodNumber: 1, startTime: '09:00', endTime: '09:45', isAvailable: true },
          { periodNumber: 2, startTime: '09:45', endTime: '10:30', isAvailable: false },
          { periodNumber: 3, startTime: '10:45', endTime: '11:30', isAvailable: true },
          { periodNumber: 4, startTime: '11:30', endTime: '12:15', isAvailable: true },
          { periodNumber: 6, startTime: '13:00', endTime: '13:45', isAvailable: true },
          { periodNumber: 7, startTime: '13:45', endTime: '14:30', isAvailable: false },
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Prof. Amit Singh',
    employeeId: 'EMP1003',
    department: 'English',
    position: 'Senior Teacher',
    gender: 'Male',
    subject: ['English Literature', 'Grammar', 'English'],
    qualification: 'M.A. in English',
    contactNumber: '+91 9876543212',
    email: 'amit.singh@schoolsync.edu',
    joiningDate: '2013-07-05',
    availability: [
      {
        day: 'Wednesday',
        slots: [
          { periodNumber: 1, startTime: '09:00', endTime: '09:45', isAvailable: false },
          { periodNumber: 2, startTime: '09:45', endTime: '10:30', isAvailable: true },
          { periodNumber: 3, startTime: '10:45', endTime: '11:30', isAvailable: true },
          { periodNumber: 4, startTime: '11:30', endTime: '12:15', isAvailable: true },
          { periodNumber: 6, startTime: '13:00', endTime: '13:45', isAvailable: false },
          { periodNumber: 7, startTime: '13:45', endTime: '14:30', isAvailable: true },
        ]
      }
    ]
  }
];

// Mock subject allocations for classes
const mockSubjectAllocations: ClassSubjectAllocation[] = [
  {
    classId: '1',
    className: 'Class 10A',
    subjectAllocations: [
      { subject: 'Mathematics', periodsPerWeek: 6, assignedTeacher: 'Dr. Rajesh Kumar' },
      { subject: 'Science', periodsPerWeek: 6, assignedTeacher: 'Mrs. Priya Sharma' },
      { subject: 'English', periodsPerWeek: 5, assignedTeacher: 'Prof. Amit Singh' },
      { subject: 'Hindi', periodsPerWeek: 4, assignedTeacher: 'Dr. Neha Gupta' },
      { subject: 'Social Science', periodsPerWeek: 4, assignedTeacher: 'Mr. Vikram Mehta' },
      { subject: 'Computer Science', periodsPerWeek: 3, assignedTeacher: 'Mrs. Anjali Verma' },
      { subject: 'Physical Education', periodsPerWeek: 2, assignedTeacher: 'Mr. Rahul Khanna' },
    ]
  },
  {
    classId: '2',
    className: 'Class 9B',
    subjectAllocations: [
      { subject: 'Mathematics', periodsPerWeek: 6, assignedTeacher: 'Dr. Rajesh Kumar' },
      { subject: 'Science', periodsPerWeek: 6, assignedTeacher: 'Mrs. Priya Sharma' },
      { subject: 'English', periodsPerWeek: 5, assignedTeacher: 'Prof. Amit Singh' },
      { subject: 'Hindi', periodsPerWeek: 4, assignedTeacher: 'Dr. Neha Gupta' },
      { subject: 'Social Science', periodsPerWeek: 4, assignedTeacher: 'Mr. Vikram Mehta' },
      { subject: 'Computer Science', periodsPerWeek: 3, assignedTeacher: 'Mrs. Anjali Verma' },
    ]
  }
];

const weekdays: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = ['09:00 - 09:45', '09:45 - 10:30', '10:45 - 11:30', '11:30 - 12:15', '12:15 - 13:00', '13:00 - 13:45', '13:45 - 14:30'];

const Timetable = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<string | undefined>(mockClasses[0].id);
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
  const [isEditingAllocation, setIsEditingAllocation] = useState(false);
  const [isGeneratingTimetable, setIsGeneratingTimetable] = useState(false);
  const [subjectAllocations, setSubjectAllocations] = useState<ClassSubjectAllocation[]>(mockSubjectAllocations);
  
  // Initialize with empty periods for all days
  const initialPeriodsMap: Record<WeekDay, Period[]> = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: []
  };
  
  const [tempSchedule, setTempSchedule] = useState(initialPeriodsMap);
  const [generatedTimetable, setGeneratedTimetable] = useState<Record<WeekDay, Period[]> | null>(null);

  const selectedClassData = mockClasses.find(c => c.id === selectedClass);
  const selectedClassAllocation = subjectAllocations.find(a => a.classId === selectedClass);
  
  // Function to check teacher availability for a specific period
  const checkTeacherAvailability = (teacherId: string, day: WeekDay, periodNumber: number): boolean => {
    const teacher = mockFaculty.find(f => f.id === teacherId);
    if (!teacher || !teacher.availability) return true; // Assume available if no data
    
    const dayAvailability = teacher.availability.find(a => a.day === day);
    if (!dayAvailability) return true; // Assume available if no specific day data
    
    const slotAvailability = dayAvailability.slots.find(s => s.periodNumber === periodNumber);
    return slotAvailability ? slotAvailability.isAvailable : true; // Assume available if no specific slot data
  };

  // Function to find available teacher for a subject
  const findAvailableTeacher = (subject: string, day: WeekDay, periodNumber: number): string | null => {
    // First, try to find the assigned teacher from subject allocations
    const subjectAllocation = selectedClassAllocation?.subjectAllocations.find(s => s.subject === subject);
    if (!subjectAllocation) return null;
    
    const assignedTeacher = mockFaculty.find(f => f.name === subjectAllocation.assignedTeacher);
    if (!assignedTeacher) return null;
    
    // Check if assigned teacher is available
    const isAvailable = checkTeacherAvailability(assignedTeacher.id, day, periodNumber);
    if (isAvailable) return assignedTeacher.name;
    
    // If assigned teacher is not available, try to find an alternative
    const alternativeTeachers = mockFaculty.filter(f => 
      f.id !== assignedTeacher.id && 
      f.subject.includes(subject) && 
      checkTeacherAvailability(f.id, day, periodNumber)
    );
    
    return alternativeTeachers.length > 0 ? alternativeTeachers[0].name : null;
  };

  // Function to generate a timetable based on subject allocations and teacher availability
  const generateTimetable = () => {
    if (!selectedClassAllocation) return;
    
    const newTimetable: Record<WeekDay, Period[]> = { ...initialPeriodsMap };
    
    // First, distribute subjects across the week based on periodsPerWeek
    const totalPeriodsPerDay = 6; // Excluding lunch
    let unassignedSubjects: Array<{ subject: string; count: number }> = [];
    
    // Initialize unassigned subjects based on periodsPerWeek
    selectedClassAllocation.subjectAllocations.forEach(allocation => {
      unassignedSubjects.push({ subject: allocation.subject, count: allocation.periodsPerWeek });
    });
    
    // Fill in the timetable day by day, period by period
    weekdays.forEach(day => {
      newTimetable[day] = [];
      
      // Add lunch break
      newTimetable[day].push({
        number: 5,
        subject: 'Lunch',
        teacher: '-',
        startTime: '12:15',
        endTime: '13:00'
      });
      
      // Try to assign subjects for other periods
      for (let periodNum = 1; periodNum <= 7; periodNum++) {
        if (periodNum === 5) continue; // Skip lunch period
        
        // Skip if no more subjects to assign
        if (unassignedSubjects.every(s => s.count <= 0)) break;
        
        // Filter subjects that still need to be assigned
        const availableSubjects = unassignedSubjects.filter(s => s.count > 0);
        if (availableSubjects.length === 0) break;
        
        // Choose a subject (simple round-robin for now)
        const subjectToAssign = availableSubjects[Math.floor(Math.random() * availableSubjects.length)];
        
        // Find an available teacher
        const teacher = findAvailableTeacher(subjectToAssign.subject, day, periodNum);
        
        if (teacher) {
          // Get time slot based on period number
          const startTime = periodNum < 5 ? 
            timeSlots[periodNum - 1].split(' - ')[0] : 
            timeSlots[periodNum].split(' - ')[0];
          const endTime = periodNum < 5 ? 
            timeSlots[periodNum - 1].split(' - ')[1] : 
            timeSlots[periodNum].split(' - ')[1];
          
          // Add period to the timetable
          newTimetable[day].push({
            number: periodNum,
            subject: subjectToAssign.subject,
            teacher: teacher,
            startTime,
            endTime
          });
          
          // Decrease remaining count for this subject
          const index = unassignedSubjects.findIndex(s => s.subject === subjectToAssign.subject);
          if (index !== -1) {
            unassignedSubjects[index].count--;
          }
        } else {
          // If no teacher available, add a free period
          const startTime = periodNum < 5 ? 
            timeSlots[periodNum - 1].split(' - ')[0] : 
            timeSlots[periodNum].split(' - ')[0];
          const endTime = periodNum < 5 ? 
            timeSlots[periodNum - 1].split(' - ')[1] : 
            timeSlots[periodNum].split(' - ')[1];
          
          newTimetable[day].push({
            number: periodNum,
            subject: 'Free Period',
            teacher: '-',
            startTime,
            endTime
          });
        }
      }
      
      // Sort periods by period number
      newTimetable[day].sort((a, b) => a.number - b.number);
    });
    
    return newTimetable;
  };
  
  const handleGenerateTimetable = () => {
    setIsGeneratingTimetable(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newTimetable = generateTimetable();
      setGeneratedTimetable(newTimetable || null);
      setIsGeneratingTimetable(false);
      
      toast({
        title: "Timetable Generated",
        description: "Timetable has been successfully generated for the selected class.",
        variant: "default"
      });
    }, 2000);
  };
  
  const handleSaveAllocation = () => {
    setIsEditingAllocation(false);
    toast({
      title: "Subject Allocation Saved",
      description: "The subject allocation has been saved successfully.",
      variant: "default"
    });
  };

  // Helper function to update subject allocation
  const updateSubjectAllocation = (subject: string, field: keyof SubjectAllocation, value: string | number) => {
    if (!selectedClassAllocation) return;
    
    setSubjectAllocations(prev => 
      prev.map(allocation => {
        if (allocation.classId !== selectedClass) return allocation;
        
        return {
          ...allocation,
          subjectAllocations: allocation.subjectAllocations.map(subjectAlloc => {
            if (subjectAlloc.subject !== subject) return subjectAlloc;
            return { ...subjectAlloc, [field]: value };
          })
        };
      })
    );
  };

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">View and manage class timetables</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {mockClasses.map(cls => (
                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="view">View Timetable</TabsTrigger>
          <TabsTrigger value="allocation">Subject Allocation</TabsTrigger>
          <TabsTrigger value="faculty">Faculty Availability</TabsTrigger>
          <TabsTrigger value="generator">Timetable Generator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedClassData?.name} Timetable</CardTitle>
                  <CardDescription>
                    Class Teacher: {selectedClassData?.classTeacher} | Room: {selectedClassData?.room}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === 'table' ? 'list' : 'table')}
                  >
                    {viewMode === 'table' ? 'List View' : 'Table View'}
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Edit Timetable</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        {/* Timetable editor would go here */}
                        <p className="text-muted-foreground">Timetable editing functionality coming soon...</p>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'table' ? (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Time</TableHead>
                        {weekdays.map(day => (
                          <TableHead key={day}>{day}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeSlots.map((timeSlot, index) => (
                        <TableRow key={timeSlot}>
                          <TableCell className="font-medium">
                            {timeSlot}
                            {index === 4 && <Badge variant="outline" className="ml-2">Lunch</Badge>}
                          </TableCell>
                          {weekdays.map(day => {
                            const periodData = selectedClassData?.schedule
                              .find(s => s.day === day)?.periods
                              .find(p => p.startTime === timeSlot.split(' - ')[0]);
                              
                            return (
                              <TableCell key={day} className={index === 4 ? 'bg-muted/30' : ''}>
                                {index === 4 ? (
                                  <div className="text-center text-muted-foreground">Lunch Break</div>
                                ) : periodData ? (
                                  <div>
                                    <div className="font-medium">{periodData.subject}</div>
                                    <div className="text-xs text-muted-foreground">{periodData.teacher}</div>
                                  </div>
                                ) : (
                                  <div className="text-muted-foreground text-center">-</div>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="space-y-6">
                  {weekdays.map(day => (
                    <div key={day}>
                      <h3 className="font-medium text-lg mb-2">{day}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {selectedClassData?.schedule
                          .find(s => s.day === day)?.periods
                          .map(period => period.subject !== 'Lunch' && (
                            <Card key={period.number} className="overflow-hidden">
                              <div className="bg-primary/10 px-4 py-2 flex justify-between items-center">
                                <div className="font-medium">Period {period.number}</div>
                                <div className="text-xs">{period.startTime} - {period.endTime}</div>
                              </div>
                              <CardContent className="p-4">
                                <div className="font-medium">{period.subject}</div>
                                <div className="text-sm text-muted-foreground">{period.teacher}</div>
                              </CardContent>
                            </Card>
                          ))
                        }
                      </div>
                      <Separator className="my-6" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Subject Allocation for {selectedClassData?.name}</CardTitle>
                  <CardDescription>
                    Assign teachers and define periods per week for each subject
                  </CardDescription>
                </div>
                {!isEditingAllocation ? (
                  <Button size="sm" onClick={() => setIsEditingAllocation(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Allocation
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setIsEditingAllocation(false)}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveAllocation}>
                      <Check className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Assigned Teacher</TableHead>
                    <TableHead>Periods per Week</TableHead>
                    <TableHead>Preferred Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedClassAllocation?.subjectAllocations.map((allocation, index) => (
                    <TableRow key={allocation.subject}>
                      <TableCell className="font-medium">{allocation.subject}</TableCell>
                      <TableCell>
                        {isEditingAllocation ? (
                          <Select 
                            defaultValue={allocation.assignedTeacher}
                            onValueChange={(value) => updateSubjectAllocation(allocation.subject, 'assignedTeacher', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockFaculty
                                .filter(f => f.subject.includes(allocation.subject) || f.department === allocation.subject)
                                .map(teacher => (
                                  <SelectItem key={teacher.id} value={teacher.name}>
                                    {teacher.name}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        ) : (
                          allocation.assignedTeacher || 'Not assigned'
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditingAllocation ? (
                          <Select 
                            defaultValue={allocation.periodsPerWeek.toString()}
                            onValueChange={(value) => updateSubjectAllocation(allocation.subject, 'periodsPerWeek', parseInt(value))}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          allocation.periodsPerWeek.toString()
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditingAllocation ? (
                          <Select defaultValue={allocation.preferredDays ? allocation.preferredDays[0] : "any"}>
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any day</SelectItem>
                              {weekdays.map(day => (
                                <SelectItem key={day} value={day}>
                                  {day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          allocation.preferredDays ? allocation.preferredDays.join(', ') : 'Any day'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faculty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Availability</CardTitle>
              <CardDescription>
                View teacher schedules and availability for better timetable planning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockFaculty.map(faculty => (
                <div key={faculty.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{faculty.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{faculty.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {faculty.department} | Subjects: {faculty.subject.join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        {timeSlots.map((slot, i) => (
                          <TableHead key={i} className="text-center">
                            Period {i+1}<br/>
                            <span className="text-xs text-muted-foreground">{slot}</span>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weekdays.map(day => {
                        const availabilityForDay = faculty.availability?.find(a => a.day === day);
                        
                        return (
                          <TableRow key={day}>
                            <TableCell className="font-medium">{day}</TableCell>
                            {timeSlots.map((_, i) => {
                              const periodNum = i + 1;
                              const slot = availabilityForDay?.slots.find(s => s.periodNumber === periodNum);
                              const isLunchTime = i === 4;
                              
                              if (isLunchTime) {
                                return <TableCell key={i} className="bg-muted/30 text-center">Lunch</TableCell>;
                              }
                              
                              // Define the status with our custom type
                              let status: TeacherStatus = 'unknown';
                              
                              if (slot) {
                                status = slot.isAvailable ? 'available' : 'teaching';
                              } else {
                                // If no explicit availability is set, assume they're available
                                status = 'available';
                              }
                              
                              return (
                                <TableCell key={i} className="text-center">
                                  {status === 'available' && (
                                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                      Available
                                    </Badge>
                                  )}
                                  {status === 'teaching' && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                      Teaching
                                    </Badge>
                                  )}
                                  {status === 'unavailable' && (
                                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                                      Unavailable
                                    </Badge>
                                  )}
                                  {status === 'unknown' && (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  
                  <Separator className="my-6" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timetable Generator</CardTitle>
              <CardDescription>
                Automatically generate timetables based on constraints and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Generator Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Select Class</label>
                      <Select defaultValue={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClasses.map(cls => (
                            <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Max Periods Per Day</label>
                      <Select defaultValue="7">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[6, 7, 8, 9].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Days per Week</label>
                      <Select defaultValue="6">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 6].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Using subject allocations from the Subject Allocation tab</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Additional Constraints</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Subjects Preferred in Morning</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subjects" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedClassData?.subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Avoid Consecutive Periods for Subject</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subjects" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedClassData?.subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Max Daily Periods per Teacher</label>
                      <Select defaultValue="5">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 4, 5, 6].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Teacher availability will be respected</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {generatedTimetable && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Generated Timetable Preview</h3>
                  <div className="overflow-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Time</TableHead>
                          {weekdays.map(day => (
                            <TableHead key={day}>{day}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {timeSlots.map((timeSlot, index) => (
                          <TableRow key={timeSlot}>
                            <TableCell className="font-medium">
                              {timeSlot}
                              {index === 4 && <Badge variant="outline" className="ml-2">Lunch</Badge>}
                            </TableCell>
                            {weekdays.map(day => {
                              const periodData = generatedTimetable[day]
                                .find(p => p.startTime === timeSlot.split(' - ')[0]);
                                
                              return (
                                <TableCell key={day} className={index === 4 ? 'bg-muted/30' : ''}>
                                  {index === 4 ? (
                                    <div className="text-center text-muted-foreground">Lunch Break</div>
                                  ) : periodData ? (
                                    <div>
                                      <div className="font-medium">{periodData.subject}</div>
                                      <div className="text-xs text-muted-foreground">{periodData.teacher}</div>
                                    </div>
                                  ) : (
                                    <div className="text-muted-foreground text-center">-</div>
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Copy From Existing
              </Button>
              <Button onClick={handleGenerateTimetable} disabled={isGeneratingTimetable}>
                {isGeneratingTimetable ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Generate Timetable
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Timetable;
