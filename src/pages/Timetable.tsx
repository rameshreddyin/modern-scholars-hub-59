
import React, { useState, useEffect } from 'react';
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
  X
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
import { Class, Faculty, Period, WeekDay } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
        subject: 'Mathematics',
        teacher: `T${2000 + i}`,
        startTime: `${9 + j}:00 AM`,
        endTime: `${10 + j}:00 AM`,
      })),
    },
    {
      day: 'Tuesday',
      periods: Array.from({ length: 6 }, (__, j) => ({
        number: j + 1,
        subject: 'Physics',
        teacher: `T${2001 + i}`,
        startTime: `${9 + j}:00 AM`,
        endTime: `${10 + j}:00 AM`,
      })),
    },
    {
      day: 'Wednesday',
      periods: Array.from({ length: 6 }, (__, j) => ({
        number: j + 1,
        subject: 'Chemistry',
        teacher: `T${2002 + i}`,
        startTime: `${9 + j}:00 AM`,
        endTime: `${10 + j}:00 AM`,
      })),
    },
    {
      day: 'Thursday',
      periods: Array.from({ length: 6 }, (__, j) => ({
        number: j + 1,
        subject: 'Biology',
        teacher: `T${2003 + i}`,
        startTime: `${9 + j}:00 AM`,
        endTime: `${10 + j}:00 AM`,
      })),
    },
    {
      day: 'Friday',
      periods: Array.from({ length: 6 }, (__, j) => ({
        number: j + 1,
        subject: 'English',
        teacher: `T${2004 + i}`,
        startTime: `${9 + j}:00 AM`,
        endTime: `${10 + j}:00 AM`,
      })),
    },
  ],
  room: `Room ${101 + i}`,
}));

const mockFaculty: Faculty[] = Array.from({ length: 10 }, (_, i) => ({
  id: `T${2000 + i}`,
  name: ['Rajesh Kumar', 'Sunita Sharma', 'Amit Patel', 'Priya Verma', 'Vikram Singh', 'Anjali Gupta', 'Sanjay Reddy', 'Pooja Malhotra', 'Raj Malhotra', 'Ananya Das'][i],
  employeeId: `EMP${3000 + i}`,
  department: ['Science', 'Mathematics', 'English', 'Social Studies', 'Computer Science'][i % 5],
  position: ['Teacher', 'Head Teacher', 'Senior Teacher'][i % 3],
  gender: i % 3 === 0 ? 'Female' : (i % 3 === 1 ? 'Male' : 'Other'),
  subject: [['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'][i % 5]],
  qualification: 'Master\'s Degree',
  contactNumber: `+91 98765${10000 + i}`,
  email: `teacher${i}@example.com`,
  joiningDate: `2020-${(i % 12) + 1}-${(i % 28) + 1}`,
}));

// Define teacher availability status
type TeacherStatus = 'available' | 'teaching' | 'unavailable' | 'unknown';

