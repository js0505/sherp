/**
 * @jest-environment node
 */

import request from "supertest"
import server from "nextjs-http-supertest"
import { testStore } from "@/tests/variable/store"
import { StoreTestGenerator } from "@/tests/utils/StoreTestGenerator"

describe("/api/store[storeId]", () => {
	let testStoreId: Promise<string>
	const data = new StoreTestGenerator()
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
