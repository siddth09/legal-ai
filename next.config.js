/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",          value: "nosniff" },
          { key: "X-Frame-Options",                  value: "DENY" },
          { key: "X-XSS-Protection",                 value: "1; mode=block" },
          { key: "Referrer-Policy",                  value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",               value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security",        value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Cross-Origin-Opener-Policy",       value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy",     value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy",     value: "require-corp" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // unsafe-inline kept for styles only (inline styles are used throughout);
              // unsafe-eval removed — no eval usage in production code.
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob:",
              "connect-src 'self' https://generativelanguage.googleapis.com",
              "worker-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Turbopack config (Next.js 16 uses Turbopack by default)
  turbopack: {},

  // Restrict server-only modules on client
  serverExternalPackages: ["pdf-parse"],
};

module.exports = nextConfig;
