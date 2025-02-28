
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Filter, 
  Download, 
  Plus, 
  RefreshCw, 
  Save, 
  Settings, 
  Users, 
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { 
  Class, 
  Faculty, 
  WeekDay, 
  TimetableSettings, 
  SubjectAllocation, 
  ClassSubjectAllocation,
  GeneratedTimetable,
  TimetableConflict
} from '@/types';

// Mock data
const mockClasses: Class[] = Array.from({ length: 6 }, (_, i) => ({
  id: `C${100 + i}`,
  name: `Class ${9 + Math.floor(i / 3)} ${['A', 'B'][i % 2]}`,
  standard: `${9 + Math.floor(i / 3)}`,
  section: ['A', 'B'][i % 2],
  classTeacher: ['Dr. Rajesh Kumar', 'Mrs. Priya Sharma', 'Mr. Amit Singh'][i % 3],
  totalStudents: 30 + (i % 15),
  subjects: [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 
    'Social Studies', 'Computer Science'
  ].slice(0, 6 + (i % 2)),
  schedule: [],
  room: `Room ${200 + i}`,
}));

const mockFaculty: Faculty[] = Array.from({ length: 8 }, (_, i) => ({
  id: `F${100 + i}`,
  name: ['Dr. Rajesh Kumar', 'Mrs. Priya Sharma', 'Mr. Amit Singh', 'Dr. Neha Gupta', 'Mr. Vikram Mehta', 'Mrs. Anjali Verma', 'Mr. Sanjay Patel', 'Dr. Pooja Reddy'][i],
  employeeId: `EMP${1000 + i}`,
  department: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science'][i % 6],
  position: ['Senior Teacher', 'Teacher'][i % 2],
  gender: i % 2 === 0 ? 'Male' : 'Female',
  subject: [
    ['Mathematics'],
    ['Physics', 'Science'],
    ['Chemistry', 'Science'],
    ['Biology', 'Science'],
    ['English'],
    ['Hindi'],
    ['Social Studies', 'History', 'Geography'],
    ['Computer Science']
  ][i],
  qualification: ['Ph.D.', 'M.Sc.', 'M.A.', 'B.Ed.'][i % 4],
  contactNumber: `+91 98765${10000 + i}`,
  email: `faculty${i}@schoolsync.edu`,
  joiningDate: `${2010 + (i % 10)}-${(i % 12) + 1}-${(i % 28) + 1}`,
  // Generate random availability
  availability: generateRandomAvailability(),
}));

// Helper function to generate random availability
function generateRandomAvailability() {
  const days: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.map(day => ({
    day,
    slots: Array.from({ length: 8 }, (_, i) => ({
      periodNumber: i + 1,
      startTime: `${8 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`,
      endTime: `${8 + Math.floor((i + 1) / 2)}:${(i + 1) % 2 === 0 ? '00' : '30'}`,
      isAvailable: Math.random() > 0.2, // 80% chance of being available
    }))
  }));
}

// Default timetable settings
const defaultSettings: TimetableSettings = {
  periodsPerDay: 8,
  daysInWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  startTime: '08:00',
  endTime: '14:30',
  periodDuration: 45, // minutes
  breakDuration: 5, // minutes
  lunchBreakAfter: 4, // after 4th period
  lunchBreakDuration: 30, // minutes
};

