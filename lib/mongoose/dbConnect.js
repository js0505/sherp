import mongoose from "mongoose"

export default async function dbConnect() {
	const MONGO_URI = process.env.MONGO_URI

	console.log("Connect to DB")

	await mongoose.connect(MONGO_URI)
}
