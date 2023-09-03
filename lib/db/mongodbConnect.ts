import { MongoClient } from "mongodb"

const MONGO_URI = process.env.MONGO_URI

const client = new MongoClient(MONGO_URI, {})

let clientPromise: Promise<MongoClient>

try {
	clientPromise = client.connect()
} catch (e) {
	console.log(e)
}

export default clientPromise
