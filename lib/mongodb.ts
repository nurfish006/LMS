import { MongoClient, type Db } from "mongodb"

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise(): Promise<MongoClient> {
  // Check for MongoDB URI only when actually connecting
  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local")
  }

  if (clientPromise) {
    return clientPromise
  }

  const uri = process.env.MONGODB_URI

  const options = {
    // SSL/TLS options for MongoDB Atlas
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,

    // Connection timeout settings
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,

    // Connection pool settings
    maxPoolSize: 10,
    minPoolSize: 2,

    // Retry settings
    retryWrites: true,
    retryReads: true,
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }

  return clientPromise
}

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise()
  return client.db("woldia_els")
}

export const getDb = getDatabase

export default getClientPromise
