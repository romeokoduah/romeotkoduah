import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Runs as a Node server under PM2, proxied by nginx — the same pattern as the
  // other apps on this box. Static export cannot serve database-backed posts,
  // the admin dashboard, or server-side moderation.
  output: 'standalone',

  // Gallery uploads are resized to display and thumbnail WebP variants at
  // upload time, so Next's optimiser has nothing left to do.
  images: { unoptimized: true },

  trailingSlash: false,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  // sharp is used only in the upload route; keep it out of the client bundle.
  serverExternalPackages: ['sharp', 'postgres', '@node-rs/argon2'],
}

export default nextConfig
