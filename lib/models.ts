export interface User {
  _id?: string
  email: string
  password: string
  role: "student" | "teacher" | "admin" | "head"
  firstName: string
  lastName: string
  department?: string
  year?: number
  semester?: number
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  _id?: string
  title: string
  code: string
  description: string
  department: string
  year: number
  semester: number
  teacherId: string
  createdAt: Date
  updatedAt: Date
}

export interface Material {
  _id?: string
  courseId: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  uploadedBy: string
  createdAt: Date
}

export interface Assignment {
  _id?: string
  courseId: string
  title: string
  description: string
  dueDate: Date
  totalPoints: number
  fileUrl?: string
  createdBy: string
  createdAt: Date
}

export interface Submission {
  _id?: string
  assignmentId: string
  studentId: string
  fileUrl: string
  submittedAt: Date
  grade?: number
  feedback?: string
  gradedBy?: string
  gradedAt?: Date
}

export interface Message {
  _id?: string
  senderId: string
  senderName: string
  senderRole: string
  receiverId?: string // Optional: for direct messages
  receiverName?: string
  content: string
  isGroupMessage: boolean
  createdAt: Date
}

export interface News {
  _id?: string
  title: string
  content: string
  createdBy: string
  createdAt: Date
}

export interface Conversation {
  oderId: string
  odeName: string
  otherRole: string
  lastMessage?: string
  lastMessageAt?: Date
  unreadCount?: number
}
