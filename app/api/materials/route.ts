import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import type { Material } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const materialsCollection = db.collection<Material>("materials")

    const materials = await materialsCollection.find({ courseId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ materials })
  } catch (error) {
    console.error("[v0] Get materials error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !["teacher", "admin", "head"].includes(session.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, title, description, tokenId, fileUrl, fileType } = body

    if (!courseId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const materialsCollection = db.collection<Material>("materials")

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

      if (uploadAsset.type !== "material") {
        return NextResponse.json({ error: "Invalid upload type for material" }, { status: 400 })
      }

      if (new Date() > new Date(uploadAsset.expiresAt)) {
        return NextResponse.json({ error: "Upload token expired" }, { status: 400 })
      }

      assetId = uploadAsset._id
      finalFileUrl = tokenId
    } else if (!fileUrl) {
      return NextResponse.json({ error: "Either tokenId or fileUrl is required" }, { status: 400 })
    }

    const newMaterial: Material = {
      courseId,
      title,
      description,
      fileUrl: finalFileUrl as string,
      fileType: fileType || "url",
      uploadedBy: session.userId as string,
      createdAt: new Date(),
    }

    const result = await materialsCollection.insertOne(newMaterial)

    if (tokenId && assetId) {
      const uploadsCollection = db.collection("uploads")
      await uploadsCollection.updateOne(
        { _id: assetId },
        { $set: { claimed: true, linkedTo: result.insertedId.toString() } }
      )
    }

    return NextResponse.json(
      { message: "Material uploaded successfully", materialId: result.insertedId },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Upload material error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
