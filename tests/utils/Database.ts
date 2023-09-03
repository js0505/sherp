import mongooseConnect from "@/lib/db/mongooseConnect"

export default class Database {
	private db = null

	async connect() {
		this.db = await mongooseConnect()
		return this.db
	}

	async disconnect() {
		await (await this.db).disconnect()
	}
}
