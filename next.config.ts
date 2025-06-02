import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests from mobile devices during development
  allowedDevOrigins: [
    '192.168.4.221', // Your phone's IP address
    '192.168.4.*',   // Allow any device on the 192.168.4.x subnet
    '192.168.*.*',   // Allow any device on the 192.168.x.x network (broader)
  ],
};

export default nextConfig;
