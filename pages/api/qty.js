import nextConnect from "next-connect"

import mongooseConnect from "../../lib/db/mongooseConnect"
import { ProductModel } from "../../models/Product"
import { ProductLogModel } from "../../models/ProductLog"

const handler = nextConnect()

// 장비 재고 수정

handler.patch(async function (req, res) {
	await mongooseConnect()

	const { qty, calc, note, user, productId, date } = req.body
	try {
		const product = await ProductModel.findById(productId)

		switch (calc) {
			case "plus":
				product.qty = product.qty + qty
				product.save()

				const logBody = {
					user,
					product: productId,
					calc,
					quantity: Number(qty),
					note,
					date,
				}

				const log = new ProductLogModel(logBody)
				log.save()
				res
					.status(200)
					.json({ message: "재고수량 업데이트 성공", success: true })
				return
			case "minus":
				if (product.qty - qty < 0) {
					res
						.status(200)
						.json({ message: "재고 수량이 0보다 작습니다.", success: false })
				} else {
					product.qty = product.qty - qty
					product.save()
					const logBody = {
						user,
						product: productId,
						calc,
						quantity: Number(qty),
						note,
						date,
					}

					const log = new ProductLogModel(logBody)
					log.save()
					res
						.status(200)
						.json({ message: "재고수량 업데이트 성공", success: true })
					return
				}
		}
	} catch (e) {
		res
			.status(200)
			.json({ message: "재고수량 조정중 에러", success: false, error: e })
	}
})

export default handler
