import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TeacherDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your courses, assignments, and student progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Active this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Students</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">To Grade</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Pending submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Submissions</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Latest assignment submissions requiring grading
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-2">
              <div>
                <p className="font-medium text-sm sm:text-base">Database Systems - Assignment 3</p>
                <p className="text-xs sm:text-sm text-muted-foreground">5 new submissions</p>
              </div>
              <Link href="/teacher/assignments">
                <Button size="sm" className="w-full sm:w-auto">
                  Grade
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-2">
              <div>
                <p className="font-medium text-sm sm:text-base">Web Development - Project Proposal</p>
                <p className="text-xs sm:text-sm text-muted-foreground">8 new submissions</p>
              </div>
              <Link href="/teacher/assignments">
                <Button size="sm" className="w-full sm:w-auto">
                  Grade
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-2">
              <div>
                <p className="font-medium text-sm sm:text-base">Software Engineering - Case Study</p>
                <p className="text-xs sm:text-sm text-muted-foreground">10 new submissions</p>
              </div>
              <Link href="/teacher/assignments">
                <Button size="sm" className="w-full sm:w-auto">
                  Grade
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <Link href="/teacher/courses">
              <Button className="w-full justify-start bg-transparent text-sm" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </Link>
            <Link href="/teacher/assignments">
              <Button className="w-full justify-start bg-transparent text-sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </Link>
            <Link href="/teacher/materials">
              <Button className="w-full justify-start bg-transparent text-sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Upload Course Material
              </Button>
            </Link>
            <Link href="/teacher/messages">
              <Button className="w-full justify-start bg-transparent text-sm" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Message Students
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
