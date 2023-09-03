import { ITestDataGenerator } from "../interface/ITestDataGenerator"
import { Store } from "@/models/Store"
import { StoreModel } from "@/models/Store"
import { testStore } from "@/tests/utils/store/mockData"
import Database from "../Database"

type TestStoreType = typeof testStore

export class StoreTestDataGenerator
	implements ITestDataGenerator<Store, TestStoreType>
{
	db: Database
	createdTestData: Store
	mockData: TestStoreType

	constructor() {
		this.db = new Database()
		this.mockData = testStore
		this.createdTestData = null
	}

	public async connectDb(): Promise<void> {
		await this.db.connect()
	}

	public async disconnectDb(): Promise<void> {
		await this.db.disconnect()
	}

	public async getId(): Promise<string> {
		if (this.createdTestData === null) {
			throw Error("데이터를 먼저 생성 하세요.")
		}
		return this.createdTestData._id.toString()
	}

	public async getData(): Promise<Store> {
		try {
			return this.createdTestData
		} catch (e) {
			console.error("err", e)
		}
	}

	public getMockData(): TestStoreType {
		return this.mockData
	}

	public async create() {
		const store = new StoreModel(this.mockData)
		store.save()
		this.createdTestData = await StoreModel.findOne(this.mockData).lean()
	}

	async clear(): Promise<void> {
		await StoreModel.deleteOne({
			businessNum: this.createdTestData.businessNum,
		})
		this.createdTestData = null
	}
}
