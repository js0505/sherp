import fs from "fs"
import path from "path"
import os from "os"
import request from "supertest"
import server from "nextjs-http-supertest"
import { format } from "date-fns"
import { Workbook } from "exceljs"
import { Store, StoreModel } from "@/models/Store"
import { StoreTestDataGenerator } from "@/tests/utils/store/StoreTestDataGenerator"
import { URL } from "url"

describe("/api/store/excel", () => {
	const baseUrl = "/api/store/excel"
	const year = format(new Date(), "yyyy")
	const month = format(new Date(), "MM")
	const mockStore = new StoreTestDataGenerator()
	let tempDir: string
	let tempUploadSampleFilePath: string
	let tempUploadFilePath: string

	beforeAll(async () => {
		await mockStore.connectDb()

		// 건수 조회 샘플을 미리 받아서 파일 테스트, 건수 입력 테스트 까지 사용.
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "test"))
		tempUploadSampleFilePath = path.join(tempDir, "uploadSampleTest.xlsx")

		const response = await request(server)
			.get(baseUrl)
			.query({ type: "countUp", year })
			.buffer()
			.parse((res, callback) => {
				res.setEncoding("binary")
				res.body = ""
				res.on("data", (chunk) => {
					res.body += chunk
				})

				res.on("end", () => {
					callback(null, Buffer.from(res.body, "binary"))
				})
			})

		fs.writeFileSync(tempUploadSampleFilePath, response.body)
	})

	afterAll(async () => {
		fs.unlinkSync(tempUploadSampleFilePath)
		fs.unlinkSync(tempUploadFilePath)
		fs.rmdirSync(tempDir)
		await mockStore.disconnectDb()
	})

	// test("GET, 업로드 샘플 다운로드 테스트", async () => {
	// 	const workbook = new Workbook()
	// 	await workbook.xlsx.readFile(tempUploadSampleFilePath)

	// 	const getVanCountDocuments = async (van: string) => {
	// 		try {
	// 			return await StoreModel.countDocuments({
	// 				inOperation: { $not: { $eq: "폐업" } },
	// 				isCorporation: { $not: { $eq: true } },
	// 				van: van.toUpperCase(),
	// 			})
	// 		} catch (e) {
	// 			console.log(e)
	// 			throw e
	// 		}
	// 	}

	// 	const sheetCounts = {}
	// 	workbook.eachSheet(function (worksheet) {
	// 		sheetCounts[worksheet.name.toUpperCase()] = worksheet.actualRowCount - 1
	// 	})

	// 	const compose = await getVanCountDocuments("COMPOSE")
	// 	const daou = await getVanCountDocuments("DAOU")
	// 	const kis = await getVanCountDocuments("KIS")
	// 	const jtnet = await getVanCountDocuments("JTNET")
	// 	const fdik = await getVanCountDocuments("FDIK")

	// 	expect(compose).toEqual(sheetCounts["COMPOSE"])
	// 	expect(daou).toEqual(sheetCounts["DAOU"])
	// 	expect(kis).toEqual(sheetCounts["KIS"])
	// 	expect(jtnet).toEqual(sheetCounts["JTNET"])
	// 	expect(fdik).toEqual(sheetCounts["FDIK"])
	// })

	// test("GET, 보고서 다운로드 테스트", async () => {
	// 	return await request(server)
	// 		.get(baseUrl)
	// 		.query({ type: "report", year })
	// 		.expect(200)
	// })

	test("POST, 건수입력 테스트", async () => {
		try {
			const workbook = new Workbook()
			await workbook.xlsx.readFile(tempUploadSampleFilePath)
			tempUploadFilePath = path.join(tempDir, "countTest.xlsx")

			const sheet = workbook.getWorksheet("KIS")
			// 테스트 할 가맹점 사업자번호 3가지 받아오고
			// 파일 보내고 나서 해당 연월일 카운트 값 맞는지 확인

			const firstStoreBusinessNum = sheet.getRow(2).getCell("A").value as number
			const secondStoreBusinessNum = sheet.getRow(3).getCell("A")
				.value as number
			const thirdStoreBusinessNum = sheet.getRow(4).getCell("A").value as number

			sheet.getRow(2).getCell("C").value = 111
			sheet.getRow(3).getCell("C").value = 222
			sheet.getRow(4).getCell("C").value = 333

			await workbook.xlsx.writeFile(tempUploadFilePath)

			
			const getStoreCreditCount = async (businessNum) => {
				const store: Store = await StoreModel.findOne({ businessNum }).lean()

				const creditCount = store.creditCount.find((value) => {
					value.year === year && value.month === month
				})

				// console.log(store)
				// console.log(creditCount)
				return creditCount.count
			}

			await request(server)
				.post(baseUrl)
				.attach("file", tempUploadFilePath)
				.then(async (response) =>{
					const firstCount = await getStoreCreditCount(firstStoreBusinessNum)
					expect(response.body.success).toBeTruthy()
					expect(response.body.message).toEqual("건수 입력 성공.")
					expect(firstCount).toEqual(111)

				})
				.catch((e) => {
					console.log(e)
					throw e
				})

				// 여기 테스트 다시 수정 필요.

			
		} catch (e) {
			console.log(e)
			throw e
		}
	}, 50000)
})
export {}
