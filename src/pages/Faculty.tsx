
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
import { Badge } from '@/components/ui/badge';
import SearchField from '@/components/ui/SearchField';
import DataTable from '@/components/ui/DataTable';
import { Faculty } from '@/types';

// Mock data for demonstration
const mockFaculty: Faculty[] = Array.from({ length: 12 }, (_, i) => ({
  id: `F${100 + i}`,
  name: ['Dr. Rajesh Kumar', 'Mrs. Priya Sharma', 'Mr. Amit Singh', 'Dr. Neha Gupta', 'Mr. Vikram Mehta', 'Mrs. Anjali Verma', 'Mr. Sanjay Patel', 'Dr. Pooja Reddy'][i % 8],
  employeeId: `EMP${1000 + i}`,
  department: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physical Education'][i % 7],
  position: ['Principal', 'Vice Principal', 'Head of Department', 'Senior Teacher', 'Teacher', 'Lab Assistant'][i % 5],
  gender: i % 2 === 0 ? 'Male' : 'Female',
  subject: [
    ['Mathematics', 'Physics'],
    ['Biology', 'Chemistry'],
    ['English Literature', 'Grammar'],
    ['Hindi', 'Sanskrit'],
    ['History', 'Civics', 'Geography'],
    ['Computer Science', 'Information Technology'],
    ['Physical Education']
  ][i % 7],
  qualification: ['Ph.D.', 'M.Sc.', 'M.A.', 'B.Ed.', 'M.Tech.'][i % 5],
  contactNumber: `+91 98765${10000 + i}`,
  email: `faculty${i}@schoolsync.edu`,
  joiningDate: `${2010 + (i % 10)}-${(i % 12) + 1}-${(i % 28) + 1}`,
}));

const facultyColumns = [
  {
    accessor: 'employeeId',
    header: 'ID',
    sortable: true,
  },
  {
    accessor: 'name',
    header: 'Name',
    sortable: true,
    cell: (faculty: Faculty) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt={faculty.name} />
          <AvatarFallback>{faculty.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span>{faculty.name}</span>
      </div>
    ),
  },
  {
    accessor: 'department',
    header: 'Department',
    sortable: true,
  },
  {
    accessor: 'position',
    header: 'Position',
    sortable: true,
  },
  {
    accessor: 'subject',
    header: 'Subjects',
    cell: (faculty: Faculty) => (
      <div className="flex flex-wrap gap-1">
        {faculty.subject.map((subject, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {subject}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessor: 'qualification',
    header: 'Qualification',
  },
  {
    accessor: 'contactNumber',
    header: 'Contact',
  },
  {
    accessor: 'id',
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
          <DropdownMenuItem>Assign Classes</DropdownMenuItem>
          <DropdownMenuItem>Performance Evaluation</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const Faculty = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredFaculty = mockFaculty.filter(faculty => 
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faculty</h1>
          <p className="text-muted-foreground">Manage faculty members and staff</p>
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
            Add Faculty
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <SearchField 
          placeholder="Search by name, ID, or department..." 
          className="w-full md:w-80" 
          onSearch={setSearchTerm}
        />
        <div className="text-sm text-muted-foreground">
          Showing <strong>{filteredFaculty.length}</strong> of <strong>{mockFaculty.length}</strong> faculty members
        </div>
      </div>
      
      <div className="rounded-md border">
        <DataTable 
          data={filteredFaculty} 
          columns={facultyColumns} 
          onRowClick={(faculty) => console.log('Clicked faculty:', faculty)}
        />
      </div>
    </div>
  );
};

export default Faculty;
