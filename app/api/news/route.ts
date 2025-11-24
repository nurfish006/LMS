import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import type { News } from "@/lib/models"

export async function GET() {
  try {
    const db = await getDatabase()
    const newsCollection = db.collection<News>("news")

    const news = await newsCollection.find({}).sort({ createdAt: -1 }).limit(20).toArray()

    return NextResponse.json({ news })
  } catch (error) {
    console.error("[v0] Get news error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || (session.role !== "admin" && session.role !== "head")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const newsCollection = db.collection<News>("news")

    const newNews: News = {
      title,
      content,
      createdBy: session.userId as string,
      createdAt: new Date(),
    }

    const result = await newsCollection.insertOne(newNews)

    return NextResponse.json({ message: "News created successfully", newsId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create news error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
