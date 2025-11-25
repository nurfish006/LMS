import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import type { Message } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get("partnerId")

    const db = await getDatabase()
    const messagesCollection = db.collection<Message>("messages")

    let query: any = {
      $or: [{ senderId: session.userId }, { receiverId: session.userId }],
    }

    // If partnerId is provided, filter for direct conversation
    if (partnerId) {
      query = {
        $or: [
          { senderId: session.userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: session.userId },
        ],
      }
    }

    const messages = await messagesCollection.find(query).sort({ createdAt: 1 }).limit(500).toArray()

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { receiverId, content, attachment } = body

    if (!receiverId) {
      return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 })
    }

    if (!content && !attachment) {
      return NextResponse.json({ error: "Message content or attachment is required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Get receiver info
    const usersCollection = db.collection("users")
    const receiver = await usersCollection.findOne({ _id: new (await import("mongodb")).ObjectId(receiverId) })

    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 })
    }

    const senderName =
      session.firstName && session.lastName
        ? `${session.firstName} ${session.lastName}`
        : (session.email as string) || "Unknown User"

    const receiverName =
      receiver.firstName && receiver.lastName
        ? `${receiver.firstName} ${receiver.lastName}`
        : receiver.email || "Unknown User"

    const message: Message = {
      senderId: session.userId as string,
      senderName,
      senderRole: session.role as string,
      receiverId,
      receiverName,
      content: content?.trim() || "",
      attachment,
      read: false,
      createdAt: new Date(),
    }

    const result = await db.collection("messages").insertOne(message)

    return NextResponse.json(
      {
        message: { ...message, _id: result.insertedId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
