import nextConnect from "next-connect"
import Product from "../../../models/Product"
import ProductCompany from "../../../models/ProductCompany"
import Brand from "../../../models/Brand"
import dbConnect from "../../../lib/mongoose/dbConnect"

const handler = nextConnect()

// 모든 등록된 장비 불러오기
handler.get(async function (req, res) {
	await dbConnect()

	try {
		const getAllProducts = await Product.find({})
			.populate({ path: "productCompany", model: ProductCompany })
			.populate({ path: "brand", model: Brand })
			.exec()

		res.status(200).json({ products: getAllProducts, success: true })
	} catch (e) {
		console.log(e)
		res.status(200).json({
			message: "장비 정보 가져오는 중 에러 발생",
			success: false,
			error: e,
		})
	}
})

// 장비 정보 저장
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
