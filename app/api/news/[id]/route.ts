import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || (session.role !== "admin" && session.role !== "head")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const newsCollection = db.collection("news")

    const result = await newsCollection.deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "News not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "News deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete news error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
