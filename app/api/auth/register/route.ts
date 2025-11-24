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
      console.error("[v0] MONGODB_URI is not defined")
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 })
    }

    console.log("[v0] Registering user:", email)

    const db = await getDatabase()
    console.log("[v0] Database connected")

    const usersCollection = db.collection<User>("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      console.log("[v0] User already exists:", email)
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    console.log("[v0] Hashing password")
    const hashedPassword = await hashPassword(password)

    // Create user
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

    console.log("[v0] Inserting new user")
    await usersCollection.insertOne(newUser)
    console.log("[v0] User registered successfully")

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Registration error details:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
