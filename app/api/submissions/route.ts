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
    if (assignmentId) query.assignmentId = assignmentId
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
    const { assignmentId, tokenId, fileUrl } = body

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const submissionsCollection = db.collection<Submission>("submissions")

    const existing = await submissionsCollection.findOne({
      assignmentId,
      studentId: session.userId as string,
    })

    if (existing) {
      return NextResponse.json({ error: "Assignment already submitted" }, { status: 400 })
    }

    let finalFileUrl = fileUrl
    let assetId

    if (tokenId) {
      const uploadsCollection = db.collection("uploads")
      const uploadAsset = await uploadsCollection.findOne({ tokenId })

      if (!uploadAsset) {
        return NextResponse.json({ error: "Invalid upload token" }, { status: 400 })
      }
      if (uploadAsset.claimed) {
        return NextResponse.json({ error: "Upload token already used" }, { status: 400 })
      }
      if (uploadAsset.uploadedBy !== session.userId) {
        return NextResponse.json({ error: "Unauthorized to use this upload" }, { status: 403 })
      }
      if (uploadAsset.uploadType !== "submission") {
        return NextResponse.json({ error: "Invalid upload type for submission" }, { status: 400 })
      }
      if (new Date() > new Date(uploadAsset.expiresAt)) {
        return NextResponse.json({ error: "Upload token expired" }, { status: 400 })
      }

      assetId = uploadAsset._id
      finalFileUrl = tokenId
    } else if (!fileUrl) {
      return NextResponse.json({ error: "Either tokenId or fileUrl is required" }, { status: 400 })
    }

    const newSubmission: Submission = {
      assignmentId,
      studentId: session.userId as string,
      fileUrl: finalFileUrl as string,
      submittedAt: new Date(),
    }

    const result = await submissionsCollection.insertOne(newSubmission)

    if (tokenId && assetId) {
      const uploadsCollection = db.collection("uploads")
      await uploadsCollection.updateOne(
        { _id: assetId },
        { $set: { claimed: true, linkedTo: result.insertedId.toString() } },
      )
    }

    return NextResponse.json(
      { message: "Assignment submitted successfully", submissionId: result.insertedId },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Submit assignment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
