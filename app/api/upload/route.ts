import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getSession } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import type { UploadAsset } from "@/lib/models"
import { randomUUID } from "crypto"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 50 * 1024 * 1024

const ALLOWED_EXTENSIONS = {
  material: [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".mp4", ".mp3", ".zip"],
  assignment: [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".mp4", ".zip"],
  submission: [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".zip"]
}

const ALLOWED_MIME_TYPES = {
  material: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "video/mp4",
    "audio/mpeg",
    "application/zip",
    "application/x-zip-compressed"
  ],
  assignment: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "video/mp4",
    "application/zip",
    "application/x-zip-compressed"
  ],
  submission: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "application/x-zip-compressed"
  ]
}

const ROLE_PERMISSIONS = {
  material: ["teacher", "admin", "head"],
  assignment: ["teacher", "admin", "head"],
  submission: ["student"]
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!type || !["material", "assignment", "submission"].includes(type)) {
      return NextResponse.json({ error: "Invalid upload type" }, { status: 400 })
    }

    const userRole = session.role as string
    const allowedRoles = ROLE_PERMISSIONS[type as keyof typeof ROLE_PERMISSIONS]
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 })
    }

    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`
    const allowedExtensions = ALLOWED_EXTENSIONS[type as keyof typeof ALLOWED_EXTENSIONS]
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ 
        error: `Invalid file extension. Allowed types: ${allowedExtensions.join(', ')}` 
      }, { status: 400 })
    }

    const allowedTypes = ALLOWED_MIME_TYPES[type as keyof typeof ALLOWED_MIME_TYPES]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Please upload PDF, Word, PowerPoint, or ZIP files only." 
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const tokenId = randomUUID()
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const baseFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
    const sanitizedBaseName = baseFileName.replace(/[^a-zA-Z0-9-]/g, "_").substring(0, 100)
    const fileName = `${timestamp}-${tokenId}.${extension}`
    
    const uploadDir = join(process.cwd(), "uploads", `${type}s`)
    await mkdir(uploadDir, { recursive: true })
    
    const filePath = join(uploadDir, fileName)
    const storagePath = `uploads/${type}s/${fileName}`
    await writeFile(filePath, buffer)

    const db = await getDb()
    const uploadType = type as "material" | "assignment" | "submission"
    const uploadAsset = {
      tokenId,
      uploadedBy: session.userId as string,
      originalName: file.name,
      storagePath,
      mimeType: file.type,
      size: file.size,
      type: uploadType,
      claimed: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
    
    await db.collection("uploads").insertOne(uploadAsset)

    return NextResponse.json({ 
      success: true, 
      tokenId,
      originalName: file.name,
      size: file.size
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
