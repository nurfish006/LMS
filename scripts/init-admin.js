const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/wduels"

async function initAdmin() {
  console.log("Connecting to MongoDB...")
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const users = db.collection("users")

    // Check if admin already exists
    const existingAdmin = await users.findOne({ email: "admin@woldia.edu.et" })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)

    const adminUser = {
      name: "System Administrator",
      email: "admin@woldia.edu.et",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await users.insertOne(adminUser)
    console.log("Admin user created successfully!")
    console.log("Email: admin@woldia.edu.et")
    console.log("Password: admin123")
    console.log("⚠️  Please change the password after first login!")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await client.close()
    console.log("Connection closed")
  }
}

initAdmin()
