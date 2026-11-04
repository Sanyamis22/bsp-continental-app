import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { rateLimit } from "@/lib/rate-limit";
import { AppError } from "@/lib/errors";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

async function sendWelcomeTermsEmail(email: string, name?: string | null) {
  try {
    if (!email) return;
    const cleanEmail = email.toLowerCase().trim();

    await connectDB();
    let user = await User.findOne({ email: cleanEmail });

    if (user?.hasReceivedTermsPdf) return;

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    if (!emailUser || !emailPass) {
      console.warn("Welcome email skipped: EMAIL_USER / EMAIL_PASS not configured.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
    });

    const attachments: { filename: string; path: string }[] = [];
    try {
      const pdfPath = path.join(process.cwd(), "public", "Offer of Terms.pdf");
      if (fs.existsSync(pdfPath)) {
        attachments.push({
          filename: "BSP_Continental_Offer_of_Terms.pdf",
          path: pdfPath,
        });
      }
    } catch (e) {
      console.warn("⚠️ PDF attachment skipped:", e instanceof Error ? e.message : e);
    }

    const mailOptions = {
      from: `"BSP CONTINENTAL PVT LTD" <${emailUser}>`,
      to: cleanEmail,
      subject: "Welcome to BSP CONTINENTAL PVT LTD | Terms & Policy Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #217044;">
            <h1 style="color: #217044; margin: 0; font-size: 22px; text-transform: uppercase;">BSP CONTINENTAL PVT LTD</h1>
            <p style="color: #64748b; font-size: 12px; margin-top: 4px;">Secure Finance. Compliant Properties.</p>
          </div>
          <div style="padding: 20px 0;">
            <p style="font-size: 15px; color: #1e293b;">Hello <strong>${escapeHtml(name || "Valued Client")}</strong>,</p>
            <p style="font-size: 13px; color: #475569; line-height: 1.6;">Your account has been successfully authenticated on the BSP Continental portal.</p>
          </div>
        </div>
      `,
      attachments,
    };

    await transporter.sendMail(mailOptions);

    if (user) {
      user.hasReceivedTermsPdf = true;
      await user.save();
    } else {
      await User.findOneAndUpdate(
        { email: cleanEmail },
        { hasReceivedTermsPdf: true },
        { upsert: false }
      );
    }
  } catch (err) {
    console.error("Non-blocking email delivery notice:", err instanceof Error ? err.message : err);
  }
}

const isProduction = process.env.NODE_ENV === "production";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Mobile Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const creds = credentials as Record<string, string> | undefined;
        const inputPhone = creds?.phone || creds?.email;
        const password = creds?.password;

        if (!inputPhone || !password) {
          throw new Error("Please enter both mobile number and password.");
        }

        const cleanPhone = inputPhone.trim();
        try {
          await rateLimit(`login:${cleanPhone}`, 10, 15 * 60);
        } catch (err) {
          if (err instanceof AppError) throw new Error("Too many login attempts. Please try again later.");
          throw err;
        }
        
        const user = await User.findOne({ phone: cleanPhone });
        if (!user) {
          throw new Error("No account found with this mobile number. Please sign up first.");
        }

        if (!user.password) {
          throw new Error("This account was created using Google. Please use 'Continue with Google' to sign in.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid password! Please check your credentials and try again.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "user",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();
        const cleanEmail = user.email ? user.email.toLowerCase().trim() : "";

        if (account?.provider === "google" && cleanEmail) {
          const existingUser = await User.findOne({ email: cleanEmail });
          if (!existingUser) {
            await User.create({
              name: user.name || "User",
              email: cleanEmail,
              image: user.image || "",
              phone: "",
              role: "user",
              hasReceivedTermsPdf: false,
            });
          }
        }

        if (cleanEmail) {
          sendWelcomeTermsEmail(cleanEmail, user.name).catch(() => {});
        }
      } catch (err) {
        console.error("SignIn callback error:", err);
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return url === "/" ? `${baseUrl}/dashboard` : `${baseUrl}${url}`;
      }
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.origin === baseUrl) {
          if (parsedUrl.pathname === "/" || parsedUrl.pathname === "") {
            return `${baseUrl}/dashboard`;
          }
          return url;
        }
      } catch {
        // fall through to default redirect
      }
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
