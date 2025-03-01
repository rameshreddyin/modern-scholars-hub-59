
import React, { useState } from 'react';
import { 
  Plus, 
  FileSpreadsheet, 
  ClipboardCheck, 
  Edit, 
  Trash2, 
  Filter,
  Download, 
  Calendar, 
  Eye, 
  Shuffle,
  Upload,
  SortAsc
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SearchField from '@/components/ui/SearchField';
import DataTable from '@/components/ui/DataTable';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Sheet, 
  SheetClose, 
  SheetContent, 
  SheetDescription, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Exam, ExamResult, ExamSeatingArrangement } from '@/types';

// Mock data for exams
const mockExams: Exam[] = Array.from({ length: 8 }, (_, i) => ({
  id: `E${1000 + i}`,
  name: ['Mid Term Examination', 'Final Term Examination', 'Unit Test 1', 'Unit Test 2', 'Annual Examination', 'Quarterly Assessment', 'Half Yearly Examination', 'Pre-Board Examination'][i],
  description: 'Examination for evaluating student performance',
  startDate: `2023-${(i % 3) + 4}-${(i % 20) + 1}`,
  endDate: `2023-${(i % 3) + 4}-${(i % 20) + 10}`,
  examType: ['Mid Term', 'Final Term', 'Unit Test', 'Annual Exam', 'Other'][i % 5] as Exam['examType'],
  classes: ['9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'].slice(0, (i % 4) + 1),
  subjects: Array.from({ length: 3 }, (_, j) => ({
    subjectId: `S${100 + j}`,
    subjectName: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'][j % 8],
    examDate: `2023-${(i % 3) + 4}-${(i % 20) + j + 1}`,
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    maxMarks: 100,
    passingMarks: 35,
    venue: `Room ${101 + j}`
  })),
  status: ['Draft', 'Published', 'Completed', 'Cancelled'][i % 4] as Exam['status'],
  createdBy: 'Admin',
  createdAt: '2023-03-01T10:00:00Z',
  updatedAt: '2023-03-05T15:30:00Z'
}));

// Mock data for results
const mockResults: ExamResult[] = Array.from({ length: 10 }, (_, i) => {
  const totalMarks = 300;
  const obtainedMarks = Math.floor(Math.random() * 150) + 150;
  const percentage = (obtainedMarks / totalMarks) * 100;
  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B+';
  else if (percentage >= 60) grade = 'B';
  else if (percentage >= 50) grade = 'C';
  else if (percentage >= 40) grade = 'D';
  else if (percentage >= 33) grade = 'E';
  
  return {
    id: `R${2000 + i}`,
    examId: `E${1000 + (i % 8)}`,
    examName: mockExams[i % 8].name,
    studentId: `S${100 + i}`,
    studentName: ['Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Neha Gupta', 'Vikram Mehta', 'Anjali Verma', 'Sanjay Kumar', 'Pooja Reddy', 'Raj Malhotra', 'Ananya Das'][i],
    studentRollNumber: `R${2023100 + i}`,
    class: `${9 + (i % 4)}`,
    section: ['A', 'B', 'C'][i % 3],
    subjects: Array.from({ length: 3 }, (_, j) => {
      const max = 100;
      const obtained = Math.floor(Math.random() * 35) + 65;
      let subGrade = 'F';
      const subPercentage = (obtained / max) * 100;
      if (subPercentage >= 90) subGrade = 'A+';
      else if (subPercentage >= 80) subGrade = 'A';
      else if (subPercentage >= 70) subGrade = 'B+';
      else if (subPercentage >= 60) subGrade = 'B';
      else if (subPercentage >= 50) subGrade = 'C';
      else if (subPercentage >= 40) subGrade = 'D';
      else if (subPercentage >= 33) subGrade = 'E';
      
      return {
        subjectId: `S${100 + j}`,
        subjectName: ['Mathematics', 'Physics', 'Chemistry'][j],
        maxMarks: max,
        obtainedMarks: obtained,
        grade: subGrade,
        status: obtained >= 35 ? 'Pass' : 'Fail' as 'Pass' | 'Fail' | 'Absent'
      };
    }),
    totalMarks,
    obtainedMarks,
    percentage,
    grade,
    remarks: percentage >= 60 ? 'Excellent performance' : percentage >= 40 ? 'Satisfactory' : 'Needs improvement',
    rank: i + 1,
    status: percentage >= 33 ? 'Pass' : 'Fail' as 'Pass' | 'Fail' | 'Absent',
    publishDate: '2023-05-15'
  };
});

