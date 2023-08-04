import nextConnect from "next-connect"

import mongooseConnect from "../../../lib/db/mongooseConnect"
import { format, parseISO } from "date-fns"
import { NextApiRequest, NextApiResponse } from "next"
import { FilterQuery } from "mongoose"
import { StoreModel } from "@/models/Store"
import { ProductModel } from "@/models/Product"

const handler = nextConnect()

// 사업자번호, 상호명으로 필터링 된 데이터 전달
// query ex)
// { businessNum: '', storeName: '', van: 'FDIK', city: '부천시', user: '장문광' }

handler.get(async function (req: NextApiRequest, res: NextApiResponse) {
	try {
		const { businessNum, storeName, van, city, user } = req.query

		let andQuery: FilterQuery<any>[] = []
		let orQuery: FilterQuery<any>[] = []

		if (van) {
			andQuery.push({ van })
		}
		if (city) {
			andQuery.push({ city })
		}
		if (user) {
			andQuery.push({ user })
		}

		if (businessNum) {
			orQuery.push({ businessNum: businessNum })
		}
		if (storeName) {
			orQuery.push({ storeName: { $regex: storeName, $options: "i" } })
		}

		await mongooseConnect()

		const filteredStore = await StoreModel.find()
			.or(orQuery.length < 1 ? [{}] : orQuery)
			.and(andQuery.length < 1 ? [{}] : andQuery)
			.populate({
				path: "product",
				populate: { path: "productId", model: ProductModel },
			})
			.exec()

		res.status(200).json({ filteredStore, success: true })
	} catch (e) {
		console.log(e)
		res.status(200).json({
			message: "가맹점 정보 가져오는 중 에러 발생",
			success: false,
			error: e,
		})
	}
})

// 가맹점 신규 등록
// 법인 가맹점 체크 기능 필요
handler.post(async function (req: NextApiRequest, res: NextApiResponse) {
	await mongooseConnect()

	const {
		user,
		storeName,
		businessNum,
		van,
		vanId,
		vanCode,
		owner,
		city,
		address,
		contact,
		product,
		cms,
		contractDate,
		note,
		contractImg,
		isBackup,
		isCorporation,
	} = req.body

	console.log(req.body)

	try {
		// 계약 일자에 맞는 초기 데이터 입력.
		const parsedContractDate = parseISO(contractDate)
		const year = format(parsedContractDate, "yyyy")
		const month = format(parsedContractDate, "MM")

		const inOperation = isBackup === true ? "백업" : "영업중"
		const creditCount = [
			{
				year,
				month,
				cms,
				inOperation,
			},
		]

		const newStore = new StoreModel({
			user,
			storeName,
			businessNum,
			van,
			vanId,
			vanCode,
			owner,
			city,
			address,
			contact,
			product,
			cms,
			contractDate,
			note,
			contractImg,
			isBackup,
			inOperation,
			creditCount,
			isCorporation,
		})

		newStore.save()

		res
			.status(201)
			.json({ message: "가맹점 저장 성공", result: newStore, success: true })
	} catch (e) {
		console.log(e)
		res
			.status(500)
			.json({ message: "가맹점 저장 중 오류", error: e, success: false })
	}
})

