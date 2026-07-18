import type { NextConfig } from "next";
import { cultivars } from "./data/cultivars";

// Every real cultivar page is deep-linkable ('debug' is the intro card, not a page)
const deepLinkIds = cultivars.map(c => c.id).filter(id => id !== 'debug');

const nextConfig: NextConfig = {
  // Allow cross-origin requests from mobile devices during development
  allowedDevOrigins: [
    '192.168.4.221', // Your phone's IP address
    '192.168.4.*',   // Allow any device on the 192.168.4.x subnet
    '192.168.*.*',   // Allow any device on the 192.168.x.x network (broader)
  ],

  // Deep link support: /adelanto → /?cultivar=adelanto
  // Allows QR codes and direct URLs to open a specific cultivar.
  // The id list derives from data/cultivars.ts — new cultivars deep-link automatically.
  async rewrites() {
    return [
      {
        source: `/:cultivarId(${deepLinkIds.join('|')})`,
        destination: '/?cultivar=:cultivarId',
      },
    ];
  },
};

export default nextConfig;
