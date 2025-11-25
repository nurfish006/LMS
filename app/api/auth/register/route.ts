import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth"
import type { User } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, role, firstName, lastName, department, year, semester } = body

    if (!email || !password || !role || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: "Database configuration error. Please add MONGODB_URI to environment variables." },
        { status: 500 },
      )
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) return NextResponse.json({ error: "User already exists" }, { status: 400 })

    const hashedPassword = await hashPassword(password)

    const newUser: User = {
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      department,
      year,
      semester,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await usersCollection.insertOne(newUser)
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: `Registration failed: ${error.message}` }, { status: 500 })
  }
}
