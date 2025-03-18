/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "skill-trade-xi.vercel.app"], // Allow both localhost and production domain
  },
  reactStrictMode: false, // Disable StrictMode
  experimental: {
    turboMode: false, // Disable Turbo if needed
  },
  output: "standalone", // Reduce deployment issues
  compiler: {
    removeConsole: true, // Prevent log-related errors
  },
};

export default nextConfig;
