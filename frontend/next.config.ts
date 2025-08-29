import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
    // Melhorar hidratação
    optimizePackageImports: ["lucide-react"],
  },
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
  swcMinify: true,
};

export default nextConfig;
