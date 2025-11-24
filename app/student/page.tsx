import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function StudentDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's your learning overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Active this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Pending Assignments</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Assignments submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Study Hours</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Upcoming Assignments</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Assignments due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-2">
              <div>
                <p className="font-medium text-sm sm:text-base">Database Systems - Assignment 3</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Due in 2 days</p>
              </div>
              <Link href="/student/assignments">
                <Button size="sm" className="w-full sm:w-auto">
                  View
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-2">
              <div>
                <p className="font-medium text-sm sm:text-base">Web Development - Project Proposal</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Due in 4 days</p>
              </div>
              <Link href="/student/assignments">
                <Button size="sm" className="w-full sm:w-auto">
                  View
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-2">
              <div>
                <p className="font-medium text-sm sm:text-base">Software Engineering - Case Study</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Due in 6 days</p>
              </div>
              <Link href="/student/assignments">
                <Button size="sm" className="w-full sm:w-auto">
                  View
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Course Materials</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Latest materials uploaded by instructors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-2">
              <div>
                <p className="font-medium text-sm sm:text-base">Data Structures - Lecture 10</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Added 1 day ago</p>
              </div>
              <Link href="/student/courses">
                <Button size="sm" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Download
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-2">
              <div>
                <p className="font-medium text-sm sm:text-base">Algorithms - Practice Problems</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Added 2 days ago</p>
              </div>
              <Link href="/student/courses">
                <Button size="sm" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Download
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-2">
              <div>
                <p className="font-medium text-sm sm:text-base">Computer Networks - Lab Manual</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Added 3 days ago</p>
              </div>
              <Link href="/student/courses">
                <Button size="sm" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Download
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
