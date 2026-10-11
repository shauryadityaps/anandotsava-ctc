import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.*.*",
    "10.*.*.*",
    "172.*.*.*",
    "*.local",
    "*.lan",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "me7aitdbxq.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "cdn.21st.dev",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/brochure.pdf",
        destination: "/Anandotsav.pdf",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/Anandotsav.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Anandotsav.pdf"',
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
