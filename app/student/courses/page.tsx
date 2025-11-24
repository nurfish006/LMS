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
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid md:grid-cols-4 gap-6">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
          <div className="md:col-span-3 h-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Access course materials and resources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Course List */}
        <div className="md:col-span-1 space-y-2">
          <h2 className="font-semibold mb-4 text-sm sm:text-base">Enrolled Courses</h2>
          {courses.map((course) => (
            <Button
              key={course._id}
              variant={selectedCourse === course._id ? "default" : "outline"}
              className="w-full justify-start text-left h-auto py-3"
              onClick={() => setSelectedCourse(course._id)}
            >
              <div className="text-left">
                <div className="font-medium text-xs sm:text-sm">{course.code}</div>
                <div className="text-xs">{course.title}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Materials */}
        <div className="md:col-span-3">
          {selectedCourse && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Course Materials</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {courses.find((c) => c._id === selectedCourse)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {materials.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8 text-sm">No materials available yet</p>
                ) : (
                  <div className="space-y-3">
                    {materials.map((material) => (
                      <div
                        key={material._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-muted rounded-lg gap-3"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          {getFileIcon(material.fileType)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base truncate">{material.title}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                              {material.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(material.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                          <a href={getDownloadUrl(material)} download>
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
