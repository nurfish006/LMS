import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import type { Course } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const coursesCollection = db.collection<Course>("courses")

    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")
    const department = searchParams.get("department")

    const query: any = {}
    if (teacherId) {
      query.teacherId = teacherId
    }
    if (department) {
      query.department = department
    }

    const courses = await coursesCollection.find(query).toArray()

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("[v0] Get courses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || (session.role !== "teacher" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, code, description, department, year, semester } = body

    if (!title || !code || !department || !year || !semester) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const coursesCollection = db.collection<Course>("courses")

    const newCourse: Course = {
      title,
      code,
      description,
      department,
      year,
      semester,
      teacherId: session.userId as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await coursesCollection.insertOne(newCourse)

    return NextResponse.json({ message: "Course created successfully", courseId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
