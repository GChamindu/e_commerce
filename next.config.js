/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // THIS FIXES YOUR IMAGE ERROR FOREVER
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-860b96fb3f4b4c8aafe4f645234dd20f.r2.dev",
        port: "",
        pathname: "/**",
      },
      // Also allow your own domain (for future uploads)
      {
        protocol: "https",
        hostname: "www.zeloanspice.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zeloanspice.com",
        pathname: "/**",
      },
    ],
  },

  // Optional: Better performance (recommended)
  output: "standalone", // Smaller build size
  swcMinify: true,
};

export default nextConfig;