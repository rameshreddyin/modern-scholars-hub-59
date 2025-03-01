
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarDays, 
  BookOpen, 
  GraduationCap, 
  Users, 
  ClipboardCheck, 
  Wallet, 
  Home, 
  Plus, 
  Filter, 
  MoreHorizontal,
  Edit,
  Save,
  X,
  RefreshCw,
  Calendar,
  Settings,
  Clock,
  Check,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  CircleAlert,
  Shuffle,
  ArrowRightLeft,
  FileText,
  BookOpen as BookIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SearchField from '@/components/ui/SearchField';
import { Class, Faculty, Period, WeekDay, TimetableGenerationConstraints, TeacherAvailability, TimeSlot } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for demonstration
let mockClasses: Class[] = Array.from({ length: 5 }, (_, i) => ({
  id: `C${1000 + i}`,
  name: `Class ${i + 9}`,
  standard: `${i + 9}`,
  section: ['A', 'B', 'C'][i % 3],
  classTeacher: `T${2000 + i}`,
  totalStudents: 35 + i,
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
  schedule: [
    {
      day: 'Monday',
      periods: Array.from({ length: 6 }, (__, j) => ({
        number: j + 1,
        subject: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'][j % 5],
        teacher: `T${2000 + (j % 5)}`,
        startTime: `${8 + j}:00`,
        endTime: `${9 + j}:00`,
      })),
    },
    {
      day: 'Tuesday',
      periods: Array.from({ length: 6 }, (__, j) => ({
        number: j + 1,
        subject: ['Physics', 'Chemistry', 'Biology', 'English', 'Mathematics'][j % 5],
        teacher: `T${2000 + ((j + 1) % 5)}`,
        startTime: `${8 + j}:00`,
        endTime: `${9 + j}:00`,
      })),
    },
    {
      day: 'Wednesday',
      periods: Array.from({ length: 6 }, (__, j) => ({
        number: j + 1,
        subject: ['Chemistry', 'Biology', 'English', 'Mathematics', 'Physics'][j % 5],
        teacher: `T${2000 + ((j + 2) % 5)}`,
        startTime: `${8 + j}:00`,
        endTime: `${9 + j}:00`,
      })),
    },
    {
      day: 'Thursday',
      periods: Array.from({ length: 6 }, (__, j) => ({
        number: j + 1,
        subject: ['Biology', 'English', 'Mathematics', 'Physics', 'Chemistry'][j % 5],
        teacher: `T${2000 + ((j + 3) % 5)}`,
        startTime: `${8 + j}:00`,
        endTime: `${9 + j}:00`,
      })),
    },
    {
      day: 'Friday',
      periods: Array.from({ length: 6 }, (__, j) => ({
        number: j + 1,
        subject: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology'][j % 5],
        teacher: `T${2000 + ((j + 4) % 5)}`,
        startTime: `${8 + j}:00`,
        endTime: `${9 + j}:00`,
      })),
    },
  ],
  room: `Room ${101 + i}`,
}));

let mockFaculty: Faculty[] = Array.from({ length: 10 }, (_, i) => {
  const teacherNames = ['Rajesh Kumar', 'Sunita Sharma', 'Amit Patel', 'Priya Verma', 'Vikram Singh', 
                       'Anjali Gupta', 'Sanjay Reddy', 'Pooja Malhotra', 'Raj Malhotra', 'Ananya Das'];
  const subjects = [['Mathematics'], ['Physics'], ['Chemistry'], ['Biology'], ['English'], 
                  ['Computer Science'], ['Social Studies'], ['Hindi'], ['Physical Education'], ['Arts']];
  
  return {
    id: `T${2000 + i}`,
    name: teacherNames[i],
    employeeId: `EMP${3000 + i}`,
    department: ['Science', 'Mathematics', 'English', 'Social Studies', 'Computer Science'][i % 5],
    position: ['Teacher', 'Head Teacher', 'Senior Teacher'][i % 3],
    gender: i % 3 === 0 ? 'Female' : (i % 3 === 1 ? 'Male' : 'Other'),
    subject: subjects[i],
    qualification: 'Master\'s Degree',
    contactNumber: `+91 98765${10000 + i}`,
    email: `teacher${i}@example.com`,
    joiningDate: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
    availability: generateMockAvailability(i),
  };
});

