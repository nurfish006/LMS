"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, UploadIcon } from "lucide-react"
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

export default function TeacherMaterialsPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [open, setOpen] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    fileUrl: "",
    fileType: "application/pdf",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let tokenId: string | undefined
      let fileUrl = uploadMethod === "url" ? formData.fileUrl : undefined

      if (uploadMethod === "file") {
        if (!selectedFile) {
          throw new Error("Please select a file")
        }

        const uploadFormData = new FormData()
        uploadFormData.append("file", selectedFile)
        uploadFormData.append("type", "material")

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || "Failed to upload file")
        }

        const uploadData = await uploadResponse.json()
        tokenId = uploadData.tokenId
      }

      const response = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: formData.courseId,
          title: formData.title,
          description: formData.description,
          tokenId,
          fileUrl,
          fileType: formData.fileType,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Material uploaded successfully",
        })
        setOpen(false)
        setSelectedFile(null)
        setFormData({
          courseId: "",
          title: "",
          description: "",
          fileUrl: "",
          fileType: "application/pdf",
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to create material")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Course Materials</h1>
          <p className="text-muted-foreground">Upload and manage course materials</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Course Material</DialogTitle>
              <DialogDescription>Add learning resources for your students</DialogDescription>
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
                <Label htmlFor="title">Material Title</Label>
                <Input
                  id="title"
                  placeholder="Lecture 1: Introduction"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the material..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType">File Type</Label>
                <Select
                  value={formData.fileType}
                  onValueChange={(value) => setFormData({ ...formData, fileType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="application/pdf">PDF Document</SelectItem>
                    <SelectItem value="application/msword">Word Document</SelectItem>
                    <SelectItem value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">Word Document (DOCX)</SelectItem>
                    <SelectItem value="video/mp4">Video (MP4)</SelectItem>
                    <SelectItem value="audio/mpeg">Audio (MP3)</SelectItem>
                    <SelectItem value="application/zip">ZIP Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Upload Method</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={uploadMethod === "file" ? "default" : "outline"}
                    onClick={() => setUploadMethod("file")}
                    className="flex-1"
                  >
                    Upload File
                  </Button>
                  <Button
                    type="button"
                    variant={uploadMethod === "url" ? "default" : "outline"}
                    onClick={() => setUploadMethod("url")}
                    className="flex-1"
                  >
                    Provide URL
                  </Button>
                </div>
              </div>

              {uploadMethod === "file" ? (
                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3,.zip"
                    required
                  />
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="fileUrl">File URL</Label>
                  <Input
                    id="fileUrl"
                    placeholder="https://example.com/lecture1.pdf"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload your file to cloud storage and paste the URL here
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={uploading}>
                <UploadIcon className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Material"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Materials uploaded in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">Upload your first course material to get started</p>
        </CardContent>
      </Card>
    </div>
  )
}
