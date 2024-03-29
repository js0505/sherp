import nextConnect from "next-connect"
import mongooseConnect from "../../../lib/db/mongooseConnect"
import { BrandModel } from "../../../models/Brand"
import { ProductModel } from "../../../models/Product"
import { ProductLogModel } from "../../../models/ProductLog"

const handler = nextConnect()

// 제품 입,출고 로그내역
handler.get(async function (req, res) {
	try {
		await mongooseConnect()
		// page : 현재 페이지네이션 번호
		// maxPosts : 페이지에 나타낼 총 데이터 갯수
		// start, end : 검색 시작, 끝 날짜
		const { page, maxPosts, start, end } = req.query
		const parsedPage = Number(page)
		const limitPageSize = maxPosts
		// 날짜 형식으로 날아온 글자 갯수로 파악...
		//  === undefined 같은거 안 통함
		if (start !== "null") {
			// 날짜 필터 데이터가 존재할 때

			if (parsedPage === 1) {
				const query = { date: { $gte: start, $lte: end } }

				const productLogs = await ProductLogModel.find(query)
					.limit(limitPageSize)
					.sort({ date: -1, updatedAt: -1 })
					.populate({
						path: "product",
						model: ProductModel,
						populate: { path: "brand", model: BrandModel },
					})
					.exec()
				console.log(productLogs)
				const totalPosts = await ProductLogModel.countDocuments(query)

				return res.status(200).json({ success: true, productLogs, totalPosts })

				// 날짜 필터를 가지고 페이지네이션
			} else {
				const query = { date: { $gte: start, $lte: end } }
				const skipIndex = (parsedPage - 1) * limitPageSize
				const productLogs = await ProductLogModel.find(query)
					.skip(skipIndex)
					.limit(limitPageSize)
					.sort({ date: -1, updatedAt: -1 })
					.populate({
						path: "product",
						model: ProductModel,
						populate: { path: "brand", model: BrandModel },
					})
					.exec()

				const totalPosts = await ProductLogModel.countDocuments(query)
				return res.status(200).json({ success: true, productLogs, totalPosts })
			}
			// 필터 없이 전체 데이터만 나타내는 부분
		} else {
			if (parsedPage === 1) {
				// 최초 페이지 접속, 1페이지 클릭 시
				const query = {}
				// 페이지에 나타낼 데이터 쿼리
				const productLogs = await ProductLogModel.find(query)
					.limit(limitPageSize)
					.sort({ date: -1, updatedAt: -1 })
					.populate({
						path: "product",
						model: ProductModel,
						populate: { path: "brand", model: BrandModel },
					})
					.exec()

				// 리미트 없이 해당 조건에 맞는 전체 데이터 갯수 전달.
				const totalPosts = await ProductLogModel.countDocuments(query)

				return res.status(200).json({ success: true, productLogs, totalPosts })
			} else {
				// 그 외 페이지네이션
				const query = {}
				const skipIndex = (parsedPage - 1) * limitPageSize
				const productLogs = await ProductLogModel.find(query)
					.skip(skipIndex)
					.limit(limitPageSize)
					.sort({ createdAt: -1 })
					.populate({
						path: "product",
						model: ProductModel,
						populate: { path: "brand", model: BrandModel },
					})
					.exec()

				const totalPosts = await ProductLogModel.countDocuments(query)
				return res.status(200).json({ success: true, productLogs, totalPosts })
			}
		}
	} catch (e) {
		console.log(e)
	}
})

export default handler
