import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyPassword, createToken, setSession } from "@/lib/auth"
import type { User } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 })
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Authentication configuration error" }, { status: 500 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    // Find user
    const user = await usersCollection.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create token
    const token = await createToken({
      userId: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    // Set session
    await setSession(token)

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
      },
    })
  } catch (error: any) {
    console.error("[v0] Login error:", error.message)
    return NextResponse.json({ error: `Login failed: ${error.message}` }, { status: 500 })
  }
}
