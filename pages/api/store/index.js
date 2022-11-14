import nextConnect from "next-connect"
import Product from "../../../models/Product"
import Store from "../../../models/Store"
import User from "../../../models/User"
import dbConnect from "../../../lib/mongoose/dbConnect"

const handler = nextConnect()

// 사업자번호, 상호명으로 필터링 된 데이터 전달
handler.get(async function (req, res) {
	const { filter } = req.query
	await dbConnect()

	try {
		const filterdStore = await Store.find({})
			.or([
				{ businessNum: { $regex: filter, $options: "i" } },
				{ storeName: { $regex: filter, $options: "i" } },
				{ van: { $regex: filter, $options: "i" } },
				{ city: { $regex: filter, $options: "i" } },
			])
			.populate({
				path: "product",
				populate: { path: "productId", model: Product },
			})
			.populate({ path: "user", model: User })
			.exec()
		res.status(200).json({ filterdStore, success: true })
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
handler.post(async function (req, res) {
	await dbConnect()

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
	} = req.body

	try {
		const newStore = new Store({
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
		})
		newStore.save()
		res
			.status(201)
			.json({ message: "가맹점 저장 성공", result: newStore, success: true })
	} catch (e) {
		res
			.status(500)
			.json({ message: "가맹점 저장 중 오류", error: e, success: false })
	}
})

handler.patch(async function (req, res) {
	await dbConnect()

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
	} = req.body

	try {
		await Store.findByIdAndUpdate(
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
					closeDate,
					cms,
					product,
					owner,
					note,
				},
			},
		)

		const updatedStore = await Store.findById(_id)
			.populate({
				path: "user",
				model: User,
			})
			.exec()
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

export default handler
