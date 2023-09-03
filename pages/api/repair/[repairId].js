import nextConnect from "next-connect"
import {  RepairModel } from "../../../models/Repair"

import mongooseConnect from "../../../lib/db/mongooseConnect"
import { ProductModel } from "../../../models/Product"

const handler = nextConnect()

handler.get(async function (req, res) {
	await mongooseConnect()
	const { repairId } = req.query
	try {
		const findRepairItem = await RepairModel.findById(repairId)
			.populate({ path: "product", model: ProductModel })
			.exec()
		res.status(200).json({ repair: findRepairItem, success: true })
	} catch (e) {
		res.status(200).json({
			message: "수리 정보 가져오는 중 에러",
			error: e,
			success: false,
		})
	}
})

export default handler
