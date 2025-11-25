import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDatabase()
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.userId as string) }, { projection: { password: 0 } })

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        year: user.year,
        semester: user.semester,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
