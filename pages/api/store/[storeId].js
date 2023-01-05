import nextConnect from "next-connect"
import dbConnect from "../../../lib/mongoose/dbConnect"
import Store from "../../../models/Store"

const handler = nextConnect()

handler.get(async function (req, res) {
	await dbConnect()
	const { storeId } = req.query
	try {
		const findStore = await Store.findById(storeId).exec()

		res.status(200).json({ store: findStore, success: true })
	} catch (e) {
		res.status(200).json({
			message: "수리 정보 가져오는 중 에러",
			error: e,
			success: false,
		})
	}
})

export default handler
