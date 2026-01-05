import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/doom',
        destination: 'https://playclassic.games/games/first-person-shooter-dos-games-online/play-doom-online/play/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;