// Mock data for seating arrangements
const mockSeatingArrangements: ExamSeatingArrangement[] = Array.from({ length: 5 }, (_, i) => ({
  id: `SA${3000 + i}`,
  examId: `E${1000 + (i % 8)}`,
  examName: mockExams[i % 8].name,
  room: `Room ${101 + i}`,
  date: `2023-${(i % 3) + 4}-${(i % 20) + 5}`,
  startTime: '09:00 AM',
  endTime: '12:00 PM',
  totalSeats: 30,
  invigilators: ['Mr. Rajesh Kumar', 'Mrs. Sunita Sharma'],
  seatingPlan: Array.from({ length: 10 }, (_, j) => ({
    studentId: `S${100 + (i * 10) + j}`,
    studentName: ['Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Neha Gupta', 'Vikram Mehta', 'Anjali Verma', 'Sanjay Kumar', 'Pooja Reddy', 'Raj Malhotra', 'Ananya Das'][j],
    rollNumber: `R${2023100 + (i * 10) + j}`,
    class: `${9 + (j % 4)}`,
    section: ['A', 'B', 'C'][j % 3],
    seatNumber: `${String.fromCharCode(65 + j % 5)}${Math.floor(j / 5) + 1}`
  }))
}));

const examColumns = [
  {
    accessor: 'name' as keyof Exam,
    header: 'Exam Name',
    sortable: true,
  },
  {
    accessor: 'examType' as keyof Exam,
    header: 'Type',
    sortable: true,
  },
  {
    accessor: (exam: Exam) => `${exam.startDate} to ${exam.endDate}`,
    header: 'Duration',
    sortable: true,
  },
  {
    accessor: (exam: Exam) => exam.classes.join(', '),
    header: 'Classes',
  },
  {
    accessor: 'status' as keyof Exam,
    header: 'Status',
    sortable: true,
    cell: (exam: Exam) => {
      const status = exam.status;
      let bgColor = 'bg-gray-100 text-gray-800';
      
      if (status === 'Published') bgColor = 'bg-blue-100 text-blue-800';
      else if (status === 'Completed') bgColor = 'bg-green-100 text-green-800';
      else if (status === 'Cancelled') bgColor = 'bg-red-100 text-red-800';
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessor: 'id' as keyof Exam,
    header: 'Actions',
    cell: (exam: Exam) => (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <SortAsc className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Shuffle className="mr-2 h-4 w-4" />
              Generate Seating Plan
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Upload className="mr-2 h-4 w-4" />
              Upload Results
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Publish Results
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

const resultColumns = [
  {
    accessor: 'studentName' as keyof ExamResult,
    header: 'Student Name',
    sortable: true,
  },
  {
    accessor: 'studentRollNumber' as keyof ExamResult,
    header: 'Roll No.',
    sortable: true,
  },
  {
    accessor: (result: ExamResult) => `${result.class} ${result.section}`,
    header: 'Class',
    sortable: true,
  },
  {
    accessor: 'obtainedMarks' as keyof ExamResult,
    header: 'Marks',
    cell: (result: ExamResult) => (
      <span>{result.obtainedMarks}/{result.totalMarks}</span>
    ),
  },
  {
    accessor: 'percentage' as keyof ExamResult,
    header: 'Percentage',
    cell: (result: ExamResult) => (
      <span>{result.percentage.toFixed(2)}%</span>
    ),
  },
  {
    accessor: 'grade' as keyof ExamResult,
    header: 'Grade',
    sortable: true,
    cell: (result: ExamResult) => {
      const grade = result.grade;
      let bgColor = 'bg-gray-100 text-gray-800';
      
      if (grade === 'A+' || grade === 'A') bgColor = 'bg-green-100 text-green-800';
      else if (grade === 'B+' || grade === 'B') bgColor = 'bg-blue-100 text-blue-800';
      else if (grade === 'C') bgColor = 'bg-yellow-100 text-yellow-800';
      else if (grade === 'D' || grade === 'E') bgColor = 'bg-orange-100 text-orange-800';
      else if (grade === 'F') bgColor = 'bg-red-100 text-red-800';
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
          {grade}
        </span>
      );
    },
  },
  {
    accessor: 'status' as keyof ExamResult,
    header: 'Status',
    sortable: true,
    cell: (result: ExamResult) => {
      const status = result.status;
      let bgColor = status === 'Pass' ? 'bg-green-100 text-green-800' : 
                   status === 'Fail' ? 'bg-red-100 text-red-800' : 
                   'bg-gray-100 text-gray-800';
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessor: 'rank' as keyof ExamResult,
    header: 'Rank',
    sortable: true,
  },
  {
    accessor: 'id' as keyof ExamResult,
    header: 'Actions',
    cell: (result: ExamResult) => (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

const Exams = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewExamDialog, setShowNewExamDialog] = useState(false);
  const [showUploadResultsSheet, setShowUploadResultsSheet] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  
  // Filter exams based on search term
  const filteredExams = mockExams.filter(exam => 
    exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.examType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter results based on search term and selected exam
  const filteredResults = mockResults.filter(result => 
    (selectedExam ? result.examId === selectedExam : true) &&
    (result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.studentRollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // New Exam Form State
  const [newExam, setNewExam] = useState({
    name: '',
    description: '',
    examType: 'Mid Term',
    startDate: '',
    endDate: '',
    classes: [] as string[],
  });
  
  const handleNewExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New Exam:', newExam);
    setShowNewExamDialog(false);
    // Reset form
    setNewExam({
      name: '',
      description: '',
      examType: 'Mid Term',
      startDate: '',
      endDate: '',
      classes: [],
    });
  };
  
  // Display seating arrangement for a selected exam
  const renderSeatingArrangement = () => {
    const arrangement = mockSeatingArrangements[0];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{arrangement.examName}</h2>
            <p className="text-muted-foreground">
              {arrangement.date} • {arrangement.startTime} - {arrangement.endTime} • {arrangement.room}
            </p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        
        <div className="grid grid-cols-5 gap-4">
          {arrangement.seatingPlan.map((seat, index) => (
            <div key={index} className="border rounded-md p-3 bg-white shadow-sm">
              <div className="text-lg font-bold text-center mb-1">{seat.seatNumber}</div>
              <div className="text-sm text-center">{seat.studentName}</div>
              <div className="text-xs text-muted-foreground text-center">
                {seat.class} {seat.section} • {seat.rollNumber}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Invigilators</h3>
          <div className="flex gap-2">
            {arrangement.invigilators.map((inv, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {inv}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Upload Results component
  const UploadResultsSheet = () => (
    <Sheet open={showUploadResultsSheet} onOpenChange={setShowUploadResultsSheet}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Upload Results</SheetTitle>
          <SheetDescription>
            Upload examination results in CSV or Excel format.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="exam">Exam</Label>
            <select
              id="exam"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Exam</option>
              {mockExams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Result Sheet</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-muted-foreground mb-1">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports CSV, Excel (.xlsx)
              </p>
              <Input
                id="file"
                type="file"
                className="hidden"
                accept=".csv,.xlsx"
              />
              <Button variant="outline" size="sm" className="mt-4">
                Browse Files
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template">Download Template</Label>
            <Button variant="outline" size="sm" className="w-full flex justify-center items-center">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Download Result Template
            </Button>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Upload and Process</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
  
  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Examinations</h1>
          <p className="text-muted-foreground">Manage exams, results, and grading</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Exam Calendar
          </Button>
          <Button size="sm" onClick={() => setShowNewExamDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="seating">Seating Plans</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <SearchField 
              placeholder={activeTab === 'exams' ? "Search exams..." : "Search by student name or roll number..."} 
              className="w-full md:w-80" 
              onSearch={setSearchTerm}
            />
            
            {activeTab === 'results' && (
              <div className="flex gap-2 items-center">
                <Label htmlFor="exam-filter" className="mr-2">Exam:</Label>
                <select
                  id="exam-filter"
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedExam || ''}
                  onChange={(e) => setSelectedExam(e.target.value || null)}
                >
                  <option value="">All Exams</option>
                  {mockExams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowUploadResultsSheet(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Results
                </Button>
              </div>
            )}
          </div>
          
          <TabsContent value="exams" className="border rounded-md">
            <DataTable 
              data={filteredExams} 
              columns={examColumns} 
            />
          </TabsContent>
          
          <TabsContent value="results" className="border rounded-md">
            <DataTable 
              data={filteredResults} 
              columns={resultColumns} 
            />
          </TabsContent>
          
          <TabsContent value="seating" className="border rounded-md p-6">
            {renderSeatingArrangement()}
          </TabsContent>
        </div>
      </Tabs>
      
      {/* New Exam Dialog */}
      <Dialog open={showNewExamDialog} onOpenChange={setShowNewExamDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Exam</DialogTitle>
            <DialogDescription>
              Enter the details for the new examination.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleNewExamSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exam-name">Exam Name</Label>
                <Input
                  id="exam-name"
                  placeholder="e.g. Mid-Term Examination 2023"
                  value={newExam.name}
                  onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exam-type">Exam Type</Label>
                <select
                  id="exam-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newExam.examType}
                  onChange={(e) => setNewExam({...newExam, examType: e.target.value as Exam['examType']})}
                  required
                >
                  <option value="Mid Term">Mid Term</option>
                  <option value="Final Term">Final Term</option>
                  <option value="Unit Test">Unit Test</option>
                  <option value="Annual Exam">Annual Exam</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newExam.startDate}
                    onChange={(e) => setNewExam({...newExam, startDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newExam.endDate}
                    onChange={(e) => setNewExam({...newExam, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="classes">Classes</Label>
                <div className="grid grid-cols-4 gap-2">
                  {['9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'].map((cls) => (
                    <label key={cls} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={cls}
                        checked={newExam.classes.includes(cls)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewExam({...newExam, classes: [...newExam.classes, cls]});
                          } else {
                            setNewExam({...newExam, classes: newExam.classes.filter(c => c !== cls)});
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span>{cls}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea
                  id="description"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter additional details about the examination"
                  value={newExam.description}
                  onChange={(e) => setNewExam({...newExam, description: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowNewExamDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Exam</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Upload Results Sheet */}
      <UploadResultsSheet />
    </div>
  );
};

export default Exams;
