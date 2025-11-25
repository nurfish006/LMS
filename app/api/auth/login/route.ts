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
      return NextResponse.json(
        { error: "Database configuration error. Please add MONGODB_URI to environment variables." },
        { status: 500 },
      )
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Authentication configuration error. Please add JWT_SECRET to environment variables." },
        { status: 500 },
      )
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")
    const user = await usersCollection.findOne({ email })
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })

    const token = await createToken({
      userId: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    })

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
    return NextResponse.json({ error: `Login failed: ${error.message}` }, { status: 500 })
  }
}
