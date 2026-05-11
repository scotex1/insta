import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  images: { domains: ['graph.facebook.com'] },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  },
};
export default nextConfig;
