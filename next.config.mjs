/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
      {
        protocol: "https",
        hostname: "pub-21daddc5e64940d8bfac214df111cd0c.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