// Helper function to distribute subjects across the week
const distributeSubjects = (allocations: SubjectAllocation[]): Record<string, number[][]> => {
  const days = 6; // Monday to Saturday
  const periods = 8; // per day
  const distribution: Record<string, number[][]> = {};
  
  // Initialize distribution matrix for each subject
  allocations.forEach(allocation => {
    distribution[allocation.subject] = Array(days).fill(null).map(() => Array(periods).fill(0));
  });
  
  // Simple distribution algorithm (can be enhanced further)
  allocations.forEach(allocation => {
    let remainingPeriods = allocation.periodsPerWeek;
    let dayIndex = 0;
    
    while (remainingPeriods > 0) {
      const day = dayIndex % days;
      const periodsForThisDay = Math.min(remainingPeriods, 2); // Max 2 periods per day
      
      for (let i = 0; i < periodsForThisDay; i++) {
        // Find first available period slot
        const availablePeriod = distribution[allocation.subject][day].findIndex(p => p === 0);
        if (availablePeriod !== -1) {
          distribution[allocation.subject][day][availablePeriod] = 1;
          remainingPeriods--;
        }
      }
      
      dayIndex++;
      
      // Break if we've gone through all days multiple times and still can't allocate
      if (dayIndex > days * 3) break;
    }
  });
  
  return distribution;
};

