import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests from mobile devices during development
  allowedDevOrigins: [
    '192.168.4.221', // Your phone's IP address
    '192.168.4.*',   // Allow any device on the 192.168.4.x subnet
    '192.168.*.*',   // Allow any device on the 192.168.x.x network (broader)
  ],

  // Deep link support: /adelanto → /?cultivar=adelanto
  // Allows QR codes and direct URLs to open a specific cultivar
  async rewrites() {
    return [
      {
        source: '/:cultivarId(alturas|adelanto|alhambra|artesia|belvedere|brisbane|castaic|carpinteria|sweet-carolina)',
        destination: '/?cultivar=:cultivarId',
      },
    ];
  },
};

export default nextConfig;
