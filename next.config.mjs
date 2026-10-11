/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server in .next/standalone for the Docker image
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
