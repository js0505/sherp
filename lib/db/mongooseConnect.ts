import mongoose from "mongoose"

export default async function mongooseConnect() {
	try {
		const MONGO_URI = "mongodb://127.0.0.1/sherp"
		// const MONGO_URI = process.env.MONGO_URI

		const db = await mongoose.connect(MONGO_URI)

		return db
	} catch (e) {
		console.log(e)
	}
}
