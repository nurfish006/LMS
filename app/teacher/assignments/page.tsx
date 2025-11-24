"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Course {
  _id: string
  title: string
  code: string
}

interface Assignment {
  _id: string
  title: string
  description: string
  dueDate: string
  totalPoints: number
  courseId: string
}

interface Submission {
  _id: string
  assignmentId: string
  studentId: string
  fileUrl: string
  submittedAt: string
  grade?: number
}

export default function TeacherAssignmentsPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
    totalPoints: "",
    fileUrl: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
    fetchAssignments()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses")
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      })
    }
  }

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/assignments")
      if (response.ok) {
        const data = await response.json()
        setAssignments(data.assignments)
      }
    } catch (error) {
      console.error("[v0] Fetch assignments error:", error)
    }
  }

  const fetchSubmissions = async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/submissions?assignmentId=${assignmentId}`)
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error("[v0] Fetch submissions error:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          totalPoints: Number.parseInt(formData.totalPoints),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Assignment created successfully",
        })
        fetchAssignments()
        setOpen(false)
        setFormData({
          courseId: "",
          title: "",
          description: "",
          dueDate: "",
          totalPoints: "",
          fileUrl: "",
        })
      } else {
        const data = await response.json()
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleViewSubmissions = (assignmentId: string) => {
    setSelectedAssignment(assignmentId)
    fetchSubmissions(assignmentId)
    setViewOpen(true)
  }

  const handleGrade = async (submissionId: string, grade: number, feedback: string) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/grade`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, feedback }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Grade submitted successfully",
        })
        if (selectedAssignment) {
          fetchSubmissions(selectedAssignment)
        }
      } else {
        throw new Error("Failed to submit grade")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assignments</h1>
          <p className="text-muted-foreground">Create and manage course assignments</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>Add a new assignment for your students</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseId">Course</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.code} - {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  placeholder="Assignment 1: Introduction to Programming"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Assignment instructions and requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalPoints">Total Points</Label>
                  <Input
                    id="totalPoints"
                    type="number"
                    placeholder="100"
                    value={formData.totalPoints}
                    onChange={(e) => setFormData({ ...formData, totalPoints: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileUrl">Attachment URL (Optional)</Label>
                <Input
                  id="fileUrl"
                  placeholder="https://example.com/assignment1.pdf"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                Create Assignment
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => {
          const course = courses.find((c) => c._id === assignment.courseId)
          return (
            <Card key={assignment._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{assignment.title}</CardTitle>
                    <CardDescription>
                      {course?.code} - Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => handleViewSubmissions(assignment._id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Submissions
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                <p className="text-sm">
                  <strong>Points:</strong> {assignment.totalPoints}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* View Submissions Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Assignment Submissions</DialogTitle>
            <DialogDescription>Review and grade student submissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {submissions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No submissions yet</p>
            ) : (
              submissions.map((submission) => (
                <Card key={submission._id}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">
                          <strong>Student ID:</strong> {submission.studentId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                          View Submission
                        </a>
                      </Button>
                      {submission.grade !== undefined ? (
                        <div className="p-3 bg-muted rounded">
                          <p className="text-sm">
                            <strong>Grade:</strong> {submission.grade}
                          </p>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input type="number" placeholder="Grade" className="w-24" id={`grade-${submission._id}`} />
                          <Input placeholder="Feedback (optional)" id={`feedback-${submission._id}`} />
                          <Button
                            size="sm"
                            onClick={() => {
                              const gradeInput = document.getElementById(`grade-${submission._id}`) as HTMLInputElement
                              const feedbackInput = document.getElementById(
                                `feedback-${submission._id}`,
                              ) as HTMLInputElement
                              handleGrade(submission._id, Number.parseInt(gradeInput.value), feedbackInput.value)
                            }}
                          >
                            Submit Grade
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
