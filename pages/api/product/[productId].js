import nextConnect from "next-connect"
import Product from "../../../models/Product"
import dbConnect from "../../../lib/mongoose/dbConnect"



const handler = nextConnect()

handler.get(async function (req, res) {
	const { productId } = req.query

	const product = await Product.findById(productId)
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

handler.patch(async function (req, res) {
	const { name, van, category, qty, brand, productCompany } = req.body.data

	const product = await Product.find
	res.status(200).json({ message: "재고수량 업데이트 성공", success: true })
})
