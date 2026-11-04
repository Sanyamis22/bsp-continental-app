import crypto from "crypto";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getAdmin, requireUser } from "@/lib/auth/guards";
import { requireEnv } from "@/lib/env";
import { badRequest, errorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const MAX_BYTES = 10 * 1024 * 1024;

const ALLOWED: Record<string, { ext: string; magic: number[] }> = {
  "application/pdf": { ext: "pdf", magic: [0x25, 0x50, 0x44, 0x46] },
  "image/png": { ext: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  "image/jpeg": { ext: "jpg", magic: [0xff, 0xd8, 0xff] },
};

function matchesSignature(buffer: Buffer, magic: number[]): boolean {
  return magic.every((byte, i) => buffer[i] === byte);
}

export async function POST(req: Request) {
  try {
    // Admins upload reply documents; users upload their own KYC / request documents.
    let ownerPrefix: string;
    if (await getAdmin()) {
      ownerPrefix = "admin";
    } else {
      const user = await requireUser();
      ownerPrefix = `u_${crypto.createHash("sha256").update(user.email.toLowerCase()).digest("hex").slice(0, 24)}`;
      await rateLimit(`upload:${ownerPrefix}`, 30, 10 * 60);
    }

    const bucketName = (
      process.env.AWS_S3_BUCKET_NAME ||
      process.env.AWS_BUCKET_NAME ||
      process.env.S3_BUCKET_NAME ||
      process.env.S3_BUCKET ||
      ""
    ).trim();
    if (!bucketName) requireEnv("AWS_BUCKET_NAME");
    const region = (process.env.AWS_REGION || "ap-south-1").trim();
    const accessKeyId = requireEnv("AWS_ACCESS_KEY_ID");
    const secretAccessKey = requireEnv("AWS_SECRET_ACCESS_KEY");

    const formData = await req.formData();
    const file = formData.getAll("files")[0] ?? formData.get("file");
    if (!file || typeof file === "string") throw badRequest("No file provided in form data.");

    const rule = ALLOWED[file.type];
    if (!rule) throw badRequest("Only PDF, PNG and JPG files are allowed.");
    if (file.size === 0 || file.size > MAX_BYTES) throw badRequest("File must be between 1 byte and 10 MB.");

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!matchesSignature(buffer, rule.magic)) throw badRequest("File content does not match its type.");

    const key = `documents/${ownerPrefix}/doc_${Date.now()}_${crypto.randomBytes(6).toString("hex")}.${rule.ext}`;
    const s3Client = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
    await s3Client.send(
      new PutObjectCommand({ Bucket: bucketName, Key: key, Body: buffer, ContentType: file.type })
    );

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    return NextResponse.json({
      success: true,
      name: file.name,
      fileUrl,
      url: fileUrl,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
    });
  } catch (error) {
    return errorResponse(error, "File upload failed. Please try again.");
  }
}
