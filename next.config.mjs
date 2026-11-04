/** @type {import('next').NextConfig} */
// ponytail: script-src keeps 'unsafe-inline' because Next injects inline bootstrap scripts —
// move to a per-request nonce CSP in proxy.ts to drop it.
const isDev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://checkout.razorpay.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com",
  "frame-src https://api.razorpay.com https://checkout.razorpay.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

// Legacy URL -> canonical URL (one path per feature).
const legacyRedirects = [
  ["/profile", "/dashboard/profile"],
  ["/my-requests", "/dashboard/my-requests"],
  ["/notifications", "/dashboard/notifications"],
  ["/request/loan-solution", "/dashboard/loan-solution"],
  ["/loan-solution", "/dashboard/loan-solution"],
  ["/request/property-vetting", "/dashboard/property-compliance"],
  ["/loan", "/services"],
  ["/cibil", "/dashboard/credit-score-management"],
  ["/admin/approved", "/admin/dashboard/requests?status=Approved"],
  ["/admin/rejected", "/admin/dashboard/requests?status=Rejected"],
  ["/admin/user-requests", "/admin/dashboard/requests?status=Pending"],
  ["/admin/dashboard/approved", "/admin/dashboard/requests?status=Approved"],
  ["/admin/dashboard/rejected", "/admin/dashboard/requests?status=Rejected"],
  ["/admin/dashboard/in-review", "/admin/dashboard/requests?status=In%20Review"],
  ["/admin/users", "/admin/dashboard/users"],
];

const nextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    // OAuth / Google avatars. Unknown hosts still use Image with `unoptimized`.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
