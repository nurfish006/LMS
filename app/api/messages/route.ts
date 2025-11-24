import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import type { Message } from "@/lib/models"

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const db = await getDb()
    const messages = await db.collection<Message>("messages").find({}).sort({ createdAt: -1 }).limit(100).toArray()

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    const db = await getDb()
    const message: Message = {
      senderId: user.userId,
      senderName: `${user.firstName} ${user.lastName}`,
      senderRole: user.role,
      content: content.trim(),
      createdAt: new Date(),
    }

    const result = await db.collection("messages").insertOne(message)

    return NextResponse.json({ ...message, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
