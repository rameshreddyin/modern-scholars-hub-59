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
  maxStrength: number;
  subjects: string[];
  schedule: ClassSchedule[];
  room: string;
  performanceMetrics?: {
    averageAttendance: number;
    averageAcademics: number;
    passPercentage: number;
  };
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

export type TeacherStatus = 'available' | 'teaching' | 'unavailable' | 'unknown';

export interface FeeCategory {
  id: string;
  name: string;
  description: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Annually' | 'One-time';
  applicableClasses: string[];
}

export interface FeeStructure {
  id: string;
  academicYear: string;
  standard: string;
  categories: FeeCategoryAmount[];
  totalAmount: number;
}

export interface FeeCategoryAmount {
  categoryId: string;
  categoryName: string;
  amount: number;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  rollNumber: string;
  amount: number;
  paymentDate: string;
  dueDate: string;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Online Payment' | 'Cheque';
  receiptNumber: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
  feeCategories: FeeCategoryAmount[];
  remarks?: string;
}

export interface FinanceStats {
  totalCollected: number;
  pendingAmount: number;
  overdueAmount: number;
  totalStudentsPaid: number;
  totalStudentsPending: number;
}

export interface Exam {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  examType: 'Mid Term' | 'Final Term' | 'Unit Test' | 'Annual Exam' | 'Other';
  classes: string[];
  subjects: ExamSubject[];
  status: 'Draft' | 'Published' | 'Completed' | 'Cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamSubject {
  subjectId: string;
  subjectName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passingMarks: number;
  venue?: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  class: string;
  section: string;
  subjects: SubjectResult[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  rank?: number;
  status: 'Pass' | 'Fail' | 'Absent';
  publishDate?: string;
}

export interface SubjectResult {
  subjectId: string;
  subjectName: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  status: 'Pass' | 'Fail' | 'Absent';
}

export interface ExamSeatingArrangement {
  id: string;
  examId: string;
  examName: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  totalSeats: number;
  invigilators: string[];
  seatingPlan: StudentSeat[];
}

export interface StudentSeat {
  studentId: string;
  studentName: string;
  rollNumber: string;
  class: string;
  section: string;
  seatNumber: string;
}
