/** @type {import('next').NextConfig} */
const securityHeaders = [
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
  async headers() {
    // ponytail: no CSP yet — needs a Razorpay/inline-script allowlist; add via nonce-based CSP in Phase 5.
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
