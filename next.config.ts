import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static HTML export — the VPS runs nginx only, no Node runtime.
  output: 'export',
  images: { unoptimized: true },
  // nginx resolves clean URLs via `try_files $uri $uri.html $uri/`.
  trailingSlash: false,
  productionBrowserSourceMaps: false,
}

export default nextConfig
