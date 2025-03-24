
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClassDetailView from '@/components/classes/ClassDetailView';
import { Class } from '@/types';
import { useToast } from '@/hooks/use-toast';
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

// Mock data for demonstration
const mockClasses: Class[] = Array.from({ length: 9 }, (_, i) => ({
  id: `C${100 + i}`,
  name: `Class ${9 + Math.floor(i / 3)} ${['A', 'B', 'C'][i % 3]}`,
  standard: `${9 + Math.floor(i / 3)}`,
  section: ['A', 'B', 'C'][i % 3],
  classTeacher: ['Dr. Rajesh Kumar', 'Mrs. Priya Sharma', 'Mr. Amit Singh', 'Dr. Neha Gupta', 'Mr. Vikram Mehta', 'Mrs. Anjali Verma', 'Mr. Sanjay Patel', 'Dr. Pooja Reddy'][i % 8],
  totalStudents: 30 + (i % 15),
  maxStrength: 50,
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
  performanceMetrics: {
    averageAttendance: 85 + (Math.random() * 10),
    averageAcademics: 70 + (Math.random() * 20),
    passPercentage: 90 + (Math.random() * 10)
  }
}));

const ClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [classData, setClassData] = useState<Class | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real application, fetch from API
    // For demo, use mock data
    const fetchClass = () => {
      setIsLoading(true);
      setTimeout(() => {
        const foundClass = mockClasses.find(c => c.id === id);
        if (foundClass) {
          setClassData(foundClass);
        } else {
          toast({
            title: "Class Not Found",
            description: "The class you're looking for doesn't exist.",
            variant: "destructive"
          });
          navigate('/classes');
        }
        setIsLoading(false);
      }, 500);
    };
    
    fetchClass();
  }, [id, navigate, toast]);
  
  const handleDeleteClass = () => {
    // In a real application, call API to delete
    toast({
      title: "Class Deleted",
      description: `${classData?.name} has been deleted.`,
    });
    navigate('/classes');
  };
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading class data...</p>
        </div>
      </div>
    );
  }
  
  if (!classData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Class not found</p>
          <Button 
            variant="link" 
            className="mt-2"
            onClick={() => navigate('/classes')}
          >
            Go back to Classes
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/classes')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Classes
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Class
          </Button>
        </div>
      </div>
      
      <ClassDetailView classData={classData} />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class
              and all its associated data.
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

export default ClassDetail;
