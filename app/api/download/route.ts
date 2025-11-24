import { NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import { join, basename, normalize } from "path"
import { getSession } from "@/lib/auth"

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
    const type = searchParams.get("type")
    const fileName = searchParams.get("file")

    if (!type || !["material", "assignment", "submission"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    if (!fileName) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 })
    }

    const userRole = session.role as string
    if (type === "material" || type === "assignment") {
      if (!["teacher", "admin", "head"].includes(userRole)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    if (type === "submission" && userRole === "student") {
      const userId = session.userId as string
      if (!fileName.includes(userId)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    const safeFileName = basename(normalize(fileName))
    if (safeFileName !== fileName || fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
      return NextResponse.json({ error: "Invalid file name" }, { status: 400 })
    }

    const uploadDir = join(process.cwd(), "uploads", `${type}s`)
    const filePath = join(uploadDir, safeFileName)

    try {
      await stat(filePath)
    } catch (error) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileBuffer = await readFile(filePath)
    
    const extension = `.${safeFileName.split('.').pop()?.toLowerCase() || ''}`
    const contentType = CONTENT_TYPES[extension] || "application/octet-stream"

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safeFileName}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff"
      }
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}
