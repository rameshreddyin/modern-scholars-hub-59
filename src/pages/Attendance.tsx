
import React, { useState } from 'react';
import { 
  CalendarDays, 
  Filter, 
  ArrowLeft,
  ArrowRight,
  Download,
  FileCheck,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  MoreHorizontal
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SearchField from '@/components/ui/SearchField';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DataTable from '@/components/ui/DataTable';
import { type Attendance as AttendanceType } from '@/types';

// Mock data for demonstration
const mockAttendance: AttendanceType[] = Array.from({ length: 40 }, (_, i) => ({
  id: `A${1000 + i}`,
  date: `2023-07-${(i % 30) + 1}`,
  class: `${9 + Math.floor((i % 9) / 3)}`,
  section: ['A', 'B', 'C'][i % 3],
  studentId: `S${1000 + (i % 15)}`,
  studentName: ['Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Neha Gupta', 'Vikram Mehta', 'Anjali Verma', 'Sanjay Kumar', 'Pooja Reddy', 'Raj Malhotra', 'Ananya Das'][i % 10],
  status: (['Present', 'Absent', 'Late', 'Half Day'] as const)[i % 4],
  reason: i % 4 === 1 ? ['Sick leave', 'Family emergency', 'Medical appointment', 'Personal reasons'][i % 4] : undefined,
}));

// Helper function to format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

// Helper function to get status badge
const getStatusBadge = (status: AttendanceType['status']) => {
  switch (status) {
    case 'Present':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Present
        </Badge>
      );
    case 'Absent':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Absent
        </Badge>
      );
    case 'Late':
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
          <Clock className="h-3 w-3 mr-1" />
          Late
        </Badge>
      );
    case 'Half Day':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Half Day
        </Badge>
      );
  }
};

const attendanceColumns = [
  {
    accessor: 'date' as keyof AttendanceType,
    header: 'Date',
    sortable: true,
    cell: (record: AttendanceType) => formatDate(record.date),
  },
  {
    accessor: 'studentName' as keyof AttendanceType,
    header: 'Student',
    sortable: true,
    cell: (record: AttendanceType) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt={record.studentName} />
          <AvatarFallback>{record.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{record.studentName}</p>
          <p className="text-xs text-muted-foreground">ID: {record.studentId}</p>
        </div>
      </div>
    ),
  },
  {
    accessor: (record: AttendanceType) => `${record.class} ${record.section}`,
    header: 'Class',
    sortable: true,
    cell: (record: AttendanceType) => (
      <div>
        <p>Class {record.class} {record.section}</p>
      </div>
    ),
  },
  {
    accessor: 'status' as keyof AttendanceType,
    header: 'Status',
    sortable: true,
    cell: (record: AttendanceType) => getStatusBadge(record.status),
  },
  {
    accessor: 'reason' as keyof AttendanceType,
    header: 'Reason',
    cell: (record: AttendanceType) => (
      <div>{record.reason || '-'}</div>
    ),
  },
  {
    accessor: 'id' as keyof AttendanceType,
    header: '',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Edit Record</DropdownMenuItem>
          <DropdownMenuItem>View Student Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Delete Record</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const AttendanceSummaryCard = () => {
  return (
    <DashboardCard>
      <h3 className="font-semibold mb-4">Today's Attendance Summary</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">85%</div>
          <div className="text-sm text-muted-foreground">Present</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">8%</div>
          <div className="text-sm text-muted-foreground">Absent</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">5%</div>
          <div className="text-sm text-muted-foreground">Late</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">2%</div>
          <div className="text-sm text-muted-foreground">Half Day</div>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
        <div className="flex h-full">
          <div className="bg-green-500 h-full" style={{ width: '85%' }}></div>
          <div className="bg-red-500 h-full" style={{ width: '8%' }}></div>
          <div className="bg-amber-500 h-full" style={{ width: '5%' }}></div>
          <div className="bg-blue-500 h-full" style={{ width: '2%' }}></div>
        </div>
      </div>
    </DashboardCard>
  );
};

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const filteredAttendance = mockAttendance.filter(record => {
    const matchesSearch = 
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = !selectedClass || `${record.class} ${record.section}` === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Manage and track student attendance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <CalendarDays className="mr-2 h-4 w-4" />
            {formatDate(selectedDate)}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <FileCheck className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileCheck className="mr-2 h-4 w-4" />
                Mark Today's Attendance
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Import Attendance Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Attendance Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <AttendanceSummaryCard />
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="present">Present</TabsTrigger>
          <TabsTrigger value="absent">Absent</TabsTrigger>
          <TabsTrigger value="late">Late</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <SearchField 
              placeholder="Search by student name or ID..." 
              className="w-full sm:w-80" 
              onSearch={setSearchTerm}
            />
            <Select onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9 A">Class 9 A</SelectItem>
                <SelectItem value="9 B">Class 9 B</SelectItem>
                <SelectItem value="9 C">Class 9 C</SelectItem>
                <SelectItem value="10 A">Class 10 A</SelectItem>
                <SelectItem value="10 B">Class 10 B</SelectItem>
                <SelectItem value="10 C">Class 10 C</SelectItem>
                <SelectItem value="11 A">Class 11 A</SelectItem>
                <SelectItem value="11 B">Class 11 B</SelectItem>
                <SelectItem value="11 C">Class 11 C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground w-full md:w-auto text-left md:text-right">
            Showing <strong>{filteredAttendance.length}</strong> of <strong>{mockAttendance.length}</strong> records
          </div>
        </div>
        
        <TabsContent value="all" className="m-0">
          <div className="rounded-md border">
            <DataTable 
              data={filteredAttendance} 
              columns={attendanceColumns} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="present" className="m-0">
          <div className="rounded-md border">
            <DataTable 
              data={filteredAttendance.filter(record => record.status === 'Present')} 
              columns={attendanceColumns} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="absent" className="m-0">
          <div className="rounded-md border">
            <DataTable 
              data={filteredAttendance.filter(record => record.status === 'Absent')} 
              columns={attendanceColumns} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="late" className="m-0">
          <div className="rounded-md border">
            <DataTable 
              data={filteredAttendance.filter(record => record.status === 'Late')} 
              columns={attendanceColumns} 
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Day
        </Button>
        <Button variant="outline" size="sm">
          Next Day
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Attendance;
