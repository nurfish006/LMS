import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import type { Assignment } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    const db = await getDatabase()
    const assignmentsCollection = db.collection<Assignment>("assignments")

    const query: any = {}
    if (courseId) {
      query.courseId = courseId
    }

    const assignments = await assignmentsCollection.find(query).sort({ dueDate: 1 }).toArray()

    return NextResponse.json({ assignments })
  } catch (error) {
    console.error("[v0] Get assignments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, title, description, dueDate, totalPoints, fileUrl } = body

    if (!courseId || !title || !dueDate || !totalPoints) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const assignmentsCollection = db.collection<Assignment>("assignments")

    const newAssignment: Assignment = {
      courseId,
      title,
      description,
      dueDate: new Date(dueDate),
      totalPoints,
      fileUrl,
      createdBy: session.userId as string,
      createdAt: new Date(),
    }

    const result = await assignmentsCollection.insertOne(newAssignment)

    return NextResponse.json(
      { message: "Assignment created successfully", assignmentId: result.insertedId },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create assignment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
