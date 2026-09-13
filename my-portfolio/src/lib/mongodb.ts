import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

type MongooseCache = {
  conn: Connection | null;
  promise: Promise<Connection> | null;
};

const globalWithMongoose = globalThis as unknown as { mongoose?: MongooseCache };

const cached = globalWithMongoose.mongoose ?? { conn: null, promise: null };
globalWithMongoose.mongoose = cached;

export async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "portfolio",
        bufferCommands: false,
      })
      .then((m) => m.connection)
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/**
 * Close MongoDB connection (useful for cleanup)
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}