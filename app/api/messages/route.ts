import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import type { Message, User } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const oderId = searchParams.get("userId") // Get messages with specific user
    const type = searchParams.get("type") // "conversations" | "messages" | "users"

    const db = await getDatabase()
    const messagesCollection = db.collection<Message>("messages")
    const usersCollection = db.collection<User>("users")

    if (type === "users") {
      const users = await usersCollection
        .find({ _id: { $ne: session.userId as any } }, { projection: { password: 0 } })
        .sort({ firstName: 1 })
        .toArray()

      // Get last message for each user
      const usersWithLastMessage = await Promise.all(
        users.map(async (user) => {
          const lastMessage = await messagesCollection.findOne(
            {
              $or: [
                { senderId: session.userId, receiverId: user._id?.toString() },
                { senderId: user._id?.toString(), receiverId: session.userId },
              ],
            },
            { sort: { createdAt: -1 } },
          )

          return {
            ...user,
            lastMessage: lastMessage?.content,
            lastMessageAt: lastMessage?.createdAt,
          }
        }),
      )

      return NextResponse.json({ users: usersWithLastMessage })
    }

    if (oderId) {
      const messages = await messagesCollection
        .find({
          $or: [
            { senderId: session.userId, receiverId: oderId },
            { senderId: oderId, receiverId: session.userId },
          ],
        })
        .sort({ createdAt: 1 })
        .limit(200)
        .toArray()

      return NextResponse.json(messages)
    }

    // Return group messages (default behavior)
    const messages = await messagesCollection
      .find({ isGroupMessage: true })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json(messages.reverse())
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { content, receiverId, receiverName } = await request.json()
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const senderName =
      session.firstName && session.lastName
        ? `${session.firstName} ${session.lastName}`
        : (session.email as string) || "Unknown User"

    const message: Message = {
      senderId: session.userId as string,
      senderName,
      senderRole: session.role as string,
      receiverId: receiverId || undefined,
      receiverName: receiverName || undefined,
      content: content.trim(),
      isGroupMessage: !receiverId,
      createdAt: new Date(),
    }

    const result = await db.collection("messages").insertOne(message)
    return NextResponse.json({ ...message, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
