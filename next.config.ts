import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // experimental: {
  //   optimizePackageImports: [
  //     "react-icons",
  //     "react-icons/ai",
  //     "react-icons/bi",
  //     "react-icons/bs",
  //     "react-icons/cg",
  //     "react-icons/ci",
  //     "react-icons/fa",
  //     "react-icons/fa6",
  //     "react-icons/fi",
  //     "react-icons/gi",
  //     "react-icons/go",
  //     "react-icons/gr",
  //     "react-icons/hi",
  //     "react-icons/hi2",
  //     "react-icons/im",
  //     "react-icons/io",
  //     "react-icons/io5",
  //     "react-icons/lia",
  //     "react-icons/lu",
  //     "react-icons/md",
  //     "react-icons/pi",
  //     "react-icons/ri",
  //     "react-icons/rx",
  //     "react-icons/si",
  //     "react-icons/sl",
  //     "react-icons/tb",
  //     "react-icons/tfi",
  //     "react-icons/ti",
  //     "react-icons/vsc",
  //     "react-icons/wi",
  //     "lucide-react",
  //   ],
  // },
};

export default nextConfig;
