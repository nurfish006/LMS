import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // 'material', 'submission', 'message'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 50MB" }, { status: 400 })
    }

    // Generate a unique filename
    const ext = file.name.split(".").pop()
    const uniqueName = `${type || "file"}/${session.userId}/${randomUUID()}.${ext}`

    // Upload to Vercel Blob
    const blob = await put(uniqueName, file, {
      access: "public",
    })

    // Create upload token for tracking
    const tokenId = randomUUID()
    const db = await getDatabase()
    const uploadsCollection = db.collection("uploads")

    await uploadsCollection.insertOne({
      tokenId,
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadType: type || "general",
      uploadedBy: session.userId,
      claimed: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    })

    return NextResponse.json({
      url: blob.url,
      tokenId,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
