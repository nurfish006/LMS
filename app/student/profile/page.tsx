"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function StudentProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
                {user.department && <Badge variant="outline">{user.department}</Badge>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <CardTitle className="text-sm text-muted-foreground">Email Address</CardTitle>
            <p className="text-lg">{user.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CardTitle className="text-sm text-muted-foreground">Academic Year</CardTitle>
              <p className="text-lg">{user.year || "Not set"}</p>
            </div>
            <div>
              <CardTitle className="text-sm text-muted-foreground">Semester</CardTitle>
              <p className="text-lg">{user.semester || "Not set"}</p>
            </div>
          </div>
          <div>
            <CardTitle className="text-sm text-muted-foreground">Account Created</CardTitle>
            <p className="text-lg">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
