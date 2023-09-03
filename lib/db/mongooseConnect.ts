import mongoose from "mongoose"

let cachedDb = null

export default async function mongooseConnect() {
	const MONGO_URI = "mongodb://127.0.0.1/sherp"
	if (cachedDb !== null) {
		return cachedDb
	}

	try {
		cachedDb = await mongoose.connect(MONGO_URI)
		return cachedDb
	} catch (e) {
		console.log(e)
		throw e
	}
}
