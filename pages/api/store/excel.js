import nextConnect from "next-connect"

import { Workbook } from "exceljs"
import multer from "multer"
import fs from "fs"
import path from "path"
import mongooseConnect from "../../../lib/db/mongooseConnect"
import { StoreModel } from "../../../models/Store"

const handler = nextConnect()

handler.get(async function (req, res) {
	const { type, year } = req.query
	await mongooseConnect()

	// type 쿼리를 만들어서 report면 전체 리스트 만드는 엑셀파일 넘기고
	// countUp 이면 건수 넣을 샘플파일 넘기기. van 도 받아서 van 별로 받아 줘야 함.

	// 쿼리로 연도 받기.
	// const year = "2022"

	switch (type) {
		case "report":
			await makeStoreReport({ year, res })
			break
		case "countUp":
			await makeStoreCountUpSample({ res })
			break
	}
})

export const config = {
	api: {
		bodyParser: false, // Disallow body parsing, consume as stream
	},
}

// multer 세팅

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = `${path.resolve()}/public/upload`

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir)
		}
		cb(null, dir)
	},
	filename: function (req, file, cb) {
		cb(null, "countTest.xlsx")
	},
})
let upload = multer({
	storage: storage,
})

let uploadFile = upload.single("file")

/**
 * 가맹점 건수 일괄 입력기능.
 *
 * 사업자번호, 가맹점명, 건수, 밴사명은 시트 이름으로.
 *
 * 가맹점 리스트에서 해당 가맹점 사업자번호로 찾아서 creditCount 배열 접근.
 * 만약 사업자번호 검색 결과가 1개가 아니면?
 * van이 다른 사업자 번호 or 법인사업자 가맹점.
 *
 * 해당 연, 월 데이터가 있으면 그 데이터에 건수 값만 새로운 값으로 수정
 * 없으면 새로운 객체 입력. cms, inOperation은 기존 가맹점 값에 있는걸로
 *
 */
handler.use(uploadFile).post(async function (req, res) {
	console.log("건수입력 시작")
	try {
		await dbConnect()
		// 요청 받으면서 업로드 된 파일을 처리할 연, 월 값
		const { month, year } = req.query
		const parseMonth = month.length === 1 ? `0${month}` : month

		const workbook = new Workbook()

		await workbook.xlsx.readFile("public/upload/countTest.xlsx")

		// 시트별로 반복문 실행. -> van이 다른 사업자가 중복되어 있을 수 있어서

		workbook.eachSheet(function (worksheet) {
			// 현재 작업하는 van
			// 밴 이름 찾아서 검색할때 밴 이름도 같이 검색 해야됨.
			const van = worksheet.name

			// 현재 시트의 사업자, 건수 배열로 저장
			let businessNumArr = []
			let countArr = []
			let storeNameArr = []

			worksheet.getColumn(1).eachCell(function (cell, rowNum) {
				if (rowNum !== 1) {
					businessNumArr.push(cell.value)
				}
			})

			worksheet.getColumn(2).eachCell(function (cell, rowNum) {
				if (rowNum !== 1) {
					storeNameArr.push(cell.value)
				}
			})

			worksheet.getColumn(3).eachCell(function (cell, rowNum) {
				if (rowNum !== 1) {
					countArr.push(cell.value === null ? 0 : cell.value)
				}
			})

			// 저장된 사업자로 데이터 입력 시작
			businessNumArr.forEach(async (businessNum, index) => {
				const count = countArr[index]
				const storeName = storeNameArr[index]

				const store = await StoreModel.findOne({ van, businessNum, storeName })

				if (store) {
					// 기존에 입력된 데이터가 있는지 확인
					const findCreditCountIdx = store.creditCount.findIndex(function (
						value,
					) {
						return value.year === year && value.month === parseMonth
					})

					const newCount = {
						year,
						month: parseMonth,
						count,
						cms: store.cms === null ? 0 : store.cms,
						inOperation: store.inOperation,
					}
					if (findCreditCountIdx === -1) {
						// null값 있으면 바로잡기 위해 로직 생성
						store.cms = store.cms === null ? 0 : store.cms
						// 연, 월 데이터가 기록된 적 없는 경우. 새로운 객체 추가
						store.creditCount.push(newCount)
						store.save()
					} else {
						// null값 있으면 바로잡기 위해 로직 생성
						store.cms = store.cms === null ? 0 : store.cms
						// 기록된 데이터가 있는 경우, 전체 덮어쓰기
						store.creditCount[findCreditCountIdx] = newCount
						store.save()
					}
				}
			})
		})

		// 처리하고 남은 파일 삭제
		fs.unlinkSync("public/upload/countTest.xlsx")
		res.status(200).json({ success: true, message: "건수 입력 성공." })
	} catch (e) {
		console.log(e)
		res.status(200).json({ success: false, message: "거래건수 입력 중 오류" })
	}
})

