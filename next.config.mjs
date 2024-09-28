/** @type {import('next').NextConfig} */
const nextConfig = {
	sassOptions: {
		includePaths: ["./src/styles"],
	},
	experimental: {
		serverComponentsExternalPackages: ["@node-rs/argon2"],
	},
};

export default nextConfig;
