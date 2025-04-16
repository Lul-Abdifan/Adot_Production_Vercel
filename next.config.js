/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'storage.googleapis.com'],
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_DEV_API_URL: process.env.NEXT_PUBLIC_DEV_API_URL,
    NEXT_PUBLIC_PROD_API_URL: process.env.NEXT_PUBLIC_PROD_API_URL,
    NEXT_PUBLIC_G4A_PROPERTY_ID: process.env.NEXT_PUBLIC_G4A_PROPERTY_ID,
  },
}



module.exports = nextConfig