const makeStoreReport = async ({ year, res }) => {
	// const firstRowFill = {
	// 	type: "pattern",
	// 	pattern: "solid",
	// 	fgColor: { argb: "deebf9" },
	// }
	// const firstRowAlign = { vertical: "middle", horizontal: "center" }

	// const firstRowBorder = {
	// 	bottom: { style: "thin" },
	// 	left: { style: "thin" },
	// }

	// const firstRowHeight = 33

	const sheetColumns = [
		{ header: "담당자", key: "user" },
		{ header: "대리점코드", key: "vanCode" },
		{ header: "ID", key: "vanId" },
		{ header: "계약일자", key: "contractDate" },
		{ header: "사업자번호", key: "businessNum" },
		{ header: "상호", key: "storeName" },
		{ header: "대표자명", key: "owner" },
		{ header: "주소", key: "city" },
		{ header: "주소2", key: "address" },
		{ header: "메모", key: "note" },
		{ header: "1월 영업상태", key: "jan_inOperation" },
		{ header: "1월 CMS", key: "jan_cms" },
		{ header: "1월 건수", key: "jan_count" },
		{ header: "2월 영업상태", key: "feb_inOperation" },
		{ header: "2월 CMS", key: "feb_cms" },
		{ header: "2월 건수", key: "feb_count" },
		{ header: "3월 영업상태", key: "mar_inOperation" },
		{ header: "3월 CMS", key: "mar_cms" },
		{ header: "3월 건수", key: "mar_count" },
		{ header: "4월 영업상태", key: "apr_inOperation" },
		{ header: "4월 CMS", key: "apr_cms" },
		{ header: "4월 건수", key: "apr_count" },
		{ header: "5월 영업상태", key: "may_inOperation" },
		{ header: "5월 CMS", key: "may_cms" },
		{ header: "5월 건수", key: "may_count" },
		{ header: "6월 영업상태", key: "jun_inOperation" },
		{ header: "6월 CMS", key: "jun_cms" },
		{ header: "6월 건수", key: "jun_count" },
		{ header: "7월 영업상태", key: "jul_inOperation" },
		{ header: "7월 CMS", key: "jul_cms" },
		{ header: "7월 건수", key: "jul_count" },
		{ header: "8월 영업상태", key: "aug_inOperation" },
		{ header: "8월 CMS", key: "aug_cms" },
		{ header: "8월 건수", key: "aug_count" },
		{ header: "9월 영업상태", key: "sep_inOperation" },
		{ header: "9월 CMS", key: "sep_cms" },
		{ header: "9월 건수", key: "sep_count" },
		{ header: "10월 영업상태", key: "oct_inOperation" },
		{ header: "10월 CMS", key: "oct_cms" },
		{ header: "10월 건수", key: "oct_count" },
		{ header: "11월 영업상태", key: "nov_inOperation" },
		{ header: "11월 CMS", key: "nov_cms" },
		{ header: "11월 건수", key: "nov_count" },
		{ header: "12월 영업상태", key: "dec_inOperation" },
		{ header: "12월 CMS", key: "dec_cms" },
		{ header: "12월 건수", key: "dec_count" },
	]

	try {
		const workbook = new Workbook()

		await workbook.xlsx.readFile("public/리스트.xlsx")

		// 밴사별 시트 가져오기
		const kisSheet = workbook.getWorksheet("KIS")
		const niceSheet = workbook.getWorksheet("NICE")
		const fdikSheet = workbook.getWorksheet("FDIK")
		const daouSheet = workbook.getWorksheet("DAOU")
		const smartroSheet = workbook.getWorksheet("SMARTRO")
		const jtnetSheet = workbook.getWorksheet("JTNET")
		const ksnetSheet = workbook.getWorksheet("KSNET")
		const composeSheet = workbook.getWorksheet("COMPOSE")
		const kiccSheet = workbook.getWorksheet("KICC")
		const kcpSheet = workbook.getWorksheet("KCP")

		/**
		 * 각 시트별로 초기 디자인 값 입력.
		 */
		workbook.eachSheet((worksheet) => {
			if (worksheet.id !== 1) {
				worksheet.columns = sheetColumns
			}
		})

		const stores = await StoreModel.find()

		stores.forEach((item) => {
			// 계약 연도가 요청한 연도보다 크면 그 해에는 없던 가맹점 이니까 제외.
			if (item.contractDate && item.contractDate.slice(0, 4) > year) {
				return
			}

			const yearFilteredCount = item.creditCount.filter(
				(item) => item.year === year,
			)

			const {
				user,
				van,
				vanCode,
				vanId,
				contractDate,
				businessNum,
				storeName,
				owner,
				city,
				address,
				note,
			} = item

			const jan_valueIndex = yearFilteredCount.findIndex(
				(value) => value.month === "01",
			)
			const feb_valueIndex = yearFilteredCount.findIndex(
				(value) => value.month === "02",
			)
			const mar_valueIndex = yearFilteredCount.findIndex(
				(value) => value.month === "03",
			)
			const apr_valueIndex = yearFilteredCount.findIndex(
				(value) => value.month === "04",
			)
			const may_valueIndex = yearFilteredCount.findIndex(
				(value) => value.month === "05",
			)
			const jun_valueIndex = yearFilteredCount.findIndex(
				(value) => value.month === "06",
			)
			const jul_valueIndex = yearFilteredCount.findIndex(
				(value) => value.month === "07",
			)
			const aug_valueIndex = yearFilteredCount.findIndex(
				(value) => value.month === "08",
			)
			const sep_valueIndex = yearFilteredCount.findIndex(
				(value) => value.month === "09",
			)
			const oct_valueIndex = yearFilteredCount.findIndex(
				(value) => value.month === "10",
			)
			const nov_valueIndex = yearFilteredCount.findIndex(
				(value) => value.month === "11",
			)
			const dec_valueIndex = yearFilteredCount.findIndex(
				(value) => value.month === "12",
			)

			const rowData = {
				user,
				van,
				vanCode,
				vanId,
				contractDate,
				businessNum,
				storeName,
				owner,
				city,
				address,
				note,
				jan_inOperation:
					jan_valueIndex === -1
						? ""
						: yearFilteredCount[jan_valueIndex].inOperation,
				feb_inOperation:
					feb_valueIndex === -1
						? ""
						: yearFilteredCount[feb_valueIndex].inOperation,
				mar_inOperation:
					mar_valueIndex === -1
						? ""
						: yearFilteredCount[mar_valueIndex].inOperation,
				apr_inOperation:
					apr_valueIndex === -1
						? ""
						: yearFilteredCount[apr_valueIndex].inOperation,
				may_inOperation:
					may_valueIndex === -1
						? ""
						: yearFilteredCount[may_valueIndex].inOperation,
				jun_inOperation:
					jun_valueIndex === -1
						? ""
						: yearFilteredCount[jun_valueIndex].inOperation,
				jul_inOperation:
					jul_valueIndex === -1
						? ""
						: yearFilteredCount[jul_valueIndex].inOperation,
				aug_inOperation:
					aug_valueIndex === -1
						? ""
						: yearFilteredCount[aug_valueIndex].inOperation,
				sep_inOperation:
					sep_valueIndex === -1
						? ""
						: yearFilteredCount[sep_valueIndex].inOperation,
				oct_inOperation:
					oct_valueIndex === -1
						? ""
						: yearFilteredCount[oct_valueIndex].inOperation,
				nov_inOperation:
					nov_valueIndex === -1
						? ""
						: yearFilteredCount[nov_valueIndex].inOperation,
				dec_inOperation:
					dec_valueIndex === -1
						? ""
						: yearFilteredCount[dec_valueIndex].inOperation,
				jan_cms:
					jan_valueIndex === -1 ? "" : yearFilteredCount[jan_valueIndex].cms,
				feb_cms:
					feb_valueIndex === -1 ? "" : yearFilteredCount[feb_valueIndex].cms,
				mar_cms:
					mar_valueIndex === -1 ? "" : yearFilteredCount[mar_valueIndex].cms,
				apr_cms:
					apr_valueIndex === -1 ? "" : yearFilteredCount[apr_valueIndex].cms,
				may_cms:
					may_valueIndex === -1 ? "" : yearFilteredCount[may_valueIndex].cms,
				jun_cms:
					jun_valueIndex === -1 ? "" : yearFilteredCount[jun_valueIndex].cms,
				jul_cms:
					jul_valueIndex === -1 ? "" : yearFilteredCount[jul_valueIndex].cms,
				aug_cms:
					aug_valueIndex === -1 ? "" : yearFilteredCount[aug_valueIndex].cms,
				sep_cms:
					sep_valueIndex === -1 ? "" : yearFilteredCount[sep_valueIndex].cms,
				oct_cms:
					oct_valueIndex === -1 ? "" : yearFilteredCount[oct_valueIndex].cms,
				nov_cms:
					nov_valueIndex === -1 ? "" : yearFilteredCount[nov_valueIndex].cms,
				dec_cms:
					dec_valueIndex === -1 ? "" : yearFilteredCount[dec_valueIndex].cms,
				jan_count:
					jan_valueIndex === -1 ? "" : yearFilteredCount[jan_valueIndex].count,
				feb_count:
					feb_valueIndex === -1 ? "" : yearFilteredCount[feb_valueIndex].count,
				mar_count:
					mar_valueIndex === -1 ? "" : yearFilteredCount[mar_valueIndex].count,
				apr_count:
					apr_valueIndex === -1 ? "" : yearFilteredCount[apr_valueIndex].count,
				may_count:
					may_valueIndex === -1 ? "" : yearFilteredCount[may_valueIndex].count,
				jun_count:
					jun_valueIndex === -1 ? "" : yearFilteredCount[jun_valueIndex].count,
				jul_count:
					jul_valueIndex === -1 ? "" : yearFilteredCount[jul_valueIndex].count,
				aug_count:
					aug_valueIndex === -1 ? "" : yearFilteredCount[aug_valueIndex].count,
				sep_count:
					sep_valueIndex === -1 ? "" : yearFilteredCount[sep_valueIndex].count,
				oct_count:
					oct_valueIndex === -1 ? "" : yearFilteredCount[oct_valueIndex].count,
				nov_count:
					nov_valueIndex === -1 ? "" : yearFilteredCount[nov_valueIndex].count,
				dec_count:
					dec_valueIndex === -1 ? "" : yearFilteredCount[dec_valueIndex].count,
			}

			switch (van) {
				case "KIS":
					kisSheet.addRow(rowData)
					break
				case "NICE":
					niceSheet.addRow(rowData)
					break
				case "FDIK":
					fdikSheet.addRow(rowData)
					break
				case "DAOU":
					daouSheet.addRow(rowData)
					break
				case "SMARTRO":
					smartroSheet.addRow(rowData)
					break
				case "JTNET":
					jtnetSheet.addRow(rowData)
					break
				case "KSNET":
					ksnetSheet.addRow(rowData)
					break
				case "COMPOSE":
					composeSheet.addRow(rowData)
					break
				case "KICC":
					kiccSheet.addRow(rowData)
					break
				case "KCP":
					kcpSheet.addRow(rowData)
					break
			}
		})

		// todo: 파일 수식 안깨지게 했는데 이 함수 필요한지 테스트 해보기
		workbook.eachSheet((worksheet) => {
			if (worksheet.id !== 1) {
				// 수식 깨지지 않게 초기 시트에 첫줄 데이터가 들어 있어서 그 부분 삭제
				// 맨 위에 반복문 에서 실행하면 적용되지 않아 파일 생성 전에 실행
				worksheet.spliceRows(2, 1)
			}
		})

		// 파일 실행 후 수식 활성화?
		workbook.calcProperties.fullCalcOnLoad = true

		await workbook.xlsx.write(res).then(() => {
			res.status(200)
		})
	} catch (e) {
		console.log(e)
		res.status(200).json({
			message: "엑셀 파일 생성 중 에러 발생",
			success: false,
			error: e,
		})
	}
}

