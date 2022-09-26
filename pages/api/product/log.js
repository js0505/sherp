import nextConnect from "next-connect"
import User from "../../../models/User"
import ProductLog from "../../../models/ProductLog"
import Product from "../../../models/Product"
import dbConnect from "../../../lib/mongoose/dbConnect"

const handler = nextConnect()

// 제품 입,출고 로그내역
handler.get(async function (req, res) {
	await dbConnect()
	// page : 현재 페이지네이션 번호
	// maxPosts : 페이지에 나타낼 총 데이터 갯수
	// start, end : 검색 시작, 끝 날짜
	const { page, maxPosts, start, end } = req.query
	const parsedPage = Number(page)
	const limitPageSize = maxPosts
	// 날짜 형식으로 날아온 글자 갯수로 파악...
	//  === undefined 같은거 안 통함
	if (start.length > 4) {
		// 날짜 필터 데이터가 존재할 때
		if (parsedPage === 1) {
			const query = { date: { $gte: start, $lte: end } }

			const productLogs = await ProductLog.find(query)
				.limit(limitPageSize)
				.sort({ date: -1 })
				.populate({ path: "product", model: Product })
				.populate({ path: "user", model: User })
				.exec()

			const totalPosts = await ProductLog.countDocuments(query)

			res.status(200).json({ success: true, productLogs, totalPosts })

		// 날짜 필터를 가지고 페이지네이션
		} else {
			const query = { date: { $gte: start, $lte: end } }
			const skipIndex = (parsedPage - 1) * limitPageSize
			const productLogs = await ProductLog.find(query)
				.skip(skipIndex)
				.limit(limitPageSize)
				.sort({ date: -1 })
				.populate({ path: "product", model: Product })
				.populate({ path: "user", model: User })
				.exec()

			res.status(200).json({ success: true, productLogs })
		}
		// 필터 없이 전체 데이터만 나타내는 부분
	} else {
		if (parsedPage === 1) {
			// 최초 페이지 접속, 1페이지 클릭 시
			const query = {}
			// 페이지에 나타낼 데이터 쿼리
			const productLogs = await ProductLog.find(query)
				.limit(limitPageSize)
				.sort({ createdAt: -1 })
				.populate({ path: "product", model: Product })
				.populate({ path: "user", model: User })
				.exec()

			// 리미트 없이 해당 조건에 맞는 전체 데이터 갯수 전달.
			const totalPosts = await ProductLog.countDocuments(query)

			res.status(200).json({ success: true, productLogs, totalPosts })
		} else {
			// 그 외 페이지네이션
			const query = {}
			const skipIndex = (parsedPage - 1) * limitPageSize
			const productLogs = await ProductLog.find(query)
				.skip(skipIndex)
				.limit(limitPageSize)
				.sort({ createdAt: -1 })
				.populate({ path: "product", model: Product })
				.populate({ path: "user", model: User })
				.exec()

			res.status(200).json({ success: true, productLogs })
		}
	}
})

export default handler
