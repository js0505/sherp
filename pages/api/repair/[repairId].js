import nextConnect from "next-connect"
import dbConnect from "../../../lib/mongoose/dbConnect"
import Repair from "../../../models/Repair"
import User from "../../../models/User"
import Product from "../../../models/Product"

const handler = nextConnect()

handler.get(async function (req, res) {
	await dbConnect()
	const { repairId } = req.query
	try {
		const findRepairItem = await Repair.findById(repairId)
			.populate({ path: "product", model: Product })
			.populate({ path: "user", model: User })
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
