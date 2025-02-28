
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
  availability?: TeacherAvailability[];
}

export interface TeacherAvailability {
  day: WeekDay;
  slots: TimeSlot[];
}

export interface TimeSlot {
  periodNumber: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
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

export type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface ClassSchedule {
  day: WeekDay;
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

export interface TimetableSettings {
  periodsPerDay: number;
  daysInWeek: WeekDay[];
  startTime: string;
  endTime: string;
  periodDuration: number;
  breakDuration: number;
  lunchBreakAfter: number;
  lunchBreakDuration: number;
}

export interface TimetableGenerationConstraints {
  maxPeriodsPerTeacherPerDay: number;
  minGapBetweenSameSubject: number;
  preferredSubjectsInMorning: string[];
  avoidConsecutivePeriodsForSubjects: string[];
}

export interface ClassSubjectAllocation {
  classId: string;
  className: string;
  subjectAllocations: SubjectAllocation[];
}

export interface SubjectAllocation {
  subject: string;
  periodsPerWeek: number;
  assignedTeacher: string;
  preferredDays?: WeekDay[];
}

export interface GeneratedTimetable {
  classId: string;
  className: string;
  schedule: ClassSchedule[];
  conflicts?: TimetableConflict[];
}

export interface TimetableConflict {
  type: 'teacher_unavailable' | 'teacher_overlap' | 'subject_constraint';
  day: WeekDay;
  periodNumber: number;
  subject: string;
  teacher: string;
  message: string;
}
