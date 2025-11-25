import { type NextRequest, NextResponse } from "next/server"
import { put, del } from "@vercel/blob"
import { getSession } from "@/lib/auth"

// Allowed file types
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "text/plain",
  "application/zip",
  "application/x-rar-compressed",
  "application/octet-stream", // Added for generic binary files
]

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: NextRequest) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("[v0] BLOB_READ_WRITE_TOKEN is not configured")
      return NextResponse.json(
        { error: "File storage is not configured. Please add BLOB_READ_WRITE_TOKEN to environment variables." },
        { status: 500 },
      )
    }

    let session = null
    try {
      session = await getSession()
    } catch (authError) {
      console.error("[v0] Auth error:", authError)
    }

    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Uploading file:", file.name, "Type:", file.type, "Size:", file.size)

    if (file.type && !ALLOWED_TYPES.includes(file.type)) {
      console.error("[v0] Invalid file type:", file.type)
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, images, TXT, ZIP, RAR`,
        },
        { status: 400 },
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 50MB" }, { status: 400 })
    }

    // Generate unique filename with folder structure
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").substring(0, 50)
    const pathname = `uploads/${timestamp}-${randomStr}-${sanitizedName}`

    console.log("[v0] Uploading to Vercel Blob with pathname:", pathname)

    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
    })

    console.log("[v0] Upload successful:", blob.url)

    return NextResponse.json({
      message: "File uploaded successfully",
      fileUrl: blob.url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })
  } catch (error: any) {
    console.error("[v0] Upload error:", error?.message || error)
    console.error("[v0] Error stack:", error?.stack)
    return NextResponse.json({ error: error?.message || "Failed to upload file" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    await del(url)

    return NextResponse.json({ message: "File deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