const EditPeriodDialog = ({ 
  isOpen, 
  onClose, 
  period, 
  teachers, 
  subjects, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  period?: Period; 
  teachers: Faculty[]; 
  subjects: string[]; 
  onSave: (updatedPeriod: Period) => void;
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
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
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

const Timetable = () => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState<WeekDay>('Monday');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingTimetable, setIsEditingTimetable] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | undefined>(undefined);
  const [isEditPeriodDialogOpen, setIsEditPeriodDialogOpen] = useState(false);

  const filteredClasses = mockClasses.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.standard.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const daysOfWeek: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periodNumbers = Array.from({ length: 6 }, (_, i) => i + 1);
  const periodTimes = [
    { startTime: '9:00 AM', endTime: '10:00 AM' },
    { startTime: '10:00 AM', endTime: '11:00 AM' },
    { startTime: '11:15 AM', endTime: '12:15 PM' },
    { startTime: '12:15 PM', endTime: '1:15 PM' },
    { startTime: '2:00 PM', endTime: '3:00 PM' },
    { startTime: '3:00 PM', endTime: '4:00 PM' },
  ];

  const handleEditPeriod = (day: WeekDay, period: Period) => {
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

  const renderClassTimetable = () => {
    if (!selectedClass) {
      return <p className="text-muted-foreground">Select a class to view the timetable.</p>;
    }

    const schedule = selectedClass.schedule.find(s => s.day === dayOfWeek)?.periods || [];

    const getTeacherStatus = (teacherId: string): TeacherStatus => {
      // Check if the teacher is teaching in the current period
      const isTeaching = selectedClass.schedule.some(daySchedule =>
        daySchedule.day === dayOfWeek &&
        daySchedule.periods.some(period => period.teacher === teacherId)
      );
    
      if (isTeaching) return 'teaching';
    
      // Check if the teacher has marked themselves as unavailable
      const teacher = mockFaculty.find(t => t.id === teacherId);
      if (teacher && teacher.availability) {
        const dayAvailability = teacher.availability.find(a => a.day === dayOfWeek);
        if (dayAvailability) {
          // Check if the teacher is available during the period
          const isAvailable = dayAvailability.slots.some(slot => {
            const periodNumber = schedule.find(p => p.teacher === teacherId)?.number;
            return slot.periodNumber === periodNumber && slot.isAvailable;
          });
          return isAvailable ? 'available' : 'unavailable';
        }
      }
    
      return 'unknown';
    };

    const renderCellContent = (teacherId: string): string | null => {
      const teacher = mockFaculty.find(t => t.id === teacherId);
      return teacher ? teacher.name : null;
    };

    const renderCellStatus = (teacherId: string): TeacherStatus => {
      return getTeacherStatus(teacherId);
    };

    return (
      <div className="rounded-md border shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Class Timetable</h3>
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
              <Button variant="outline" size="sm" onClick={() => setIsEditingTimetable(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Timetable
              </Button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border-b font-medium text-left">Period</th>
                {daysOfWeek.map(day => (
                  <th key={day} className="p-2 border-b font-medium text-left">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periodNumbers.map((periodNum) => (
                <tr key={periodNum} className="border-b last:border-b-0">
                  <td className="p-2 border-r text-center bg-muted font-medium text-sm">
                    {periodNum}
                    <div className="text-xs text-muted-foreground">
                      {periodTimes[periodNum - 1]?.startTime} - {periodTimes[periodNum - 1]?.endTime}
                    </div>
                  </td>
                  
                  {daysOfWeek.map((day) => {
                    const daySchedule = selectedClass.schedule.find(s => s.day === day);
                    const period = daySchedule?.periods.find(p => p.number === periodNum);
                    
                    if (!period) {
                      return <td key={day} className="p-3 border-r last:border-r-0 text-center text-muted-foreground">-</td>;
                    }
                    
                    return (
                      <td key={day} className="p-3 border-r last:border-r-0">
                        <div className="flex flex-col">
                          <div className="font-medium">{period.subject}</div>
                          <div className="text-sm text-muted-foreground">{period.teacher}</div>
                          
                          {isEditingTimetable && (
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
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">Manage class schedules and teacher availability</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarDays className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Class View</DropdownMenuItem>
              <DropdownMenuItem>Teacher View</DropdownMenuItem>
              <DropdownMenuItem>Room View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="rounded-md border shadow-sm">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Classes</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {filteredClasses.map(cls => (
                  <li key={cls.id} className="flex items-center justify-between">
                    <button
                      className={`w-full text-left p-2 rounded-md hover:bg-secondary hover:text-secondary-foreground ${selectedClass?.id === cls.id ? 'bg-secondary text-secondary-foreground' : ''}`}
                      onClick={() => setSelectedClass(cls)}
                    >
                      {cls.name} ({cls.standard}{cls.section})
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="rounded-md border shadow-sm">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Day of Week</h3>
              <div className="flex gap-2 mt-2">
                {daysOfWeek.map(day => (
                  <Button
                    key={day}
                    variant={dayOfWeek === day ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDayOfWeek(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
            <div className="p-4">
              {renderClassTimetable()}
            </div>
          </div>
        </div>
      </div>
      
      <EditPeriodDialog
        isOpen={isEditPeriodDialogOpen}
        onClose={() => setIsEditPeriodDialogOpen(false)}
        period={editingPeriod}
        teachers={mockFaculty}
        subjects={selectedClass ? selectedClass.subjects : []}
        onSave={handleSavePeriodChanges}
      />
    </div>
  );
};

export default Timetable;
