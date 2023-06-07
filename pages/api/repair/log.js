import nextConnect from "next-connect"
import { RepairModel } from "../../../models/Repair"
import { BrandModel } from "../../../models/Brand"
import { ProductModel } from "../../../models/Product"
import mongooseConnect from "../../../lib/db/mongooseConnect"

const handler = nextConnect()

handler.get(async function (req, res) {
	await mongooseConnect()
	// page : 현재 페이지네이션 번호
	// maxPosts : 페이지에 나타낼 총 데이터 갯수

	const { page, maxPosts, storeName, productNum } = req.query
	const parsedPage = Number(page)
	const limitPageSize = maxPosts

	// 가맹점명 이나 제품번호 검색 들어올 때
	if (storeName !== "" || productNum !== "") {
		let orQuery =
			storeName !== ""
				? { storeName: { $regex: storeName, $options: "i" } }
				: { productNum: { $regex: productNum, $options: "i" } }

		const query = {
			...orQuery,
			state: { $in: ["원복완료", "재고입고"] },
		}

		if (parsedPage === 1) {
			const repairs = await RepairModel.find(query)
				.limit(limitPageSize)
				.sort({ completeDate: -1, updatedAt: -1 })
				.populate({
					path: "product",
					model: ProductModel,
					populate: { path: "brand", model: BrandModel },
				})
				.exec()

			const totalPosts = await RepairModel.countDocuments(query)

			res.status(200).json({ success: true, repairs, totalPosts })
		} else {
			const skipIndex = (parsedPage - 1) * limitPageSize

			const repairs = await RepairModel.find(query)
				.skip(skipIndex)
				.limit(limitPageSize)
				.sort({ completeDate: -1, updatedAt: -1 })
				.populate({
					path: "product",
					model: ProductModel,
					populate: { path: "brand", model: BrandModel },
				})
				.exec()
			const totalPosts = await RepairModel.countDocuments(query)
			res.status(200).json({ success: true, repairs, totalPosts })
		}
	} else {
		if (parsedPage === 1) {
			// 최초 페이지 접속, 1페이지 클릭 시

			const query = { state: { $in: ["원복완료", "재고입고"] } }

			// 페이지에 나타낼 데이터 쿼리
			const repairs = await RepairModel.find(query)
				.limit(limitPageSize)
				.sort({ completeDate: -1, updatedAt: -1 })
				.populate({
					path: "product",
					model: ProductModel,
					populate: { path: "brand", model: BrandModel },
				})
				.exec()

			// 리미트 없이 해당 조건에 맞는 전체 데이터 갯수 전달.
			const totalPosts = await RepairModel.countDocuments(query)

			res.status(200).json({ success: true, repairs, totalPosts })
		} else {
			// 그 외 페이지네이션

			const query = { state: { $in: ["원복완료", "재고입고"] } }

			const skipIndex = (parsedPage - 1) * limitPageSize

			const repairs = await RepairModel.find(query)
				.skip(skipIndex)
				.limit(limitPageSize)
				.sort({ completeDate: -1, updatedAt: -1 })
				.populate({
					path: "product",
					model: ProductModel,
					populate: { path: "brand", model: BrandModel },
				})
				.exec()
			const totalPosts = await RepairModel.countDocuments(query)
			res.status(200).json({ success: true, repairs, totalPosts })
		}
	}
})

export default handler
