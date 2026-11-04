import { notFound } from "@/lib/errors";

/** Parked integrations that have no UI yet. Off unless FEATURE_<NAME>=true (e.g. FEATURE_CHAT=true). */
export type FeatureName = "CHAT" | "CIBIL";

export function requireFeature(name: FeatureName): void {
  if (process.env[`FEATURE_${name}`] !== "true") throw notFound();
}
