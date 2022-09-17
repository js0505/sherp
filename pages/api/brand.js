import nextConnect from "next-connect"
import Brand from "../../models/Brand"

const handler = nextConnect()

handler.get(async function (req, res) {
	const getAllBrand = await Brand.find()

	res.status(200).json({ brand: getAllBrand })
})

handler.post(async function (req, res) {
	const data = req.body
	let brand
	const existingBrandName = await Brand.findOne({ name: data.name })

	if (existingBrandName) {
		res.status(400).json({ message: "이미 등록된 이름입니다." })
		return
	}

	try {
		brand = new Brand(data)
		brand.save()
	} catch (e) {
		console.log(e)
		res.status(500).json({ message: "법인명 저장 중 오류", err: e })
	}
	res.status(201).json({ message: "법인명 저장 성공", result: brand })
})
export default handler
