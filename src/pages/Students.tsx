
import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  Filter, 
  MoreHorizontal,
  UserPlus,
  FileSpreadsheet,
  Printer
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SearchField from '@/components/ui/SearchField';
import DataTable from '@/components/ui/DataTable';
import { type Student } from '@/types';

// Mock data for demonstration
const mockStudents: Student[] = Array.from({ length: 15 }, (_, i) => ({
  id: `S${1000 + i}`,
  name: ['Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Neha Gupta', 'Vikram Mehta', 'Anjali Verma', 'Sanjay Kumar', 'Pooja Reddy', 'Raj Malhotra', 'Ananya Das'][i % 10],
  rollNumber: `R${2023100 + i}`,
  standard: `${Math.floor(i / 3) + 9}`,
  section: ['A', 'B', 'C'][i % 3],
  gender: i % 3 === 0 ? 'Female' : (i % 3 === 1 ? 'Male' : 'Other'),
  attendancePercentage: 80 + Math.floor(Math.random() * 20),
  parentName: ['Mr. Rajesh Sharma', 'Mrs. Meena Patel', 'Mr. Ajay Singh', 'Mr. Rakesh Gupta', 'Mrs. Seema Mehta'][i % 5],
  contactNumber: `+91 98765${10000 + i}`,
  address: 'Sector 123, New Delhi, India',
  dateOfBirth: `${2000 + (i % 5)}-${(i % 12) + 1}-${(i % 28) + 1}`,
  admissionDate: `2023-${(i % 12) + 1}-${(i % 28) + 1}`,
}));

const studentsColumns = [
  {
    accessor: 'rollNumber' as keyof Student,
    header: 'Roll No.',
    sortable: true,
  },
  {
    accessor: 'name' as keyof Student,
    header: 'Name',
    sortable: true,
    cell: (student: Student) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt={student.name} />
          <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span>{student.name}</span>
      </div>
    ),
  },
  {
    accessor: (student: Student) => `${student.standard} ${student.section}`,
    header: 'Class',
    sortable: true,
  },
  {
    accessor: 'gender' as keyof Student,
    header: 'Gender',
    sortable: true,
  },
  {
    accessor: 'parentName' as keyof Student,
    header: 'Parent Name',
    sortable: true,
  },
  {
    accessor: 'contactNumber' as keyof Student,
    header: 'Contact',
  },
  {
    accessor: 'attendancePercentage' as keyof Student,
    header: 'Attendance',
    sortable: true,
    cell: (student: Student) => {
      const percentage = student.attendancePercentage;
      let color = 'bg-green-500';
      
      if (percentage < 85) color = 'bg-yellow-500';
      if (percentage < 75) color = 'bg-red-500';
      
      return (
        <div className="flex items-center">
          <div className="h-2.5 w-16 rounded-full bg-gray-200 mr-2">
            <div
              className={`h-2.5 rounded-full ${color}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span>{percentage}%</span>
        </div>
      );
    },
  },
  {
    accessor: 'id' as keyof Student,
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
          <DropdownMenuItem>View Profile</DropdownMenuItem>
          <DropdownMenuItem>Edit Details</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Attendance History</DropdownMenuItem>
          <DropdownMenuItem>Performance Report</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage student information and records</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Print List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <SearchField 
          placeholder="Search by name or roll number..." 
          className="w-full md:w-80" 
          onSearch={setSearchTerm}
        />
        <div className="text-sm text-muted-foreground">
          Showing <strong>{filteredStudents.length}</strong> of <strong>{mockStudents.length}</strong> students
        </div>
      </div>
      
      <div className="rounded-md border">
        <DataTable 
          data={filteredStudents} 
          columns={studentsColumns} 
          onRowClick={(student) => console.log('Clicked student:', student)}
        />
      </div>
    </div>
  );
};

export default Students;
