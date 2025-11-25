"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Video, FileAudio } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Course {
  _id: string
  title: string
  code: string
  description: string
  department: string
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

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      fetchMaterials(selectedCourse)
    }
  }, [selectedCourse])

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses")
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses)
        if (data.courses.length > 0) {
          setSelectedCourse(data.courses[0]._id)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMaterials = async (courseId: string) => {
    try {
      const response = await fetch(`/api/materials?courseId=${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setMaterials(data.materials)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load materials",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("video")) return <Video className="h-5 w-5" />
    if (fileType.includes("audio")) return <FileAudio className="h-5 w-5" />
    return <FileText className="h-5 w-5" />
  }

  const getDownloadUrl = (material: Material) => {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(material.fileUrl)
    if (isUUID) {
      return `/api/download?materialId=${material._id}`
    }
    return material.fileUrl
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded mb-4" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">Access course materials and resources</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Course List */}
        <div className="space-y-2">
          <h2 className="font-semibold mb-4">Enrolled Courses</h2>
          {courses.map((course) => (
            <Button
              key={course._id}
              variant={selectedCourse === course._id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedCourse(course._id)}
            >
              <div className="text-left">
                <p className="font-medium">{course.code}</p>
                <p className="text-xs text-muted-foreground">{course.title}</p>
              </div>
            </Button>
          ))}
        </div>

        {/* Materials */}
        <div className="md:col-span-2">
          {selectedCourse && (
            <Card>
              <CardHeader>
                <CardTitle>Course Materials</CardTitle>
                <CardDescription>{courses.find((c) => c._id === selectedCourse)?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {materials.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No materials available yet</p>
                ) : (
                  <div className="space-y-4">
                    {materials.map((material) => (
                      <div key={material._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          {getFileIcon(material.fileType)}
                          <div>
                            <p className="font-medium">{material.title}</p>
                            <p className="text-sm text-muted-foreground">{material.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(material.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={getDownloadUrl(material)} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
