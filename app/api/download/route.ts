import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { getSession } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".zip": "application/zip"
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const materialId = searchParams.get("materialId")
    const submissionId = searchParams.get("submissionId")

    if (!materialId && !submissionId) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 })
    }

    const db = await getDb()
    let tokenId: string
    let authorized = false

    if (materialId) {
      const material = await db.collection("materials").findOne({ _id: new ObjectId(materialId) })
      if (!material) {
        return NextResponse.json({ error: "Material not found" }, { status: 404 })
      }

      authorized = true

      tokenId = material.fileUrl
    } else if (submissionId) {
      const submission = await db.collection("submissions").findOne({ _id: new ObjectId(submissionId) })
      if (!submission) {
        return NextResponse.json({ error: "Submission not found" }, { status: 404 })
      }

      if (["teacher", "admin", "head"].includes(session.role as string)) {
        authorized = true
      } else if (session.role === "student" && submission.studentId === session.userId) {
        authorized = true
      }

      tokenId = submission.fileUrl
    } else {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    if (!authorized) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const isUUID = tokenId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    
    if (isUUID) {
      const uploadAsset = await db.collection("uploads").findOne({ tokenId })
      if (!uploadAsset) {
        return NextResponse.json({ error: "File not found" }, { status: 404 })
      }

      const filePath = join(process.cwd(), uploadAsset.storagePath)
      const fileBuffer = await readFile(filePath)
      
      const extension = `.${uploadAsset.originalName.split('.').pop()?.toLowerCase() || ''}`
      const contentType = CONTENT_TYPES[extension] || uploadAsset.mimeType || "application/octet-stream"

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${uploadAsset.originalName}"`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Content-Type-Options": "nosniff"
        }
      })
    } else if (tokenId.startsWith("http://") || tokenId.startsWith("https://")) {
      return NextResponse.redirect(tokenId)
    } else if (tokenId.startsWith("/uploads/") || tokenId.startsWith("/api/download")) {
      const legacyPath = tokenId.startsWith("/api/download") 
        ? tokenId.split("file=")[1]?.split("&")[0] 
        : tokenId.replace(/^\/uploads\//, "uploads/")

      if (!legacyPath) {
        return NextResponse.json({ error: "Invalid legacy file path" }, { status: 400 })
      }

      const filePath = join(process.cwd(), "public", legacyPath.startsWith("uploads/") ? legacyPath : `uploads/${legacyPath}`)
      
      try {
        const fileBuffer = await readFile(filePath)
        const fileName = legacyPath.split('/').pop() || "download"
        const extension = `.${fileName.split('.').pop()?.toLowerCase() || ''}`
        const contentType = CONTENT_TYPES[extension] || "application/octet-stream"

        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${fileName}"`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Content-Type-Options": "nosniff"
          }
        })
      } catch (error) {
        return NextResponse.json({ error: "Legacy file not found" }, { status: 404 })
      }
    } else {
      return NextResponse.json({ 
        error: "Invalid file reference" 
      }, { status: 400 })
    }
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}
