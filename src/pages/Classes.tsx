
import React, { useState } from 'react';
import { 
  BookOpen, 
  Filter, 
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Users,
  Clock
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
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import SearchField from '@/components/ui/SearchField';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Class } from '@/types';

// Mock data for demonstration
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

const ClassCard = ({ classData }: { classData: Class }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <DashboardCard className="overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">{classData.name}</h3>
          <p className="text-sm text-muted-foreground">Room: {classData.room}</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Class</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Manage Students</DropdownMenuItem>
              <DropdownMenuItem>View Timetable</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete Class</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CollapsibleTrigger 
            asChild 
            onClick={() => setIsOpen(!isOpen)}
          >
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          {classData.totalStudents} students
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mr-1" />
          {classData.subjects.length} subjects
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm font-medium">Class Teacher</p>
        <p className="text-sm">{classData.classTeacher}</p>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-4">
        {classData.subjects.slice(0, 5).map((subject, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {subject}
          </Badge>
        ))}
        {classData.subjects.length > 5 && (
          <Badge variant="outline" className="text-xs">
            +{classData.subjects.length - 5} more
          </Badge>
        )}
      </div>
      
      <Collapsible open={isOpen}>
        <CollapsibleContent className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium mb-2">Weekly Schedule</p>
          <div className="space-y-2">
            {classData.schedule.slice(0, 3).map((day) => (
              <div key={day.day} className="text-sm">
                <p className="font-medium">{day.day}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                  {day.periods.slice(0, 4).map((period) => (
                    <div key={period.number} className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium mr-2">
                        {period.number}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{period.subject}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {period.startTime} - {period.endTime}
                        </div>
                      </div>
                    </div>
                  ))}
                  {day.periods.length > 4 && (
                    <div className="text-xs text-muted-foreground col-span-full">
                      + {day.periods.length - 4} more periods
                    </div>
                  )}
                </div>
              </div>
            ))}
            {classData.schedule.length > 3 && (
              <p className="text-xs text-muted-foreground">
                + {classData.schedule.length - 3} more days
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full">
            View Full Timetable
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </DashboardCard>
  );
};

const Classes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredClasses = mockClasses.filter(classData => 
    classData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classData.classTeacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage classes, sections, and timetables</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <BookOpen className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <SearchField 
          placeholder="Search by class name or teacher..." 
          className="w-full md:w-80" 
          onSearch={setSearchTerm}
        />
        <div className="text-sm text-muted-foreground">
          Showing <strong>{filteredClasses.length}</strong> of <strong>{mockClasses.length}</strong> classes
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((classData) => (
          <ClassCard key={classData.id} classData={classData} />
        ))}
      </div>
    </div>
  );
};

export default Classes;
