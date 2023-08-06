import nextConnect from "next-connect"
import { BrandModel } from "../../models/Brand"

const handler = nextConnect()

handler.get(async function (req, res) {
	const getAllBrand = await BrandModel.find()

	res.status(200).json({ brand: getAllBrand })
})

handler.post(async function (req, res) {
	const data = req.body

	try {
		const existingBrandName = await BrandModel.findOne({ name: data.name })

		if (existingBrandName) {
			res
				.status(200)
				.json({ message: "이미 등록된 이름입니다.", success: false })
			return
		}

		const brand = new BrandModel(data)
		brand.save()
	} catch (e) {
		console.log(e)
		res
			.status(500)
			.json({ message: "법인명 저장 중 오류", err: e, success: false })
		return
	}
	res
		.status(201)
		.json({ message: "법인명 저장 성공", result: brand, success: true })
})
export default handler
