/** @type {import('next').NextConfig} */
const nextConfig = {
  // Runs as a normal Next.js app on Vercel (needed for the /keystatic admin).
  // Public pages are still pre-rendered at build time; content edits trigger a new build.
  images: { formats: ['image/avif', 'image/webp'] },
  reactStrictMode: true,
  async headers() {
    return [{ source: '/keystatic/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  }
};

export default nextConfig;
