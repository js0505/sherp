import mongooseConnect from "@/lib/db/mongooseConnect"

export default class Database {
	private db: Promise<typeof import("mongoose")>

	constructor() {
		this.db = this.connect()
	}

	async connect() {
		return await mongooseConnect()
	}

	async disconnect() {
		await (await this.db).disconnect()
	}
}
