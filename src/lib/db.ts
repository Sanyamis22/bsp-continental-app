import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Crucial Error: Please define the MONGODB_URI inside .env.local');
}

// Global caching system to prevent multiple concurrent connections in development
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

async function dbConnect() {
  // If active connection already exists, return it instantly
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000, // Wait up to 8 seconds before throwing error
    };


    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch((error) => {
      console.error('❌ Mongoose Connection Error:', error instanceof Error ? error.message : error);
      cached.promise = null; // Clear broken cache promise threads
      throw error;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; 
    throw e;
  }

  return cached.conn;
}

export default dbConnect;