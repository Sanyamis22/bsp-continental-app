import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// One document per limiter key (or cooldown key).
const RateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  // Sliding-window log: epoch-ms timestamps of the hits that were allowed. Unused by cooldown keys.
  hits: { type: [Number], default: [] },
  // TTL: Mongo removes the document once `expiresAt` has passed.
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export type RateLimitDoc = InferSchemaType<typeof RateLimitSchema>;

export default (mongoose.models.RateLimit as Model<RateLimitDoc>) ||
  mongoose.model<RateLimitDoc>("RateLimit", RateLimitSchema);
