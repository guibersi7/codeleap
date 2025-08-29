import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Melhorar hidratação
    optimizePackageImports: ["lucide-react"],
  },
  // Configurações para Vercel
  trailingSlash: false,
  // Garantir que cookies funcionem corretamente
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
  // Configurações para melhorar a hidratação
  reactStrictMode: true,
};

export default nextConfig;
