/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		reactCompiler: true
	},
	env: {
		ADMIN_EMAIL: process.env.ADMIN_EMAIL
	},
	typescript: {
		ignoreBuildErrors: true
	},
	eslint: {
		ignoreDuringBuilds: true
	}
}

export default nextConfig
