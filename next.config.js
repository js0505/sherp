module.exports = () => {
	return {
		env: {
			MONGO_URI: "mongodb://127.0.0.1/sherp",
			NEXT_PUBLIC_SECRET: "sherp",
		},
	}
}