// Main component
const Timetable = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [faculty, setFaculty] = useState<Faculty[]>(mockFaculty);
  const [settings, setSettings] = useState<TimetableSettings>(defaultSettings);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('view');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [subjectAllocations, setSubjectAllocations] = useState<ClassSubjectAllocation[]>([]);
  const [generatedTimetables, setGeneratedTimetables] = useState<GeneratedTimetable[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [conflicts, setConflicts] = useState<TimetableConflict[]>([]);

  // Initialize subject allocations from classes
  useEffect(() => {
    const initialAllocations = classes.map(classItem => ({
      classId: classItem.id,
      className: classItem.name,
      subjectAllocations: classItem.subjects.map(subject => {
        const teacherForSubject = faculty.find(f => f.subject.includes(subject));
        return {
          subject,
          periodsPerWeek: subject === 'Mathematics' || subject === 'English' ? 6 : 4, // More periods for core subjects
          assignedTeacher: teacherForSubject ? teacherForSubject.name : '',
        };
      }),
    }));
    
    setSubjectAllocations(initialAllocations);
  }, [classes, faculty]);

  // Generate time slots for display
  const generateTimeSlots = () => {
    const slots = [];
    let currentTime = settings.startTime;
    
    for (let i = 0; i < settings.periodsPerDay; i++) {
      const startTime = currentTime;
      const [hours, minutes] = startTime.split(':').map(Number);
      
      let endHours = hours;
      let endMinutes = minutes + settings.periodDuration;
      
      if (endMinutes >= 60) {
        endHours += Math.floor(endMinutes / 60);
        endMinutes = endMinutes % 60;
      }
      
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      
      slots.push({
        number: i + 1,
        startTime,
        endTime,
      });
      
      // Add break time
      let breakHours = endHours;
      let breakMinutes = endMinutes;
      
      // Add lunch break after specified period
      if (i + 1 === settings.lunchBreakAfter) {
        breakMinutes += settings.lunchBreakDuration;
      } else {
        breakMinutes += settings.breakDuration;
      }
      
      if (breakMinutes >= 60) {
        breakHours += Math.floor(breakMinutes / 60);
        breakMinutes = breakMinutes % 60;
      }
      
      currentTime = `${breakHours.toString().padStart(2, '0')}:${breakMinutes.toString().padStart(2, '0')}`;
    }
    
    return slots;
  };

  // Function to generate timetable
  const generateTimetable = () => {
    setIsGenerating(true);
    setConflicts([]);
    
    setTimeout(() => {
      try {
        const generated: GeneratedTimetable[] = [];
        const allConflicts: TimetableConflict[] = [];
        
        subjectAllocations.forEach(classAllocation => {
          const teacherAssignments: Record<string, Array<{ day: WeekDay; period: number }>> = {};
          const classSchedule: Record<WeekDay, Array<{ number: number; subject: string; teacher: string; startTime: string; endTime: string }>> = {};
          const timeSlots = generateTimeSlots();
          
          // Initialize empty schedule for each day
          settings.daysInWeek.forEach(day => {
            classSchedule[day] = [];
          });
          
          // Distribute subjects across the week
          const distribution = distributeSubjects(classAllocation.subjectAllocations);
          
          // Generate schedule for each day
          settings.daysInWeek.forEach((day, dayIndex) => {
            for (let periodIndex = 0; periodIndex < settings.periodsPerDay; periodIndex++) {
              const timeSlot = timeSlots[periodIndex];
              
              // Find a subject that should be scheduled in this slot
              let allocatedSubject: SubjectAllocation | null = null;
              
              for (const subject in distribution) {
                if (distribution[subject][dayIndex][periodIndex] === 1) {
                  allocatedSubject = classAllocation.subjectAllocations.find(a => a.subject === subject) || null;
                  break;
                }
              }
              
              // If no subject is allocated, choose a random one
              if (!allocatedSubject && Math.random() > 0.2) { // 80% chance to fill empty slots
                const remainingSubjects = classAllocation.subjectAllocations.filter(a => {
                  const assigned = classSchedule[day].filter(p => p.subject === a.subject).length;
                  return assigned < (a.periodsPerWeek / settings.daysInWeek.length);
                });
                
                if (remainingSubjects.length > 0) {
                  allocatedSubject = remainingSubjects[Math.floor(Math.random() * remainingSubjects.length)];
                }
              }
              
              if (allocatedSubject) {
                const teacher = allocatedSubject.assignedTeacher;
                
                // Check for teacher availability
                const teacherData = faculty.find(f => f.name === teacher);
                const teacherAvailability = teacherData?.availability?.find(a => a.day === day);
                const isTeacherAvailable = teacherAvailability?.slots[periodIndex]?.isAvailable ?? true;
                
                // Check if teacher is already assigned in this period on this day
                const teacherKey = `${teacher}-${day}-${periodIndex}`;
                const isTeacherAssigned = teacherAssignments[teacher]?.some(
                  a => a.day === day && a.period === periodIndex
                );
                
                if (!isTeacherAvailable) {
                  allConflicts.push({
                    type: 'teacher_unavailable',
                    day,
                    periodNumber: periodIndex + 1,
                    subject: allocatedSubject.subject,
                    teacher,
                    message: `${teacher} is not available on ${day} for period ${periodIndex + 1}`
                  });
                }
                
                if (isTeacherAssigned) {
                  allConflicts.push({
                    type: 'teacher_overlap',
                    day,
                    periodNumber: periodIndex + 1,
                    subject: allocatedSubject.subject,
                    teacher,
                    message: `${teacher} is already assigned to another class on ${day} for period ${periodIndex + 1}`
                  });
                }
                
                // Add period to schedule regardless of conflicts (we'll highlight them later)
                classSchedule[day].push({
                  number: periodIndex + 1,
                  subject: allocatedSubject.subject,
                  teacher,
                  startTime: timeSlot.startTime,
                  endTime: timeSlot.endTime
                });
                
                // Track teacher assignments
                if (!teacherAssignments[teacher]) {
                  teacherAssignments[teacher] = [];
                }
                teacherAssignments[teacher].push({ day, period: periodIndex });
              } else {
                // Empty period
                classSchedule[day].push({
                  number: periodIndex + 1,
                  subject: "Free Period",
                  teacher: "-",
                  startTime: timeSlot.startTime,
                  endTime: timeSlot.endTime
                });
              }
            }
          });
          
          // Convert to the required format
          const formattedSchedule = settings.daysInWeek.map(day => ({
            day,
            periods: classSchedule[day].sort((a, b) => a.number - b.number)
          }));
          
          // Store the generated timetable
          generated.push({
            classId: classAllocation.classId,
            className: classAllocation.className,
            schedule: formattedSchedule,
            conflicts: allConflicts.filter(c => c.teacher && c.subject)
          });
        });
        
        setGeneratedTimetables(generated);
        setConflicts(allConflicts);
        
        // Update classes with the generated timetables
        const updatedClasses = classes.map(classItem => {
          const generatedTimetable = generated.find(g => g.classId === classItem.id);
          if (generatedTimetable) {
            return {
              ...classItem,
              schedule: generatedTimetable.schedule
            };
          }
          return classItem;
        });
        
        setClasses(updatedClasses);
        
        toast({
          title: "Timetable Generated",
          description: `Generated timetables for ${generated.length} classes with ${allConflicts.length} conflicts`,
        });
      } catch (error) {
        console.error("Error generating timetable:", error);
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Failed to generate timetable. Please try again.",
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1500); // Simulate processing time
  };

  // Function to suggest optimizations
  const suggestOptimizations = () => {
    if (conflicts.length === 0) {
      toast({
        title: "No Conflicts",
        description: "The current timetable has no conflicts to resolve.",
      });
      return;
    }

    // Group conflicts by type
    const teacherUnavailable = conflicts.filter(c => c.type === 'teacher_unavailable');
    const teacherOverlap = conflicts.filter(c => c.type === 'teacher_overlap');
    
    let message = "Suggested optimizations:\n";
    
    if (teacherUnavailable.length > 0) {
      message += `- ${teacherUnavailable.length} teacher availability conflicts\n`;
    }
    
    if (teacherOverlap.length > 0) {
      message += `- ${teacherOverlap.length} teacher assignment overlaps\n`;
    }
    
    toast({
      title: "Optimization Suggestions",
      description: message,
    });
  };

  // Get the selected class data
  const currentClass = classes.find(c => c.id === selectedClass);
  
  // Resolve conflicts when saving
  const handleSaveTimetable = () => {
    // In a real application, this would send data to the backend
    if (conflicts.length > 0) {
      toast({
        variant: "warning",
        title: "Warning",
        description: `Timetable saved with ${conflicts.length} unresolved conflicts.`,
      });
    } else {
      toast({
        title: "Timetable Saved",
        description: "Timetable has been saved successfully.",
      });
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable Management</h1>
          <p className="text-muted-foreground">Generate and manage class schedules</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={generateTimetable}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Generate Timetable
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <DashboardCard>
            <CardHeader className="pb-3">
              <CardTitle>Classes</CardTitle>
              <CardDescription>Select a class to view or edit its timetable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {classes.map((cls) => (
                  <Button
                    key={cls.id}
                    variant={selectedClass === cls.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedClass(cls.id)}
                  >
                    <div className="flex flex-col items-start">
                      <span>{cls.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {cls.totalStudents} students • Room {cls.room}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </DashboardCard>
          
          <DashboardCard>
            <CardHeader className="pb-3">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={suggestOptimizations}
              >
                <Info className="mr-2 h-4 w-4" />
                Suggest Optimizations
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleSaveTimetable}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Timetable
              </Button>
            </CardContent>
          </DashboardCard>
          
          {conflicts.length > 0 && (
            <DashboardCard className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  <CardTitle className="text-orange-700 dark:text-orange-300">Conflicts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p className="text-orange-700 dark:text-orange-300">
                    Found {conflicts.length} conflicts in the generated timetable:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-orange-600 dark:text-orange-400">
                    {conflicts.slice(0, 3).map((conflict, index) => (
                      <li key={index} className="text-xs">
                        {conflict.message}
                      </li>
                    ))}
                    {conflicts.length > 3 && (
                      <li className="text-xs">
                        And {conflicts.length - 3} more conflicts...
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </DashboardCard>
          )}
        </div>
        
        <div className="lg:col-span-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="view">View Timetable</TabsTrigger>
              <TabsTrigger value="edit">Edit Allocations</TabsTrigger>
              <TabsTrigger value="faculty">Faculty Availability</TabsTrigger>
            </TabsList>
            
            <TabsContent value="view">
              {selectedClass ? (
                <DashboardCard>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{currentClass?.name} Timetable</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {settings.startTime} - {settings.endTime}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {currentClass?.schedule && currentClass.schedule.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">Day</TableHead>
                              {generateTimeSlots().map((slot) => (
                                <TableHead key={slot.number} className="text-center">
                                  <div>Period {slot.number}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {slot.startTime} - {slot.endTime}
                                  </div>
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentClass.schedule.map((day) => (
                              <TableRow key={day.day}>
                                <TableCell className="font-medium">{day.day}</TableCell>
                                {day.periods.map((period) => {
                                  // Check if this period has a conflict
                                  const hasConflict = conflicts.some(
                                    c => c.day === day.day && 
                                         c.periodNumber === period.number && 
                                         c.subject === period.subject
                                  );
                                  
                                  return (
                                    <TableCell 
                                      key={period.number}
                                      className={`text-center ${hasConflict ? 'bg-orange-50 dark:bg-orange-950' : ''}`}
                                    >
                                      <div className="flex flex-col items-center">
                                        <span className={`font-medium ${hasConflict ? 'text-orange-700 dark:text-orange-300' : ''}`}>
                                          {period.subject}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {period.teacher}
                                        </span>
                                        {hasConflict && (
                                          <Badge variant="outline" className="mt-1 text-xs border-orange-300 text-orange-700 dark:text-orange-300">
                                            Conflict
                                          </Badge>
                                        )}
                                      </div>
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-1">No Timetable Available</h3>
                        <p className="text-muted-foreground mb-4 max-w-md">
                          There is no timetable generated for this class yet. Click the Generate Timetable button to create one.
                        </p>
                        <Button
                          onClick={generateTimetable}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Calendar className="mr-2 h-4 w-4" />
                              Generate Timetable
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </DashboardCard>
              ) : (
                <DashboardCard>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-1">No Class Selected</h3>
                    <p className="text-muted-foreground mb-4">
                      Please select a class from the list to view its timetable.
                    </p>
                  </div>
                </DashboardCard>
              )}
            </TabsContent>
            
            <TabsContent value="edit">
              {selectedClass ? (
                <DashboardCard>
                  <CardHeader>
                    <CardTitle>Subject Allocations for {currentClass?.name}</CardTitle>
                    <CardDescription>
                      Define subjects, periods per week, and assigned teachers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subjectAllocations
                        .find(a => a.classId === selectedClass)
                        ?.subjectAllocations.map((allocation, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
                            <div>
                              <Label htmlFor={`subject-${index}`}>Subject</Label>
                              <Input
                                id={`subject-${index}`}
                                value={allocation.subject}
                                readOnly
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`periods-${index}`}>Periods Per Week</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Slider
                                  id={`periods-${index}`}
                                  min={1}
                                  max={8}
                                  step={1}
                                  defaultValue={[allocation.periodsPerWeek]}
                                  onValueChange={(value) => {
                                    const newAllocations = [...subjectAllocations];
                                    const classAllocationIndex = newAllocations.findIndex(a => a.classId === selectedClass);
                                    newAllocations[classAllocationIndex].subjectAllocations[index].periodsPerWeek = value[0];
                                    setSubjectAllocations(newAllocations);
                                  }}
                                  className="flex-1"
                                />
                                <span className="min-w-8 text-center">{allocation.periodsPerWeek}</span>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`teacher-${index}`}>Assigned Teacher</Label>
                              <Select
                                value={allocation.assignedTeacher}
                                onValueChange={(value) => {
                                  const newAllocations = [...subjectAllocations];
                                  const classAllocationIndex = newAllocations.findIndex(a => a.classId === selectedClass);
                                  newAllocations[classAllocationIndex].subjectAllocations[index].assignedTeacher = value;
                                  setSubjectAllocations(newAllocations);
                                }}
                              >
                                <SelectTrigger className="w-full mt-1">
                                  <SelectValue placeholder="Select a teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                  {faculty
                                    .filter(f => f.subject.includes(allocation.subject))
                                    .map(teacher => (
                                      <SelectItem key={teacher.id} value={teacher.name}>
                                        {teacher.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset</Button>
                    <Button>Save Allocations</Button>
                  </CardFooter>
                </DashboardCard>
              ) : (
                <DashboardCard>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-1">No Class Selected</h3>
                    <p className="text-muted-foreground mb-4">
                      Please select a class from the list to edit its subject allocations.
                    </p>
                  </div>
                </DashboardCard>
              )}
            </TabsContent>
            
            <TabsContent value="faculty">
              <DashboardCard>
                <CardHeader>
                  <CardTitle>Faculty Availability</CardTitle>
                  <CardDescription>
                    View and manage teacher availability for timetable scheduling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {faculty.map((teacher) => (
                      <div key={teacher.id} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{teacher.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {teacher.subject.join(', ')}
                            </p>
                          </div>
                          <Badge variant={
                            teacher.availability?.some(day => 
                              day.slots.some(slot => !slot.isAvailable)
                            ) ? "outline" : "secondary"
                          }>
                            {teacher.availability?.some(day => 
                              day.slots.some(slot => !slot.isAvailable)
                            ) ? "Partial Availability" : "Fully Available"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {teacher.availability?.slice(0, 2).map((day) => (
                            <div key={day.day} className="border rounded-md p-3">
                              <h4 className="font-medium mb-2">{day.day}</h4>
                              <div className="grid grid-cols-4 gap-2">
                                {day.slots.map((slot) => (
                                  <div key={slot.periodNumber} className={`text-center p-2 rounded-md text-xs ${
                                    slot.isAvailable 
                                      ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' 
                                      : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                                  }`}>
                                    <div>P{slot.periodNumber}</div>
                                    <div>{slot.isAvailable ? 'Available' : 'Unavailable'}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        {teacher.availability && teacher.availability.length > 2 && (
                          <Button variant="link" className="mt-2 p-0 h-auto">
                            Show more days
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </DashboardCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Timetable Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Timetable Settings</DialogTitle>
            <DialogDescription>
              Configure the parameters for timetable generation
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="periodsPerDay">Periods Per Day</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="periodsPerDay"
                    min={4}
                    max={12}
                    step={1}
                    defaultValue={[settings.periodsPerDay]}
                    onValueChange={(value) => setSettings({ ...settings, periodsPerDay: value[0] })}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{settings.periodsPerDay}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodDuration">Period Duration (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="periodDuration"
                    min={30}
                    max={60}
                    step={5}
                    defaultValue={[settings.periodDuration]}
                    onValueChange={(value) => setSettings({ ...settings, periodDuration: value[0] })}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{settings.periodDuration}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={settings.startTime}
                  onChange={(e) => setSettings({ ...settings, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                <Input
                  id="breakDuration"
                  type="number"
                  min={0}
                  max={30}
                  value={settings.breakDuration}
                  onChange={(e) => setSettings({ ...settings, breakDuration: parseInt(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lunchBreakAfter">Lunch Break After Period</Label>
                <Select
                  value={settings.lunchBreakAfter.toString()}
                  onValueChange={(value) => setSettings({ ...settings, lunchBreakAfter: parseInt(value) })}
                >
                  <SelectTrigger id="lunchBreakAfter">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: settings.periodsPerDay }, (_, i) => i + 1).map((period) => (
                      <SelectItem key={period} value={period.toString()}>
                        After Period {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lunchBreakDuration">Lunch Break Duration (minutes)</Label>
                <Input
                  id="lunchBreakDuration"
                  type="number"
                  min={15}
                  max={60}
                  value={settings.lunchBreakDuration}
                  onChange={(e) => setSettings({ ...settings, lunchBreakDuration: parseInt(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>School Days</Label>
              <div className="flex flex-wrap gap-2">
                {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const).map((day) => {
                  const isSelected = settings.daysInWeek.includes(day);
                  return (
                    <div key={day} className="flex items-center space-x-2">
                      <Switch
                        id={`day-${day}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSettings({
                              ...settings,
                              daysInWeek: [...settings.daysInWeek, day]
                            });
                          } else {
                            setSettings({
                              ...settings,
                              daysInWeek: settings.daysInWeek.filter(d => d !== day)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`day-${day}`}>{day}</Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsSettingsOpen(false)}>
              Apply Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Timetable;
