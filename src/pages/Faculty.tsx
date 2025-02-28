
import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  Filter, 
  MoreHorizontal,
  UserPlus,
  FileSpreadsheet,
  Printer,
  Mail,
  Phone,
  Calendar,
  Bookmark,
  Award
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
import { type Faculty as FacultyType } from '@/types';

// Mock data for demonstration
const mockFaculty: FacultyType[] = Array.from({ length: 15 }, (_, i) => ({
  id: `F${1000 + i}`,
  name: ['Dr. Rajesh Kumar', 'Mrs. Priya Sharma', 'Prof. Amit Singh', 'Dr. Neha Gupta', 'Mr. Vikram Mehta', 'Mrs. Anjali Verma', 'Dr. Sanjay Patel', 'Ms. Pooja Reddy', 'Prof. Raj Malhotra', 'Dr. Ananya Das'][i % 10],
  employeeId: `EMP${2023100 + i}`,
  department: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer Science', 'Physical Education'][i % 7],
  position: ['Senior Teacher', 'Teacher', 'HOD', 'Vice Principal', 'Principal', 'Lab Assistant'][i % 6],
  gender: i % 3 === 0 ? 'Female' : (i % 3 === 1 ? 'Male' : 'Other'),
  subject: [
    ['Algebra', 'Geometry', 'Calculus'][i % 3],
    ['Physics', 'Chemistry', 'Biology'][i % 3],
    ['English Literature', 'Grammar'][i % 2],
  ],
  qualification: ['Ph.D.', 'M.Ed', 'M.Sc', 'B.Ed', 'M.A.'][i % 5],
  contactNumber: `+91 98765${10000 + i}`,
  email: `faculty${i}@schoolsync.edu`,
  joiningDate: `${2010 + (i % 10)}-${(i % 12) + 1}-${(i % 28) + 1}`,
}));

const facultyColumns = [
  {
    accessor: 'employeeId' as keyof FacultyType,
    header: 'Employee ID',
    sortable: true,
  },
  {
    accessor: 'name' as keyof FacultyType,
    header: 'Name',
    sortable: true,
    cell: (faculty: FacultyType) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt={faculty.name} />
          <AvatarFallback>{faculty.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{faculty.name}</p>
          <p className="text-xs text-muted-foreground">{faculty.position}</p>
        </div>
      </div>
    ),
  },
  {
    accessor: 'department' as keyof FacultyType,
    header: 'Department',
    sortable: true,
  },
  {
    accessor: 'subject' as keyof FacultyType,
    header: 'Subjects',
    cell: (faculty: FacultyType) => (
      <div className="flex flex-wrap gap-1">
        {faculty.subject.map((subj, idx) => (
          <Badge key={idx} variant="outline" className="bg-primary/10">
            {subj}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessor: 'contactNumber' as keyof FacultyType,
    header: 'Contact',
    cell: (faculty: FacultyType) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center text-xs">
          <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
          {faculty.contactNumber}
        </div>
        <div className="flex items-center text-xs">
          <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
          {faculty.email}
        </div>
      </div>
    ),
  },
  {
    accessor: 'qualification' as keyof FacultyType,
    header: 'Qualification',
    cell: (faculty: FacultyType) => (
      <div className="flex items-center">
        <Award className="h-3 w-3 mr-1 text-muted-foreground" />
        {faculty.qualification}
      </div>
    ),
  },
  {
    accessor: 'joiningDate' as keyof FacultyType,
    header: 'Joined On',
    sortable: true,
    cell: (faculty: FacultyType) => (
      <div className="flex items-center">
        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
        {new Date(faculty.joiningDate).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessor: 'id' as keyof FacultyType,
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
          <DropdownMenuItem>Performance Report</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const Faculty = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  
  const filteredFaculty = mockFaculty.filter(faculty => {
    const matchesSearch = 
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !selectedDepartment || faculty.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faculty</h1>
          <p className="text-muted-foreground">Manage faculty information and assignments</p>
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
                Print Directory
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
        <div className="text-sm text-muted-foreground w-full md:w-auto text-left md:text-right">
          Showing <strong>{filteredFaculty.length}</strong> of <strong>{mockFaculty.length}</strong> faculty
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
