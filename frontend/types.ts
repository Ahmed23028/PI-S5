
export interface Student {
  id: string;
  fullName: string;
  birthDate: string;
  gender: 'M' | 'F';
  parentPhone: string;
  classId: string;
  address: string;
  notes?: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'teacher' | 'secretary';
  email?: string;
  status: 'active' | 'inactive';
}

export interface Classroom {
  id: string;
  name: string;
  level: number;
  studentCount?: number;
}

export interface Subject {
  id: string;
  name: string;
  totalPoints: number;  // عدد النقاط الإجمالي للمادة (مثلاً: 50 للرياضيات، 30 للفرنسية)
  level: number;
}

export interface Result {
  id?: string;
  studentId: string;
  subjectId: string;
  score: number;
  semester: 1 | 2 | 3;
  type: 'test' | 'exam';
  status?: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
  approvedBy?: string;
  rejectionReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
  comment?: string;
  student_name?: string;
  subject_name?: string;
  submitted_by_name?: string;
  approved_by_name?: string;
}

export interface Activity {
  id: string;
  type: 'add' | 'update' | 'delete' | 'result';
  descriptionKey: string;
  params?: string[];
  timestamp: Date;
}

export type Language = 'ar' | 'fr';
