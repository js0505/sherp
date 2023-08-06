/**
 * @jest-environment node
 */

import request from "supertest"
import server from "nextjs-http-supertest"
import { StoreTestDataGenerator } from "@/tests/utils/StoreTestDataGenerator"

describe("/api/store/[storeId]", () => {
	const data = new StoreTestDataGenerator()
	const baseUrl = "/api/store"

	beforeAll(async () => {
		await data.connectDb()
		await data.create()
	})

	afterAll(async () => {
		await data.clear()
		await data.disconnectDb()
	})

	test("GET", async () => {
		const testStoreId: Promise<string> = await data.getId()
		const mockData = data.getMockData()

		await request(server)
			.get(`${baseUrl}/${testStoreId}`)
			.expect((res) => {
				return expect(res.body.store.storeName).toEqual(mockData.storeName)
			})
	})
})

export {}