handler.patch(async function (req: NextApiRequest, res: NextApiResponse) {
	await mongooseConnect()

	const {
		_id,
		user,
		storeName,
		contractDate,
		businessNum,
		city,
		address,
		contact,
		van,
		vanId,
		vanCode,
		closeDate,
		cms,
		product,
		owner,
		note,
		inOperation,
		isCorporation,
	} = req.body

	try {
		// 상태가 폐업으로 넘어오면
		// closeDate 날짜를 확인, 정렬 해서 폐업으로 변경.

		if (inOperation === "폐업") {
			console.log("폐업처리 시작")
			console.log(req.body)
			const parsedCloseDate = parseISO(closeDate)
			const year = format(parsedCloseDate, "yyyy")
			const month = format(parsedCloseDate, "MM")
			const store = await StoreModel.findById(_id)

			// 월 단위 정렬 후에 연 단위 정렬.
			const sortCount = store.creditCount
				.sort(function (a, b) {
					if (a.month > b.month) return 1
					if (a.month < b.month) return -1
					return 0
				})
				.sort(function (a, b) {
					if (a.year > b.year) return 1
					if (a.year < b.year) return -1
					return 0
				})

			// 여기까지 진행하면 21년 1월, 21년 2월, 22년 2월, 22년 3월 같이 정렬 됨.

			const correctIndex = sortCount.findIndex(
				(item) => item.year === year && item.month === month,
			)

			if (correctIndex !== -1) {
				// 폐업 신청 월에 데이터가 있을 때 분기
				// 해당 기록에 폐업으로 변경
				sortCount[correctIndex].inOperation = "폐업"

				// 폐업 처리하는 달 이후의 데이터들 삭제
				const slicedCount = sortCount.slice(0, correctIndex + 1)

				// 데이터 반영 후 저장
				store.closeYear = year
				store.closeDate = closeDate
				store.creditCount = slicedCount
				store.save()
			} else {
				// 폐업 요청 했으나 해당 월에 데이터가 없으면 데이터 작성.
				store.creditCount.push({
					year,
					month,
					cms: 0,
					count: 0,
					inOperation,
				})
				store.closeYear = year
				store.closeDate = closeDate
				store.save()
			}
		}

		// 가맹점 정보 수정 쿼리

		await StoreModel.findByIdAndUpdate(
			{ _id },
			{
				$set: {
					user,
					storeName,
					contractDate,
					businessNum,
					city,
					address,
					contact,
					van,
					vanId,
					vanCode,
					cms,
					product,
					owner,
					note,
					inOperation,
					isCorporation,
					isBackup: inOperation === "영업중" ? false : true,
				},
			},
		)

		// 업데이트 된 정보를 돌려보내서 api 테스트에서 결과값 확인 하는데에 사용
		const updatedStore = await StoreModel.findById(_id)


		res
			.status(201)
			.json({ message: "가맹점 정보 수정 완료", success: true, updatedStore })
	} catch (e) {
		console.log(e)
		res
			.status(500)
			.json({ message: "가맹점 정보 수정 중 오류", error: e, success: false })
	}
})

handler.delete(async function (req: NextApiRequest, res: NextApiResponse) {
	const { storeId } = req.query

	try {
		const deleteStore = await StoreModel.findByIdAndDelete(storeId)
		console.log(deleteStore)

		res
			.status(200)
			.json({ message: "가맹점 삭제 완료", success: true, deleteStore })
	} catch (e) {
		console.log(e)
		res
			.status(500)
			.json({ message: "가맹점 정보 삭제 중 오류", error: e, success: false })
	}
})

// /**
//  * 현재 연도를 제외하고 쿼리로 입력된 연도의 폐업 가맹점 삭제 및 이동
//  */

// handler.delete(async function (req, res) {
// 	await mongooseConnect()

// 	const { year } = req.query

// 	const today = new Date()
// 	const todayYear = format(today, "yyyy")

// 	if (year === todayYear) {
// 		res.status(200).json({
// 			success: false,
// 			message: "현재 연도의 데이터를 수정 할 수 없습니다.",
// 		})
// 		return
// 	}

// 	const filterdClosedStore = await Store.find({})
// 		.and([
// 			{ closeDate: { $regex: year, $options: "i" } },
// 			{ inOperation: { $regex: "폐업" } },
// 		])
// 		.exec()

// 	let filterdClosedStoreIds = []
// 	filterdClosedStore.forEach((item) => filterdClosedStoreIds.push(item._id))

// 	const moveToClosedStoreItems = await ClosedStore.insertMany(
// 		filterdClosedStore,
// 	)

// 	await Store.deleteMany({ _id: { $in: filterdClosedStoreIds } })

// 	res.status(200).json({
// 		success: true,
// 		message: `${moveToClosedStoreItems.length}개 가맹점 처리완료.`,
// 	})
// })

export default handler
