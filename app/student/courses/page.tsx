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

  if (loading) {
    return <div>Loading courses...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-muted-foreground">Access course materials and resources</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Course List */}
        <div className="md:col-span-1 space-y-2">
          <h2 className="font-semibold mb-4">Enrolled Courses</h2>
          {courses.map((course) => (
            <Button
              key={course._id}
              variant={selectedCourse === course._id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedCourse(course._id)}
            >
              <div className="text-left">
                <div className="font-medium">{course.code}</div>
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
                <CardTitle>Course Materials</CardTitle>
                <CardDescription>{courses.find((c) => c._id === selectedCourse)?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {materials.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No materials available yet</p>
                ) : (
                  <div className="space-y-3">
                    {materials.map((material) => (
                      <div key={material._id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
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
                          <a href={material.fileUrl} download>
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
