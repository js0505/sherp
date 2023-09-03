import nextConnect from "next-connect"
import { ProductModel } from "../../../models/Product"
import { ProductCompanyModel } from "../../../models/ProductCompany"
import { BrandModel } from "../../../models/Brand"

import mongooseConnect from "../../../lib/db/mongooseConnect"

const handler = nextConnect()

// 모든 등록된 장비 불러오기
handler.get(async function (req, res) {
	const { van, name, category, brand } = req.query

	let orQuery = []
	if (name) {
		orQuery.push({ name: { $regex: name, $options: "i" } })
	}

	let andQuery = []
	if (van) {
		andQuery.push({ van })
	}
	if (category) {
		andQuery.push({ category })
	}
	if (brand) {
		andQuery.push({ brand })
	}

	await mongooseConnect()

	try {
		const filteredProduct = await ProductModel.find()
			.or(orQuery.length < 1 ? {} : orQuery)
			.and(andQuery.length < 1 ? {} : andQuery)
			.populate({ path: "productCompany", model: ProductCompanyModel })
			.populate({ path: "brand", model: BrandModel })

		res.status(200).json({ products: filteredProduct, success: true })
	} catch (e) {
		console.log(e)
		res.status(400).json({
			message: "장비 정보 가져오는 중 에러 발생",
			success: false,
			error: e,
		})
	}
})

// 장비 정보 저장
handler.post(async function (req, res) {
	try {
		const { name, van, category, brand, productCompany } = req.body

		const findBrandId = await BrandModel.findOne({ name: brand }).then(
			(value) => value._id.toString(),
		)

		const findProductCompanyId = await ProductCompanyModel.findOne({
			name: productCompany,
		}).then((value) => value._id.toString())

		const newProduct = await ProductModel.create({
			name,
			van,
			category,
			brand: findBrandId,
			productCompany: findProductCompanyId,
		})

		res
			.status(201)
			.json({ message: "장비 저장 성공", result: newProduct, success: true })
	} catch (e) {
		console.log(e)
		res
			.status(500)
			.json({ message: "장비 저장 중 오류", err: e, success: false })
	}
})

export default handler
