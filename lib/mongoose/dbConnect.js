import mongoose from "mongoose"

export default function dbConnect() {
	const MONGO_URI = process.env.MONGO_URI

	console.log("Connect to DB")

	mongoose.connect(MONGO_URI)
}
