"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/file-upload"
import { Plus, FileText, Download, Trash2, Loader2, Upload } from "lucide-react"
import { format } from "date-fns"

interface Course {
  _id: string
  title: string
  code: string
}

interface Material {
  _id: string
  courseId: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  createdAt: string
}

export default function TeacherMaterialsPage() {
  const searchParams = useSearchParams()
  const preselectedCourseId = searchParams.get("courseId")
  const { toast } = useToast()

  const [courses, setCourses] = useState<Course[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>(preselectedCourseId || "")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ url: string; tokenId: string; filename: string } | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
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

  const fetchMaterials = async (courseId: string) => {
    if (!courseId) return
    try {
      const response = await fetch(`/api/materials?courseId=${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setMaterials(data.materials || [])
      }
    } catch (error) {
      console.error("Error fetching materials:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      setLoading(true)
      fetchMaterials(selectedCourse)
    }
  }, [selectedCourse])

  const handleUpload = async () => {
    if (!selectedCourse || !formData.title || !uploadedFile) {
      toast({ title: "Please fill in all required fields and upload a file", variant: "destructive" })
      return
    }

    setUploading(true)
    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          title: formData.title,
          description: formData.description,
          fileUrl: uploadedFile.url,
          tokenId: uploadedFile.tokenId,
          fileType: "file",
        }),
      })

      if (response.ok) {
        toast({ title: "Material uploaded successfully" })
        setDialogOpen(false)
        setFormData({ title: "", description: "" })
        setUploadedFile(null)
        fetchMaterials(selectedCourse)
      } else {
        const data = await response.json()
        toast({ title: data.error || "Failed to upload material", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Failed to upload material", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (materialId: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return

    try {
      const response = await fetch(`/api/materials/${materialId}`, { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Material deleted" })
        fetchMaterials(selectedCourse)
      }
    } catch (error) {
      toast({ title: "Failed to delete material", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Course Materials</h1>
          <p className="text-muted-foreground">Upload and manage learning materials</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Material</DialogTitle>
              <DialogDescription>Add new learning material to your course</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Lecture 1 - Introduction"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the material..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Upload File *</Label>
                <FileUpload
                  uploadType="material"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar"
                  onUploadComplete={(data) => setUploadedFile(data)}
                />
              </div>
              <Button onClick={handleUpload} disabled={uploading || !uploadedFile} className="w-full">
                {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Upload Material
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Course</CardTitle>
          <CardDescription>Choose a course to view and manage its materials</CardDescription>
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
        <>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : materials.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No materials yet</h3>
                <p className="text-muted-foreground text-center mt-1">Upload your first material to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {materials.map((material) => (
                <Card key={material._id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{material.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {material.description || "No description"} •{" "}
                          {format(new Date(material.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(material._id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
