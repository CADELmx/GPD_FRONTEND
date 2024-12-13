/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: true,
  disableDevLogs: true,
  register: false
})

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)
