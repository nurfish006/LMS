import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tokenId = searchParams.get("tokenId")
    const url = searchParams.get("url")

    if (tokenId) {
      // Fetch from uploads collection
      const db = await getDatabase()
      const uploadsCollection = db.collection("uploads")
      const upload = await uploadsCollection.findOne({ tokenId })

      if (!upload) {
        return NextResponse.json({ error: "File not found" }, { status: 404 })
      }

      return NextResponse.json({
        url: upload.url,
        filename: upload.filename,
        size: upload.size,
        type: upload.type,
      })
    } else if (url) {
      // Direct URL redirect
      return NextResponse.redirect(url)
    }

    return NextResponse.json({ error: "No tokenId or url provided" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
