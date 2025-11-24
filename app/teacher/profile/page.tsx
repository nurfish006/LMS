"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function TeacherProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`} />
            <AvatarFallback>
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-2xl">
              {user.firstName} {user.lastName}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
              {user.department && <Badge variant="secondary">{user.department}</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-6 space-y-6">
          <div className="grid gap-1">
            <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
            <p className="text-base">{user.email}</p>
          </div>

          <div className="grid gap-1">
            <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
            <p className="text-base">{user.department || "General Faculty"}</p>
          </div>

          <div className="grid gap-1">
            <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
            <p className="text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
