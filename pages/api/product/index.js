import nextConnect from "next-connect"
import Product from "../../../models/Product"

const handler = nextConnect()

handler.get(async function (req, res) {
	try {
		const getAllProducts = await Product.find({})
			.populate("productCompany")
			.populate("brand")
			.exec()

		res.status(200).json({ products: getAllProducts, success: true })
	} catch (e) {
		res.status(200).json({
			message: "장비 정보 가져오는 중 에러 발생",
			success: false,
			error: e,
		})
	}
})

handler.post(async function (req, res) {
	const data = req.body

	try {
		const newProduct = new Product(data)
		newProduct.save()
		res
			.status(201)
			.json({ message: "장비 저장 성공", result: newProduct, success: true })
	} catch (e) {
		res
			.status(500)
			.json({ message: "장비 저장 중 오류", err: e, success: false })
	}
})
export default handler
