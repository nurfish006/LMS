"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { TeacherNav } from "@/components/teacher-nav"

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== "teacher") return null

  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
