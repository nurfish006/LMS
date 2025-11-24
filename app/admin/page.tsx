import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, FileText } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Students</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Assignments</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">423</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Registrations</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Latest user registrations in the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-1">
              <div>
                <p className="font-medium text-sm sm:text-base">John Doe</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Student - Computer Science</p>
              </div>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-1">
              <div>
                <p className="font-medium text-sm sm:text-base">Jane Smith</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Teacher - Mathematics</p>
              </div>
              <p className="text-xs text-muted-foreground">5 hours ago</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-1">
              <div>
                <p className="font-medium text-sm sm:text-base">Mike Johnson</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Student - Engineering</p>
              </div>
              <p className="text-xs text-muted-foreground">1 day ago</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">System Activity</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Recent system events and statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-1">
              <div>
                <p className="font-medium text-sm sm:text-base">New Course Created</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Advanced Database Systems</p>
              </div>
              <p className="text-xs text-muted-foreground">1 hour ago</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-1">
              <div>
                <p className="font-medium text-sm sm:text-base">Material Uploaded</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Web Development - Lecture 5</p>
              </div>
              <p className="text-xs text-muted-foreground">3 hours ago</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted rounded-lg gap-1">
              <div>
                <p className="font-medium text-sm sm:text-base">Assignment Submitted</p>
                <p className="text-xs sm:text-sm text-muted-foreground">45 new submissions</p>
              </div>
              <p className="text-xs text-muted-foreground">6 hours ago</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
