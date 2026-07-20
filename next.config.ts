import type { NextConfig } from "next";

const FALLBACK_DOMAIN = "example.com";

let protocol: "http" | "https" = "https";
let hostname = FALLBACK_DOMAIN;
let port = "";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (siteUrl) {
  try {
    const url = new URL(siteUrl);
    protocol = url.protocol.replace(":", "") as "http" | "https";
    hostname = url.hostname;
    port = url.port || "";
  } catch {
    console.warn("Invalid NEXT_PUBLIC_SITE_URL, using fallback domain.");
  }
} else {
  console.warn("NEXT_PUBLIC_SITE_URL not set, using fallback domain.");
}

const backendUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol,
        hostname,
        port,
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
