import { ITestDataGenerator } from "./interface/ITestDataGenerator"
import { Store } from "@/models/Store"
import { StoreModel } from "@/models/Store"
import { testStore } from "@/tests/variable/store"
import Database from "./Database"

type TestStoreType = typeof testStore

export class StoreTestGenerator
	implements ITestDataGenerator<Store, TestStoreType>
{
	private db: Database
	mockData: TestStoreType

	constructor() {
		this.db = new Database()
		this.mockData = testStore
	}

	public async connectDb(): Promise<void> {
		await this.db.connect()
	}

	public async disconnectDb(): Promise<void> {
		await this.db.disconnect()
	}

	public async getId(): Promise<any> {
		const store: Store = await StoreModel.findOne(this.mockData).lean()
		return store._id.toString()
	}

	public async getData(): Promise<Store> {
		const store = await StoreModel.findOne(this.mockData)
		return store
	}

	public async create() {
		const store = new StoreModel(this.mockData)
		store.save()
	}

	async clear(): Promise<void> {
		await StoreModel.deleteOne(this.mockData)
	}
}
