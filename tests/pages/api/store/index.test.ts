/**
 * @jest-environment node
 */

import { Store } from "@/models/Store"
import request from "supertest"
import server from "nextjs-http-supertest"
import { testStore } from "@/tests/variable/store"

describe("/api/store", () => {
	let responseStore: Store

	const baseUrl = "/api/store"

	test("POST", async () => {
		const response = await request(server).post(baseUrl).send(testStore)
		responseStore = response.body.result

		expect(responseStore.storeName).toEqual(testStore.storeName)
	})

	test("GET", async () => {
		await request(server)
			.get(baseUrl)
			.query({
				businessNum: testStore.businessNum,
				storeName: testStore.storeName,
				van: testStore.van,
				city: testStore.city,
			})
			.expect((res) => {
				return expect(res.body.filteredStore[0].storeName).toEqual(
					testStore.storeName,
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
})

export {}
