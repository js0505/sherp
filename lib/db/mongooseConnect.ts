import mongoose from "mongoose"

export default async function mongooseConnect() {
	try {
		const MONGO_URI = process.env.MONGO_URI

		await mongoose.connect(MONGO_URI)
	} catch (e) {
		console.log(e)
	}
}
