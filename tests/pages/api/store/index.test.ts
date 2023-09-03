/**
 * @jest-environment node
 */

import { StoreTestDataGenerator } from "@/tests/utils/store/StoreTestDataGenerator"
import { Store } from "@/models/Store"
import request from "supertest"
import server from "nextjs-http-supertest"

describe("/api/store", () => {
	let responseStore: Store
	const mockStore = new StoreTestDataGenerator()
	const getMockData = mockStore.getMockData()

	const baseUrl = "/api/store"
	try {
		test("POST", async () => {
			const response = await request(server).post(baseUrl).send(getMockData)
			responseStore = response.body.result

			expect(responseStore.storeName).toEqual(getMockData.storeName)
		})

		test("GET", async () => {
			await request(server)
				.get(baseUrl)
				.query({
					businessNum: getMockData.businessNum,
					storeName: getMockData.storeName,
					van: getMockData.van,
					city: getMockData.city,
				})
				.expect((res) => {
					return expect(res.body.filteredStore[0].storeName).toEqual(
						getMockData.storeName,
					)
				})
		})

		test("PATCH", async () => {
			const editedStore = { ...responseStore, van: "JTNET" }
			const response = await request(server).patch(baseUrl).send(editedStore)

			responseStore = response.body.updatedStore

			expect(responseStore.van).toEqual(editedStore.van)
		})

		test("DELETE", async () => {
			const response = await request(server)
				.delete(baseUrl)
				.query({ storeId: responseStore._id })

			expect(response.status).toBe(200)
		})
	} catch (e) {
		console.log(e)
		throw e
	}
})

export {}
