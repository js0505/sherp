module.exports = {
	webpack(config) {
		config.experiments = { ...config.experiments, topLevelAwait: true }
		return config
	},
	// reactStrictMode: false,
	// experimental: {
	// 	appDir: true,
	// 	serverComponentsExternalPackages: ["mongoose"],
	// },

	env: {
		MONGO_URI: "mongodb://127.0.0.1/sherp",
		NEXT_PUBLIC_SECRET: "sherp",
		NEXTAUTH_URL: "http://wavesh.iptime.org:81",
	},
}
