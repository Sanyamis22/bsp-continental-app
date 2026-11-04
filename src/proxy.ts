import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/admin-token";

const USER_ONLY_PREFIXES = ["/dashboard", "/notifications", "/request"];

function isUserOnlyPath(pathname: string): boolean {
  return USER_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Admin surface: the cookie must carry a valid, unexpired, correctly signed token.
  if (pathname.startsWith("/admin")) {
    const rawToken = request.cookies.get(ADMIN_COOKIE)?.value;
    // verifyAdminToken throws only on server misconfiguration (missing JWT_SECRET) -> fail closed.
    const admin = await verifyAdminToken(rawToken).catch(() => null);

    if (pathname === "/admin/login") {
      if (admin) return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (!admin) {
      const res = NextResponse.redirect(new URL("/admin/login", request.url));
      if (rawToken) res.cookies.delete(ADMIN_COOKIE);
      return res;
    }

    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  // 2. User surface.
  // Same rule next-auth uses to pick the cookie name (__Secure- prefix only when NEXTAUTH_URL is https).
  const secureCookie = (process.env.NEXTAUTH_URL ?? request.nextUrl.origin).startsWith("https://");
  const userToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie,
  }).catch(() => null);

  if (userToken && (pathname === "/" || pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!userToken && isUserOnlyPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/notifications/:path*",
    "/request/:path*",
  ],
};
