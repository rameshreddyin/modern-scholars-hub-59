
import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from '@/components/ui/DataTable';
import { 
  ChartBar, 
  Users, 
  Clock, 
  Edit, 
  UserPlus, 
  Medal,
  CheckCircle,
  Download,
  AlertTriangle,
  Pencil
} from 'lucide-react';
import { Class, Student } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogHeader,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

interface ClassDetailViewProps {
  classData: Class;
}

interface StudentData {
  id: string;
  name: string;
  gender: 'F' | 'M';
  academicAverage: number;
  attendancePercentage: number;
  rollNumber: string;
}

// Mock student data - replace with actual data in production
const mockStudents: StudentData[] = Array.from({ length: 20 }, (_, i) => ({
  id: `STU${i + 1}`,
  name: `${i % 2 === 0 ? 'Sarah Wilson' : 'John Smith'} ${i + 1}`,
  gender: i % 2 === 0 ? 'F' : 'M',
  academicAverage: 75 + Math.random() * 20,
  attendancePercentage: 80 + Math.random() * 15,
  rollNumber: `${2024}${i + 1}`.padStart(8, '0'),
}));

const ClassDetailView: React.FC<ClassDetailViewProps> = ({ classData: initialClassData }) => {
  const { toast } = useToast();
  const [classData, setClassData] = useState<Class>(initialClassData);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTeacherEditOpen, setIsTeacherEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: classData.name,
    standard: classData.standard,
    section: classData.section,
    room: classData.room,
    maxStrength: classData.maxStrength || 50
  });
  const [teacherFormData, setTeacherFormData] = useState({
    classTeacher: classData.classTeacher
  });
  const [students, setStudents] = useState<StudentData[]>(mockStudents);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [isAssignRollNumbersOpen, setIsAssignRollNumbersOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [rollNumberPrefix, setRollNumberPrefix] = useState(`${classData.standard}${classData.section}`);

  const sortedStudents = [...students].sort((a, b) => {
    // Sort by gender (F first) then by name
    if (a.gender !== b.gender) {
      return a.gender === 'F' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const studentColumns = [
    {
      accessor: 'rollNumber' as keyof StudentData,
      header: 'Roll No.',
      sortable: true,
      cell: (row: StudentData) => (
        <div className="font-mono text-sm">{row.rollNumber}</div>
      ),
    },
    {
      accessor: 'name' as keyof StudentData,
      header: 'Student Name',
      sortable: true,
      cell: (row: StudentData) => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            row.gender === 'F' ? "bg-pink-400" : "bg-blue-400"
          )} />
          {row.name}
        </div>
      ),
    },
    {
      accessor: 'academicAverage' as keyof StudentData,
      header: 'Academic Average',
      sortable: true,
      cell: (row: StudentData) => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "px-2 py-1 rounded text-xs font-medium",
            row.academicAverage >= 90 ? "bg-green-100 text-green-700" :
            row.academicAverage >= 75 ? "bg-blue-100 text-blue-700" :
            "bg-yellow-100 text-yellow-700"
          )}>
            {row.academicAverage.toFixed(1)}%
          </div>
        </div>
      ),
    },
    {
      accessor: 'attendancePercentage' as keyof StudentData,
      header: 'Attendance',
      sortable: true,
      cell: (row: StudentData) => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "px-2 py-1 rounded text-xs font-medium",
            row.attendancePercentage >= 90 ? "bg-green-100 text-green-700" :
            row.attendancePercentage >= 75 ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700"
          )}>
            {row.attendancePercentage.toFixed(1)}%
          </div>
        </div>
      ),
    },
    {
      accessor: 'id' as keyof StudentData,
      header: 'Actions',
      cell: (row: StudentData) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleEditStudent(row);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const handleEditClassDetails = () => {
    setEditFormData({
      name: classData.name,
      standard: classData.standard,
      section: classData.section,
      room: classData.room,
      maxStrength: classData.maxStrength || 50
    });
    setIsEditOpen(true);
  };

  const handleEditTeacher = () => {
    setTeacherFormData({
      classTeacher: classData.classTeacher
    });
    setIsTeacherEditOpen(true);
  };

  const handleEditStudent = (student: StudentData) => {
    setSelectedStudent(student);
    setIsEditStudentOpen(true);
  };

  const saveClassDetails = () => {
    const updatedClassData = {
      ...classData,
      name: `Class ${editFormData.standard} ${editFormData.section}`,
      standard: editFormData.standard,
      section: editFormData.section,
      room: editFormData.room,
      maxStrength: editFormData.maxStrength
    };
    
    setClassData(updatedClassData);
    setIsEditOpen(false);
    
    toast({
      title: "Class Updated",
      description: "Class details have been successfully updated.",
    });
  };

  const saveTeacherDetails = () => {
    const updatedClassData = {
      ...classData,
      classTeacher: teacherFormData.classTeacher
    };
    
    setClassData(updatedClassData);
    setIsTeacherEditOpen(false);
    
    toast({
      title: "Class Teacher Updated",
      description: "Class teacher has been successfully updated.",
    });
  };

  const saveStudentDetails = () => {
    if (!selectedStudent) return;
    
    const updatedStudents = students.map(student => 
      student.id === selectedStudent.id ? selectedStudent : student
    );
    
    setStudents(updatedStudents);
    setIsEditStudentOpen(false);
    setSelectedStudent(null);
    
    toast({
      title: "Student Updated",
      description: "Student details have been successfully updated.",
    });
  };

  const assignRollNumbers = () => {
    const updatedStudents = [...sortedStudents].map((student, index) => ({
      ...student,
      rollNumber: `${rollNumberPrefix}${(index + 1).toString().padStart(2, '0')}`
    }));
    
    setStudents(updatedStudents);
    setIsAssignRollNumbersOpen(false);
    
    toast({
      title: "Roll Numbers Assigned",
      description: "Roll numbers have been successfully assigned to all students.",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{classData.name}</h2>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">
              Room {classData.room} • {classData.totalStudents} Students 
              {classData.maxStrength && (
                <span className="text-xs text-muted-foreground"> / {classData.maxStrength} max</span>
              )}
            </p>
            <Button variant="outline" size="sm" onClick={handleEditClassDetails}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-medium">Class Teacher</div>
            <div className="text-muted-foreground">{classData.classTeacher}</div>
          </div>
          <Button variant="outline" size="sm" onClick={handleEditTeacher}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.totalStudents}</div>
            {classData.maxStrength && (
              <p className="text-xs text-muted-foreground mt-1">
                {((classData.totalStudents / classData.maxStrength) * 100).toFixed(0)}% capacity filled
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.subjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Student List</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsAssignRollNumbersOpen(true)}>
                <Medal className="h-4 w-4 mr-2" />
                Assign Roll Numbers
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <DataTable
                data={sortedStudents}
                columns={studentColumns}
                onRowClick={handleEditStudent}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetable">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Weekly Timetable</CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Timetable
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Period</TableHead>
                      <TableHead>Monday</TableHead>
                      <TableHead>Tuesday</TableHead>
                      <TableHead>Wednesday</TableHead>
                      <TableHead>Thursday</TableHead>
                      <TableHead>Friday</TableHead>
                      <TableHead>Saturday</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 6 }, (_, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {i + 1} <span className="text-xs text-muted-foreground block">
                            {`${(8 + Math.floor(i/2) + (i % 2 === 0 ? 0 : 0.45)).toFixed(2).replace('.', ':')}${i % 2 === 0 ? '0' : ''}${i >= 2 ? (i >= 4 ? ' pm' : '') : ' am'} - ${(8 + Math.floor((i+1)/2) + ((i+1) % 2 === 0 ? 0 : 0.45)).toFixed(2).replace('.', ':')}${(i+1) % 2 === 0 ? '0' : ''}${i >= 1 ? (i >= 3 ? ' pm' : '') : ' am'}`}
                          </span>
                        </TableCell>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                          const schedule = classData.schedule?.find(s => s.day === day)
                          const period = schedule?.periods.find(p => p.number === i + 1)
                          return (
                            <TableCell key={day}>
                              {period ? (
                                <div>
                                  <div className="font-medium">{period.subject}</div>
                                  <div className="text-xs text-muted-foreground">{period.teacher}</div>
                                </div>
                              ) : <span className="text-muted-foreground">-</span>}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
            <Card className={cn(
              classData.performanceMetrics?.averageAttendance && classData.performanceMetrics.averageAttendance >= 90 
                ? "bg-green-50 border-green-200" 
                : classData.performanceMetrics?.averageAttendance && classData.performanceMetrics.averageAttendance >= 75 
                ? "bg-yellow-50 border-yellow-200"
                : "bg-red-50 border-red-200"
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Average Attendance
                  <CheckCircle className={cn(
                    "h-4 w-4",
                    classData.performanceMetrics?.averageAttendance && classData.performanceMetrics.averageAttendance >= 90 
                      ? "text-green-500" 
                      : classData.performanceMetrics?.averageAttendance && classData.performanceMetrics.averageAttendance >= 75 
                      ? "text-yellow-500"
                      : "text-red-500"
                  )} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {classData.performanceMetrics?.averageAttendance 
                    ? `${classData.performanceMetrics.averageAttendance.toFixed(1)}%` 
                    : "N/A"}
                </div>
                <div className="text-xs mt-1">
                  {classData.performanceMetrics?.averageAttendance && classData.performanceMetrics.averageAttendance >= 90 
                    ? "Excellent attendance" 
                    : classData.performanceMetrics?.averageAttendance && classData.performanceMetrics.averageAttendance >= 75 
                    ? "Average attendance"
                    : "Needs improvement"}
                </div>
              </CardContent>
            </Card>
            
            <Card className={cn(
              classData.performanceMetrics?.averageAcademics && classData.performanceMetrics.averageAcademics >= 80 
                ? "bg-green-50 border-green-200" 
                : classData.performanceMetrics?.averageAcademics && classData.performanceMetrics.averageAcademics >= 65 
                ? "bg-yellow-50 border-yellow-200"
                : "bg-red-50 border-red-200"
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Academic Performance
                  <Medal className={cn(
                    "h-4 w-4",
                    classData.performanceMetrics?.averageAcademics && classData.performanceMetrics.averageAcademics >= 80 
                      ? "text-green-500" 
                      : classData.performanceMetrics?.averageAcademics && classData.performanceMetrics.averageAcademics >= 65 
                      ? "text-yellow-500"
                      : "text-red-500"
                  )} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {classData.performanceMetrics?.averageAcademics 
                    ? `${classData.performanceMetrics.averageAcademics.toFixed(1)}%` 
                    : "N/A"}
                </div>
                <div className="text-xs mt-1">
                  {classData.performanceMetrics?.averageAcademics && classData.performanceMetrics.averageAcademics >= 80 
                    ? "Above target" 
                    : classData.performanceMetrics?.averageAcademics && classData.performanceMetrics.averageAcademics >= 65 
                    ? "On target"
                    : "Below target"}
                </div>
              </CardContent>
            </Card>
            
            <Card className={cn(
              classData.performanceMetrics?.passPercentage && classData.performanceMetrics.passPercentage >= 95 
                ? "bg-green-50 border-green-200" 
                : classData.performanceMetrics?.passPercentage && classData.performanceMetrics.passPercentage >= 80 
                ? "bg-yellow-50 border-yellow-200"
                : "bg-red-50 border-red-200"
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Pass Rate
                  {classData.performanceMetrics?.passPercentage && classData.performanceMetrics.passPercentage < 80 && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {classData.performanceMetrics?.passPercentage 
                    ? `${classData.performanceMetrics.passPercentage.toFixed(1)}%` 
                    : "N/A"}
                </div>
                <div className="text-xs mt-1">
                  {classData.performanceMetrics?.passPercentage && classData.performanceMetrics.passPercentage >= 95 
                    ? "Excellent" 
                    : classData.performanceMetrics?.passPercentage && classData.performanceMetrics.passPercentage >= 80 
                    ? "Good"
                    : "Needs improvement"}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Performance by Gender</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Female Students</div>
                          <div className="text-2xl font-bold">88.2%</div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                          <div className="h-6 w-6 rounded-full bg-pink-400"></div>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Male Students</div>
                          <div className="text-2xl font-bold">83.7%</div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <div className="h-6 w-6 rounded-full bg-blue-400"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Grade Distribution</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { grade: 'A', percent: 30, color: 'bg-green-500' },
                      { grade: 'B', percent: 40, color: 'bg-blue-500' },
                      { grade: 'C', percent: 20, color: 'bg-yellow-500' },
                      { grade: 'D', percent: 10, color: 'bg-red-500' }
                    ].map(grade => (
                      <div key={grade.grade} className="flex flex-col items-center">
                        <div className="text-lg font-bold">{grade.grade}</div>
                        <div className="h-24 w-4 bg-gray-200 rounded-full overflow-hidden relative my-2">
                          <div
                            className={`absolute bottom-0 w-full ${grade.color}`}
                            style={{ height: `${grade.percent}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-muted-foreground">{grade.percent}%</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Subject Performance</h4>
                  <div className="space-y-2">
                    {classData.subjects.slice(0, 5).map((subject, index) => (
                      <div key={subject} className="flex items-center gap-2">
                        <div className="w-40 font-medium truncate">{subject}</div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              index % 3 === 0 ? "bg-green-500" :
                              index % 3 === 1 ? "bg-blue-500" : "bg-yellow-500"
                            )}
                            style={{ width: `${70 + (Math.random() * 20)}%` }}
                          ></div>
                        </div>
                        <div className="text-sm font-medium">{(70 + (Math.random() * 20)).toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Class Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class Details</DialogTitle>
            <DialogDescription>
              Update the details for this class.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="standard">Standard</Label>
                <Input
                  id="standard"
                  value={editFormData.standard}
                  onChange={(e) => setEditFormData({...editFormData, standard: e.target.value})}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  value={editFormData.section}
                  onChange={(e) => setEditFormData({...editFormData, section: e.target.value})}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={editFormData.room}
                onChange={(e) => setEditFormData({...editFormData, room: e.target.value})}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="maxStrength">Maximum Strength</Label>
              <Input
                id="maxStrength"
                type="number"
                value={editFormData.maxStrength}
                onChange={(e) => setEditFormData({...editFormData, maxStrength: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={saveClassDetails}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Dialog */}
      <Dialog open={isTeacherEditOpen} onOpenChange={setIsTeacherEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class Teacher</DialogTitle>
            <DialogDescription>
              Update the class teacher for this class.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="classTeacher">Class Teacher</Label>
              <Input
                id="classTeacher"
                value={teacherFormData.classTeacher}
                onChange={(e) => setTeacherFormData({...teacherFormData, classTeacher: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTeacherEditOpen(false)}>Cancel</Button>
            <Button onClick={saveTeacherDetails}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student information.
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  value={selectedStudent.name}
                  onChange={(e) => setSelectedStudent({...selectedStudent, name: e.target.value})}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  value={selectedStudent.rollNumber}
                  onChange={(e) => setSelectedStudent({...selectedStudent, rollNumber: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="academicAverage">Academic Average</Label>
                  <Input
                    id="academicAverage"
                    type="number"
                    value={selectedStudent.academicAverage}
                    onChange={(e) => setSelectedStudent({...selectedStudent, academicAverage: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="attendancePercentage">Attendance %</Label>
                  <Input
                    id="attendancePercentage"
                    type="number"
                    value={selectedStudent.attendancePercentage}
                    onChange={(e) => setSelectedStudent({...selectedStudent, attendancePercentage: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditStudentOpen(false)}>Cancel</Button>
            <Button onClick={saveStudentDetails}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Roll Numbers Dialog */}
      <Dialog open={isAssignRollNumbersOpen} onOpenChange={setIsAssignRollNumbersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Roll Numbers</DialogTitle>
            <DialogDescription>
              Auto-assign roll numbers to all students in the class.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="rollNumberPrefix">Roll Number Prefix</Label>
              <Input
                id="rollNumberPrefix"
                value={rollNumberPrefix}
                onChange={(e) => setRollNumberPrefix(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Roll numbers will be assigned as: {rollNumberPrefix}01, {rollNumberPrefix}02, etc.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignRollNumbersOpen(false)}>Cancel</Button>
            <Button onClick={assignRollNumbers}>Assign Roll Numbers</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassDetailView;
