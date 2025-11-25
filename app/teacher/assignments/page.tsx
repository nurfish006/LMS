"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/file-upload"
import { Plus, FileText, Download, Loader2, Calendar, CheckCircle, Users } from "lucide-react"
import { format, isPast } from "date-fns"

interface Course {
  _id: string
  title: string
  code: string
}

interface Assignment {
  _id: string
  courseId: string
  title: string
  description: string
  dueDate: string
  totalPoints: number
  fileUrl?: string
  createdAt: string
}

interface Submission {
  _id: string
  assignmentId: string
  studentId: string
  studentName?: string
  fileUrl: string
  submittedAt: string
  grade?: number
  feedback?: string
}

export default function TeacherAssignmentsPage() {
  const searchParams = useSearchParams()
  const preselectedCourseId = searchParams.get("courseId")
  const { toast } = useToast()

  const [courses, setCourses] = useState<Course[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>(preselectedCourseId || "")
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [gradeData, setGradeData] = useState({ grade: "", feedback: "" })
  const [uploadedFile, setUploadedFile] = useState<{ url: string; tokenId: string; filename: string } | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    totalPoints: "100",
  })

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses")
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
    }
  }

  const fetchAssignments = async (courseId: string) => {
    if (!courseId) return
    try {
      const response = await fetch(`/api/assignments?courseId=${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setAssignments(data.assignments || [])
      }
    } catch (error) {
      console.error("Error fetching assignments:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubmissions = async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/submissions?assignmentId=${assignmentId}`)
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
      }
    } catch (error) {
      console.error("Error fetching submissions:", error)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      setLoading(true)
      fetchAssignments(selectedCourse)
    }
  }, [selectedCourse])

  useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions(selectedAssignment._id)
    }
  }, [selectedAssignment])

  const handleCreate = async () => {
    if (!selectedCourse || !formData.title || !formData.dueDate) {
      toast({ title: "Please fill in all required fields", variant: "destructive" })
      return
    }

    setCreating(true)
    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          title: formData.title,
          description: formData.description,
          dueDate: new Date(formData.dueDate).toISOString(),
          totalPoints: Number.parseInt(formData.totalPoints),
          fileUrl: uploadedFile?.url,
        }),
      })

      if (response.ok) {
        toast({ title: "Assignment created successfully" })
        setDialogOpen(false)
        setFormData({ title: "", description: "", dueDate: "", totalPoints: "100" })
        setUploadedFile(null)
        fetchAssignments(selectedCourse)
      } else {
        const data = await response.json()
        toast({ title: data.error || "Failed to create assignment", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Failed to create assignment", variant: "destructive" })
    } finally {
      setCreating(false)
    }
  }

  const handleGrade = async () => {
    if (!selectedSubmission || !gradeData.grade) {
      toast({ title: "Please enter a grade", variant: "destructive" })
      return
    }

    try {
      const response = await fetch(`/api/submissions/${selectedSubmission._id}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: Number.parseFloat(gradeData.grade),
          feedback: gradeData.feedback,
        }),
      })

      if (response.ok) {
        toast({ title: "Submission graded successfully" })
        setGradeDialogOpen(false)
        setGradeData({ grade: "", feedback: "" })
        if (selectedAssignment) fetchSubmissions(selectedAssignment._id)
      }
    } catch (error) {
      toast({ title: "Failed to grade submission", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">Create assignments and grade submissions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Assignment</DialogTitle>
              <DialogDescription>Create a new assignment for your students</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Assignment 1 - Database Design"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Instructions</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what students need to do..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Total Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={formData.totalPoints}
                    onChange={(e) => setFormData({ ...formData, totalPoints: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Attachment (Optional)</Label>
                <FileUpload
                  uploadType="material"
                  accept=".pdf,.doc,.docx,.zip"
                  onUploadComplete={(data) => setUploadedFile(data)}
                />
              </div>
              <Button onClick={handleCreate} disabled={creating} className="w-full">
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Course</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full md:w-80">
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
        </CardContent>
      </Card>

      {selectedCourse && (
        <Tabs defaultValue="assignments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="submissions" disabled={!selectedAssignment}>
              Submissions {selectedAssignment && `(${submissions.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : assignments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No assignments yet</h3>
                  <p className="text-muted-foreground">Create your first assignment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {assignments.map((assignment) => (
                  <Card
                    key={assignment._id}
                    className={`cursor-pointer transition-all ${selectedAssignment?._id === assignment._id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <Badge variant={isPast(new Date(assignment.dueDate)) ? "destructive" : "secondary"}>
                          {isPast(new Date(assignment.dueDate)) ? "Past Due" : "Active"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {assignment.description || "No description"}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(assignment.dueDate), "MMM d, h:mm a")}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CheckCircle className="h-4 w-4" />
                          {assignment.totalPoints} pts
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            {submissions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No submissions yet</h3>
                  <p className="text-muted-foreground">Students haven't submitted yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <Card key={submission._id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Student ID: {submission.studentId}</h3>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {format(new Date(submission.submittedAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {submission.grade !== undefined ? (
                          <Badge variant="outline" className="text-green-600">
                            {submission.grade}/{selectedAssignment?.totalPoints}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600">
                            Pending
                          </Badge>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission(submission)
                            setGradeData({
                              grade: submission.grade?.toString() || "",
                              feedback: submission.feedback || "",
                            })
                            setGradeDialogOpen(true)
                          }}
                        >
                          Grade
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Grade Dialog */}
      <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>Enter grade and feedback for this submission</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade (out of {selectedAssignment?.totalPoints})</Label>
              <Input
                id="grade"
                type="number"
                value={gradeData.grade}
                onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                max={selectedAssignment?.totalPoints}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                value={gradeData.feedback}
                onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                placeholder="Optional feedback for the student..."
                rows={3}
              />
            </div>
            <Button onClick={handleGrade} className="w-full">
              Submit Grade
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
