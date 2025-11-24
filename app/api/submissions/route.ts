import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import type { Submission } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const assignmentId = searchParams.get("assignmentId")
    const studentId = searchParams.get("studentId") || session.userId

    const db = await getDatabase()
    const submissionsCollection = db.collection<Submission>("submissions")

    const query: any = {}
    if (assignmentId) {
      query.assignmentId = assignmentId
    }
    if (session.role === "student") {
      query.studentId = session.userId
    } else if (studentId) {
      query.studentId = studentId
    }

    const submissions = await submissionsCollection.find(query).sort({ submittedAt: -1 }).toArray()

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("[v0] Get submissions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { assignmentId, fileUrl } = body

    if (!assignmentId || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const submissionsCollection = db.collection<Submission>("submissions")

    // Check if already submitted
    const existing = await submissionsCollection.findOne({
      assignmentId,
      studentId: session.userId as string,
    })

    if (existing) {
      return NextResponse.json({ error: "Assignment already submitted" }, { status: 400 })
    }

    const newSubmission: Submission = {
      assignmentId,
      studentId: session.userId as string,
      fileUrl,
      submittedAt: new Date(),
    }

    const result = await submissionsCollection.insertOne(newSubmission)

    return NextResponse.json(
      { message: "Assignment submitted successfully", submissionId: result.insertedId },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Submit assignment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
