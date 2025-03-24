import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Filter, 
  MoreHorizontal,
  Users,
  Plus,
  Pencil,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SearchField from '@/components/ui/SearchField';
import { Card, CardContent } from "@/components/ui/card";
import { Class } from '@/types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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

const ClassCard = ({ classData, onEdit, onDelete }: { 
  classData: Class; 
  onEdit: (classData: Class) => void; 
  onDelete: (classId: string) => void; 
}) => {
  const navigate = useNavigate();
  
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/classes/${classData.id}`);
  };
  
  return (
    <Card className="group transition-all hover:shadow-md cursor-pointer" onClick={handleViewDetails}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {classData.name}
              <Badge variant="secondary" className="text-xs">
                Room {classData.room}
              </Badge>
            </h3>
            <p className="text-sm text-muted-foreground">
              {classData.classTeacher}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit(classData);
              }}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Class
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(classData.id);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Class
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {classData.totalStudents} students
          </div>
          <div>•</div>
          <div>{classData.subjects.length} subjects</div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-1">
            {classData.subjects.slice(0, 3).map((subject, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
            {classData.subjects.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{classData.subjects.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground"
          onClick={handleViewDetails}
        >
          View Details
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

const ClassForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editClass 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (classData: Partial<Class>) => void; 
  editClass?: Class 
}) => {
  const isEditing = !!editClass;
  const [formData, setFormData] = useState<Partial<Class>>(
    editClass || {
      standard: '',
      section: '',
      classTeacher: '',
      room: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Class' : 'Add New Class'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the details of this class'
              : 'Enter the details for the new class'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="standard">Standard</Label>
                <Input
                  id="standard"
                  name="standard"
                  placeholder="e.g. 10"
                  value={formData.standard}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  name="section"
                  placeholder="e.g. A"
                  value={formData.section}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="classTeacher">Class Teacher</Label>
              <Input
                id="classTeacher"
                name="classTeacher"
                placeholder="Enter teacher's name"
                value={formData.classTeacher}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="room">Room Number</Label>
              <Input
                id="room"
                name="room"
                placeholder="e.g. Room 201"
                value={formData.room}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update' : 'Add'} Class
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Classes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [editClass, setEditClass] = useState<Class | undefined>(undefined);
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);

  const filteredClasses = classes.filter(classData => 
    classData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classData.classTeacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedClasses = filteredClasses.reduce((acc, classData) => {
    const standard = classData.standard;
    if (!acc[standard]) {
      acc[standard] = [];
    }
    acc[standard].push(classData);
    return acc;
  }, {} as Record<string, Class[]>);

  const handleAddClass = (newClass: Partial<Class>) => {
    const classData: Class = {
      id: `C${100 + classes.length}`,
      name: `Class ${newClass.standard} ${newClass.section}`,
      standard: newClass.standard || '',
      section: newClass.section || '',
      classTeacher: newClass.classTeacher || '',
      totalStudents: 0,
      subjects: [],
      schedule: [],
      room: newClass.room || '',
    };
    
    setClasses([...classes, classData]);
    toast({
      title: "Class Added",
      description: `${classData.name} has been successfully added.`,
    });
  };

  const handleEditClass = (classData: Class) => {
    setEditClass(classData);
  };

  const handleUpdateClass = (updatedClass: Partial<Class>) => {
    if (!editClass) return;

    const updatedClasses = classes.map(c => {
      if (c.id === editClass.id) {
        return {
          ...c,
          standard: updatedClass.standard || c.standard,
          section: updatedClass.section || c.section,
          name: `Class ${updatedClass.standard || c.standard} ${updatedClass.section || c.section}`,
          classTeacher: updatedClass.classTeacher || c.classTeacher,
          room: updatedClass.room || c.room,
        };
      }
      return c;
    });
    
    setClasses(updatedClasses);
    setEditClass(undefined);
    toast({
      title: "Class Updated",
      description: `Class details have been updated successfully.`,
    });
  };

  const confirmDelete = (id: string) => {
    setDeleteClassId(id);
  };

  const handleDeleteClass = () => {
    if (!deleteClassId) return;
    
    const classToDelete = classes.find(c => c.id === deleteClassId);
    const updatedClasses = classes.filter(c => c.id !== deleteClassId);
    
    setClasses(updatedClasses);
    setDeleteClassId(null);
    
    toast({
      title: "Class Deleted",
      description: `${classToDelete?.name} has been deleted.`,
    });
  };

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
          <Button size="sm" onClick={() => setIsAddClassOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
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
          Showing <strong>{filteredClasses.length}</strong> of <strong>{classes.length}</strong> classes
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedClasses)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([standard, classesInStandard]) => (
            <div key={standard} className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Standard {standard}
                <Badge variant="secondary">
                  {classesInStandard.length} {classesInStandard.length === 1 ? 'class' : 'classes'}
                </Badge>
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classesInStandard.map((classData) => (
                  <div key={classData.id}>
                    <ClassCard 
                      classData={classData}
                      onEdit={handleEditClass}
                      onDelete={confirmDelete}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

        {filteredClasses.length === 0 && (
          <div className="text-center p-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No Classes Found</h3>
            <p className="text-muted-foreground mb-4">
              {classes.length === 0 
                ? "You haven't added any classes yet." 
                : "No classes match your search criteria."}
            </p>
            {classes.length === 0 && (
              <Button onClick={() => setIsAddClassOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Class
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Class Dialog */}
      {(isAddClassOpen || editClass) && (
        <ClassForm
          isOpen={isAddClassOpen || !!editClass}
          onClose={editClass ? () => setEditClass(undefined) : () => setIsAddClassOpen(false)}
          onSubmit={editClass ? handleUpdateClass : handleAddClass}
          editClass={editClass}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteClassId} onOpenChange={() => setDeleteClassId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class
              and remove its data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClass} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Classes;
