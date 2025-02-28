
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  standard: string;
  section: string;
  gender: 'Male' | 'Female' | 'Other';
  attendancePercentage: number;
  parentName: string;
  contactNumber: string;
  address: string;
  dateOfBirth: string;
  admissionDate: string;
  imageUrl?: string;
}

export interface Faculty {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  gender: 'Male' | 'Female' | 'Other';
  subject: string[];
  qualification: string;
  contactNumber: string;
  email: string;
  joiningDate: string;
  imageUrl?: string;
}

export interface Class {
  id: string;
  name: string;
  standard: string;
  section: string;
  classTeacher: string;
  totalStudents: number;
  subjects: string[];
  schedule: ClassSchedule[];
  room: string;
}

export interface ClassSchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: Period[];
}

export interface Period {
  number: number;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
}

export interface Attendance {
  id: string;
  date: string;
  class: string;
  section: string;
  studentId: string;
  studentName: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  reason?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalClasses: number;
  averageAttendance: number;
  maleStudents: number;
  femaleStudents: number;
  otherStudents: number;
}

export interface RecentActivity {
  id: string;
  type: 'enrollment' | 'attendance' | 'exam' | 'event' | 'notice';
  title: string;
  description: string;
  date: string;
  time: string;
}