// Generate mock availability for teachers
function generateMockAvailability(teacherId: number): TeacherAvailability[] {
  const days: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  return days.map(day => {
    return {
      day,
      slots: Array.from({ length: 8 }, (_, i) => {
        // Make some teachers unavailable during certain periods
        const isAvailable = !(
          (teacherId % 5 === 0 && i === 3) || 
          (teacherId % 3 === 0 && i === 5) || 
          (teacherId % 2 === 0 && day === 'Friday' && i > 5)
        );
        
        return {
          periodNumber: i + 1,
          startTime: `${8 + i}:00`,
          endTime: `${9 + i}:00`,
          isAvailable
        };
      })
    };
  });
}

// Define default timetable generation constraints
const defaultConstraints: TimetableGenerationConstraints = {
  maxPeriodsPerTeacherPerDay: 5,
  minGapBetweenSameSubject: 1,
  preferredSubjectsInMorning: ['Mathematics', 'Physics', 'Chemistry'],
  avoidConsecutivePeriodsForSubjects: ['Physical Education', 'Computer Science']
};

type TeacherStatus = 'available' | 'teaching' | 'unavailable' | 'unknown';

interface EditPeriodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  period?: Period;
  teachers: Faculty[];
  subjects: string[];
  availableTeachers: { id: string; name: string; status: TeacherStatus }[];
  onSave: (updatedPeriod: Period) => void;
}