/**
 * 건수 입력을 위한 가맹점 엑셀파일 샘플 다운로드 함수.
 *
 * van사 이름으로 시트 명
 * 사업자번호, 가맹점명, 거래건수
 *
 * 상태가 폐업 인 가맹점 제외 한 전체 가맹점 중
 * van사별로 시트에 나눠서 입력.
 */
const makeStoreCountUpSample = async ({ res }) => {
	const firstRowFill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "deebf9" },
	}

	const firstRowAlign = { vertical: "middle", horizontal: "center" }

	try {
		const workbook = new Workbook()

		const kisSheet = workbook.addWorksheet("KIS")
		const jtnetSheet = workbook.addWorksheet("JTNET")
		const fdikSheet = workbook.addWorksheet("FDIK")
		const daouSheet = workbook.addWorksheet("DAOU")
		const composeSheet = workbook.addWorksheet("COMPOSE")

		const header = [
			{ header: "사업자번호", key: "businessNum" },
			{ header: "가맹점명", key: "storeName" },
			{ header: "거래건수", key: "count" },
		]
		workbook.eachSheet((sheet) => {
			sheet.columns = header
			sheet.getRow(1).fill = firstRowFill
			sheet.getRow(1).alignment = firstRowAlign
		})

		const stores = await StoreModel.find({
			inOperation: { $not: { $eq: "폐업" } },
			isCorporation: { $not: { $eq: true } },
		})

		stores.forEach((value) => {
			const rowData = {
				businessNum: value.businessNum,
				storeName: value.storeName,
			}
			switch (value.van) {
				case "KIS":
					kisSheet.addRow(rowData)
					break
				case "JTNET":
					jtnetSheet.addRow(rowData)
					break
				case "FDIK":
					fdikSheet.addRow(rowData)
					break
				case "DAOU":
					daouSheet.addRow(rowData)
					break
				case "COMPOSE":
					composeSheet.addRow(rowData)
					break
			}
		})

		await workbook.xlsx.write(res).then(() => {
			res.status(200)
		})
	} catch (e) {
		console.log(e)
		res.status(200).json({ success: false })
	}
}

export default handler
