import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ggtkuawfhxkuffzmsbgn.supabase.co', // Seu domínio de imagens
        pathname: '/storage/v1/object/public/**',  // Caminho das imagens (se necessário)
      },
    ],
  },
};

export default nextConfig;