const EditPeriodDialog: React.FC<EditPeriodDialogProps> = ({ 
  isOpen, 
  onClose, 
  period, 
  teachers, 
  subjects, 
  availableTeachers,
  onSave 
}) => {
  const [editedPeriod, setEditedPeriod] = useState<Period | undefined>(period);
  
  // Reset form when period changes
  useEffect(() => {
    setEditedPeriod(period);
  }, [period]);
  
  const handleSave = () => {
    if (editedPeriod) {
      onSave(editedPeriod);
      onClose();
    }
  };
  
  if (!editedPeriod) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Period</DialogTitle>
          <DialogDescription>
            Update the details for this class period.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <select
              id="subject"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={editedPeriod.subject}
              onChange={(e) => setEditedPeriod({...editedPeriod, subject: e.target.value})}
            >
              <option value="">Select Subject</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher</Label>
            <select
              id="teacher"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={editedPeriod.teacher}
              onChange={(e) => setEditedPeriod({...editedPeriod, teacher: e.target.value})}
            >
              <option value="">Select Teacher</option>
              {availableTeachers.map((teacher) => (
                <option 
                  key={teacher.id} 
                  value={teacher.id}
                  disabled={teacher.status === 'teaching' || teacher.status === 'unavailable'}
                >
                  {teacher.name} 
                  {teacher.status === 'teaching' ? ' (Teaching elsewhere)' : 
                   teacher.status === 'unavailable' ? ' (Unavailable)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={editedPeriod.startTime}
                onChange={(e) => setEditedPeriod({...editedPeriod, startTime: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={editedPeriod.endTime}
                onChange={(e) => setEditedPeriod({...editedPeriod, endTime: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TeacherAvailabilitySheet: React.FC<{
  teacher: Faculty;
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacherId: string, availability: TeacherAvailability[]) => void;
}> = ({ teacher, isOpen, onClose, onSave }) => {
  const [editedAvailability, setEditedAvailability] = useState<TeacherAvailability[]>(
    teacher.availability || []
  );
  
  const handleToggleSlot = (dayIndex: number, slotIndex: number) => {
    const newAvailability = [...editedAvailability];
    const currentSlot = newAvailability[dayIndex].slots[slotIndex];
    newAvailability[dayIndex].slots[slotIndex] = {
      ...currentSlot,
      isAvailable: !currentSlot.isAvailable
    };
    setEditedAvailability(newAvailability);
  };
  
  const handleSave = () => {
    onSave(teacher.id, editedAvailability);
    onClose();
  };
  
  const daysOfWeek: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Teacher Availability</SheetTitle>
          <SheetDescription>
            Set when {teacher.name} is available to teach
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 overflow-auto max-h-[calc(100vh-200px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                {Array.from({ length: 8 }, (_, i) => (
                  <TableHead key={i} className="text-center">
                    Period {i + 1}
                    <div className="text-xs font-normal text-muted-foreground">
                      {`${8 + i}:00-${9 + i}:00`}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {editedAvailability.map((day, dayIndex) => (
                <TableRow key={day.day}>
                  <TableCell className="font-medium">{day.day}</TableCell>
                  {day.slots.map((slot, slotIndex) => (
                    <TableCell key={`${day.day}-${slot.periodNumber}`} className="text-center p-2">
                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          slot.isAvailable 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                        onClick={() => handleToggleSlot(dayIndex, slotIndex)}
                      >
                        {slot.isAvailable ? <Check size={16} /> : <X size={16} />}
                      </button>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

interface TimetableGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
  teachers: Faculty[];
  constraints: TimetableGenerationConstraints;
  onSave: (updatedConstraints: TimetableGenerationConstraints) => void;
  onGenerate: (classId: string, constraints: TimetableGenerationConstraints) => void;
}

const TimetableGenerationDialog: React.FC<TimetableGenerationDialogProps> = ({
  isOpen,
  onClose,
  classes,
  teachers,
  constraints,
  onSave,
  onGenerate
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || "");
  const [editedConstraints, setEditedConstraints] = useState<TimetableGenerationConstraints>(constraints);
  
  const handleConstraintChange = (key: keyof TimetableGenerationConstraints, value: any) => {
    setEditedConstraints({
      ...editedConstraints,
      [key]: value
    });
  };
  
  const handleGenerateTimetable = () => {
    if (selectedClass) {
      onSave(editedConstraints);
      onGenerate(selectedClass, editedConstraints);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Generate Timetable</DialogTitle>
          <DialogDescription>
            Configure settings and generate a timetable automatically
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <select
              id="class"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.standard}{cls.section})
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max-periods">Max Periods Per Teacher Per Day</Label>
            <Input
              id="max-periods"
              type="number"
              min={1}
              max={8}
              value={editedConstraints.maxPeriodsPerTeacherPerDay}
              onChange={(e) => handleConstraintChange('maxPeriodsPerTeacherPerDay', parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="min-gap">Minimum Gap Between Same Subject</Label>
            <Input
              id="min-gap"
              type="number"
              min={0}
              max={5}
              value={editedConstraints.minGapBetweenSameSubject}
              onChange={(e) => handleConstraintChange('minGapBetweenSameSubject', parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Preferred Subjects in Morning</Label>
            <div className="grid grid-cols-2 gap-2">
              {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
                'Computer Science', 'Social Studies', 'Physical Education'].map(subject => (
                <label 
                  key={subject} 
                  className="flex items-center space-x-2 text-sm"
                >
                  <input 
                    type="checkbox"
                    checked={editedConstraints.preferredSubjectsInMorning.includes(subject)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleConstraintChange('preferredSubjectsInMorning', 
                          [...editedConstraints.preferredSubjectsInMorning, subject]);
                      } else {
                        handleConstraintChange('preferredSubjectsInMorning',
                          editedConstraints.preferredSubjectsInMorning.filter(s => s !== subject));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span>{subject}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Avoid Consecutive Periods For</Label>
            <div className="grid grid-cols-2 gap-2">
              {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
                'Computer Science', 'Social Studies', 'Physical Education'].map(subject => (
                <label 
                  key={subject} 
                  className="flex items-center space-x-2 text-sm"
                >
                  <input 
                    type="checkbox"
                    checked={editedConstraints.avoidConsecutivePeriodsForSubjects.includes(subject)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleConstraintChange('avoidConsecutivePeriodsForSubjects', 
                          [...editedConstraints.avoidConsecutivePeriodsForSubjects, subject]);
                      } else {
                        handleConstraintChange('avoidConsecutivePeriodsForSubjects',
                          editedConstraints.avoidConsecutivePeriodsForSubjects.filter(s => s !== subject));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span>{subject}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleGenerateTimetable} 
            disabled={!selectedClass}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Timetable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TeacherStatusIndicator: React.FC<{ status: TeacherStatus }> = ({ status }) => {
  if (status === 'available') {
    return <div className="rounded-full w-2 h-2 bg-green-500 mr-2" title="Available" />;
  } else if (status === 'teaching') {
    return <div className="rounded-full w-2 h-2 bg-red-500 mr-2" title="Teaching" />;
  } else if (status === 'unavailable') {
    return <div className="rounded-full w-2 h-2 bg-yellow-500 mr-2" title="Unavailable" />;
  }
  return <div className="rounded-full w-2 h-2 bg-gray-300 mr-2" title="Unknown" />;
};

// Function to check if a teacher is available at a specific time
function isTeacherAvailableAt(teacher: Faculty, day: WeekDay, periodNumber: number): boolean {
  if (!teacher.availability) return true; // Assume available if no availability information
  
  const dayAvailability = teacher.availability.find(a => a.day === day);
  if (!dayAvailability) return true;
  
  const periodSlot = dayAvailability.slots.find(slot => slot.periodNumber === periodNumber);
  return periodSlot ? periodSlot.isAvailable : true;
}

// Function to check if a teacher is teaching in another class at a specific time
function isTeacherTeachingElsewhere(
  teacherId: string, 
  classes: Class[], 
  currentClassId: string,
  day: WeekDay, 
  periodNumber: number
): boolean {
  return classes.some(cls => {
    if (cls.id === currentClassId) return false;
    
    const daySchedule = cls.schedule.find(s => s.day === day);
    if (!daySchedule) return false;
    
    return daySchedule.periods.some(p => 
      p.number === periodNumber && p.teacher === teacherId
    );
  });
}

// Function to get teacher status for a specific period
function getTeacherStatusForPeriod(
  teacher: Faculty,
  classes: Class[],
  currentClassId: string,
  day: WeekDay,
  periodNumber: number
): TeacherStatus {
  // Check if teaching elsewhere
  if (isTeacherTeachingElsewhere(teacher.id, classes, currentClassId, day, periodNumber)) {
    return 'teaching';
  }
  
  // Check if unavailable
  if (!isTeacherAvailableAt(teacher, day, periodNumber)) {
    return 'unavailable';
  }
  
  return 'available';
}

// Function to suggest available teachers for a period
function suggestTeachersForPeriod(
  subject: string,
  classes: Class[],
  currentClassId: string,
  teachers: Faculty[],
  day: WeekDay,
  periodNumber: number
): { id: string; name: string; status: TeacherStatus }[] {
  // Filter teachers who can teach this subject
  const subjectTeachers = teachers.filter(teacher => 
    teacher.subject.includes(subject)
  );
  
  return subjectTeachers.map(teacher => {
    const status = getTeacherStatusForPeriod(
      teacher, 
      classes, 
      currentClassId, 
      day, 
      periodNumber
    );
    
    return {
      id: teacher.id,
      name: teacher.name,
      status
    };
  });
}

// Function to automatically generate a timetable for a class
function generateTimetable(
  classId: string,
  classes: Class[],
  teachers: Faculty[],
  constraints: TimetableGenerationConstraints
): Class {
  const classToUpdate = classes.find(c => c.id === classId);
  if (!classToUpdate) throw new Error("Class not found");
  
  const daysOfWeek: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periodsPerDay = 8;
  
  // Initialize empty timetable
  const newSchedule = daysOfWeek.map(day => ({
    day,
    periods: Array.from({ length: periodsPerDay }, (_, i) => ({
      number: i + 1,
      subject: "",
      teacher: "",
      startTime: `${8 + i}:00`,
      endTime: `${9 + i}:00`,
    }))
  }));
  
  // Get teachers who can teach each subject
  const subjectTeachersMap = classToUpdate.subjects.reduce((acc, subject) => {
    acc[subject] = teachers.filter(t => t.subject.includes(subject));
    return acc;
  }, {} as Record<string, Faculty[]>);
  
  // Track teacher assignments per day to avoid exceeding max periods per teacher per day
  const teacherPeriodsPerDay: Record<string, Record<WeekDay, number>> = {};
  teachers.forEach(teacher => {
    teacherPeriodsPerDay[teacher.id] = daysOfWeek.reduce((acc, day) => {
      acc[day] = 0;
      return acc;
    }, {} as Record<WeekDay, number>);
  });
  
  // Track last period for each subject to enforce minimum gap
  const lastPeriodForSubject: Record<string, Record<WeekDay, number>> = {};
  classToUpdate.subjects.forEach(subject => {
    lastPeriodForSubject[subject] = daysOfWeek.reduce((acc, day) => {
      acc[day] = -constraints.minGapBetweenSameSubject - 1; // Initialize to a value that won't block first period
      return acc;
    }, {} as Record<WeekDay, number>);
  });
  
  // Distribute subjects across the timetable
  classToUpdate.subjects.forEach(subject => {
    // Determine how many periods per week for this subject (roughly equal distribution)
    const periodsPerWeek = Math.floor((periodsPerDay * daysOfWeek.length) / classToUpdate.subjects.length);
    let assignedPeriods = 0;
    
    // Try to assign subject to periods
    while (assignedPeriods < periodsPerWeek) {
      // Random day selection
      const dayIndex = Math.floor(Math.random() * daysOfWeek.length);
      const day = daysOfWeek[dayIndex];
      
      // Determine period index based on constraints
      let periodOptions = [];
      for (let i = 0; i < periodsPerDay; i++) {
        const periodNum = i + 1;
        
        // Skip if period already assigned
        if (newSchedule[dayIndex].periods[i].subject) continue;
        
        // Check minimum gap constraint
        if (periodNum <= lastPeriodForSubject[subject][day] + constraints.minGapBetweenSameSubject) continue;
        
        // Morning preference for certain subjects
        const isMorning = periodNum <= 4;
        const isPreferredInMorning = constraints.preferredSubjectsInMorning.includes(subject);
        
        // Add period to options with appropriate weight
        const weight = (isPreferredInMorning && isMorning) ? 3 : 1;
        for (let j = 0; j < weight; j++) {
          periodOptions.push(i);
        }
      }
      
      // If no valid period found for this day, try another day
      if (periodOptions.length === 0) continue;
      
      // Select random period from options
      const periodIndex = periodOptions[Math.floor(Math.random() * periodOptions.length)];
      const periodNum = periodIndex + 1;
      
      // Find available teacher for this subject and period
      const availableTeachers = subjectTeachersMap[subject].filter(teacher => {
        // Check if teacher is available at this time
        if (!isTeacherAvailableAt(teacher, day, periodNum)) return false;
        
        // Check if teacher is already teaching elsewhere at this time
        if (isTeacherTeachingElsewhere(teacher.id, classes, classId, day, periodNum)) return false;
        
        // Check max periods per teacher per day constraint
        if (teacherPeriodsPerDay[teacher.id][day] >= constraints.maxPeriodsPerTeacherPerDay) return false;
        
        return true;
      });
      
      // If no available teacher, try another period/day
      if (availableTeachers.length === 0) continue;
      
      // Select random teacher from available teachers
      const selectedTeacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
      
      // Assign subject and teacher to period
      newSchedule[dayIndex].periods[periodIndex] = {
        ...newSchedule[dayIndex].periods[periodIndex],
        subject,
        teacher: selectedTeacher.id
      };
      
      // Update tracking variables
      lastPeriodForSubject[subject][day] = periodNum;
      teacherPeriodsPerDay[selectedTeacher.id][day]++;
      assignedPeriods++;
    }
  });
  
  // Return updated class with new schedule
  return {
    ...classToUpdate,
    schedule: newSchedule
  };
}

const Timetable: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState<WeekDay>('Monday');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingTimetable, setIsEditingTimetable] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | undefined>(undefined);
  const [isEditPeriodDialogOpen, setIsEditPeriodDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Faculty | null>(null);
  const [isTeacherAvailabilityOpen, setIsTeacherAvailabilityOpen] = useState(false);
  const [isGenerateTimetableOpen, setIsGenerateTimetableOpen] = useState(false);
  const [timetableConstraints, setTimetableConstraints] = useState<TimetableGenerationConstraints>(defaultConstraints);
  const [currentTab, setCurrentTab] = useState<string>('class-view');

  // Filter classes based on search term
  const filteredClasses = useMemo(() => {
    return mockClasses.filter(cls =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.standard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.section.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, mockClasses]);

  // Filter teachers based on search term
  const filteredTeachers = useMemo(() => {
    return mockFaculty.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.some(subj => subj.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, mockFaculty]);

  const daysOfWeek: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periodNumbers = Array.from({ length: 8 }, (_, i) => i + 1);
  const periodTimes = Array.from({ length: 8 }, (_, i) => ({
    startTime: `${8 + i}:00`,
    endTime: `${9 + i}:00`
  }));

  const handleEditPeriod = (day: WeekDay, period: Period) => {
    setDayOfWeek(day);
    setEditingPeriod(period);
    setIsEditPeriodDialogOpen(true);
  };
  
  const handleSavePeriodChanges = (updatedPeriod: Period) => {
    // Find the class and update its schedule
    if (selectedClass && editingPeriod) {
      const updatedClasses = mockClasses.map(cls => {
        if (cls.id === selectedClass.id) {
          const updatedSchedule = cls.schedule.map(sch => {
            if (sch.day === dayOfWeek) {
              const updatedPeriods = sch.periods.map(p => {
                if (p.number === editingPeriod.number) {
                  return updatedPeriod;
                }
                return p;
              });
              return { ...sch, periods: updatedPeriods };
            }
            return sch;
          });
          return { ...cls, schedule: updatedSchedule };
        }
        return cls;
      });
      
      // Update the mockClasses (in a real app, this would be an API call)
      mockClasses = updatedClasses;
      // Update the selectedClass
      setSelectedClass(updatedClasses.find(cls => cls.id === selectedClass.id) || null);
    }
  };

  const handleSaveTeacherAvailability = (teacherId: string, availability: TeacherAvailability[]) => {
    const updatedFaculty = mockFaculty.map(teacher => {
      if (teacher.id === teacherId) {
        return { ...teacher, availability };
      }
      return teacher;
    });
    
    // Update the mockFaculty (in a real app, this would be an API call)
    mockFaculty = updatedFaculty;
    // Update the selectedTeacher
    setSelectedTeacher(updatedFaculty.find(t => t.id === teacherId) || null);
  };

  const handleGenerateTimetable = (classId: string, constraints: TimetableGenerationConstraints) => {
    try {
      const generatedTimetable = generateTimetable(classId, mockClasses, mockFaculty, constraints);
      
      // Update the mockClasses with the generated timetable
      mockClasses = mockClasses.map(cls => 
        cls.id === classId ? generatedTimetable : cls
      );
      
      // Update the selectedClass if it's the one that was generated
      if (selectedClass && selectedClass.id === classId) {
        setSelectedClass(generatedTimetable);
      }
      
      // Show success message
      alert("Timetable generated successfully!");
    } catch (error) {
      console.error("Error generating timetable:", error);
      alert("Error generating timetable. Please try again.");
    }
  };

  // Function to get available teachers for a period
  const getAvailableTeachersForPeriod = (day: WeekDay, periodNumber: number, subject: string): { id: string; name: string; status: TeacherStatus }[] => {
    if (!selectedClass) return [];
    
    return suggestTeachersForPeriod(
      subject,
      mockClasses,
      selectedClass.id,
      mockFaculty,
      day,
      periodNumber
    );
  };

  const renderClassTimetable = () => {
    if (!selectedClass) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <BookIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Class Selected</h3>
          <p className="text-muted-foreground mt-2">Select a class from the list to view its timetable.</p>
        </div>
      );
    }

    const schedule = selectedClass.schedule.find(s => s.day === dayOfWeek)?.periods || [];

    return (
      <div className="rounded-md border shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Class Timetable</h3>
            <p className="text-sm text-muted-foreground">
              {selectedClass.name} ({selectedClass.standard}{selectedClass.section}) - {selectedClass.room}
            </p>
          </div>
          <div className="flex gap-2">
            {isEditingTimetable ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditingTimetable(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button size="sm" onClick={() => {
                  setIsEditingTimetable(false);
                  alert('Timetable changes saved!');
                }}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsGenerateTimetableOpen(true)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditingTimetable(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Timetable
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">Period</TableHead>
                {daysOfWeek.map(day => (
                  <TableHead 
                    key={day} 
                    className={`min-w-[180px] ${dayOfWeek === day ? 'bg-muted' : ''}`}
                  >
                    <button
                      className="w-full text-left font-medium"
                      onClick={() => setDayOfWeek(day)}
                    >
                      {day}
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {periodNumbers.map((periodNum) => {
                const currentDaySchedule = selectedClass.schedule.find(s => s.day === dayOfWeek);
                const currentPeriod = currentDaySchedule?.periods.find(p => p.number === periodNum);
                
                return (
                  <TableRow key={periodNum}>
                    <TableCell className="font-medium bg-muted/50">
                      {periodNum}
                      <div className="text-xs text-muted-foreground">
                        {periodTimes[periodNum - 1]?.startTime} - {periodTimes[periodNum - 1]?.endTime}
                      </div>
                    </TableCell>
                    
                    {daysOfWeek.map((day) => {
                      const daySchedule = selectedClass.schedule.find(s => s.day === day);
                      const period = daySchedule?.periods.find(p => p.number === periodNum);
                      
                      const isCurrentDay = day === dayOfWeek;
                      
                      if (!period || !period.subject) {
                        return (
                          <TableCell 
                            key={day} 
                            className={`${isCurrentDay ? 'bg-muted/30' : ''}`}
                          >
                            {isEditingTimetable && isCurrentDay ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-dashed w-full justify-center"
                                onClick={() => handleEditPeriod(day, {
                                  number: periodNum,
                                  subject: "",
                                  teacher: "",
                                  startTime: periodTimes[periodNum - 1]?.startTime,
                                  endTime: periodTimes[periodNum - 1]?.endTime
                                })}
                              >
                                <Plus className="h-4 w-4" />
                                <span>Add Period</span>
                              </Button>
                            ) : (
                              <span className="text-center block text-muted-foreground text-sm">Free Period</span>
                            )}
                          </TableCell>
                        );
                      }
                      
                      // Find teacher details
                      const teacher = mockFaculty.find(t => t.id === period.teacher);
                      
                      return (
                        <TableCell 
                          key={day} 
                          className={`${isCurrentDay ? 'bg-muted/30' : ''}`}
                        >
                          <div className="flex flex-col">
                            <div className="font-medium">{period.subject}</div>
                            <div className="text-sm text-muted-foreground">
                              {teacher ? teacher.name : period.teacher}
                            </div>
                            
                            {isEditingTimetable && isCurrentDay && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1" 
                                onClick={() => handleEditPeriod(day, period)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderTeacherTimetable = () => {
    if (!selectedTeacher) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Teacher Selected</h3>
          <p className="text-muted-foreground mt-2">Select a teacher from the list to view their schedule.</p>
        </div>
      );
    }

    // Generate teacher's schedule from all classes
    const teacherSchedule: Record<WeekDay, Record<number, { class: Class; period: Period } | null>> = {};
    
    daysOfWeek.forEach(day => {
      teacherSchedule[day] = {};
      periodNumbers.forEach(periodNum => {
        teacherSchedule[day][periodNum] = null;
      });
    });
    
    // Fill in the schedule from all classes
    mockClasses.forEach(cls => {
      cls.schedule.forEach(daySchedule => {
        daySchedule.periods.forEach(period => {
          if (period.teacher === selectedTeacher.id) {
            teacherSchedule[daySchedule.day][period.number] = {
              class: cls,
              period
            };
          }
        });
      });
    });

    return (
      <div className="rounded-md border shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Teacher Schedule</h3>
            <p className="text-sm text-muted-foreground">
              {selectedTeacher.name} - {selectedTeacher.department} Department
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsTeacherAvailabilityOpen(true)}>
              <Clock className="mr-2 h-4 w-4" />
              Set Availability
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">Period</TableHead>
                {daysOfWeek.map(day => (
                  <TableHead 
                    key={day} 
                    className={`min-w-[180px] ${dayOfWeek === day ? 'bg-muted' : ''}`}
                  >
                    <button
                      className="w-full text-left font-medium"
                      onClick={() => setDayOfWeek(day)}
                    >
                      {day}
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {periodNumbers.map((periodNum) => (
                <TableRow key={periodNum}>
                  <TableCell className="font-medium bg-muted/50">
                    {periodNum}
                    <div className="text-xs text-muted-foreground">
                      {periodTimes[periodNum - 1]?.startTime} - {periodTimes[periodNum - 1]?.endTime}
                    </div>
                    
                    {selectedTeacher.availability && (
                      <div className="mt-1 flex items-center">
                        <span className="text-xs mr-1">Status:</span>
                        {selectedTeacher.availability.find(a => a.day === dayOfWeek)?.slots.find(s => s.periodNumber === periodNum)?.isAvailable 
                          ? <span className="text-xs text-green-500 flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> Available</span>
                          : <span className="text-xs text-red-500 flex items-center"><XCircle className="h-3 w-3 mr-1" /> Unavailable</span>
                        }
                      </div>
                    )}
                  </TableCell>
                  
                  {daysOfWeek.map((day) => {
                    const classSession = teacherSchedule[day][periodNum];
                    const isCurrentDay = day === dayOfWeek;
                    
                    if (!classSession) {
                      // Check availability
                      const isAvailable = selectedTeacher.availability?.find(a => a.day === day)?.slots.find(s => s.periodNumber === periodNum)?.isAvailable;
                      
                      return (
                        <TableCell 
                          key={day} 
                          className={`${isCurrentDay ? 'bg-muted/30' : ''}`}
                        >
                          <div className="flex items-center justify-center h-full">
                            {isAvailable === false ? (
                              <span className="text-yellow-500 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Marked as unavailable
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Free Period</span>
                            )}
                          </div>
                        </TableCell>
                      );
                    }
                    
                    return (
                      <TableCell 
                        key={day} 
                        className={`${isCurrentDay ? 'bg-muted/30' : ''}`}
                      >
                        <div className="flex flex-col">
                          <div className="font-medium">{classSession.period.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {classSession.class.name} ({classSession.class.standard}{classSession.class.section})
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {classSession.class.room}
                          </div>
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable Management</h1>
          <p className="text-muted-foreground">
            Manage class schedules, teacher availability, and automated timetable generation
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                View Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCurrentTab('class-view')}>
                Class View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentTab('teacher-view')}>
                Teacher View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsGenerateTimetableOpen(true)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Timetable
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Timetable Settings
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList>
          <TabsTrigger value="class-view" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Class View
          </TabsTrigger>
          <TabsTrigger value="teacher-view" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Teacher View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="class-view" className="mt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <SearchField
              placeholder="Search by class name, standard, or section..."
              className="w-full md:w-80"
              onSearch={setSearchTerm}
            />
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredClasses.length}</strong> of <strong>{mockClasses.length}</strong> classes
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="md:col-span-1">
              <div className="rounded-md border shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Classes</h3>
                </div>
                <div className="p-2">
                  <ul className="space-y-1">
                    {filteredClasses.map(cls => (
                      <li key={cls.id}>
                        <button
                          className={`w-full text-left p-2 rounded-md hover:bg-secondary hover:text-secondary-foreground ${selectedClass?.id === cls.id ? 'bg-secondary text-secondary-foreground' : ''}`}
                          onClick={() => setSelectedClass(cls)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              {cls.name} ({cls.standard}{cls.section})
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {cls.totalStudents} students
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              {renderClassTimetable()}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="teacher-view" className="mt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <SearchField
              placeholder="Search by teacher name, department, or subject..."
              className="w-full md:w-80"
              onSearch={setSearchTerm}
            />
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredTeachers.length}</strong> of <strong>{mockFaculty.length}</strong> teachers
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="md:col-span-1">
              <div className="rounded-md border shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Teachers</h3>
                </div>
                <div className="p-2">
                  <ul className="space-y-1">
                    {filteredTeachers.map(teacher => (
                      <li key={teacher.id}>
                        <button
                          className={`w-full text-left p-2 rounded-md hover:bg-secondary hover:text-secondary-foreground ${selectedTeacher?.id === teacher.id ? 'bg-secondary text-secondary-foreground' : ''}`}
                          onClick={() => setSelectedTeacher(teacher)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{teacher.name}</div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {teacher.subject.map((subj, idx) => (
                              <span key={idx} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                {subj}
                              </span>
                            ))}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              {renderTeacherTimetable()}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Period Dialog */}
      {editingPeriod && (
        <EditPeriodDialog
          isOpen={isEditPeriodDialogOpen}
          onClose={() => setIsEditPeriodDialogOpen(false)}
          period={editingPeriod}
          teachers={mockFaculty}
          subjects={selectedClass ? selectedClass.subjects : []}
          availableTeachers={getAvailableTeachersForPeriod(
            dayOfWeek, 
            editingPeriod.number, 
            editingPeriod.subject || 'Mathematics'
          )}
          onSave={handleSavePeriodChanges}
        />
      )}
      
      {/* Teacher Availability Sheet */}
      {selectedTeacher && (
        <TeacherAvailabilitySheet
          teacher={selectedTeacher}
          isOpen={isTeacherAvailabilityOpen}
          onClose={() => setIsTeacherAvailabilityOpen(false)}
          onSave={handleSaveTeacherAvailability}
        />
      )}
      
      {/* Generate Timetable Dialog */}
      <TimetableGenerationDialog
        isOpen={isGenerateTimetableOpen}
        onClose={() => setIsGenerateTimetableOpen(false)}
        classes={mockClasses}
        teachers={mockFaculty}
        constraints={timetableConstraints}
        onSave={setTimetableConstraints}
        onGenerate={handleGenerateTimetable}
      />
    </div>
  );
};

export default Timetable;
