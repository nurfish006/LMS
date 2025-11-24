"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Clock, CheckCircle, AlertCircle, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Assignment {
  _id: string
  title: string
  description: string
  dueDate: string
  totalPoints: number
  fileUrl?: string
}

interface Submission {
  assignmentId: string
  submittedAt: string
  grade?: number
  feedback?: string
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAssignments()
    fetchSubmissions()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/assignments")
      if (response.ok) {
        const data = await response.json()
        setAssignments(data.assignments)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      })
    }
  }

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/submissions")
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error("[v0] Fetch submissions error:", error)
    }
  }

  const handleSubmit = async (assignmentId: string) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please provide a file URL",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, fileUrl: selectedFile }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Assignment submitted successfully",
        })
        fetchSubmissions()
        setSelectedFile("")
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
    } finally {
      setSubmitting(false)
    }
  }

  const getStatus = (assignment: Assignment) => {
    const submission = submissions.find((s) => s.assignmentId === assignment._id)
    const dueDate = new Date(assignment.dueDate)
    const now = new Date()

    if (submission) {
      if (submission.grade !== undefined) {
        return { label: "Graded", color: "bg-success", icon: <CheckCircle className="h-4 w-4" /> }
      }
      return { label: "Submitted", color: "bg-accent", icon: <CheckCircle className="h-4 w-4" /> }
    }

    if (now > dueDate) {
      return { label: "Overdue", color: "bg-destructive", icon: <AlertCircle className="h-4 w-4" /> }
    }

    return { label: "Pending", color: "bg-warning", icon: <Clock className="h-4 w-4" /> }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Assignments</h1>
        <p className="text-muted-foreground">View and submit your assignments</p>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => {
          const status = getStatus(assignment)
          const submission = submissions.find((s) => s.assignmentId === assignment._id)

          return (
            <Card key={assignment._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{assignment.title}</CardTitle>
                    <CardDescription>{assignment.description}</CardDescription>
                  </div>
                  <Badge className={`${status.color} text-white`}>
                    <span className="flex items-center gap-1">
                      {status.icon}
                      {status.label}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Points:</strong> {assignment.totalPoints}
                    </p>
                    {submission?.grade !== undefined && (
                      <p className="text-muted-foreground">
                        <strong>Grade:</strong> {submission.grade}/{assignment.totalPoints}
                      </p>
                    )}
                    {submission?.feedback && (
                      <p className="text-muted-foreground">
                        <strong>Feedback:</strong> {submission.feedback}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {assignment.fileUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={assignment.fileUrl} download>
                          Download
                        </a>
                      </Button>
                    )}
                    {!submission && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Submit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Submit Assignment</DialogTitle>
                            <DialogDescription>Upload your assignment file for {assignment.title}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="fileUrl">File URL</Label>
                              <Input
                                id="fileUrl"
                                placeholder="https://example.com/my-assignment.pdf"
                                value={selectedFile}
                                onChange={(e) => setSelectedFile(e.target.value)}
                              />
                              <p className="text-xs text-muted-foreground">
                                Upload your file to cloud storage and paste the URL here
                              </p>
                            </div>
                            <Button
                              onClick={() => handleSubmit(assignment._id)}
                              disabled={submitting}
                              className="w-full"
                            >
                              {submitting ? "Submitting..." : "Submit Assignment"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
