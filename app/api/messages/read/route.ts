import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { senderId } = await request.json()

    if (!senderId) {
      return NextResponse.json({ error: "Sender ID is required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Mark all messages from this sender to current user as read
    await db.collection("messages").updateMany(
      {
        senderId,
        receiverId: session.userId,
        read: false,
      },
      { $set: { read: true } },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error marking messages as read:", error)
    return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 })
  }
}
