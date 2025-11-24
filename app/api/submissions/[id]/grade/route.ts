import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || session.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { grade, feedback } = body

    if (grade === undefined) {
      return NextResponse.json({ error: "Grade is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const submissionsCollection = db.collection("submissions")

    const result = await submissionsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          grade,
          feedback: feedback || "",
          gradedBy: session.userId,
          gradedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Grade submitted successfully" })
  } catch (error) {
    console.error("[v0] Grade submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
