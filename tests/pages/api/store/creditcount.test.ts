/**
 * @jest-environment node
 */

import request from "supertest"
import server from "nextjs-http-supertest"
import { StoreTestDataGenerator } from "@/tests/utils/StoreTestDataGenerator"
import { format } from "date-fns"

describe("/api/creditcount", () => {
	const data = new StoreTestDataGenerator()
	const baseUrl = "/api/store/creditcount"
	const year = format(new Date(), "yyyy")
	const month = format(new Date(), "MM")

	beforeEach(async () => {
		await data.connectDb()
		await data.create()
	})

	afterEach(async () => {
		await data.clear()
		await data.disconnectDb()
	})

	test("PATCH, 기존 날짜 업데이트 테스트", async () => {
		const store = await data.getData()

		const body = {
			storeId: store._id,
			year,
			month,
			count: 999,
			cms: store.cms,
			inOperation: store.inOperation,
		}
		const response = await request(server).patch(baseUrl).send(body)

		const checkData = response.body.updatedStore.creditCount.find((value) => {
			return value.year === year && value.month === month
		})

		expect(checkData).toMatchObject({ count: 999, cms: store.cms })
		expect(response.body.message).toEqual("업데이트 성공")
	})

	test("PATCH, 새로운 날짜에 데이터 생성 테스트", async () => {
		const store = await data.getData()
		const plusMonth =
			Number(month) + 1 >= 10
				? String(Number(month) + 1)
				: `0${Number(month) + 1}`

		const body = {
			storeId: store._id,
			year,
			month: plusMonth,
			count: 123,
			cms: store.cms,
			inOperation: store.inOperation,
		}
		const response = await request(server).patch(baseUrl).send(body)

		const checkData = response.body.updatedStore.creditCount.find((value) => {
			return value.year === year && value.month === plusMonth
		})

		expect(checkData).toMatchObject({ count: 123, cms: store.cms })
		expect(response.body.message).toEqual("새로운 연, 월 데이터 생성완료")
	})
})

export {}
