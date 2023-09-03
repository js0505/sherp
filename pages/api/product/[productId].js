import nextConnect from "next-connect"
import { ProductModel } from "../../../models/Product"
import mongooseConnect from "../../../lib/db/mongooseConnect"

const handler = nextConnect()

handler.get(async function (req, res) {
	await mongooseConnect()
	const { productId } = req.query

	const product = await ProductModel.findById(productId)
		.populate("productCompany")
		.populate("brand")
		.exec()

	if (!product) {
		res.status(200).json({ message: "장비를 찾지 못했습니다.", success: false })
		return
	} else {
		res.status(200).json({ success: true, product })
	}
})

// 장비 정보 수정

// handler.patch(async function (req, res) {
// 	await mongooseConnect()
// 	const { name, van, category, qty, brand, productCompany } = req.body.data

// 	const product = await Product.find
// 	res.status(200).json({ message: "재고수량 업데이트 성공", success: true })
// })
