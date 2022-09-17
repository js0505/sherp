import nextConnect from "next-connect"
import ProductCompany from "../../models/ProductCompany"

const handler = nextConnect()

handler.get(async function (req, res) {
	const getAllCompany = await ProductCompany.find()

	res.status(200).json({ company: getAllCompany })
})

handler.post(async function (req, res) {
	const data = req.body
	let productCompany
	const existingCompanyName = await ProductCompany.findOne({
		name: data.name,
	})

	if (existingCompanyName) {
		res.status(400).json({ message: "이미 등록된 이름입니다.", success: false })
		return
	}

	try {
		productCompany = new ProductCompany(data)
		productCompany.save()
	} catch (e) {
		res
			.status(500)
			.json({ message: "제조사 저장 중 오류", err: e, success: false })
	}
	res
		.status(201)
		.json({
			message: "제조사 저장 성공",
			result: productCompany,
			success: true,
		})
})
export default handler
