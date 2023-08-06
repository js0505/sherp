/**
 * @jest-environment node
 */

import request from "supertest"
import server from "nextjs-http-supertest"
import { testStore } from "@/tests/variable/store"
import { StoreTestDataGenerator } from "@/tests/utils/StoreTestDataGenerator"

describe("/api/store/[storeId]", () => {
	let testStoreId: Promise<string>
	const data = new StoreTestDataGenerator()
	const baseUrl = "/api/store"

	beforeAll(async () => {
		await data.connectDb()
		await data.create()
		await data.getId().then((value) => {
			testStoreId = value
		})
	})

	afterAll(async () => {
		await data.clear()
		await data.disconnectDb()
	})

	test("GET", async () => {
		await request(server)
			.get(`${baseUrl}/${testStoreId}`)
			.expect((res) => {
				return expect(res.body.store.storeName).toEqual(testStore.storeName)
			})
	})
})

export {}
